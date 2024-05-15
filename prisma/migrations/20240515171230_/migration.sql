/*
  Warnings:

  - The primary key for the `Waitlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Waitlist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `WaitlistedUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `WaitlistedUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `Waitlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `WaitlistedUser` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `waitlist_id` on the `WaitlistedUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "WaitlistedUser" DROP CONSTRAINT "waitlisted_users_waitlist_id_fk";

-- AlterTable
ALTER TABLE "Waitlist" DROP CONSTRAINT "waitlist_pk",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "WaitlistedUser" DROP CONSTRAINT "waitlisted_users_pk",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "waitlist_id",
ADD COLUMN     "waitlist_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_id_key" ON "Waitlist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistedUser_id_key" ON "WaitlistedUser"("id");

-- AddForeignKey
ALTER TABLE "WaitlistedUser" ADD CONSTRAINT "WaitlistedUser_waitlist_id_fkey" FOREIGN KEY ("waitlist_id") REFERENCES "Waitlist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
