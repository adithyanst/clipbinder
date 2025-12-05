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

export async function togglePinClip({ clipId, userId }) {
  // First get the current clip to check if it exists and belongs to user
  const clip = await prisma.clips.findFirst({
    where: {
      id: clipId,
      usersId: userId,
    },
  });

  if (!clip) {
    throw new Error("Clip not found");
  }

  // Toggle the pinned status
  const updatedClip = await prisma.clips.update({
    where: {
      id: clipId,
    },
    data: {
      pinned: !clip.pinned,
    },
  });

  return updatedClip;
}

export async function deleteClip({ clipId, userId }) {
  // First verify the clip belongs to the user
  const clip = await prisma.clips.findFirst({
    where: {
      id: clipId,
      usersId: userId,
    },
  });

  if (!clip) {
    throw new Error("Clip not found");
  }

  // Delete the clip
  await prisma.clips.delete({
    where: {
      id: clipId,
    },
  });

  return { success: true, id: clipId };
}
