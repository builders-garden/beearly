-- AlterTable
ALTER TABLE "Waitlist" ADD COLUMN     "has_captcha" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CaptchaChallenge" (
    "id" SERIAL NOT NULL,
    "waitlist_id" INTEGER NOT NULL,
    "userAddress" TEXT NOT NULL,
    "numA" INTEGER NOT NULL,
    "numB" INTEGER NOT NULL,
    "result" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CaptchaChallenge_id_key" ON "CaptchaChallenge"("id");

-- AddForeignKey
ALTER TABLE "CaptchaChallenge" ADD CONSTRAINT "CaptchaChallenge_waitlist_id_fkey" FOREIGN KEY ("waitlist_id") REFERENCES "Waitlist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
