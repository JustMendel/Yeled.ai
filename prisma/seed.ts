import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const nursery = await prisma.nursery.upsert({
    where: { id: "demo-nursery" },
    update: {},
    create: {
      id: "demo-nursery",
      name: "Gan Or Demo Nursery",
      settings: {
        create: {
          terminology: "Shabbos",
          tone: "supportive"
        }
      }
    }
  });

  await prisma.user.upsert({
    where: { email: "manager@demo.local" },
    update: {},
    create: {
      name: "Leah Manager",
      email: "manager@demo.local",
      role: UserRole.manager,
      nurseryId: nursery.id
    }
  });

  await prisma.user.upsert({
    where: { email: "staff@demo.local" },
    update: {},
    create: {
      name: "Moshe Staff",
      email: "staff@demo.local",
      role: UserRole.staff,
      nurseryId: nursery.id
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
