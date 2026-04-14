import { EventType } from "@prisma/client";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { trackEvent } from "@/lib/events";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const sessionUser = await getSessionUser();
  const { searchParams } = new URL(request.url);

  const limit = Number(searchParams.get("limit") ?? "20");
  const query = searchParams.get("q")?.trim() ?? "";
  const moduleFilter = searchParams.get("module") ?? "all";

  const planningWhere = {
    nurseryId: sessionUser.nurseryId,
    ...(query ? { outputText: { contains: query } } : {})
  };

  const insightWhere = {
    nurseryId: sessionUser.nurseryId,
    ...(query ? { outputText: { contains: query } } : {})
  };

  const [planning, insights] = await Promise.all([
    moduleFilter === "insights"
      ? Promise.resolve([])
      : prisma.planningGeneration.findMany({
          where: planningWhere,
          orderBy: { createdAt: "desc" },
          take: limit
        }),
    moduleFilter === "planning"
      ? Promise.resolve([])
      : prisma.insightGeneration.findMany({
          where: insightWhere,
          orderBy: { createdAt: "desc" },
          take: limit
        })
  ]);

  await trackEvent({
    nurseryId: sessionUser.nurseryId,
    userId: sessionUser.id,
    type: EventType.history_viewed,
    metadata: {
      query,
      moduleFilter,
      limit
    }
  });

  return NextResponse.json({ planning, insights });
}
