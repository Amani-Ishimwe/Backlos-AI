"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

interface BillingPortalActionsProps {
  priceId?: string | null;
  label: string;
  className?: string;
}

export default function BillingPortalActions({
  priceId,
  label,
  className = "",
}: BillingPortalActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);

    try {
      if (priceId) {
        // Stripe Checkout Session dispatch
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        });

        const resJson = await res.json();
        if (!res.ok) throw new Error(resJson.error || "Checkout failed");

        // Track plan upgrade initiation
        if (typeof window !== "undefined" && window.pendo) {
          window.pendo.track("plan_upgrade_initiated", {
            priceId,
          });
        }

        // Redirect to Stripe checkout
        window.location.href = resJson.url;
      } else {
        // Stripe Customer Portal session dispatch
        const res = await fetch("/api/billing/portal", {
          method: "POST",
        });

        const resJson = await res.json();
        if (!res.ok) throw new Error(resJson.error || "Portal generation failed");

        // Track billing portal access
        if (typeof window !== "undefined" && window.pendo) {
          window.pendo.track("billing_portal_opened", {});
        }

        // Redirect to Stripe portal dashboard
        window.location.href = resJson.url;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to contact billing server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAction}
      isLoading={isLoading}
      variant={priceId ? "primary" : "outline"}
      size="sm"
      className={className}
    >
      {label}
    </Button>
  );
}
