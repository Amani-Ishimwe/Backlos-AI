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
  const headerList = await headers();
  const sig = headerList.get("Stripe-Signature");

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

          await prisma.org.update({
            where: { id: orgId },
            data: {
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: session.customer as string,
              plan,
            },
          });
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
          await prisma.org.update({
            where: { id: org.id },
            data: {
              stripeSubscriptionId: subscription.id,
              plan,
            },
          });
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
          // Downgrade organization back to FREE status
          await prisma.org.update({
            where: { id: org.id },
            data: {
              stripeSubscriptionId: null,
              plan: "FREE",
            },
          });
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
