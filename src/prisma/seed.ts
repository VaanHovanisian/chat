import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const create = async () => {
  await prisma.user.createMany({
    data: [
      {
        id: "1",
        name: "Vaan Hovanisyan",
        email: "vaa.hovanisyan@gmail.com",
        password: "123",
        verified: new Date(),
      },
      {
        id: "2",
        name: "Bob Jigarxanyan",
        email: "jan@gmail.com",
        password: "123",
        verified: new Date(),
      },
    ],
  });

  await prisma.chat.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      title: "General Chat",
    },
  });
};

const reset = async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
};

const main = async () => {
  try {
    await reset();
    await create();
  } catch (error) {
    console.error(error);
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
