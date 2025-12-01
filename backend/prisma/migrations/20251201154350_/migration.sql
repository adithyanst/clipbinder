-- CreateEnum
CREATE TYPE "public"."ClipType" AS ENUM ('plaintext', 'image', 'url');

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Clips" (
    "id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "type" "public"."ClipType" NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" TEXT NOT NULL,

    CONSTRAINT "Clips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- AddForeignKey
ALTER TABLE "public"."Clips" ADD CONSTRAINT "Clips_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
