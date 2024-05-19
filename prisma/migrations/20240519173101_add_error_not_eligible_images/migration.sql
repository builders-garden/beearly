/*
  Warnings:

  - Added the required column `image_error` to the `Waitlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_not_eligible` to the `Waitlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Waitlist" ADD COLUMN     "image_error" TEXT NOT NULL,
ADD COLUMN     "image_not_eligible" TEXT NOT NULL;
