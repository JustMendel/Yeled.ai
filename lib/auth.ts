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
  const email = headerStore.get("x-demo-user") ?? "manager@demo.local";

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found for demo session");
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
    throw new Error("Manager access required");
  }
}
