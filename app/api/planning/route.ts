import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth";
import { generatePlanning } from "@/lib/ai";
import { errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const planningSchema = z.object({
  ageGroup: z.string().trim().min(1).max(80),
  duration: z.string().trim().min(1).max(80),
  location: z.string().trim().min(1).max(80),
  energyLevel: z.string().trim().min(1).max(40),
  materials: z.string().trim().min(1).max(500),
  jewishThemeType: z.string().trim().min(1).max(80),
  topic: z.string().trim().min(1).max(120),
  activityType: z.string().trim().min(1).max(80)
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
    return errorResponse(error);
  }
}
