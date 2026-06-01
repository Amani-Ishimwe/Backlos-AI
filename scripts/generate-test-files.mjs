/**
 * Test data generator for Backlos applicant imports.
 * Generates 50-row CSV and Excel files with realistic fake data.
 *
 * Usage:
 *   node scripts/generate-test-files.mjs
 *
 * ⚠️  Edit CRITERIA_NAMES below to match your program's exact rubric criteria names.
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CONFIGURE THESE TO MATCH YOUR PROGRAM ────────────────────────────────────
// Open the Applicants Intake page and look at the drop zone hint for exact names.
const CRITERIA_NAMES = [
  "Technical Depth",
  "Innovation",
  "Presentation",
  "Business Viability",
];
// ──────────────────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  "Amara","Kofi","Yusuf","Fatima","Emeka","Aisha","Chidi","Nia","Obinna","Zara",
  "Kwame","Adaeze","Seun","Imani","Tunde","Chisom","Malik","Amina","Dayo","Ngozi",
  "James","Sarah","David","Emma","Michael","Olivia","Daniel","Sophia","Ryan","Mia",
  "Lucas","Chloe","Ethan","Isabella","Noah","Grace","Liam","Charlotte","Mason","Lily",
  "Hiroshi","Yuki","Arjun","Priya","Wei","Lin","Carlos","Maria","Ivan","Ana",
];

const LAST_NAMES = [
  "Okafor","Mensah","Diallo","Nwosu","Adeola","Kamara","Bello","Asante","Owusu","Traoré",
  "Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Moore","Taylor",
  "Nakamura","Sato","Kumar","Patel","Chen","Zhang","Rodriguez","Santos","Petrov","Silva",
];

const DOMAINS = ["gmail.com","outlook.com","yahoo.com","proton.me","hotmail.com"];
const STATUSES = ["ACCEPTED","REJECTED","PENDING"];
const STATUS_WEIGHTS = [0.3, 0.5, 0.2]; // 30% accepted, 50% rejected, 20% pending

const NOTES_POOL = [
  "Strong technical implementation with clear architectural decisions.",
  "Creative approach but needs more polish on the business model.",
  "Excellent presentation skills. Team clearly understands the problem space.",
  "MVP looks promising. Scaling strategy needs further thinking.",
  "Solid fundamentals but innovation factor is below average for this cohort.",
  "Outstanding demo. The live product was fully functional and impressive.",
  "Needs improvement in data privacy considerations.",
  "Great teamwork evident. Documentation was thorough.",
  "Interesting pivot from original concept. Execution was commendable.",
  "Technical debt is a concern but core product is compelling.",
  "",
  "",
  "", // intentionally blank — judge notes are optional
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedStatus() {
  const r = Math.random();
  if (r < STATUS_WEIGHTS[0]) return STATUSES[0];
  if (r < STATUS_WEIGHTS[0] + STATUS_WEIGHTS[1]) return STATUSES[1];
  return STATUSES[2];
}

function generateRow(index) {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${DOMAINS[index % DOMAINS.length]}`;
  const status = weightedStatus();
  const notes = NOTES_POOL[randomInt(0, NOTES_POOL.length - 1)];

  const row = {
    Name: `${firstName} ${lastName}`,
    Email: email,
    Status: status,
    JudgeNotes: notes,
  };

  // Generate correlated scores — accepted applicants score higher
  const base = status === "ACCEPTED" ? 70 : status === "REJECTED" ? 40 : 55;
  CRITERIA_NAMES.forEach((name) => {
    row[name] = Math.min(100, Math.max(0, randomInt(base - 15, base + 25)));
  });

  return row;
}

const rows = Array.from({ length: 50 }, (_, i) => generateRow(i));

const outDir = path.join(__dirname, "..", "test-data");
fs.mkdirSync(outDir, { recursive: true });

// ── Generate CSV ──────────────────────────────────────────────────────────────
const headers = ["Name", "Email", "Status", "JudgeNotes", ...CRITERIA_NAMES];
const csvLines = [
  headers.join(","),
  ...rows.map((r) =>
    headers.map((h) => {
      const val = String(r[h] ?? "");
      return val.includes(",") ? `"${val}"` : val;
    }).join(",")
  ),
];
const csvPath = path.join(outDir, "test-applicants-50.csv");
fs.writeFileSync(csvPath, csvLines.join("\n"), "utf8");
console.log(`✅ CSV created:  ${csvPath}`);

// ── Generate Excel (.xlsx) ────────────────────────────────────────────────────
const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Applicants");
const xlsxPath = path.join(outDir, "test-applicants-50.xlsx");
XLSX.writeFile(wb, xlsxPath);
console.log(`✅ Excel created: ${xlsxPath}`);

console.log(`\n📋 ${rows.length} applicants generated`);
console.log(`   Accepted: ${rows.filter(r => r.Status === "ACCEPTED").length}`);
console.log(`   Rejected: ${rows.filter(r => r.Status === "REJECTED").length}`);
console.log(`   Pending:  ${rows.filter(r => r.Status === "PENDING").length}`);
console.log(`\n⚠️  Make sure CRITERIA_NAMES in the script matches your program's rubric exactly!`);
