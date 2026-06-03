"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { isValidEmail } from "@/utils/csv";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ProgramDetail {
  id: string;
  name: string;
  criteria: { id: string; name: string; weight: number }[];
  applicants: {
    id: string;
    name: string;
    email: string;
    status: "ACCEPTED" | "REJECTED" | "PENDING";
    scores: { criteriaId: string; score: number }[];
  }[];
}

interface GridRow {
  id: string;
  name: string;
  email: string;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
  scores: Record<string, string>; // criteriaId -> score string
  judgeNotes: string;
}

export default function ApplicantsIntakePage({ params }: PageProps) {
  const router = useRouter();
  const programId = use(params).id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Spreadsheet Data Grid state
  const [gridRows, setGridRows] = useState<GridRow[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileValidationError, setFileValidationError] = useState<string[]>([]);

  // Sync Pipeline Progress State
  const [syncStatus, setSyncStatus] = useState<{
    status: "idle" | "validating" | "uploading" | "success" | "error";
    createdCount: number;
    updatedCount: number;
    errorMessage: string;
  }>({
    status: "idle",
    createdCount: 0,
    updatedCount: 0,
    errorMessage: "",
  });

  const makeEmptyRow = (criteriaList: { id: string }[]): GridRow => {
    const scores: Record<string, string> = {};
    criteriaList.forEach((c) => {
      scores[c.id] = "";
    });
    return {
      id: Math.random().toString(36).substring(7),
      name: "",
      email: "",
      status: "PENDING",
      scores,
      judgeNotes: "",
    };
  };

  // Load program details
  const fetchProgramData = async () => {
    try {
      const res = await fetch(`/api/programs/${programId}`);
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Failed to load program");

      setProgram(resJson.data);

      // Pre-seed grid with 5 empty rows if grid is currently empty
      if (gridRows.length === 0) {
        const initialRows = Array.from({ length: 5 }, () => makeEmptyRow(resJson.data.criteria));
        setGridRows(initialRows);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch candidate registries.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchProgramData();
  }, [programId]);

  // Validation functions
  const isNameInvalid = (name: string) => !name.trim();
  const isEmailInvalid = (email: string) => !email.trim() || !isValidEmail(email);
  const isScoreInvalid = (score: string) => {
    const val = parseFloat(score);
    return score.trim() === "" || isNaN(val) || val < 0 || val > 100;
  };

  const getGridValidationErrorCount = () => {
    let count = 0;
    gridRows.forEach((row) => {
      if (isNameInvalid(row.name)) count++;
      if (isEmailInvalid(row.email)) count++;
      Object.values(row.scores).forEach((score) => {
        if (isScoreInvalid(score)) count++;
      });
    });
    return count;
  };

  // Check columns of uploaded files
  const checkColumns = (headers: string[]) => {
    if (!program) return [];
    const normalizedHeaders = headers.map((h) => h.trim().toLowerCase());
    const hasName = normalizedHeaders.includes("name") || normalizedHeaders.includes("candidate name");
    const hasEmail = normalizedHeaders.includes("email") || normalizedHeaders.includes("candidate email");

    const missing: string[] = [];
    if (!hasName) missing.push("Name (or Candidate Name)");
    if (!hasEmail) missing.push("Email (or Candidate Email)");

    program.criteria.forEach((c) => {
      const found = normalizedHeaders.some((h) => h === c.name.toLowerCase());
      if (!found) {
        missing.push(c.name);
      }
    });

    return missing;
  };

  // Handle uploaded files (CSV + Excel)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const parseFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "xlsx" || ext === "xls") {
      parseExcel(file);
    } else {
      parseCSV(file);
    }
  };

  const parseCSV = (file: File) => {
    if (!program) return;
    setIsSyncing(true);
    setSyncStatus({ status: "validating", createdCount: 0, updatedCount: 0, errorMessage: "" });
    setFileValidationError([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const missing = checkColumns(headers);
        if (missing.length > 0) {
          setFileValidationError(missing);
          setIsSyncing(false);
          setSyncStatus({ status: "idle", createdCount: 0, updatedCount: 0, errorMessage: "" });
          toast.error("File schema validation failed.");
          return;
        }

        const parsedRows = (results.data as any[]).map((row: any) => {
          const name = row.name || row.Name || row["Candidate Name"] || row["candidate name"] || "";
          const email = row.email || row.Email || row["Candidate Email"] || row["candidate email"] || "";
          const rawStatus = String(row.status || row.Status || "PENDING").toUpperCase();
          const judgeNotes = row.judgeNotes || row.JudgeNotes || row.notes || row.Notes || "";

          const status = (
            rawStatus === "ACCEPTED" ? "ACCEPTED" :
            rawStatus === "REJECTED" ? "REJECTED" : "PENDING"
          ) as "ACCEPTED" | "REJECTED" | "PENDING";

          const scores: Record<string, string> = {};
          program.criteria.forEach((c) => {
            const matchKey = Object.keys(row).find(
              (k) => k.toLowerCase() === c.name.toLowerCase()
            );
            scores[c.id] = matchKey ? String(row[matchKey]).trim() : "";
          });

          return {
            id: Math.random().toString(36).substring(7),
            name,
            email,
            status,
            scores,
            judgeNotes,
          };
        });

        setGridRows(parsedRows);
        setIsSyncing(false);
        setSyncStatus({ status: "idle", createdCount: 0, updatedCount: 0, errorMessage: "" });

        // Track CSV file import
        if (typeof window !== "undefined" && window.pendo) {
          window.pendo.track("applicants_file_imported", {
            programId,
            fileFormat: "csv",
            applicantCount: parsedRows.length,
            criteriaCount: program.criteria.length,
          });
        }

        toast.success(`Populated workspace grid with ${parsedRows.length} candidates!`);
      },
      error: (error) => {
        setIsSyncing(false);
        setSyncStatus({ status: "error", createdCount: 0, updatedCount: 0, errorMessage: error.message });
        toast.error(`CSV parsing failed: ${error.message}`);
      },
    });
  };

  const parseExcel = (file: File) => {
    if (!program) return;
    setIsSyncing(true);
    setSyncStatus({ status: "validating", createdCount: 0, updatedCount: 0, errorMessage: "" });
    setFileValidationError([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: "" });

        const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
        const missing = checkColumns(headers);
        if (missing.length > 0) {
          setFileValidationError(missing);
          setIsSyncing(false);
          setSyncStatus({ status: "idle", createdCount: 0, updatedCount: 0, errorMessage: "" });
          toast.error("File schema validation failed.");
          return;
        }

        const parsedRows = rows.map((row: any) => {
          const name = row.name || row.Name || row["Candidate Name"] || row["candidate name"] || "";
          const email = row.email || row.Email || row["Candidate Email"] || row["candidate email"] || "";
          const rawStatus = String(row.status || row.Status || "PENDING").toUpperCase();
          const judgeNotes = row.judgeNotes || row.JudgeNotes || row.notes || row.Notes || "";

          const status = (
            rawStatus === "ACCEPTED" ? "ACCEPTED" :
            rawStatus === "REJECTED" ? "REJECTED" : "PENDING"
          ) as "ACCEPTED" | "REJECTED" | "PENDING";

          const scores: Record<string, string> = {};
          program.criteria.forEach((c) => {
            const matchKey = Object.keys(row).find(
              (k) => k.toLowerCase() === c.name.toLowerCase()
            );
            scores[c.id] = matchKey ? String(row[matchKey]).trim() : "";
          });

          return {
            id: Math.random().toString(36).substring(7),
            name,
            email,
            status,
            scores,
            judgeNotes,
          };
        });

        setGridRows(parsedRows);
        setIsSyncing(false);
        setSyncStatus({ status: "idle", createdCount: 0, updatedCount: 0, errorMessage: "" });

        // Track Excel file import
        if (typeof window !== "undefined" && window.pendo) {
          window.pendo.track("applicants_file_imported", {
            programId,
            fileFormat: "excel",
            applicantCount: parsedRows.length,
            criteriaCount: program.criteria.length,
          });
        }

        toast.success(`Populated workspace grid with ${parsedRows.length} candidates!`);
      } catch (err: any) {
        setIsSyncing(false);
        setSyncStatus({ status: "error", createdCount: 0, updatedCount: 0, errorMessage: err.message });
        toast.error(`Excel parsing failed: ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Helper helper to download client-side files
  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Empty Template (CSV/Excel)
  const downloadTemplate = (format: "csv" | "excel") => {
    if (!program) return;

    const rowData: any = {
      "Candidate Name": "Jane Doe",
      "Candidate Email": "jane.doe@example.com",
      "Status": "PENDING",
    };
    program.criteria.forEach((crit) => {
      rowData[crit.name] = "85";
    });
    rowData["Judge Notes"] = "Highly recommended, excellent communication skills.";

    const data = [rowData];

    if (format === "csv") {
      const csv = Papa.unparse(data);
      downloadFile(csv, `${program.name}_template.csv`, "text/csv");
    } else {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      XLSX.writeFile(wb, `${program.name}_template.xlsx`);
    }
    // Track template download
    if (typeof window !== "undefined" && window.pendo) {
      window.pendo.track("template_downloaded", {
        programId,
        fileFormat: format,
        programName: program.name,
      });
    }

    toast.success(`Downloaded template as ${format.toUpperCase()}`);
  };

  // Download Current Grid Data
  const exportGridData = (format: "csv" | "excel") => {
    if (!program) return;
    if (gridRows.length === 0) {
      toast.error("Grid is empty. Enter some candidate data first.");
      return;
    }

    const data = gridRows.map((r) => {
      const row: any = {
        "Candidate Name": r.name,
        "Candidate Email": r.email,
        "Status": r.status,
      };
      program.criteria.forEach((crit) => {
        row[crit.name] = r.scores[crit.id] || "";
      });
      row["Judge Notes"] = r.judgeNotes;
      return row;
    });

    if (format === "csv") {
      const csv = Papa.unparse(data);
      downloadFile(csv, `${program.name}_grid_data.csv`, "text/csv");
    } else {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Grid Data");
      XLSX.writeFile(wb, `${program.name}_grid_data.xlsx`);
    }
    // Track grid data export
    if (typeof window !== "undefined" && window.pendo) {
      window.pendo.track("grid_data_exported", {
        programId,
        fileFormat: format,
        rowCount: gridRows.length,
      });
    }

    toast.success(`Exported spreadsheet grid data as ${format.toUpperCase()}`);
  };

  // Export Enrolled Candidate Database (CSV/Excel)
  const exportRegistryData = (format: "csv" | "excel") => {
    if (!program || program.applicants.length === 0) return;

    const data = program.applicants.map((app) => {
      const row: any = {
        "Candidate Name": app.name,
        "Candidate Email": app.email,
        "Status": app.status,
      };
      program.criteria.forEach((crit) => {
        const scoreObj = app.scores.find((s) => s.criteriaId === crit.id);
        row[crit.name] = scoreObj ? scoreObj.score : "";
      });
      return row;
    });

    if (format === "csv") {
      const csv = Papa.unparse(data);
      downloadFile(csv, `${program.name}_enrolled_registry.csv`, "text/csv");
    } else {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Registry");
      XLSX.writeFile(wb, `${program.name}_enrolled_registry.xlsx`);
    }
    // Track registry data export
    if (typeof window !== "undefined" && window.pendo) {
      window.pendo.track("registry_data_exported", {
        programId,
        fileFormat: format,
        applicantCount: program.applicants.length,
      });
    }

    toast.success(`Exported enrolled candidate registry as ${format.toUpperCase()}`);
  };

  // Sync spreadsheet rows to backend database
  const handleSyncToDatabase = async () => {
    if (!program || gridRows.length === 0) return;

    // Client-side validations
    setSyncStatus({ status: "validating", createdCount: 0, updatedCount: 0, errorMessage: "" });
    setIsSyncing(true);

    // Sleep 800ms for premium feeling progress step
    await new Promise((r) => setTimeout(r, 800));

    const errorsCount = getGridValidationErrorCount();
    if (errorsCount > 0) {
      setIsSyncing(false);
      setSyncStatus({ status: "idle", createdCount: 0, updatedCount: 0, errorMessage: "" });
      toast.error(`Please correct the ${errorsCount} invalid values highlighted in red.`);
      return;
    }

    setSyncStatus({ status: "uploading", createdCount: 0, updatedCount: 0, errorMessage: "" });

    // Format scores payload properly
    const payload = gridRows.map((r) => {
      const scoresPayload: Record<string, number> = {};
      Object.keys(r.scores).forEach((critId) => {
        scoresPayload[critId] = parseFloat(r.scores[critId]);
      });

      return {
        name: r.name,
        email: r.email,
        status: r.status,
        scores: scoresPayload,
        judgeNotes: r.judgeNotes,
      };
    });

    try {
      const res = await fetch(`/api/programs/${programId}/applicants/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: payload }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Failed to synchronize roster.");

      setSyncStatus({
        status: "success",
        createdCount: resJson.data.created,
        updatedCount: resJson.data.updated,
        errorMessage: "",
      });

      // Clear the grid and pre-seed clean rows
      const cleanRows = Array.from({ length: 5 }, () => makeEmptyRow(program.criteria));
      setGridRows(cleanRows);

      // Track applicants synced to database
      if (typeof window !== "undefined" && window.pendo) {
        window.pendo.track("applicants_synced_to_database", {
          programId,
          totalRows: payload.length,
          createdCount: resJson.data.created,
          updatedCount: resJson.data.updated,
        });
      }

      toast.success("Synchronized scores successfully!");
      fetchProgramData();
    } catch (err: any) {
      setSyncStatus({
        status: "error",
        createdCount: 0,
        updatedCount: 0,
        errorMessage: err.message || "An unexpected error occurred during database sync.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddRow = () => {
    if (!program) return;
    setGridRows([...gridRows, makeEmptyRow(program.criteria)]);
  };

  const handleClearGrid = () => {
    if (!program) return;
    if (confirm("Are you sure you want to clear the entire interactive workspace spreadsheet? All unsaved edits will be lost.")) {
      setGridRows(Array.from({ length: 5 }, () => makeEmptyRow(program.criteria)));
      setFileValidationError([]);
    }
  };

  const handleRemoveRow = (id: string) => {
    const updated = gridRows.filter((r) => r.id !== id);
    setGridRows(updated.length === 0 && program ? [makeEmptyRow(program.criteria)] : updated);
  };

  const handleCellChange = (rowId: string, field: keyof GridRow, val: any) => {
    const updated = gridRows.map((row) => {
      if (row.id === rowId) {
        return { ...row, [field]: val };
      }
      return row;
    });
    setGridRows(updated);
  };

  const handleScoreChange = (rowId: string, criteriaId: string, val: string) => {
    const updated = gridRows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          scores: {
            ...row.scores,
            [criteriaId]: val,
          },
        };
      }
      return row;
    });
    setGridRows(updated);
  };

  const handleDeleteApplicant = async (appId: string) => {
    if (!confirm("Are you sure you want to delete this applicant score profile?")) return;
    setIsSyncing(true);

    try {
      const res = await fetch(`/api/programs/${programId}/applicants/upload?applicantId=${appId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Deletion failed");

      // Track applicant deletion
      if (typeof window !== "undefined" && window.pendo) {
        window.pendo.track("applicant_deleted", {
          programId,
          applicantId: appId,
        });
      }

      toast.success("Applicant deleted.");
      fetchProgramData();
    } catch (err: any) {
      toast.error(err.message || "Could not delete applicant.");
    } finally {
      setIsSyncing(false);
    }
  };

  if (isFetching || !program) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        <p className="text-xs text-brand-muted">Loading candidate rosters...</p>
      </div>
    );
  }

  const gridErrCount = getGridValidationErrorCount();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-brand-light">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-brand-text">Applicant Scores Intake</h1>
            <Badge variant="primary">{program.name}</Badge>
          </div>
          <p className="text-sm text-brand-muted mt-1">
            Build and manage candidate evaluation matrices. Input scores directly inside the workspace spreadsheet or import custom files.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/programs/${program.id}`}>
            <Button variant="outline" size="sm">
              &larr; Control Room
            </Button>
          </Link>
          <Link href={`/dashboard/programs/${program.id}/feedback`}>
            <Button variant="primary" size="sm" disabled={program.applicants.length === 0}>
              Generate Feedback &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* Roster Workspace Card */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6 border-brand-border space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-brand-text">1. Spreadsheet Data Entry Grid</h2>
              <p className="text-xs text-brand-muted mt-0.5">
                Type directly into cells. Criteria columns represent evaluation weights:{" "}
                {program.criteria.map((c) => `${c.name} (${c.weight}%)`).join(", ")}.
              </p>
            </div>

            {/* Template & Excel downloads */}
            <div className="flex flex-wrap gap-2">
              <div className="relative group">
                <Button variant="outline" size="sm">
                  📥 Download Template
                </Button>
                <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-50 bg-white border border-brand-border rounded-btn shadow-md p-1 min-w-[150px]">
                  <button onClick={() => downloadTemplate("csv")} className="w-full text-left text-xs font-semibold px-3 py-1.5 hover:bg-slate-50 rounded-btn">
                    CSV Format (.csv)
                  </button>
                  <button onClick={() => downloadTemplate("excel")} className="w-full text-left text-xs font-semibold px-3 py-1.5 hover:bg-slate-50 rounded-btn">
                    Excel Format (.xlsx)
                  </button>
                </div>
              </div>

              <div className="relative group">
                <Button variant="outline" size="sm" disabled={gridRows.length === 0}>
                  📤 Export Spreadsheet
                </Button>
                <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-50 bg-white border border-brand-border rounded-btn shadow-md p-1 min-w-[150px]">
                  <button onClick={() => exportGridData("csv")} className="w-full text-left text-xs font-semibold px-3 py-1.5 hover:bg-slate-50 rounded-btn">
                    Export as CSV
                  </button>
                  <button onClick={() => exportGridData("excel")} className="w-full text-left text-xs font-semibold px-3 py-1.5 hover:bg-slate-50 rounded-btn">
                    Export as Excel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Import Dropzone and schema validator */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left dropzone */}
            <div className="lg:col-span-1">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) parseFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-btn p-6 text-center cursor-pointer transition-all duration-200 select-none h-full flex flex-col justify-center items-center
                  ${isDragOver ? "bg-indigo-50/50 border-brand-primary" : "border-brand-border hover:bg-slate-50/50"}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                />
                <span className="text-2xl mb-2">📄</span>
                <p className="text-xs font-bold text-brand-text">Drop Custom File</p>
                <p className="text-[10px] text-brand-muted mt-1 leading-relaxed">
                  Imports .csv / .xlsx files directly into the editable grid.
                </p>
              </div>
            </div>

            {/* Right: validation block / file criteria list */}
            <div className="lg:col-span-3 flex flex-col justify-center">
              {fileValidationError.length > 0 ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-btn space-y-2 animate-in slide-in-from-top-4 duration-300">
                  <h4 className="font-bold text-red-950 text-xs flex items-center">
                    <span className="mr-2">⚠️</span> Column Headers Schema Validation Failed
                  </h4>
                  <p className="text-[11px] text-red-800 leading-relaxed">
                    The uploaded spreadsheet could not be processed because it is missing required evaluation criteria. Please rename your file columns to match these headers:
                  </p>
                  <ul className="list-disc pl-5 text-[10px] text-red-900 font-bold grid grid-cols-2 gap-1">
                    {fileValidationError.map((col, idx) => (
                      <li key={idx} className="font-mono">{col}</li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <Button size="sm" variant="outline" className="text-red-700 hover:text-red-800 border-red-200 bg-white" onClick={() => downloadTemplate("csv")}>
                      Download Reference Template
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50/50 border border-brand-light rounded-btn text-xs space-y-2">
                  <span className="font-bold text-brand-text uppercase tracking-wider text-[10px]">Mapping Specifications</span>
                  <p className="text-brand-muted leading-relaxed text-[11px]">
                    To sync candidate scores via upload, match column headers exactly to criteria names. If any header is missing, the file is rejected to ensure data integrity.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1 select-none">
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-badge border border-slate-300">Name</span>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-badge border border-slate-300">Email</span>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-badge border border-slate-300">Status</span>
                    {program.criteria.map((c) => (
                      <span key={c.id} className="bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-badge border border-indigo-200">
                        {c.name}
                      </span>
                    ))}
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-mono font-medium px-2 py-0.5 rounded-badge border border-slate-300">Judge Notes</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive spreadsheet table container */}
          <div className="overflow-x-auto border border-brand-border rounded-btn max-h-[380px] bg-slate-50/20">
            <table className="min-w-full divide-y divide-brand-light text-left text-xs bg-white">
              <thead className="bg-slate-50/80 sticky top-0 backdrop-blur-sm uppercase text-[10px] font-bold tracking-wider text-brand-muted select-none z-10">
                <tr>
                  <th className="px-4 py-3 min-w-[150px]">Candidate Name</th>
                  <th className="px-4 py-3 min-w-[200px]">Candidate Email</th>
                  <th className="px-4 py-3 min-w-[140px]">Status</th>
                  {program.criteria.map((c) => (
                    <th key={c.id} className="px-4 py-3 text-right min-w-[110px]">
                      {c.name} <span className="text-[9px] text-brand-primary lowercase font-medium">({c.weight}%)</span>
                    </th>
                  ))}
                  <th className="px-4 py-3 min-w-[200px]">Judge notes (AI Context)</th>
                  <th className="px-4 py-3 text-center w-[60px]">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light">
                {gridRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/40">
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={row.name}
                        onChange={(e) => handleCellChange(row.id, "name", e.target.value)}
                        disabled={isSyncing}
                        className={`w-full px-2 py-1 bg-transparent border-0 border-b border-transparent focus:border-indigo-500 focus:ring-0 focus:outline-none transition-colors text-xs font-semibold ${
                          isNameInvalid(row.name) ? "border-red-500 text-red-900 bg-red-50/20 rounded-btn" : ""
                        }`}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={row.email}
                        onChange={(e) => handleCellChange(row.id, "email", e.target.value)}
                        disabled={isSyncing}
                        className={`w-full px-2 py-1 bg-transparent border-0 border-b border-transparent focus:border-indigo-500 focus:ring-0 focus:outline-none transition-colors text-xs font-medium ${
                          isEmailInvalid(row.email) ? "border-red-500 text-red-900 bg-red-50/20 rounded-btn" : ""
                        }`}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={row.status}
                        onChange={(e) => handleCellChange(row.id, "status", e.target.value)}
                        disabled={isSyncing}
                        className="w-full px-2 py-1 bg-transparent border-0 border-b border-transparent focus:border-indigo-500 focus:ring-0 focus:outline-none transition-colors text-xs font-semibold text-slate-700 rounded-btn"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    {program.criteria.map((crit) => {
                      const score = row.scores[crit.id] || "";
                      const isErr = isScoreInvalid(score);
                      return (
                        <td key={crit.id} className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="85"
                            value={score}
                            onChange={(e) => handleScoreChange(row.id, crit.id, e.target.value)}
                            disabled={isSyncing}
                            className={`w-full px-2 py-1 bg-transparent border-0 border-b border-transparent text-right font-mono focus:border-indigo-500 focus:ring-0 focus:outline-none transition-colors text-xs font-semibold ${
                              isErr ? "border-red-500 text-red-900 bg-red-50/20 rounded-btn" : ""
                            }`}
                          />
                        </td>
                      );
                    })}
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        placeholder="Constructive feedback pointers..."
                        value={row.judgeNotes}
                        onChange={(e) => handleCellChange(row.id, "judgeNotes", e.target.value)}
                        disabled={isSyncing}
                        className="w-full px-2 py-1 bg-transparent border-0 border-b border-transparent focus:border-indigo-500 focus:ring-0 focus:outline-none transition-colors text-xs text-slate-600 font-medium"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => handleRemoveRow(row.id)}
                        disabled={isSyncing}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-btn transition-colors outline-none font-bold text-base leading-none select-none"
                        aria-label="Remove grid row"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action bar and error alerts for the Spreadsheet grid */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleAddRow} disabled={isSyncing}>
                ➕ Add Score Row
              </Button>
              <Button variant="outline" size="sm" className="text-slate-500 hover:text-slate-700 border-slate-200 bg-white" onClick={handleClearGrid} disabled={isSyncing}>
                🧹 Clear Grid
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              {gridErrCount > 0 && (
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-btn animate-pulse">
                  ⚠️ {gridErrCount} formatting cell issues. Save blocked.
                </span>
              )}

              <Button
                variant="primary"
                onClick={handleSyncToDatabase}
                disabled={isSyncing || gridRows.length === 0 || gridErrCount > 0}
                className="bg-gradient-to-r from-brand-primary to-indigo-600 border-0 text-white font-bold tracking-wide"
              >
                Sync & Save Candidates to Registry
              </Button>
            </div>
          </div>

          {/* Step-by-step upload progress & completed card */}
          {syncStatus.status !== "idle" && (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-btn space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Intake Sync Pipeline Status</h4>
                <Badge
                  variant={
                    syncStatus.status === "validating" ? "secondary" :
                    syncStatus.status === "uploading" ? "primary" :
                    syncStatus.status === "success" ? "success" : "danger"
                  }
                >
                  {syncStatus.status === "validating" ? "Validating Formats" :
                   syncStatus.status === "uploading" ? "Uploading Profiles" :
                   syncStatus.status === "success" ? "Pipeline Complete" : "Sync Failed"}
                </Badge>
              </div>

              {/* Progress Steps UI */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold">
                <div className={`p-2.5 rounded-btn border ${
                  syncStatus.status === "validating" ? "bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  1. Local Validation
                </div>
                <div className={`p-2.5 rounded-btn border ${
                  syncStatus.status === "uploading" ? "bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse" :
                  syncStatus.status === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  "bg-slate-100 text-slate-400 border-transparent"
                }`}>
                  2. Syncing to database
                </div>
                <div className={`p-2.5 rounded-btn border ${
                  syncStatus.status === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  syncStatus.status === "error" ? "bg-red-50 text-red-700 border-red-200" :
                  "bg-slate-100 text-slate-400 border-transparent"
                }`}>
                  3. Batch Completed
                </div>
              </div>

              {/* Success Result Card */}
              {syncStatus.status === "success" && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-btn space-y-3 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">✅</span>
                    <h5 className="font-bold text-emerald-950">Successfully Synced Candidate Roster!</h5>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Database update transaction completed. Every score row was parsed, verified, and mapped successfully.
                  </p>
                  <div className="flex space-x-6 text-xs font-mono font-bold text-emerald-900 bg-white border border-emerald-100 p-2.5 rounded-btn w-fit">
                    <div>➕ New candidates: {syncStatus.createdCount}</div>
                    <div>🔄 Updated profiles: {syncStatus.updatedCount}</div>
                  </div>
                  <div className="flex space-x-2 pt-1.5">
                    <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-200 bg-white hover:bg-emerald-50" onClick={() => setSyncStatus({ status: "idle", createdCount: 0, updatedCount: 0, errorMessage: "" })}>
                      Clear Result
                    </Button>
                    <Link href={`/dashboard/programs/${programId}/feedback`}>
                      <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white font-bold">
                        Proceed to Feedback Room &rarr;
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Error Card */}
              {syncStatus.status === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-btn space-y-2 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">⚠️</span>
                    <h5 className="font-bold text-red-950">Intake Roster Sync Pipeline Broken</h5>
                  </div>
                  <p className="text-xs text-red-800 leading-relaxed font-semibold font-mono bg-white p-3 border border-red-100 rounded-btn">
                    {syncStatus.errorMessage}
                  </p>
                  <div className="pt-1">
                    <Button size="sm" variant="outline" className="text-red-700 border-red-200 bg-white hover:bg-red-50 font-bold" onClick={() => setSyncStatus({ status: "idle", createdCount: 0, updatedCount: 0, errorMessage: "" })}>
                      Acknowledge & Edit Grid
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Enrolled registry database details */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-brand-light">
          <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">
            2. Enrolled Candidates Registry ({program.applicants.length} candidates in database)
          </h3>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-brand-muted font-bold mr-2 select-none">Export Database:</span>
            <Button variant="outline" size="sm" disabled={program.applicants.length === 0} onClick={() => exportRegistryData("csv")}>
              Export as CSV
            </Button>
            <Button variant="outline" size="sm" disabled={program.applicants.length === 0} onClick={() => exportRegistryData("excel")}>
              Export as Excel
            </Button>
          </div>
        </div>

        {program.applicants.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border border-brand-border bg-slate-50/50">
            <span className="text-2xl mb-2 select-none">👥</span>
            <p className="text-xs text-brand-muted leading-relaxed max-w-sm">
              Your program's roster database is empty. Add profiles in the Spreadsheet grid above and sync to see them registered here.
            </p>
          </Card>
        ) : (
          <Card className="p-0 border-brand-border overflow-hidden">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="min-w-full divide-y divide-brand-light text-left text-xs bg-white">
                <thead className="bg-slate-50 uppercase text-[10px] font-bold tracking-wider text-brand-muted select-none">
                  <tr>
                    <th className="px-4 py-3">Candidate Profile</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Overall Weighted Score</th>
                    <th className="px-4 py-3 text-center w-[80px]">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light">
                  {program.applicants.map((app) => {
                    // Compute overall weighted score
                    let weightedScore = 0;
                    app.scores.forEach((s) => {
                      const crit = program.criteria.find((c) => c.id === s.criteriaId);
                      if (crit) {
                        weightedScore += (s.score * crit.weight) / 100;
                      }
                    });

                    return (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-brand-text truncate">{app.name}</span>
                            <span className="text-[10px] text-brand-muted truncate mt-0.5">{app.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={app.status === "ACCEPTED" ? "success" : app.status === "REJECTED" ? "danger" : "secondary"}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-brand-primary font-mono text-sm">
                          {weightedScore.toFixed(1)}/100
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteApplicant(app.id)}
                            disabled={isSyncing}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-btn hover:bg-red-50 transition-colors outline-none font-bold text-base leading-none select-none"
                            aria-label="Delete applicant"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
