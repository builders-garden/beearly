/*
  Warnings:

  - You are about to drop the column `userAddress` on the `CaptchaChallenge` table. All the data in the column will be lost.
  - Added the required column `fid` to the `CaptchaChallenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CaptchaChallenge" DROP COLUMN "userAddress",
ADD COLUMN     "fid" INTEGER NOT NULL;
