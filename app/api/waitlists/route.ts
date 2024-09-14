import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "../../../lib/imagekit";
import slugify from "slugify";
import {
  Checkout,
  CheckoutStatus,
  WaitlistImagesMode,
  WaitlistRequirementType,
  WaitlistTier,
} from "@prisma/client";
import {
  getUserWaitlists,
  getWaitlistBySlug,
  createWaitlist,
} from "../../../lib/db/waitlist";
import {
  createWaitlistRequirements,
  createWaitlistRequirement,
} from "../../../lib/db/waitlistRequirements";
import prisma from "../../../lib/prisma";
import { BASE_URL } from "../../../lib/constants";

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("x-address");
  const waitlists = await getUserWaitlists(address!);

  return NextResponse.json(waitlists);
};

export const POST = async (req: NextRequest) => {
  const body = await req.formData();
  const address = req.headers.get("x-address");

  const name = body.get("name");
  const endDate = body.get("endDate");
  const hasCaptcha = body.get("hasCaptcha");
  const requiresEmail = body.get("requiresEmail");
  const externalUrl = body.get("externalUrl");
  const joinButtonText = body.get("joinButtonText");
  const isFanTokenLauncher = body.get("isFanTokenLauncher");
  const requiredChannels = body.get("requiredChannels");
  const requiredUsersFollow = body.get("requiredUsersFollow");
  const requiredBuilderScore = body.get("requiredBuilderScore");
  const fanTokenSymbolAndAmount = body.get("fanTokenSymbolAndAmount");
  const tier = (body.get("tier") as WaitlistTier) || WaitlistTier.FREE;

  const imagesMode = body.get("imagesMode") as WaitlistImagesMode;

  const landingImage: File | null = body.get("files[0]") as unknown as File;
  const successImage: File | null = body.get("files[1]") as unknown as File;
  const notEligibleImage: File | null = body.get("files[2]") as unknown as File;
  const errorImage: File | null = body.get("files[3]") as unknown as File;

  const logoFile: File | null = body.get("logoFile") as unknown as File;
  const imageTexts: {
    landing: string;
    success: string;
    notEligible: string;
    closed: string;
  } = JSON.parse(body.get("imageTexts") as string);

  // Create two constants to store if the images mode is simple or advanced
  const isSimpleMode = imagesMode === WaitlistImagesMode.SIMPLE;
  const isAdvancedMode = imagesMode === WaitlistImagesMode.ADVANCED;

  if (
    !name ||
    !endDate ||
    !externalUrl ||
    !address ||
    (isAdvancedMode &&
      (!landingImage || !successImage || !notEligibleImage || !errorImage)) ||
    (isSimpleMode &&
      (!logoFile ||
        !imageTexts.landing ||
        !imageTexts.success ||
        !imageTexts.notEligible ||
        !imageTexts.closed))
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
        {
          success: false,
          message: "To create this waitlist you need to buy the required tier",
        },
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

  let landing, success, notEligible, error, logo;

  if (isAdvancedMode) {
    const landingBytes = await landingImage!.arrayBuffer();
    const landingBuffer = Buffer.from(landingBytes);
    const successBytes = await successImage!.arrayBuffer();
    const successBuffer = Buffer.from(successBytes);
    const notEligibleBytes = await notEligibleImage!.arrayBuffer();
    const notEligibleBuffer = Buffer.from(notEligibleBytes);
    const errorBytes = await errorImage!.arrayBuffer();
    const errorBuffer = Buffer.from(errorBytes);
    [landing, success, notEligible, error] = await Promise.all([
      uploadImage(landingBuffer, `${name}-landing.png`),
      uploadImage(successBuffer, `${name}-success.png`),
      uploadImage(notEligibleBuffer, `${name}-not-eligible.png`),
      uploadImage(errorBuffer, `${name}-error.png`),
    ]);
  } else {
    const logoBytes = await logoFile!.arrayBuffer();
    const logoBuffer = Buffer.from(logoBytes);
    logo = await uploadImage(logoBuffer, `${name}-logo.png`);
  }

  const waitlist = await createWaitlist({
    data: {
      name: name as string,
      slug: slugName,
      endDate: new Date(endDate as string),
      requiresEmail: requiresEmail?.toString() === "true",
      hasCaptcha: hasCaptcha?.toString() === "true",
      externalUrl: externalUrl as string,
      joinButtonText: joinButtonText as string,
      userAddress: address!,
      imagesMode: imagesMode,
      imageLanding: landing?.url ?? null,
      imageSuccess: success?.url ?? null,
      imageNotEligible: notEligible?.url ?? null,
      imageError: error?.url ?? null,
      logo: logo?.url ?? null,
      textLanding: isAdvancedMode ? null : imageTexts.landing,
      textSuccess: isAdvancedMode ? null : imageTexts.success,
      textNotEligible: isAdvancedMode ? null : imageTexts.notEligible,
      textError: isAdvancedMode ? null : imageTexts.closed,
      tier: tier || WaitlistTier.FREE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

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
              url: landing?.url ?? logo?.url ?? "",
            },
            color: 16776960,
          },
        ],
      }),
    });
  }

  return NextResponse.json(waitlist);
};
