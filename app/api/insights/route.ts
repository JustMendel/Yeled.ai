import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth";
import { generateInsight } from "@/lib/ai";
import { errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const insightSchema = z.object({
  childName: z.string().trim().min(1).max(120),
  age: z.string().trim().min(1).max(40),
  observations: z.string().trim().min(1).max(1500),
  developmentFocus: z.string().trim().min(1).max(120),
  concernLevel: z.enum(["low", "medium", "high"]),
  tone: z.string().trim().min(1).max(80),
  jewishFraming: z.boolean()
});

export async function POST(request: Request) {
  try {
    const input = insightSchema.parse(await request.json());
    const sessionUser = await getSessionUser();
    const output = await generateInsight(input);

    const saved = await prisma.insightGeneration.create({
      data: {
        nurseryId: sessionUser.nurseryId,
        userId: sessionUser.id,
        observation: input.observations,
        outputText: output
      }
    });

    return NextResponse.json({ id: saved.id, output });
  } catch (error) {
    return errorResponse(error);
  }
}
