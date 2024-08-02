import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { WaitlistRequirementType, WaitlistTier } from "@prisma/client";
import { TIERS } from "../../../../../lib/constants";
import {
  fetchFarcasterProfile,
  fetchFidFromAddress,
  isUserFollowingUsers,
  UserProfile,
} from "../../../../../lib/airstack";
import { publishToQstash } from "../../../../../lib/qstash";
import { formatAirstackUserData } from "../../../../../lib/airstack/utils";
import { isUserFollowingChannels } from "../../../../../lib/warpcast";
import { getTalentPassportByWalletOrId } from "../../../../../lib/talent";

export const POST = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  // update waitlist
  const body = await req.json();

  const captchaId = body.get("captchaId");
  const email = body.get("endDate");
  const address = req.headers.get("x-address");

  // Check if the connected user is also a Farcaster user
  if (!address) {
    return NextResponse.json(
      {
        message: "No wallet connected",
      },
      { status: 400 }
    );
  }
  const userFid = await fetchFidFromAddress(address);
  if (!userFid) {
    return NextResponse.json(
      {
        message:
          "The connected address is not an address associated with a Farcaster user",
      },
      { status: 404 }
    );
  }

  // Fetch the waitlist from the database through the id
  const waitlist = await prisma.waitlist.findUnique({
    where: {
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

  // If the waitlist is not in the QUEEN tier
  // 1. Check if the waitlist is full before going further
  // 2. Send a notification to the waitlist owner if the waitlist is exactly at 80% capacity
  if (waitlist.tier !== WaitlistTier.QUEEN) {
    const tierLimitSize = TIERS[waitlist.tier].size;
    const currentWaitlistSize = waitlist._count.waitlistedUsers;

    // If the waitlist is full, return an error response
    if (currentWaitlistSize >= tierLimitSize) {
      return NextResponse.json(
        { message: "Waitlist is full" },
        { status: 400 }
      );
    }
    // If the waitlist is at 80% capacity, send a notification to the waitlist owner
    else if (
      process.env.NODE_ENV === "production" &&
      currentWaitlistSize === Math.round(tierLimitSize * 0.8) - 1
    ) {
      const alertMessage = `📢🐝\n\nAlert!\nYou are receiving this message because your waitlist "${waitlist.name}" has reached 80% of its full capacity.\n\nIf you are looking for an upgrade reach out to @limone.eth or @blackicon.eth`;
      const ownerFid = await fetchFidFromAddress(waitlist.userAddress);
      // Send the direct cast by publishing it to Qstash if the waitlist's owner fid is found
      if (ownerFid) {
        const res = await publishToQstash(
          `${process.env.BASE_URL}/api/qstash/workers/broadcast`,
          { fid: ownerFid, text: alertMessage },
          0
        );
        if (res.response !== "ok") {
          console.error(
            "Failed to send limit notification direct cast to the waitlist owner"
          );
        }
      } else {
        console.error("Owner fid not found");
      }
    }
  }

  // Get the captcha id, ref and refSquared from the search params
  //   const captchaId = ctx.url.searchParams.get("id");
  //   const email = ctx.url.searchParams.get("email") ?? ctx.message.inputText;
  //   let ref =
  //     ctx.url.searchParams.get("ref") || ctx.message.castId?.fid.toString();
  //   const refSquared = ctx.url.searchParams.get("refSquared");

  //   // If the waitlist requires solving a captcha, validate the user's answer
  //   if (waitlist.hasCaptcha) {
  //     if (!captchaId) {
  //       return NextResponse.json({message: "Captcha id not found"}, {status: 404});
  //     }
  //     const inputText = ctx.message.inputText;
  //     const isCaptchaPassed = await validateCaptchaChallenge(
  //       parseInt(captchaId),
  //       inputText
  //     );
  //     if (!isCaptchaPassed) {
  //       return NextResponse.json({message: "Incorrect captcha answer"}, {status: 400});
  //     }
  //   }

  // If the waitlist requires the email, validate the email input
  // If the waitlist has a captcha requirement, the email was already validated in the /captcha/[slug] endpoint
  //   if (waitlist.requiresEmail && !waitlist.hasCaptcha) {
  //     const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  //     if (!email || !regex.test(email)) {
  //       return NextResponse.json({message: "Invalid email"}, {status: 400});
  //     }
  //   }

  // Check if the user is already waitlisted, if so return a success response
  const waitlistedUser = await prisma.waitlistedUser.findFirst({
    where: {
      waitlistId: waitlist.id,
      fid: parseInt(userFid),
    },
  });
  if (waitlistedUser) {
    return NextResponse.json(
      { message: "User already waitlisted" },
      { status: 200 }
    );
  }

  // If the waitlist has ended, return an error response
  if (Date.now() > waitlist.endDate.getTime()) {
    return NextResponse.json(
      { message: "Waitlist period has ended" },
      { status: 400 }
    );
  }

  // Check if the user is already in the database (in a different waitlist)
  const existingWaitlistedUser = await prisma.waitlistedUser.findFirst({
    where: { fid: parseInt(userFid) },
  });

  let userToAdd;

  // User was found in database
  if (existingWaitlistedUser) {
    userToAdd = {
      ...existingWaitlistedUser,
      id: undefined,
      //email: email ? email : existingWaitlistedUser.email,
      referrerFid: null,
      waitlistId: waitlist.id,
      waitlistedAt: new Date(),
    };
  }
  // Fetch from Airstack if user was not found in database
  else {
    const farcasterProfile: UserProfile | boolean | undefined =
      await fetchFarcasterProfile(userFid);
    if (!farcasterProfile) {
      return NextResponse.json(
        { message: "User not found in Airstack" },
        { status: 404 }
      );
    }
    userToAdd = {
      ...formatAirstackUserData(farcasterProfile),
      waitlistId: waitlist.id,
      //email: email ?? null,
      referrerFid: null,
      waitlistedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  if (waitlist.waitlistRequirements.length > 0) {
    const powerBadgeRequirement = waitlist.waitlistRequirements.find(
      (r) => r.type === WaitlistRequirementType.POWER_BADGE
    );
    const requiredChannels = waitlist.waitlistRequirements.filter(
      (r) => r.type === WaitlistRequirementType.CHANNEL_FOLLOW
    );
    const requiredUsersFollow = waitlist.waitlistRequirements.filter(
      (r) => r.type === WaitlistRequirementType.USER_FOLLOW
    );
    const requiredBuilderScore = waitlist.waitlistRequirements.find(
      (r) => r.type === WaitlistRequirementType.TALENT_BUILDER_SCORE
    );
    if (powerBadgeRequirement?.value === "true") {
      if (!userToAdd?.powerBadge) {
        return NextResponse.json(
          {
            message:
              "User is not eligible because he does not have a power badge",
          },
          { status: 400 }
        );
      }
    }
    if (requiredChannels.length > 0) {
      const requiredChannelsList = requiredChannels.map((r) => r.value);
      const isUserFollowingRequiredChannels = await isUserFollowingChannels(
        parseInt(userFid),
        requiredChannelsList
      );
      if (!isUserFollowingRequiredChannels) {
        return NextResponse.json(
          {
            message:
              "User is not eligible because he is not following the required channels",
          },
          { status: 400 }
        );
      }
      if (requiredUsersFollow.length > 0) {
        const isUserFollowingRequiredUsers = await isUserFollowingUsers(
          userFid,
          requiredUsersFollow.map((r) => r.value)
        );
        if (isUserFollowingRequiredUsers.length < requiredUsersFollow.length) {
          return NextResponse.json(
            {
              message:
                "User is not eligible because he is not following the required users",
            },
            { status: 400 }
          );
        }
      }
      if (requiredBuilderScore) {
        const talentPassportProfile = await getTalentPassportByWalletOrId(
          userToAdd.address
        );

        if (
          !talentPassportProfile ||
          talentPassportProfile.passport.score <
            parseInt(requiredBuilderScore.value)
        ) {
          return NextResponse.json(
            {
              message:
                "User is not eligible because he does not have the required minimum builder score",
            },
            { status: 400 }
          );
        }
      }
    }

    await prisma.waitlistedUser.create({
      data: userToAdd,
    });

    // Send the user a direct cast to notify them that they have been waitlisted
    if (process.env.NODE_ENV === "production") {
      const enrichedMessage = `📢🐝\n\nCongratulations!\nYou have succesfully joined ${waitlist.name} (${waitlist.externalUrl}) waitlist.`;
      // Send the direct cast by publishing it to Qstash
      const res = await publishToQstash(
        `${process.env.BASE_URL}/api/qstash/workers/broadcast`,
        { fid: userFid, text: enrichedMessage },
        0
      );
      if (res.response !== "ok") {
        console.error("Failed to send join notification direct cast");
      }
    }

    return NextResponse.json(
      { message: "User successfully waitlisted" },
      { status: 200 }
    );
  }
};
