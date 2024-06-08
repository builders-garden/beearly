import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "../../../lib/imagekit";
import slugify from "slugify";
import { WaitlistRequirementType } from "@prisma/client";
import {
  getUserWaitlists,
  getWaitlistBySlug,
  createWaitlist,
  getUserWaitlistsCount,
} from "../../../lib/db/waitlist";
import {
  createWaitlistRequirements,
  createWaitlistRequirement,
} from "../../../lib/db/waitlistRequirements";

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("x-address");
  const waitlists = await getUserWaitlists(address!);

  return NextResponse.json(waitlists);
};

export const POST = async (req: NextRequest) => {
  const body = await req.formData();

  const name = body.get("name");
  const endDate = body.get("endDate");
  const externalUrl = body.get("externalUrl");
  const isPowerBadgeRequired = body.get("isPowerBadgeRequired");
  const requiredChannels = body.get("requiredChannels");
  const requiredUsersFollow = body.get("requiredUsersFollow");
  const address = req.headers.get("x-address");

  const landingImage: File | null = body.get("files[0]") as unknown as File;
  const successImage: File | null = body.get("files[1]") as unknown as File;
  const notEligibleImage: File | null = body.get("files[2]") as unknown as File;
  const errorImage: File | null = body.get("files[3]") as unknown as File;

  // Prisma call to check if the user has more than 1 waitlist
  const waitlistsCount = await getUserWaitlistsCount(address!);

  if (waitlistsCount >= 1) {
    return NextResponse.json(
      { message: "You can only create one waitlist" },
      { status: 400 }
    );
  }

  if (
    !name ||
    !endDate ||
    !externalUrl ||
    !address ||
    !landingImage ||
    !successImage ||
    !notEligibleImage ||
    !errorImage
  ) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  const slugName = slugify(name as string, {
    lower: true,
    trim: true,
    replacement: "-",
  });

  const existingWaitlist = await getWaitlistBySlug(slugName);

  if (existingWaitlist) {
    return NextResponse.json(
      { message: "Waitlist with that name already exists" },
      { status: 400 }
    );
  }

  const landingBytes = await landingImage!.arrayBuffer();
  const landingBuffer = Buffer.from(landingBytes);
  const successBytes = await successImage!.arrayBuffer();
  const successBuffer = Buffer.from(successBytes);
  const notEligibleBytes = await notEligibleImage!.arrayBuffer();
  const notEligibleBuffer = Buffer.from(notEligibleBytes);
  const errorBytes = await errorImage!.arrayBuffer();
  const errorBuffer = Buffer.from(errorBytes);
  const [landing, success, notEligible, error] = await Promise.all([
    uploadImage(landingBuffer, `${name}-landing.png`),
    uploadImage(successBuffer, `${name}-success.png`),
    uploadImage(notEligibleBuffer, `${name}-not-eligible.png`),
    uploadImage(errorBuffer, `${name}-error.png`),
  ]);

  const waitlist = await createWaitlist({
    data: {
      name: name as string,
      slug: slugName,
      endDate: new Date(endDate as string),
      externalUrl: externalUrl as string,
      userAddress: address!,
      imageLanding: landing.url,
      imageSuccess: success.url,
      imageNotEligible: notEligible.url,
      imageError: error.url,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  if (isPowerBadgeRequired) {
    await createWaitlistRequirement({
      data: {
        waitlistId: waitlist.id,
        type: WaitlistRequirementType.POWER_BADGE,
        value: (isPowerBadgeRequired === "true").toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  if (requiredChannels?.toString()?.length! > 0) {
    const channels = requiredChannels
      ?.toString()
      .split(",")
      .map((c) => c?.trim()?.toLowerCase());
    await createWaitlistRequirements({
      data: channels!.map((channel) => ({
        waitlistId: waitlist.id,
        type: WaitlistRequirementType.CHANNEL_FOLLOW,
        value: channel,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
  }

  if (requiredUsersFollow?.toString()?.length! > 0) {
    const users = requiredUsersFollow
      ?.toString()
      .split(",")
      .map((u) => u?.trim()?.toLowerCase());
    await createWaitlistRequirements({
      data: users!.map((user) => ({
        waitlistId: waitlist.id,
        type: WaitlistRequirementType.USER_FOLLOW,
        value: user,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
  }

  return NextResponse.json(waitlist);
};
