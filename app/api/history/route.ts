import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessionUser = await getSessionUser();

  const [planning, insights] = await Promise.all([
    prisma.planningGeneration.findMany({
      where: { nurseryId: sessionUser.nurseryId },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    prisma.insightGeneration.findMany({
      where: { nurseryId: sessionUser.nurseryId },
      orderBy: { createdAt: "desc" },
      take: 20
    })
  ]);

  return NextResponse.json({ planning, insights });
}
