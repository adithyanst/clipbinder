import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchClips({ userId, limit, page }) {
  const clips = await prisma.clips.findMany({
    where: { usersId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: limit * page,
  });

  return clips;
}

export async function searchClips({ userId, query }) {
  const clips = await prisma.clips.findMany({
    where: {
      usersId: userId,
      data: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return clips;
}
