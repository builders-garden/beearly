-- AlterTable
ALTER TABLE "WaitlistedUser" ADD COLUMN     "follower_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "following_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "location" TEXT DEFAULT '',
ADD COLUMN     "profile_bio" TEXT DEFAULT '',
ADD COLUMN     "social_capital_rank" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "social_capital_score" DOUBLE PRECISION NOT NULL DEFAULT 0.00;
