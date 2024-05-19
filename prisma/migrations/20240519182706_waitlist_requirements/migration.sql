-- CreateEnum
CREATE TYPE "WaitlistRequirementType" AS ENUM ('CHANNEL_FOLLOW', 'POWER_BADGE');

-- CreateTable
CREATE TABLE "WaitlistRequirement" (
    "id" SERIAL NOT NULL,
    "waitlist_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "type" "WaitlistRequirementType" NOT NULL,
    "created_at" DATE NOT NULL,
    "updated_at" DATE NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistRequirement_id_key" ON "WaitlistRequirement"("id");

-- CreateIndex
CREATE INDEX "waitlistId_fid" ON "WaitlistedUser"("waitlist_id", "fid");

-- AddForeignKey
ALTER TABLE "WaitlistRequirement" ADD CONSTRAINT "WaitlistRequirement_waitlist_id_fkey" FOREIGN KEY ("waitlist_id") REFERENCES "Waitlist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
