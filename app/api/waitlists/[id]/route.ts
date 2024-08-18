import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { uploadImage } from "../../../../lib/imagekit";
import slugify from "slugify";
import { WaitlistRequirementType } from "@prisma/client";
import { createWaitlistRequirement } from "../../../../lib/db/waitlistRequirements";

export const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const address = req.headers.get("x-address");
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      userAddress: address!,
      id: parseInt(id),
    },
    include: {
      waitlistRequirements: true,
      _count: {
        select: { waitlistedUsers: true },
      },
    },
  });
  if (!waitlist) {
    return NextResponse.json(
      {
        message: "Waitlist not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(waitlist);
};

export const PUT = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  // update waitlist
  const body = await req.formData();

  const name = body.get("name");
  const endDate = body.get("endDate");
  const externalUrl = body.get("externalUrl");
  const joinButtonText = body.get("joinButtonText");
  const address = req.headers.get("x-address");
  const requiresEmail = body.get("requiresEmail");
  const hasCaptcha = body.get("hasCaptcha");
  const isPowerBadgeRequired = body.get("isPowerBadgeRequired");
  const isFanTokenLauncher = body.get("isFanTokenLauncher");
  const requiredChannels = body.get("requiredChannels");
  const requiredUsersFollow = body.get("requiredUsersFollow");
  const requiredBuilderScore = body.get("requiredBuilderScore");
  const fanTokenSymbolAndAmount = body.get("fanTokenSymbolAndAmount");

  const landingImage: File | null = body.get("files[0]") as unknown as File;
  const successImage: File | null = body.get("files[1]") as unknown as File;
  const notEligibleImage: File | null = body.get("files[2]") as unknown as File;
  const errorImage: File | null = body.get("files[3]") as unknown as File;

  if (!name || !endDate || !externalUrl) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const slugName = slugify(name as string, {
    lower: true,
    trim: true,
    replacement: "-",
  });
  const existingWaitlist = await prisma.waitlist.findFirst({
    where: {
      id: {
        not: parseInt(id),
      },
      slug: slugName,
    },
  });

  if (existingWaitlist) {
    return NextResponse.json(
      { message: "Waitlist with that name already exists" },
      { status: 400 }
    );
  }

  let landing: { url: string } = { url: "" };
  if (landingImage) {
    const landingBytes = await landingImage!.arrayBuffer();
    const landingBuffer = Buffer.from(landingBytes);
    const landingUpload = await uploadImage(
      landingBuffer,
      `${name}-landing.png`
    );
    landing = { url: landingUpload.url };
  }

  let success: { url: string } = { url: "" };
  if (successImage) {
    const successBytes = await successImage!.arrayBuffer();
    const successBuffer = Buffer.from(successBytes);
    const successUpload = await uploadImage(
      successBuffer,
      `${name}-success.png`
    );
    success = { url: successUpload.url };
  }

  let notEligible: { url: string } = { url: "" };
  if (notEligibleImage) {
    const notEligibleBytes = await notEligibleImage!.arrayBuffer();
    const notEligibleBuffer = Buffer.from(notEligibleBytes);
    const notEligibleUpload = await uploadImage(
      notEligibleBuffer,
      `${name}-not-eligible.png`
    );
    notEligible = { url: notEligibleUpload.url };
  }

  let error: { url: string } = { url: "" };
  if (errorImage) {
    const errorBytes = await errorImage!.arrayBuffer();
    const errorBuffer = Buffer.from(errorBytes);
    const errorUpload = await uploadImage(errorBuffer, `${name}-error.png`);
    error = { url: errorUpload.url };
  }

  const waitlist = await prisma.waitlist.update({
    where: {
      userAddress: address!,
      id: parseInt(id),
    },
    data: {
      name: name as string,
      slug: slugName,
      requiresEmail: requiresEmail?.toString() === "true",
      hasCaptcha: hasCaptcha?.toString() === "true",
      endDate: new Date(endDate as string),
      externalUrl: externalUrl as string,
      joinButtonText: joinButtonText as string,
      ...(landing.url ? { imageLanding: landing.url } : {}),
      ...(success.url ? { imageSuccess: success.url } : {}),
      ...(notEligible.url ? { imageNotEligible: notEligible.url } : {}),
      ...(error.url ? { imageError: error.url } : {}),
      updatedAt: new Date(),
    },
  });

  await prisma.waitlistRequirement.deleteMany({
    where: {
      waitlistId: waitlist.id,
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

  if (isFanTokenLauncher) {
    await createWaitlistRequirement({
      data: {
        waitlistId: waitlist.id,
        type: WaitlistRequirementType.FAN_TOKEN_LAUNCHER,
        value: (isFanTokenLauncher === "true").toString(),
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
    await Promise.all(
      channels!.map((channel) =>
        createWaitlistRequirement({
          data: {
            waitlistId: waitlist.id,
            type: WaitlistRequirementType.CHANNEL_FOLLOW,
            value: channel,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
      )
    );
  }

  if (requiredUsersFollow?.toString()?.length! > 0) {
    const users = requiredUsersFollow
      ?.toString()
      .split(",")
      .map((u) => u?.trim()?.toLowerCase());
    await Promise.all(
      users!.map((user) =>
        createWaitlistRequirement({
          data: {
            waitlistId: waitlist.id,
            type: WaitlistRequirementType.USER_FOLLOW,
            value: user,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
      )
    );
  }

  if (requiredBuilderScore) {
    await createWaitlistRequirement({
      data: {
        waitlistId: waitlist.id,
        type: WaitlistRequirementType.TALENT_BUILDER_SCORE,
        value: String(requiredBuilderScore),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  if (fanTokenSymbolAndAmount) {
    await createWaitlistRequirement({
      data: {
        waitlistId: waitlist.id,
        type: WaitlistRequirementType.FAN_TOKEN_BALANCE,
        value: String(fanTokenSymbolAndAmount),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  const waitlistRequirements = await prisma.waitlistRequirement.findMany({
    where: {
      waitlistId: waitlist.id,
    },
  });

  return NextResponse.json({
    ...waitlist,
    waitlistRequirements,
  });
};

export const DELETE = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  // delete waitlist
  const address = req.headers.get("x-address");
  const waitlist = await prisma.waitlist.delete({
    where: {
      userAddress: address!,
      id: parseInt(id),
    },
  });
  if (!waitlist) {
    return NextResponse.json(
      {
        message: "Waitlist not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
};
