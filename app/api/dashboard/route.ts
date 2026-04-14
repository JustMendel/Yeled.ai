import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sessionUser = await getSessionUser();

    const [planningCount, insightCount, teamSize] = await Promise.all([
      prisma.planningGeneration.count({ where: { nurseryId: sessionUser.nurseryId } }),
      prisma.insightGeneration.count({ where: { nurseryId: sessionUser.nurseryId } }),
      prisma.user.count({ where: { nurseryId: sessionUser.nurseryId } })
    ]);

    return NextResponse.json({ planningCount, insightCount, teamSize });
  } catch (error) {
    return errorResponse(error);
  }
}
