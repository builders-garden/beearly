/*
  Warnings:

  - A unique constraint covering the columns `[waitlist_id,fid]` on the table `WaitlistedUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WaitlistedUser_waitlist_id_fid_key" ON "WaitlistedUser"("waitlist_id", "fid");

-- AddForeignKey
ALTER TABLE "WaitlistedUser" ADD CONSTRAINT "WaitlistedUser_waitlist_id_referrer_fid_fkey" FOREIGN KEY ("waitlist_id", "referrer_fid") REFERENCES "WaitlistedUser"("waitlist_id", "fid") ON DELETE RESTRICT ON UPDATE CASCADE;
