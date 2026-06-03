"use client";

import { useEffect } from "react";

interface PendoIdentifyProps {
  visitorId: string;
  visitorEmail: string;
  visitorFullName: string;
  visitorOrgId: string;
  visitorRole: string;
  visitorMemberCreatedAt: string;
  accountId: string;
  accountName: string;
  accountSlug: string;
  accountPlan: string;
  accountFeedbackDeliveryScore: number;
  accountCreatedAt: string;
}

export default function PendoIdentify({
  visitorId,
  visitorEmail,
  visitorFullName,
  visitorOrgId,
  visitorRole,
  visitorMemberCreatedAt,
  accountId,
  accountName,
  accountSlug,
  accountPlan,
  accountFeedbackDeliveryScore,
  accountCreatedAt,
}: PendoIdentifyProps) {
  useEffect(() => {
    pendo.identify({
      visitor: {
        id: visitorId,
        email: visitorEmail,
        full_name: visitorFullName,
        orgId: visitorOrgId,
        role: visitorRole,
        memberCreatedAt: visitorMemberCreatedAt,
      },
      account: {
        id: accountId,
        name: accountName,
        slug: accountSlug,
        plan: accountPlan,
        feedbackDeliveryScore: accountFeedbackDeliveryScore,
        createdAt: accountCreatedAt,
      },
    });
  }, [
    visitorId,
    visitorEmail,
    visitorFullName,
    visitorOrgId,
    visitorRole,
    visitorMemberCreatedAt,
    accountId,
    accountName,
    accountSlug,
    accountPlan,
    accountFeedbackDeliveryScore,
    accountCreatedAt,
  ]);

  return null;
}
