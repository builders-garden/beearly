/*
  Warnings:

  - A unique constraint covering the columns `[waitlist_id,fid]` on the table `WaitlistedUser` will be added. If there are existing duplicate values, this will fail.
  - Made the column `fid` on table `WaitlistedUser` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "WaitlistRequirementType" ADD VALUE 'USER_FOLLOW';

-- DropIndex
DROP INDEX "WaitlistedUser_id_key";

-- AlterTable
ALTER TABLE "WaitlistedUser" ALTER COLUMN "fid" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistedUser_waitlist_id_fid_key" ON "WaitlistedUser"("waitlist_id", "fid");

-- AddForeignKey
ALTER TABLE "WaitlistedUser" ADD CONSTRAINT "WaitlistedUser_waitlist_id_referrer_fid_fkey" FOREIGN KEY ("waitlist_id", "referrer_fid") REFERENCES "WaitlistedUser"("waitlist_id", "fid") ON DELETE RESTRICT ON UPDATE CASCADE;
