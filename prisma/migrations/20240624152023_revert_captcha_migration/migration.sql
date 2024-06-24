/*
  Warnings:

  - You are about to drop the column `has_captcha` on the `Waitlist` table. All the data in the column will be lost.
  - You are about to drop the `CaptchaChallenge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CaptchaChallenge" DROP CONSTRAINT "CaptchaChallenge_waitlist_id_fkey";

-- AlterTable
ALTER TABLE "Waitlist" DROP COLUMN "has_captcha";

-- DropTable
DROP TABLE "CaptchaChallenge";
