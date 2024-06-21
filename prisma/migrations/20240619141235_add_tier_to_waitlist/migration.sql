-- CreateEnum
CREATE TYPE "WaitlistTier" AS ENUM ('FREE', 'HONEY', 'QUEEN');

-- AlterTable
ALTER TABLE "Waitlist" ADD COLUMN     "tier" "WaitlistTier" NOT NULL DEFAULT 'FREE';
