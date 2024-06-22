-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('PENDING', 'SUCCESS', 'ERROR');

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
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_waitlist_id_fkey" FOREIGN KEY ("waitlist_id") REFERENCES "Waitlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
