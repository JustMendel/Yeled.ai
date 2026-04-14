import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth";
import { generateInsight } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

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
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
