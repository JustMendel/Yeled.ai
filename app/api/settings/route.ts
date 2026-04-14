import { EventType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { assertManager, getSessionUser } from "@/lib/auth";
import { trackEvent } from "@/lib/events";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  tone: z.string(),
  terminology: z.string(),
  jewishOrientation: z.string(),
  languageStyle: z.string(),
  messTolerance: z.string(),
  outputDetail: z.string()
});

export async function GET() {
  const sessionUser = await getSessionUser();
  const settings = await prisma.nurserySettings.findUnique({
    where: { nurseryId: sessionUser.nurseryId }
  });

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    assertManager(sessionUser.role);

    const data = settingsSchema.parse(await request.json());

    const settings = await prisma.nurserySettings.upsert({
      where: { nurseryId: sessionUser.nurseryId },
      update: data,
      create: { nurseryId: sessionUser.nurseryId, ...data }
    });

    await trackEvent({
      nurseryId: sessionUser.nurseryId,
      userId: sessionUser.id,
      type: EventType.settings_updated,
      metadata: {
        tone: data.tone,
        detail: data.outputDetail
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
