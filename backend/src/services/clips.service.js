import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createClip({ data, type, usersId }) {
  const clipPost = await prisma.clips.create({
    data: {
      data: data,
      type: type,
      usersId: usersId,
    },
  });

  return clipPost;
}
