import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { Plan } from "@prisma/client";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Maps Stripe Price IDs to B2B SaaS Plan tiers.
 */
function getPlanFromPriceId(priceId: string): Plan {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return "STARTER";
  if (priceId === process.env.STRIPE_GROWTH_PRICE_ID) return "GROWTH";
  if (priceId === process.env.STRIPE_SCALE_PRICE_ID) return "SCALE";
  return "FREE";
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get("Stripe-Signature");

  let event;

  try {
    if (!sig || !webhookSecret) {
      throw new Error("Missing Stripe signature or webhook verification key.");
    }
    // Verify event origin cryptographically
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const { type, data } = event;

  try {
    switch (type) {
      case "checkout.session.completed": {
        const session = data.object as any;
        const orgId = session.metadata?.orgId;
        const subscriptionId = session.subscription as string;
        
        if (orgId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0].price.id;
          const plan = getPlanFromPriceId(priceId);

          // Fetch previous plan before updating
          const prevOrg = await prisma.org.findUnique({ where: { id: orgId } });
          const previousPlan = prevOrg?.plan || "FREE";

          await prisma.org.update({
            where: { id: orgId },
            data: {
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: session.customer as string,
              plan,
            },
          });

          // Server-side Pendo track: plan changed
          try {
            await fetch("https://data.pendo.io/data/track", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-pendo-integration-key": "709225bf-7a1a-4eee-8774-717dac3dcf10",
              },
              body: JSON.stringify({
                type: "track",
                event: "plan_changed",
                visitorId: "system",
                accountId: orgId,
                timestamp: Date.now(),
                properties: {
                  orgId,
                  previousPlan,
                  newPlan: plan,
                  stripeEventType: type,
                  subscriptionId,
                  customerId: session.customer as string,
                },
              }),
            });
          } catch (e) {
            console.error("Failed to send Pendo track event:", e);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = data.object as any;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;
        const plan = getPlanFromPriceId(priceId);

        // Find org matching this customerId
        const org = await prisma.org.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (org) {
          const previousPlan = org.plan;

          await prisma.org.update({
            where: { id: org.id },
            data: {
              stripeSubscriptionId: subscription.id,
              plan,
            },
          });

          // Server-side Pendo track: plan changed (only if plan actually changed)
          if (previousPlan !== plan) {
            try {
              await fetch("https://data.pendo.io/data/track", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-pendo-integration-key": "709225bf-7a1a-4eee-8774-717dac3dcf10",
                },
                body: JSON.stringify({
                  type: "track",
                  event: "plan_changed",
                  visitorId: "system",
                  accountId: org.id,
                  timestamp: Date.now(),
                  properties: {
                    orgId: org.id,
                    previousPlan,
                    newPlan: plan,
                    stripeEventType: type,
                    subscriptionId: subscription.id,
                    customerId,
                  },
                }),
              });
            } catch (e) {
              console.error("Failed to send Pendo track event:", e);
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = data.object as any;
        const customerId = subscription.customer as string;

        const org = await prisma.org.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (org) {
          const previousPlan = org.plan;

          // Downgrade organization back to FREE status
          await prisma.org.update({
            where: { id: org.id },
            data: {
              stripeSubscriptionId: null,
              plan: "FREE",
            },
          });

          // Server-side Pendo track: plan changed (subscription deleted)
          try {
            await fetch("https://data.pendo.io/data/track", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-pendo-integration-key": "709225bf-7a1a-4eee-8774-717dac3dcf10",
              },
              body: JSON.stringify({
                type: "track",
                event: "plan_changed",
                visitorId: "system",
                accountId: org.id,
                timestamp: Date.now(),
                properties: {
                  orgId: org.id,
                  previousPlan,
                  newPlan: "FREE",
                  stripeEventType: type,
                  subscriptionId: subscription.id,
                  customerId,
                },
              }),
            });
          } catch (e) {
            console.error("Failed to send Pendo track event:", e);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe Webhook Event: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing logic crashed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
