"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { toast } from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface FeedbackStatus {
  total: number;
  ready: number;
  generating: number;
  error: number;
  percentComplete: number;
  applicants: {
    id: string;
    name: string;
    email: string;
    status: string;
    reportStatus: "GENERATING" | "READY" | "SENT" | "ERROR";
  }[];
}

interface CriteriaBreakdown {
  criteriaName: string;
  score: number;
  percentile: number;
  insight: string;
}

interface ReportPreview {
  applicantId: string;
  name: string;
  email: string;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
  overallPercentile: number;
  summary: string;
  strengthHighlight: string;
  criteriaBreakdown: CriteriaBreakdown[];
  improvementAreas: string[];
  nextSteps: string[];
}

// Module-level dedup guard for feedback_generation_completed polling event
const trackedGenerationCompleteIds = new Set<string>();

export default function AIFeedbackRoom({ params }: PageProps) {
  const router = useRouter();
  const programId = use(params).id;

  const [programName, setProgramName] = useState("");
  const [tonePreference, setTonePreference] = useState<"FRIENDLY" | "FORMAL" | "CONCISE">("FRIENDLY");
  const [isFetching, setIsFetching] = useState(true);

  // Status polling and generation variables
  const [status, setStatus] = useState<FeedbackStatus | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previews, setPreviews] = useState<ReportPreview[]>([]);

  // Email Send Progress State
  const [sendProgress, setSendProgress] = useState<{
    status: "idle" | "preparing" | "sending" | "success" | "error";
    errorMessage: string;
    sentCount: number;
  }>({
    status: "idle",
    errorMessage: "",
    sentCount: 0,
  });

  const fetchProgramAndStatus = async () => {
    try {
      const pRes = await fetch(`/api/programs/${programId}`);
      const pJson = await pRes.json();
      if (!pRes.ok) throw new Error(pJson.error);

      setProgramName(pJson.data.name);
      setTonePreference(pJson.data.tonePreference);

      const sRes = await fetch(`/api/programs/${programId}/feedback/status`);
      const sJson = await sRes.json();
      if (!sRes.ok) throw new Error(sJson.error);

      setStatus(sJson.data);

      const genActive = sJson.data.generating > 0;
      setIsGenerating(genActive);

      // If everyone is READY/SENT and no reports are currently compiling, load previews
      if (sJson.data.ready > 0 && !genActive) {
        loadReportPreviews();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load status metrics.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchProgramAndStatus();
  }, [programId]);

  // Polling hook while generating
  useEffect(() => {
    let interval: any = null;

    if (isGenerating) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/programs/${programId}/feedback/status`);
          const resJson = await res.json();
          if (res.ok) {
            setStatus(resJson.data);
            const active = resJson.data.generating > 0;
            setIsGenerating(active);

            if (!active && resJson.data.ready > 0) {
              // Track feedback generation completed (deduped per programId)
              if (!trackedGenerationCompleteIds.has(programId) && typeof window !== "undefined" && window.pendo) {
                trackedGenerationCompleteIds.add(programId);
                window.pendo.track("feedback_generation_completed", {
                  programId,
                  totalApplicants: resJson.data.total,
                  readyCount: resJson.data.ready,
                  errorCount: resJson.data.error,
                  percentComplete: resJson.data.percentComplete,
                });
              }

              toast.success("Feedback reports compiled successfully!");
              loadReportPreviews();
            }
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, programId]);

  const loadReportPreviews = async () => {
    try {
      const res = await fetch(`/api/programs/${programId}/feedback/status?preview=true`);
      const resJson = await res.json();
      if (res.ok && resJson.data.previews) {
        setPreviews(resJson.data.previews);
      }
    } catch (e) {
      console.error("Preview load error", e);
    }
  };

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setStatus(null);
    setPreviews([]);

    try {
      const res = await fetch(`/api/programs/${programId}/feedback/generate`, {
        method: "POST",
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || "Generation kickoff failed.");
      }

      // Track feedback generation started
      if (typeof window !== "undefined" && window.pendo) {
        window.pendo.track("feedback_generation_started", {
          programId,
          programName,
        });
      }

      // Reset dedup guard so completion can be tracked for this new generation
      trackedGenerationCompleteIds.delete(programId);

      toast.success(`Launched AI Feedback Engine!`);
      fetchProgramAndStatus();
    } catch (err: any) {
      toast.error(err.message || "Could not launch AI engine.");
      setIsGenerating(false);
    }
  };

  const handleRegenerateReport = async (applicantId: string) => {
    toast.info("Regenerating candidate report...");
    try {
      const res = await fetch(`/api/programs/${programId}/feedback/generate?applicantId=${applicantId}`, {
        method: "POST",
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error);

      // Track individual report regeneration
      if (typeof window !== "undefined" && window.pendo) {
        window.pendo.track("feedback_report_regenerated", {
          programId,
          applicantId,
        });
      }

      toast.success("Constructive review updated successfully!");
      loadReportPreviews();
    } catch (err: any) {
      toast.error(err.message || "Failed to update report.");
    }
  };

  const handleApproveAndSendAll = async () => {
    if (!confirm("Are you sure you want to approve and send all feedback reports now? This will dispatch closure notifications to all candidates.")) return;

    setSendProgress({ status: "preparing", errorMessage: "", sentCount: 0 });

    // Premium visual buffer steps
    await new Promise((r) => setTimeout(r, 1200));
    setSendProgress({ status: "sending", errorMessage: "", sentCount: 0 });

    try {
      const res = await fetch(`/api/programs/${programId}/feedback/send`, {
        method: "POST",
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Batch email dispatcher failed.");

      setSendProgress({
        status: "success",
        errorMessage: "",
        sentCount: resJson.data.sent,
      });

      // Track feedback emails dispatched
      if (typeof window !== "undefined" && window.pendo) {
        window.pendo.track("feedback_emails_dispatched", {
          programId,
          programName,
          sentCount: resJson.data.sent,
        });
      }

      toast.success(`Successfully sent ${resJson.data.sent} feedback emails!`);
      fetchProgramAndStatus();
    } catch (err: any) {
      setSendProgress({
        status: "error",
        errorMessage: err.message || "An unexpected error occurred during dispatch.",
        sentCount: 0,
      });
      toast.error(err.message || "Failed to dispatch closure notifications.");
    }
  };

  if (isFetching || !status) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        <p className="text-xs text-brand-muted">Initializing AI Feedback Engine...</p>
      </div>
    );
  }

  const isQueueComplete = status.ready === status.total && status.total > 0;
  const isQueuePartial = status.ready > 0 && status.ready < status.total && !isGenerating;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-brand-light">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-brand-text">AI Feedback Generator</h1>
            <Badge variant="primary">{programName}</Badge>
          </div>
          <p className="text-sm text-brand-muted mt-1">
            Build and dispatch detailed, personalized applicant feedback reports to ensure a high-fidelity recruitment brand.
          </p>
        </div>
        <Link href={`/dashboard/programs/${programId}`}>
          <Button variant="outline" size="sm">
            &larr; Control Room
          </Button>
        </Link>
      </div>

      {/* 1. Core Generator Trigger State (If no compilation or in progress) */}
      {!isGenerating && status.ready === 0 && (
        <Card className="p-12 text-center border-brand-border">
          <div className="w-16 h-16 bg-brand-light text-brand-primary flex items-center justify-center rounded-full mx-auto text-2xl font-bold mb-4 shadow-sm select-none">
            ⚡
          </div>
          <h2 className="text-xl font-bold text-brand-text mb-2">
            Compile Personal Feedback Reports
          </h2>
          <p className="text-sm text-brand-muted max-w-md mx-auto mb-6 leading-relaxed">
            The AI Feedback Engine will write highly specific performance breakdowns for all{" "}
            <strong>{status.total} applicants</strong> based on their scores and judges notes. Make closure clean and constructive.
          </p>
          <Button
            onClick={handleStartGeneration}
            variant="primary"
            disabled={status.total === 0}
            className="bg-gradient-to-r from-brand-primary to-indigo-600 border-0"
          >
            Start Feedback Engine Queue
          </Button>
        </Card>
      )}

      {/* 2. Generation Progress Loader Bar (Polled active state) */}
      {isGenerating && (
        <Card className="p-8 border-brand-border space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Spinner size="md" />
              <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">
                Compiling personalized feedback for {status.total} candidates...
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="primary">Processing Queue</Badge>
              <Button
                onClick={handleStartGeneration}
                variant="outline"
                size="sm"
              >
                ↺ Force Re-generate
              </Button>
            </div>
          </div>

          <ProgressBar
            value={status.percentComplete}
            label="Intake compilation progress"
          />

          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100 text-center">
            <div>
              <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Completed</span>
              <span className="text-lg font-bold text-emerald-600">{status.ready}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Generating</span>
              <span className="text-lg font-bold text-brand-primary animate-pulse">{status.generating}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Failed</span>
              <span className="text-lg font-bold text-rose-600">{status.error}</span>
            </div>
          </div>

          {/* Per-candidate status dots */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block select-none">
              Candidate Queue Processing Status
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {status.applicants.map((app) => (
                <div key={app.id} className="flex items-center space-x-2 bg-slate-50 border border-slate-100 p-2 rounded-btn select-none truncate">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    app.reportStatus === "READY" || app.reportStatus === "SENT" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                    app.reportStatus === "ERROR" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" :
                    "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse"
                  }`} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate leading-none">{app.name}</span>
                    <span className="text-[9px] text-slate-400 truncate mt-0.5">{app.reportStatus.toLowerCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* 3. Inline Summary Completion Card */}
      {!isGenerating && status.ready > 0 && (
        <Card className={`p-6 border ${status.error > 0 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"} flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-in slide-in-from-top-4 duration-300`}>
          <div className="space-y-1">
            <h3 className={`text-base font-bold ${status.error > 0 ? "text-amber-950" : "text-emerald-950"} flex items-center`}>
              <span className="mr-2 text-xl">{status.error > 0 ? "⚠️" : "🎉"}</span>
              {status.error > 0
                ? `${status.ready} Feedback Reports Ready, ${status.error} Failed`
                : `All ${status.total} Feedback Reports Compiled Successfully!`}
            </h3>
            <p className={`text-xs ${status.error > 0 ? "text-amber-800" : "text-emerald-800"} max-w-2xl leading-relaxed`}>
              {status.error > 0
                ? "Some candidate reports failed to compile due to high rate-limiting loads. You can easily trigger the generator again to retry the failed queue items."
                : "Constructive performance reviews, highlighted strengths, focus development areas, and actionable next steps have been successfully generated for all candidate matrixes."}
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center space-x-2">
            {status.error > 0 && (
              <Button onClick={handleStartGeneration} variant="primary" className="bg-amber-600 hover:bg-amber-700 border-amber-600 font-bold text-xs">
                Retry Failed Items
              </Button>
            )}
            <Badge variant={status.error > 0 ? "warning" : "success"} className="uppercase font-bold tracking-wider text-[10px]">
              {status.ready} / {status.total} Reports Prepared
            </Badge>
          </div>
        </Card>
      )}

      {/* 4. Previews Suite (Ready state) */}
      {(isQueueComplete || isQueuePartial) && previews.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-2 border-b border-brand-light">
            <h2 className="text-lg font-bold text-brand-text">Personalized Feedback Audits (Random Sample)</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-brand-muted font-semibold uppercase tracking-wider mr-2">
                Program Tone:
              </span>
              <Badge variant="primary" className="uppercase tracking-wider">
                {tonePreference.toLowerCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {previews.map((report) => (
              <Card key={report.applicantId} className="border border-brand-border shadow-premium relative p-6">
                <div className="absolute top-6 right-6">
                  <Button
                    onClick={() => handleRegenerateReport(report.applicantId)}
                    variant="outline"
                    size="sm"
                  >
                    ↻ Regenerate Report
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Profile */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-brand-text">{report.name}</h3>
                      <Badge variant={report.status === "ACCEPTED" ? "success" : "secondary"}>
                        {report.status === "ACCEPTED" ? "Accepted" : "Reviewed"}
                      </Badge>
                    </div>
                    <p className="text-xs text-brand-muted font-medium">{report.email}</p>
                    <span className="inline-block bg-brand-light text-brand-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-badge mt-2">
                      Scored Top {Math.round(100 - report.overallPercentile)}% of applicants
                    </span>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Submission Analysis</span>
                    <p className="text-sm text-brand-text leading-relaxed bg-slate-50/50 p-4 border border-brand-light rounded-btn">
                      {report.summary}
                    </p>
                  </div>

                  {/* Strength */}
                  <div className="p-4 bg-brand-light/45 border-l-4 border-brand-primary rounded-r-btn space-y-1">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block flex items-center">
                      <span className="mr-1.5">✦</span> Key Highlighted Strength
                    </span>
                    <p className="text-xs font-semibold text-brand-text leading-normal">
                      {report.strengthHighlight}
                    </p>
                  </div>

                  {/* Criteria breakdown bars */}
                  <div className="space-y-4">
                    <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Evaluation Metrics</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {report.criteriaBreakdown.map((crit, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-brand-text truncate max-w-[200px]">{crit.criteriaName}</span>
                            <span className="text-brand-primary">{crit.score}/100</span>
                          </div>

                          <div className="w-full h-2 bg-slate-100 border border-slate-200 rounded-badge overflow-hidden">
                            <div className="h-full bg-brand-primary rounded-badge" style={{ width: `${crit.score}%` }} />
                          </div>
                          <p className="text-[11px] text-brand-muted italic leading-relaxed">
                            {crit.insight}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Improvement Areas & next steps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Focus Areas for Improvement</span>
                      <ol className="list-decimal pl-5 text-xs text-brand-text space-y-2 leading-relaxed font-medium">
                        {report.improvementAreas.map((area, idx) => (
                          <li key={idx}>{area}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider block">Actionable Next Steps</span>
                      <ul className="list-disc pl-5 text-xs text-brand-text space-y-2 leading-relaxed font-medium">
                        {report.nextSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Core Submit dispatches bottom card */}
          {sendProgress.status === "idle" && (
            <Card className="p-8 border-brand-primary bg-brand-light/30 text-center flex flex-col items-center space-y-4">
              <h3 className="text-base font-bold text-brand-text">Approve & Dispatch Closure Reviews</h3>
              <p className="text-xs text-brand-muted max-w-lg leading-relaxed font-medium">
                Upon approval, Backlos will instantly compile and dispatch customized feedback templates to all{" "}
                <strong>{status.ready} ready candidates</strong> via Resend. Make closure a premium branding asset.
              </p>
              <Button
                onClick={handleApproveAndSendAll}
                variant="primary"
                className="px-12 py-3 text-sm tracking-wide font-bold bg-gradient-to-r from-brand-primary to-indigo-600 border-0 text-white"
              >
                Approve & Send Feedback Reports to All Candidates
              </Button>
            </Card>
          )}

          {/* Send Progress Overlay inside Room */}
          {sendProgress.status !== "idle" && (
            <Card className="p-8 border border-slate-200 bg-slate-50 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Delivery Pipeline</h4>
                <Badge
                  variant={
                    sendProgress.status === "preparing" ? "secondary" :
                    sendProgress.status === "sending" ? "primary" :
                    sendProgress.status === "success" ? "success" : "danger"
                  }
                >
                  {sendProgress.status.toUpperCase()}
                </Badge>
              </div>

              {/* Steps indicators */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold">
                <div className={`p-2.5 rounded-btn border ${
                  sendProgress.status === "preparing" ? "bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse" :
                  "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  1. Compile Templates
                </div>
                <div className={`p-2.5 rounded-btn border ${
                  sendProgress.status === "sending" ? "bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse" :
                  sendProgress.status === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  "bg-slate-100 text-slate-400 border-transparent"
                }`}>
                  2. Dispatch Batch
                </div>
                <div className={`p-2.5 rounded-btn border ${
                  sendProgress.status === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  sendProgress.status === "error" ? "bg-red-50 text-red-700 border-red-200" :
                  "bg-slate-100 text-slate-400 border-transparent"
                }`}>
                  3. Commits Complete
                </div>
              </div>

              {/* Success summary card */}
              {sendProgress.status === "success" && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-btn space-y-3 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">📨</span>
                    <h5 className="font-bold text-emerald-950">Dispatched {sendProgress.sentCount} Feedback Reviews!</h5>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed font-semibold">
                    All personalized performance reports have been successfully generated and dispatched. Program status is marked as CLOSED.
                  </p>
                  <div className="flex space-x-2 pt-2">
                    <Link href={`/dashboard/programs/${programId}/analytics`}>
                      <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white font-bold">
                        View Program Analytics &rarr;
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button size="sm" variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700">
                        Return to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Error card */}
              {sendProgress.status === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-btn space-y-2 animate-in slide-in-from-top-4 duration-300">
                  <h5 className="font-bold text-red-950 text-xs flex items-center">
                    <span className="mr-2">⚠️</span> Bulk Email Delivery Failed
                  </h5>
                  <p className="text-xs text-red-800 leading-relaxed font-semibold font-mono bg-white p-3 border border-red-100 rounded-btn">
                    {sendProgress.errorMessage}
                  </p>
                  <Button size="sm" variant="outline" className="text-red-700 border-red-200 bg-white hover:bg-red-50" onClick={() => setSendProgress({ status: "idle", errorMessage: "", sentCount: 0 })}>
                    Retry Dispatch Pipeline
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
