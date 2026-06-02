"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";

interface CriterionInput {
  id?: string; // Existing ID if editing
  name: string;
  weight: number;
  description: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RubricBuilderPage({ params }: PageProps) {
  const router = useRouter();
  const programId = use(params).id;

  const [criteria, setCriteria] = useState<CriterionInput[]>([
    { name: "Technical Execution", weight: 40, description: "Depth of codebase architecture and complexity." },
    { name: "Design & UX", weight: 30, description: "Aesthetics, styling details, layout responsiveness." },
    { name: "Business Pitch", weight: 30, description: "Market potential, value proposition clarity." },
  ]);

  const [programName, setProgramName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch existing program and criteria if any
  useEffect(() => {
    async function fetchProgramDetails() {
      try {
        const res = await fetch(`/api/programs/${programId}`);
        const resJson = await res.json();
        
        if (!res.ok) {
          throw new Error(resJson.error || "Failed to load program details.");
        }

        setProgramName(resJson.data.name);

        if (resJson.data.criteria && resJson.data.criteria.length > 0) {
          const formattedCriteria = resJson.data.criteria.map((c: any) => ({
            id: c.id,
            name: c.name,
            weight: c.weight,
            description: c.description || "",
          }));
          setCriteria(formattedCriteria);
        }
      } catch (err: any) {
        toast.error(err.message || "Could not load existing rubric.");
      } finally {
        setIsFetching(false);
      }
    }

    fetchProgramDetails();
  }, [programId]);

  // Live weights calculation
  const totalWeight = criteria.reduce((sum, item) => sum + (item.weight || 0), 0);
  const isWeightValid = totalWeight === 100;

  const handleAddCriterion = () => {
    setCriteria([
      ...criteria,
      { name: "", weight: 0, description: "" },
    ]);
  };

  const handleRemoveCriterion = (idx: number) => {
    const nextCriteria = [...criteria];
    nextCriteria.splice(idx, 1);
    setCriteria(nextCriteria);
  };

  const handleUpdateCriterion = (idx: number, field: keyof CriterionInput, value: any) => {
    const nextCriteria = [...criteria];
    nextCriteria[idx] = {
      ...nextCriteria[idx],
      [field]: field === "weight" ? parseInt(value) || 0 : value,
    };
    setCriteria(nextCriteria);
  };

  const handleSave = async () => {
    if (!isWeightValid) {
      toast.error(`Total weights must sum to exactly 100. Current total is ${totalWeight}.`);
      return;
    }

    const invalidFields = criteria.some((c) => !c.name.trim());
    if (invalidFields) {
      toast.error("Please fill in the name for all criteria.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/programs/${programId}/rubric`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria }),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || "Failed to save rubric.");
      }

      toast.success("Rubric criteria successfully saved!");
      // Proceed to the next step (Applicant Upload)
      router.push(`/dashboard/programs/${programId}/applicants`);
    } catch (err: any) {
      toast.error(err.message || "Failed to sync rubric details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        <p className="text-xs text-brand-muted">Fetching criteria profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-brand-light">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-brand-text">Configure Rubric</h1>
            <Badge variant="primary">{programName}</Badge>
          </div>
          <p className="text-sm text-brand-muted mt-1">
            Define specific evaluation criteria weights. AI models will profile candidate submissions based on these parameters.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Live total indicator pill */}
          <span className="text-xs font-bold uppercase tracking-wider text-brand-muted mr-1">
            Total Weight:
          </span>
          <span
            className={`px-4 py-1.5 rounded-badge text-sm font-bold border ${
              isWeightValid
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-rose-50 border-rose-300 text-rose-700"
            }`}
          >
            {totalWeight}% / 100%
          </span>
        </div>
      </div>

      {/* Criteria Cards List */}
      <div className="max-w-3xl space-y-4">
        {criteria.map((item, idx) => (
          <Card key={idx} className="border-1.5 border-brand-border relative p-6">
            <button
              onClick={() => handleRemoveCriterion(idx)}
              disabled={criteria.length <= 1 || isLoading}
              className="absolute top-4 right-4 p-1.5 text-brand-muted hover:text-red-500 rounded-btn hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed outline-none"
              aria-label="Delete criterion"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {/* Left Column: Name & Weight inputs */}
              <div className="sm:col-span-3 space-y-4">
                <Input
                  label="Criterion Name"
                  placeholder="e.g. Technical Depth"
                  type="text"
                  value={item.name}
                  onChange={(e) => handleUpdateCriterion(idx, "name", e.target.value)}
                  disabled={isLoading}
                />

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
                    Criterion Description
                  </label>
                  <textarea
                    placeholder="Provide a clear rubric guideline for scoring (e.g. depth of database indexing, clean modular separation)..."
                    value={item.description}
                    onChange={(e) => handleUpdateCriterion(idx, "description", e.target.value)}
                    disabled={isLoading}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-btn outline-none hover:border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Right Column: Weight input */}
              <div className="sm:col-span-1 flex flex-col justify-start">
                <Input
                  label="Weight (%)"
                  placeholder="30"
                  type="number"
                  min="0"
                  max="100"
                  value={item.weight || ""}
                  onChange={(e) => handleUpdateCriterion(idx, "weight", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </Card>
        ))}

        {/* Buttons Action bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-brand-light">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddCriterion}
            disabled={isLoading}
          >
            + Add Rubric Criterion
          </Button>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <Link href={`/dashboard/programs/${programId}`}>
              <button
                type="button"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-semibold text-brand-muted hover:text-brand-text disabled:opacity-50"
              >
                Back to Overview
              </button>
            </Link>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              disabled={!isWeightValid || isLoading}
              isLoading={isLoading}
            >
              Save Rubric & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
