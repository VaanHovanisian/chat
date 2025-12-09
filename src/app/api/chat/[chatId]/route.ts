// app/api/chat/[chatId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } },
) {
  const { chatId } = params;
  const messages = await prisma.message.findMany({
    where: { chatId: chatId },
    orderBy: { createdAt: "asc" },
    include: { user: true },
  });
  return NextResponse.json(messages);
}
