/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Waitlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `WaitlistedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WaitlistedUser" ADD COLUMN     "address" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_slug_key" ON "Waitlist"("slug");
