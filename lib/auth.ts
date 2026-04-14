import { UserRole } from "@prisma/client";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";

export type SessionUser = {
  id: string;
  nurseryId: string;
  role: UserRole;
  name: string;
};

export async function getSessionUser(): Promise<SessionUser> {
  const headerStore = await headers();
  const requestedEmail = headerStore.get("x-demo-user");
  const email = requestedEmail?.trim().toLowerCase() || "manager@demo.local";
  const allowedDemoUsers = new Set(["manager@demo.local", "staff@demo.local"]);

  if (!allowedDemoUsers.has(email)) {
    throw new Error("Unauthorized demo user");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Unauthorized");
  }

  return {
    id: user.id,
    nurseryId: user.nurseryId,
    role: user.role,
    name: user.name
  };
}

export function assertManager(role: UserRole) {
  if (role !== UserRole.manager) {
    throw new Error("Forbidden");
  }
}
