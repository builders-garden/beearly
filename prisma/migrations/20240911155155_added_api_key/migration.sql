-- CreateEnum
CREATE TYPE "WaitlistedUserStatus" AS ENUM ('WAITLISTED', 'APPROVED');

-- AlterTable
ALTER TABLE "WaitlistedUser" ADD COLUMN     "status" "WaitlistedUserStatus" NOT NULL DEFAULT 'WAITLISTED';

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "waitlist_id" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "key" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ApiRequest" (
    "id" SERIAL NOT NULL,
    "api_key_id" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_id_key" ON "ApiKey"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_waitlist_id_key_key" ON "ApiKey"("waitlist_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "ApiRequest_id_key" ON "ApiRequest"("id");

-- AddForeignKey
ALTER TABLE "ApiRequest" ADD CONSTRAINT "ApiRequest_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "ApiKey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
