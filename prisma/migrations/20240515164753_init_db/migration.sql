-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" DATE,
    "updated_at" DATE,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waitlist" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "slug" TEXT NOT NULL,
    "external_url" TEXT NOT NULL,
    "end_date" DATE NOT NULL,
    "image_landing" TEXT NOT NULL,
    "image_success" TEXT NOT NULL,
    "user_address" TEXT NOT NULL,
    "created_at" DATE NOT NULL,
    "updated_at" DATE NOT NULL,

    CONSTRAINT "waitlist_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistedUser" (
    "id" UUID NOT NULL,
    "waitlist_id" UUID NOT NULL,
    "fid" INTEGER,
    "display_name" VARCHAR NOT NULL,
    "username" VARCHAR NOT NULL,
    "avatar_url" TEXT,
    "power_badge" BOOLEAN DEFAULT false,
    "waitlistedAt" DATE NOT NULL,
    "created_at" DATE NOT NULL,
    "updated_at" DATE NOT NULL,

    CONSTRAINT "waitlisted_users_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WaitlistedUser" ADD CONSTRAINT "waitlisted_users_waitlist_id_fk" FOREIGN KEY ("waitlist_id") REFERENCES "Waitlist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
