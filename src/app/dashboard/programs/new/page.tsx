"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { ProgramType, Tone } from "@/types";

export default function NewProgramPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<ProgramType>("HACKATHON");
  const [decisionDeadline, setDecisionDeadline] = useState("");
  const [tonePreference, setTonePreference] = useState<Tone>("FRIENDLY");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    if (!name.trim()) {
      setErrorMsg("Program Name is required.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          decisionDeadline: decisionDeadline ? new Date(decisionDeadline).toISOString() : null,
          tonePreference,
        }),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || "Failed to create program.");
      }

      // Redirect to rubric builder of this program
      router.push(`/dashboard/programs/${resJson.data.id}/rubric`);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const programOptions = [
    { label: "Hackathon", value: "HACKATHON" },
    { label: "Accelerator", value: "ACCELERATOR" },
    { label: "Grant Program", value: "GRANT" },
    { label: "Job Opening", value: "JOB" },
    { label: "Fellowship", value: "FELLOWSHIP" },
    { label: "Award", value: "AWARD" },
    { label: "Other Cohort", value: "OTHER" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="pb-4 border-b border-brand-light">
        <h1 className="text-2xl font-bold text-brand-text">Deploy New Program</h1>
        <p className="text-sm text-brand-muted mt-1">
          Create an intake cohort, configure rubrics, and start generating closure feedback reviews.
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl">
        <Card className="border-1.5 border-brand-border shadow-premium">
          <CardContent className="p-0">
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-btn">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Program Name"
                placeholder="e.g. Backlos Summer Hackathon 2026"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Select
                  label="Program Type"
                  options={programOptions}
                  value={type}
                  onChange={(e) => setType(e.target.value as ProgramType)}
                  disabled={isLoading}
                />

                <Input
                  label="Decision Release Date"
                  type="date"
                  value={decisionDeadline}
                  onChange={(e) => setDecisionDeadline(e.target.value)}
                  disabled={isLoading}
                  helperText="The date when applicants expect results."
                />
              </div>

              {/* Tone Preference selector chips */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-text">
                  AI Tone Preference
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["FRIENDLY", "FORMAL", "CONCISE"] as Tone[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTonePreference(t)}
                      disabled={isLoading}
                      className={`py-3 px-4 border rounded-btn text-xs font-bold transition-all uppercase tracking-wider select-none outline-none focus:ring-1 focus:ring-brand-border
                        ${
                          tonePreference === t
                            ? "bg-brand-light border-brand-primary text-brand-primary font-bold shadow-sm"
                            : "bg-white border-slate-200 text-brand-muted hover:border-brand-border"
                        }`}
                    >
                      {t.toLowerCase()}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-brand-muted mt-1 leading-normal">
                  * Friendly: supportive & warm. Formal: objective & technical. Concise: brief bulleted feedback.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-light">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-semibold text-brand-muted hover:text-brand-text disabled:opacity-50"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  Continue to Rubric Builder
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
