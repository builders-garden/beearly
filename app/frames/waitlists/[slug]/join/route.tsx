/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../../frames";
import prisma from "../../../../../lib/prisma";
import {
  fetchFarcasterChannels,
  fetchFarcasterProfile,
} from "../../../../../lib/airstack";
import { WaitlistRequirementType } from "@prisma/client";

const frameHandler = frames(async (ctx) => {
  if (!ctx?.message?.isValid) {
    throw new Error("Invalid message");
  }
  const urlSplit = ctx.url.pathname.split("/");
  const slug = urlSplit[urlSplit.length - 2];
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      slug,
    },
    include: {
      waitlistRequirements: true,
    },
  });
  if (!waitlist) {
    // TODO: show error frame
    throw new Error("Invalid waitlist");
  }

  // ALREADY WAITLISTED
  const waitlistedUser = await prisma.waitlistedUser.findFirst({
    where: {
      waitlistId: waitlist.id,
      fid: ctx.message.requesterFid,
    },
  });
  if (waitlistedUser) {
    return {
      image: waitlist.imageSuccess,
      imageOptions: {
        aspectRatio: "1.91:1",
      },
      buttons: [
        <Button action="link" key="1" target={waitlist.externalUrl}>
          Learn more
        </Button>,
      ],
    };
  }

  // WAITLIST REGISTRATIONS CLOSED
  if (Date.now() > waitlist.endDate.getTime()) {
    return {
      image: waitlist.imageError,
      imageOptions: {
        aspectRatio: "1.91:1",
      },
      buttons: [
        <Button action="link" key="1" target={waitlist.externalUrl}>
          Learn more
        </Button>,
      ],
    };
  }

  const fid = ctx.message?.requesterFid;
  const farcasterProfile = await fetchFarcasterProfile(fid.toString());
  if (!farcasterProfile) {
    // TODO: show error frame
    throw new Error("Invalid farcaster profile");
  }

  if (waitlist.waitlistRequirements.length > 0) {
    const powerBadgeRequirement = waitlist.waitlistRequirements.find(
      (r) => r.type === WaitlistRequirementType.POWER_BADGE
    );
    const requiredChannels = waitlist.waitlistRequirements.filter(
      (r) => r.type === WaitlistRequirementType.CHANNEL_FOLLOW
    );
    if (powerBadgeRequirement?.value === "true") {
      if (!farcasterProfile?.isFarcasterPowerUser) {
        return {
          image: waitlist.imageNotEligible,
          imageOptions: {
            aspectRatio: "1.91:1",
          },
          buttons: [
            <Button
              action="post"
              key="1"
              target={`/waitlists/${waitlist.slug}/join`}
            >
              Try again
            </Button>,
            <Button action="link" key="2" target={waitlist.externalUrl}>
              Learn more
            </Button>,
          ],
        };
      }
    }
    if (requiredChannels.length > 0) {
      const farcasterChannels = await fetchFarcasterChannels(
        fid.toString(),
        requiredChannels.map((r) => r.value)
      );
      if (farcasterChannels.length !== requiredChannels.length) {
        return {
          image: waitlist.imageNotEligible,
          imageOptions: {
            aspectRatio: "1.91:1",
          },
          buttons: [
            <Button
              action="post"
              key="1"
              target={`/waitlists/${waitlist.slug}/join`}
            >
              Try again
            </Button>,
            <Button action="link" key="1" target={waitlist.externalUrl}>
              Learn more
            </Button>,
          ],
        };
      }
    }
  }

  await prisma.waitlistedUser.create({
    data: {
      waitlistId: waitlist.id,
      fid,
      address:
        ctx.message.verifiedWalletAddress ||
        ctx.message.connectedAddress ||
        ctx.message.requesterVerifiedAddresses[0] ||
        ctx.message.requesterCustodyAddress,
      displayName: farcasterProfile.profileDisplayName!,
      username: farcasterProfile.profileName!,
      avatarUrl: farcasterProfile.profileImage!,
      powerBadge: farcasterProfile.isFarcasterPowerUser,
      waitlistedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return {
    image: waitlist.imageSuccess,
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    buttons: [
      <Button action="link" key="1" target={waitlist.externalUrl}>
        Learn more
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
