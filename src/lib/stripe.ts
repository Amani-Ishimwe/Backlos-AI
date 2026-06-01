import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_dummy";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16" as any, // Standard stable SDK api version
});

export const STRIPE_PLANS = {
  STARTER: {
    id: "STARTER",
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "price_starter",
    limit: 200,
    price: 49,
  },
  GROWTH: {
    id: "GROWTH",
    priceId: process.env.STRIPE_GROWTH_PRICE_ID || "price_growth",
    limit: 2000,
    price: 199,
  },
  SCALE: {
    id: "SCALE",
    priceId: process.env.STRIPE_SCALE_PRICE_ID || "price_scale",
    limit: 10000,
    price: 599,
  },
  FREE: {
    id: "FREE",
    priceId: null,
    limit: 10, // Mock B2B SaaS trial limit for applicants
    price: 0,
  },
  ENTERPRISE: {
    id: "ENTERPRISE",
    priceId: null,
    limit: Infinity,
    price: 999,
  },
};

/**
 * Returns plan metadata based on plan name.
 */
export function getPlanDetails(planName: string) {
  const name = (planName || "FREE").toUpperCase();
  return (STRIPE_PLANS as any)[name] || STRIPE_PLANS.FREE;
}
