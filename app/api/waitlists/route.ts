import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "../../../lib/imagekit";
import slugify from "slugify";
import {
  Checkout,
  CheckoutStatus,
  WaitlistRequirementType,
  WaitlistTier,
} from "@prisma/client";
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
import prisma from "../../../lib/prisma";
import { Check } from "lucide-react";
import { BASE_URL } from "../../../lib/constants";

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("x-address");
  const waitlists = await getUserWaitlists(address!);

  return NextResponse.json(waitlists);
};

export const POST = async (req: NextRequest) => {
  const body = await req.formData();

  const name = body.get("name");
  const endDate = body.get("endDate");
  const hasCaptcha = body.get("hasCaptcha");
  const requiresEmail = body.get("requiresEmail");
  const externalUrl = body.get("externalUrl");
  const isPowerBadgeRequired = body.get("isPowerBadgeRequired");
  const requiredChannels = body.get("requiredChannels");
  const requiredUsersFollow = body.get("requiredUsersFollow");
  const requiredBuilderScore = body.get("requiredBuilderScore");
  const tier = (body.get("tier") as WaitlistTier) || WaitlistTier.FREE;

  const address = req.headers.get("x-address");

  const landingImage: File | null = body.get("files[0]") as unknown as File;
  const successImage: File | null = body.get("files[1]") as unknown as File;
  const notEligibleImage: File | null = body.get("files[2]") as unknown as File;
  const errorImage: File | null = body.get("files[3]") as unknown as File;

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

  let claimableCheckout: Checkout | null;
  if (tier !== WaitlistTier.FREE) {
    claimableCheckout = await prisma.checkout.findFirst({
      where: {
        address: address as string,
        status: CheckoutStatus.SUCCESS,
        waitlistId: null,
        tier,
      },
    });
    if (!claimableCheckout) {
      return NextResponse.json(
        { success: false, message: "To create" },
        { status: 400 }
      );
    }
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
      requiresEmail: requiresEmail?.toString() === "true",
      hasCaptcha: hasCaptcha?.toString() === "true",
      externalUrl: externalUrl as string,
      userAddress: address!,
      imageLanding: landing.url,
      imageSuccess: success.url,
      imageNotEligible: notEligible.url,
      imageError: error.url,
      tier: tier || WaitlistTier.FREE,
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

  if (tier !== WaitlistTier.FREE) {
    await prisma.checkout.update({
      where: {
        id: claimableCheckout!.id,
      },
      data: {
        waitlistId: waitlist.id,
      },
    });
  }

  if (BASE_URL !== "http://localhost:3000") {
    // Sending a Discord Webhook message to monitor new waitlists
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL!;

    const waitlistCreator = await prisma.waitlistedUser.findFirst({
      where: {
        address: address,
      },
      select: {
        displayName: true,
      },
    });

    await fetch(discordWebhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `
# **New Waitlist Created!** 🐝\n
- **Waitlist name: ** ${waitlist.name}
- **Creator: ** ${waitlistCreator?.displayName || address}
- **End Date: ** ${new Date(endDate as string).toLocaleDateString("it-IT")}
- **External URL: ** [Link]${"(<" + externalUrl + ">)"}
- **Tier: ** ${tier || WaitlistTier.FREE}\n
      `,
        embeds: [
          {
            image: {
              url: landing.url,
            },
            color: 16776960,
          },
        ],
      }),
    });
  }

  return NextResponse.json(waitlist);
};
