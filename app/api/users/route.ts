import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { assertManager, getSessionUser } from "@/lib/auth";
import { errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const inviteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email(),
  role: z.nativeEnum(UserRole)
});

export async function GET() {
  const sessionUser = await getSessionUser();
  const users = await prisma.user.findMany({ where: { nurseryId: sessionUser.nurseryId } });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    assertManager(sessionUser.role);

    const data = inviteSchema.parse(await request.json());
    const user = await prisma.user.create({
      data: { ...data, nurseryId: sessionUser.nurseryId }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
