/*
  Warnings:

  - You are about to drop the column `referrerFid` on the `WaitlistedUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WaitlistedUser" DROP COLUMN "referrerFid",
ADD COLUMN     "referrer_fid" INTEGER;
