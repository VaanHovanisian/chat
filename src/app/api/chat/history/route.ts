import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "asc" },
    take: 100,
    include: { user: true },
  });
  res.json(messages);
}
