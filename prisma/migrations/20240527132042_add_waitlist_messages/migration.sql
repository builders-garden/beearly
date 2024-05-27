-- CreateTable
CREATE TABLE "WaitlistMessages" (
    "id" SERIAL NOT NULL,
    "waitlist_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" DATE NOT NULL,
    "updated_at" DATE NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistMessages_id_key" ON "WaitlistMessages"("id");

-- AddForeignKey
ALTER TABLE "WaitlistMessages" ADD CONSTRAINT "WaitlistMessages_waitlist_id_fkey" FOREIGN KEY ("waitlist_id") REFERENCES "Waitlist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
