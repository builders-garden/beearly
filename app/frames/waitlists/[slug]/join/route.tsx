/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../../frames";
import prisma from "../../../../../lib/prisma";
import {
  fetchFarcasterChannels,
  fetchFarcasterProfile,
  isUserFollowingUsers,
} from "../../../../../lib/airstack";
import { WaitlistRequirementType } from "@prisma/client";
import {
  createCastIntent,
  isUserFollowingChannels,
} from "../../../../../lib/warpcast";

const frameHandler = frames(async (ctx) => {
  if (!ctx?.message?.isValid) {
    throw new Error("Invalid message");
  }

  let ref =
    ctx.url.searchParams.get("ref") || ctx.message.castId?.fid.toString();

  if (ref && ref !== "1") {
    const isWaitlistUser = await prisma.waitlistedUser.findFirst({
      where: {
        fid: parseInt(ref),
      },
    });
    if (!isWaitlistUser) {
      const farcasterProfile = await fetchFarcasterProfile(ref);
      if (!farcasterProfile) {
        ref = "";
      } else {
        await prisma.waitlistedUser.create({
          data: {
            waitlistId: 1,
            fid: parseInt(ref),
            address:
              farcasterProfile.connectedAddresses?.length! > 0
                ? farcasterProfile.connectedAddresses![0]!.address
                : farcasterProfile.userAddress,
            displayName: farcasterProfile.profileDisplayName!,
            username: farcasterProfile.profileName!,
            avatarUrl: farcasterProfile.profileImage!,
            powerBadge: farcasterProfile.isFarcasterPowerUser,
            referrerFid: null,
            waitlistedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }
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
  const fid = ctx.message?.requesterFid;
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
        <Button
          action="link"
          key="2"
          target={createCastIntent(fid, waitlist.name, waitlist.slug)}
        >
          Share with referral
        </Button>,
        <Button
          action="link"
          key="3"
          target={"https://warpcast.com/beearlybot"}
        >
          Follow @beearlybot for updates
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
    const requiredUsersFollow = waitlist.waitlistRequirements.filter(
      (r) => r.type === WaitlistRequirementType.USER_FOLLOW
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
      const isUserFollowingRequiredChannels = await isUserFollowingChannels(
        fid,
        requiredChannels.map((r) => r.value)
      );
      if (!isUserFollowingRequiredChannels) {
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
    if (requiredUsersFollow.length > 0) {
      const isUserFollowingRequiredUsers = await isUserFollowingUsers(
        fid.toString(),
        requiredUsersFollow.map((r) => r.value)
      );
      if (isUserFollowingRequiredUsers.length < requiredUsersFollow.length) {
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
  }
  console.log({
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
    referrerFid: ref ? parseInt(ref) : null,
    waitlistedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
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
      referrerFid: ref && ref !== "1" ? parseInt(ref) : null,
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
      <Button
        action="link"
        key="2"
        target={createCastIntent(fid, waitlist.name, waitlist.slug)}
      >
        Share with referral
      </Button>,
      <Button action="link" key="3" target={"https://warpcast.com/beearlybot"}>
        Follow @beearlybot for updates
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
