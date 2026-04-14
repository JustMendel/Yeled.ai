import { NextResponse } from "next/server";
import { z } from "zod";

import { assertManager, getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  tone: z.string().trim().min(1).max(80),
  terminology: z.string().trim().min(1).max(80),
  jewishOrientation: z.string().trim().min(1).max(80),
  languageStyle: z.string().trim().min(1).max(80),
  messTolerance: z.string().trim().min(1).max(80),
  outputDetail: z.string().trim().min(1).max(80)
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

    return NextResponse.json(settings);
  } catch (error) {
    return errorResponse(error);
  }
}
