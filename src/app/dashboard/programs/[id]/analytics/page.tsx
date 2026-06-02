import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface AnalyticsProps {
  params: {
    id: string;
  };
}

export default async function ProgramAnalyticsPage({ params }: AnalyticsProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch program details along with delivery status
  const program = await prisma.program.findUnique({
    where: { id: params.id },
    include: {
      applicants: {
        include: {
          emailDelivery: true,
        },
      },
    },
  });

  if (!program) {
    notFound();
  }

  // 2. Compute delivery analytics metrics
  const totalApplicants = program.applicants.length;
  const sentCount = program.applicants.filter(
    (app) => app.emailDelivery && app.emailDelivery.status !== "PENDING"
  ).length;

  const openedCount = program.applicants.filter(
    (app) => app.emailDelivery && app.emailDelivery.status === "OPENED"
  ).length;

  const bouncedCount = program.applicants.filter(
    (app) => app.emailDelivery && app.emailDelivery.status === "BOUNCED"
  ).length;

  const openRate = sentCount > 0 ? Math.round((openedCount / sentCount) * 100) : 0;
  const bounceRate = sentCount > 0 ? Math.round((bouncedCount / sentCount) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-brand-light">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-brand-text">Delivery Analytics Logs</h1>
            <Badge variant="primary">{program.name}</Badge>
          </div>
          <p className="text-sm text-brand-muted mt-1">
            Track dispatches, candidate delivery receipt confirmations, and click events.
          </p>
        </div>
        <Link href={`/dashboard/programs/${program.id}`}>
          <Button variant="outline" size="sm">
            &larr; Control Room
          </Button>
        </Link>
      </div>

      {/* Analytics stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card className="p-4 flex flex-col justify-center">
          <CardDescription className="text-[10px] font-bold uppercase tracking-wider mb-1">
            Total Candidates
          </CardDescription>
          <span className="text-2xl font-bold text-brand-text">{totalApplicants}</span>
        </Card>

        <Card className="p-4 flex flex-col justify-center">
          <CardDescription className="text-[10px] font-bold uppercase tracking-wider mb-1">
            Successfully Sent
          </CardDescription>
          <span className="text-2xl font-bold text-brand-primary">{sentCount}</span>
        </Card>

        <Card className="p-4 flex flex-col justify-center">
          <CardDescription className="text-[10px] font-bold uppercase tracking-wider mb-1 text-emerald-600">
            Open Ratio
          </CardDescription>
          <span className="text-2xl font-bold text-emerald-600">{openRate}%</span>
        </Card>

        <Card className="p-4 flex flex-col justify-center">
          <CardDescription className="text-[10px] font-bold uppercase tracking-wider mb-1 text-rose-600">
            Bounce Ratio
          </CardDescription>
          <span className="text-2xl font-bold text-rose-600">{bounceRate}%</span>
        </Card>
      </div>

      {/* Roster logs details list */}
      <Card className="p-0 border-brand-border overflow-hidden">
        <CardHeader className="p-6 border-b border-brand-light">
          <CardTitle className="text-sm font-bold uppercase tracking-wider">Candidate Delivery Tracker logs</CardTitle>
          <CardDescription>
            Live status reports indicating email releases and view receipts.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {totalApplicants === 0 ? (
            <div className="p-8 text-center text-xs text-brand-muted">
              No applicant rosters deployed for this program.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-light text-left text-xs bg-white">
                <thead className="bg-slate-50 uppercase text-[10px] font-bold tracking-wider text-brand-muted select-none">
                  <tr>
                    <th className="px-6 py-3">Candidate</th>
                    <th className="px-6 py-3">Selection Status</th>
                    <th className="px-6 py-3">Sent Timestamp</th>
                    <th className="px-6 py-3">Receipt Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light">
                  {program.applicants.map((app) => {
                    const hasDelivery = !!app.emailDelivery;
                    const deliveryStatus = app.emailDelivery?.status || "PENDING";
                    const sentAt = app.emailDelivery?.sentAt;

                    const deliveryColors = {
                      PENDING: "secondary" as const,
                      SENT: "primary" as const,
                      BOUNCED: "danger" as const,
                      OPENED: "success" as const,
                    };

                    return (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-semibold">
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-brand-text truncate">{app.name}</span>
                            <span className="text-[10px] text-brand-muted truncate">{app.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={app.status === "ACCEPTED" ? "success" : app.status === "REJECTED" ? "danger" : "secondary"}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-mono text-brand-muted text-[10px]">
                          {sentAt ? new Date(sentAt).toLocaleString() : "Not dispatched"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={deliveryColors[deliveryStatus]}>
                            {deliveryStatus.toLowerCase()}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
