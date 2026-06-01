import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const membership = await prisma.orgMember.findFirst({
      where: { userId: user.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organization membership found" }, { status: 403 });
    }

    // Verify program belongs to this organization
    const program = await prisma.program.findFirst({
      where: {
        id: params.id,
        orgId: membership.orgId,
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const { criteria } = await request.json();

    if (!Array.isArray(criteria) || criteria.length === 0) {
      return NextResponse.json({ error: "At least one rubric criterion is required" }, { status: 400 });
    }

    // Validate weights sum to exactly 100
    const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
    if (totalWeight !== 100) {
      return NextResponse.json({ error: `Weights must sum to exactly 100%. Currently it is ${totalWeight}%` }, { status: 400 });
    }

    // 1. Find current ids in db first (outside of transaction)
    const existing = await prisma.rubricCriteria.findMany({
      where: { programId: params.id },
      select: { id: true },
    });

    const incomingIds = criteria.map((c) => c.id).filter(Boolean) as string[];
    const deleteIds = existing.map((e) => e.id).filter((id) => !incomingIds.includes(id));

    // 2. Compile queries into a batch array
    const operations: any[] = [];

    // Add delete query if there are removed criteria
    if (deleteIds.length > 0) {
      operations.push(
        prisma.rubricCriteria.deleteMany({
          where: {
            id: { in: deleteIds },
          },
        })
      );
    }

    // Add upsert queries for each criterion
    criteria.forEach((c) => {
      operations.push(
        prisma.rubricCriteria.upsert({
          where: { id: c.id || "new-item-dummy-id" },
          update: {
            name: c.name,
            weight: c.weight,
            description: c.description,
          },
          create: {
            programId: params.id,
            name: c.name,
            weight: c.weight,
            description: c.description,
          },
        })
      );
    });

    // 3. Execute array-based transaction (fully compatible with PgBouncer, takes milliseconds)
    const results = await prisma.$transaction(operations);

    // Extract only the upsert results (excluding the deleteMany result if present)
    const updatedCriteria = deleteIds.length > 0 ? results.slice(1) : results;

    return NextResponse.json({ success: true, data: updatedCriteria });
  } catch (error: any) {
    console.error("Rubric save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
