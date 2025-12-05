import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchClips({ userId, limit, page, sortBy = "date", sortOrder = "desc", filterType = null }) {
  const orderByObj = getSortingOrder(sortBy, sortOrder);
  const whereObj = getFilterConditions(userId, filterType);

  const clips = await prisma.clips.findMany({
    where: whereObj,
    orderBy: orderByObj,
    take: limit,
    skip: limit * page,
  });

  return clips;
}

export async function searchClips({ userId, query, sortBy = "date", sortOrder = "desc", filterType = null }) {
  const orderByObj = getSortingOrder(sortBy, sortOrder);
  const whereObj = getFilterConditions(userId, filterType);

  const clips = await prisma.clips.findMany({
    where: {
      ...whereObj,
      data: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: orderByObj,
  });

  return clips;
}

function getSortingOrder(sortBy, sortOrder) {
  const order = sortOrder === "asc" ? "asc" : "desc";

  if (sortBy === "words") {
    // Sort by data length (word count approximation)
    return { data: order };
  }

  // Default to date sorting
  return { createdAt: order };
}

function getFilterConditions(userId, filterType) {
  const baseCondition = { usersId: userId };

  if (filterType && filterType !== "all") {
    return {
      ...baseCondition,
      type: filterType,
    };
  }

  return baseCondition;
}
