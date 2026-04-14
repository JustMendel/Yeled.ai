import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth";
import { generatePlanning } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

const planningSchema = z.object({
  ageGroup: z.string(),
  duration: z.string(),
  location: z.string(),
  energyLevel: z.string(),
  materials: z.string(),
  jewishThemeType: z.string(),
  topic: z.string(),
  activityType: z.string()
});

export async function POST(request: Request) {
  try {
    const input = planningSchema.parse(await request.json());
    const sessionUser = await getSessionUser();

    const output = await generatePlanning(input);

    const saved = await prisma.planningGeneration.create({
      data: {
        nurseryId: sessionUser.nurseryId,
        userId: sessionUser.id,
        inputJson: JSON.stringify(input),
        outputText: output
      }
    });

    return NextResponse.json({ id: saved.id, output });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
