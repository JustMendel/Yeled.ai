import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessionUser = await getSessionUser();

  const [planningCount, insightCount, teamSize] = await Promise.all([
    prisma.planningGeneration.count({ where: { nurseryId: sessionUser.nurseryId } }),
    prisma.insightGeneration.count({ where: { nurseryId: sessionUser.nurseryId } }),
    prisma.user.count({ where: { nurseryId: sessionUser.nurseryId } })
  ]);

  return NextResponse.json({ planningCount, insightCount, teamSize });
}
