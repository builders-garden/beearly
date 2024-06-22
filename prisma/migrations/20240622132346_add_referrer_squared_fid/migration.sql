-- AlterTable
ALTER TABLE "WaitlistedUser" ADD COLUMN     "referrer_squared_fid" INTEGER;

-- AddForeignKey
ALTER TABLE "WaitlistedUser" ADD CONSTRAINT "WaitlistedUser_waitlist_id_referrer_squared_fid_fkey" FOREIGN KEY ("waitlist_id", "referrer_squared_fid") REFERENCES "WaitlistedUser"("waitlist_id", "fid") ON DELETE RESTRICT ON UPDATE CASCADE;
