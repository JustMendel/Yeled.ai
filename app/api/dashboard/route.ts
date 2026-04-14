import { EventType } from "@prisma/client";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { trackEvent } from "@/lib/events";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessionUser = await getSessionUser();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [planningCount, insightCount, teamSize, weeklyPlanning, weeklyInsights] = await Promise.all([
    prisma.planningGeneration.count({ where: { nurseryId: sessionUser.nurseryId } }),
    prisma.insightGeneration.count({ where: { nurseryId: sessionUser.nurseryId } }),
    prisma.user.count({ where: { nurseryId: sessionUser.nurseryId } }),
    prisma.planningGeneration.count({
      where: { nurseryId: sessionUser.nurseryId, createdAt: { gte: sevenDaysAgo } }
    }),
    prisma.insightGeneration.count({
      where: { nurseryId: sessionUser.nurseryId, createdAt: { gte: sevenDaysAgo } }
    })
  ]);

  const totalGenerations = planningCount + insightCount;
  const weeklyGenerations = weeklyPlanning + weeklyInsights;
  const avgGenerationsPerStaff = teamSize > 0 ? Number((weeklyGenerations / teamSize).toFixed(2)) : 0;
  const parentInsightShare = totalGenerations > 0 ? Number(((insightCount / totalGenerations) * 100).toFixed(1)) : 0;

  await trackEvent({
    nurseryId: sessionUser.nurseryId,
    userId: sessionUser.id,
    type: EventType.dashboard_viewed,
    metadata: {
      weeklyGenerations,
      teamSize
    }
  });

  return NextResponse.json({
    planningCount,
    insightCount,
    teamSize,
    totalGenerations,
    weeklyGenerations,
    avgGenerationsPerStaff,
    parentInsightShare
  });
}
