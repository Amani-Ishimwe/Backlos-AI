import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Normalizes organization names into safe unique slug strings.
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
    const { userId, orgName } = await request.json();

    if (!userId || !orgName || !orgName.trim()) {
      return NextResponse.json(
        { error: "Missing required registration credentials." },
        { status: 400 }
      );
    }

    // 1. Generate a clean unique slug
    let slug = generateSlug(orgName);
    
    // Check if the slug exists already
    const existingOrg = await prisma.org.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      // Append random string to guarantee uniqueness
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // 2. Perform a transactional creation of Org and OrgMember in database
    const org = await prisma.$transaction(async (tx) => {
      const createdOrg = await tx.org.create({
        data: {
          name: orgName,
          slug,
          plan: "FREE",
          feedbackDeliveryScore: 100, // Starts at perfect score
        },
      });

      await tx.orgMember.create({
        data: {
          orgId: createdOrg.id,
          userId,
          role: "OWNER",
        },
      });

      return createdOrg;
    });

    return NextResponse.json({ success: true, data: org }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to initialize organization:", error);
    return NextResponse.json(
      { error: error.message || "Database synchronization failed." },
      { status: 500 }
    );
  }
}
