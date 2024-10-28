-- CreateEnum
CREATE TYPE "WaitlistImagesMode" AS ENUM ('SIMPLE', 'ADVANCED');

-- AlterTable
ALTER TABLE "Waitlist" ADD COLUMN     "images_mode" "WaitlistImagesMode" NOT NULL DEFAULT 'ADVANCED',
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "text_error" TEXT,
ADD COLUMN     "text_landing" TEXT,
ADD COLUMN     "text_not_eligible" TEXT,
ADD COLUMN     "text_success" TEXT,
ALTER COLUMN "image_landing" DROP NOT NULL,
ALTER COLUMN "image_success" DROP NOT NULL,
ALTER COLUMN "image_error" DROP NOT NULL,
ALTER COLUMN "image_not_eligible" DROP NOT NULL;
