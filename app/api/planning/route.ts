import { EventType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { generatePlanning, regeneratePlanningSection } from "@/lib/ai";
import { getSessionUser } from "@/lib/auth";
import { trackEvent } from "@/lib/events";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";

const planningSchema = z.object({
  ageGroup: z.string(),
  duration: z.string(),
  location: z.string(),
  energyLevel: z.string(),
  materials: z.string(),
  jewishThemeType: z.string(),
  topic: z.string(),
  activityType: z.string(),
  regenerateSection: z
    .enum(["title", "summary", "materials", "setup", "steps", "jewish message", "extensions", "cleanup"])
    .optional(),
  previousOutput: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const input = planningSchema.parse(await request.json());
    const sessionUser = await getSessionUser();

    enforceRateLimit(`planning:${sessionUser.id}`, 20, 60_000);

    const output = input.regenerateSection
      ? await regeneratePlanningSection(input, input.previousOutput ?? "", input.regenerateSection)
      : await generatePlanning(input);

    const saved = await prisma.planningGeneration.create({
      data: {
        nurseryId: sessionUser.nurseryId,
        userId: sessionUser.id,
        inputJson: JSON.stringify(input),
        outputText: output
      }
    });

    await trackEvent({
      nurseryId: sessionUser.nurseryId,
      userId: sessionUser.id,
      type: input.regenerateSection ? EventType.planning_section_regenerated : EventType.planning_generated,
      metadata: {
        section: input.regenerateSection,
        activityType: input.activityType,
        topic: input.topic
      }
    });

    return NextResponse.json({ id: saved.id, output });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
