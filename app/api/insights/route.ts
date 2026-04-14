import { EventType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { generateInsight } from "@/lib/ai";
import { getSessionUser } from "@/lib/auth";
import { trackEvent } from "@/lib/events";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";

const insightSchema = z.object({
  childName: z.string(),
  age: z.string(),
  observations: z.string(),
  developmentFocus: z.string(),
  concernLevel: z.string(),
  tone: z.string(),
  jewishFraming: z.boolean()
});

export async function POST(request: Request) {
  try {
    const input = insightSchema.parse(await request.json());
    const sessionUser = await getSessionUser();

    enforceRateLimit(`insights:${sessionUser.id}`, 20, 60_000);

    const output = await generateInsight(input);

    const saved = await prisma.insightGeneration.create({
      data: {
        nurseryId: sessionUser.nurseryId,
        userId: sessionUser.id,
        observation: input.observations,
        outputText: output
      }
    });

    await trackEvent({
      nurseryId: sessionUser.nurseryId,
      userId: sessionUser.id,
      type: EventType.insight_generated,
      metadata: {
        developmentFocus: input.developmentFocus,
        concernLevel: input.concernLevel,
        jewishFraming: input.jewishFraming
      }
    });

    return NextResponse.json({ id: saved.id, output });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
