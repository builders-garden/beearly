-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('PENDING', 'SUCCESS', 'ERROR');

-- AlterTable
ALTER TABLE "WaitlistedUser" ADD COLUMN     "referrer_squared_fid" INTEGER;

-- CreateTable
CREATE TABLE "Checkout" (
    "id" SERIAL NOT NULL,
    "waitlist_id" INTEGER,
    "address" TEXT NOT NULL,
    "tier" "WaitlistTier" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "CheckoutStatus" NOT NULL,
    "request_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Checkout_id_key" ON "Checkout"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Checkout_request_id_key" ON "Checkout"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "Checkout_address_request_id_key" ON "Checkout"("address", "request_id");

-- AddForeignKey
ALTER TABLE "WaitlistedUser" ADD CONSTRAINT "WaitlistedUser_waitlist_id_referrer_squared_fid_fkey" FOREIGN KEY ("waitlist_id", "referrer_squared_fid") REFERENCES "WaitlistedUser"("waitlist_id", "fid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_waitlist_id_fkey" FOREIGN KEY ("waitlist_id") REFERENCES "Waitlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
