/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../../frames";
import prisma from "../../../../../lib/prisma";
import {
  fetchFarcasterChannels,
  fetchFarcasterProfile,
  isUserFollowingUsers,
  UserProfile,
} from "../../../../../lib/airstack";
import { WaitlistRequirementType, WaitlistTier } from "@prisma/client";
import {
  createCastIntent,
  isUserFollowingChannels,
} from "../../../../../lib/warpcast";
import { formatAirstackUserData } from "../../../../../lib/airstack/utils";
import { TIERS } from "../../../../../lib/constants";

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
      _count: {
        select: { waitlistedUsers: true },
      },
    },
  });
  if (!waitlist) {
    // TODO: show error frame
    throw new Error("Invalid waitlist");
  }

  if (waitlist.tier !== WaitlistTier.QUEEN) {
    if (waitlist._count.waitlistedUsers >= TIERS[waitlist.tier].size) {
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
  }

  // In this case you are a referrer and you should be in the waitlist
  let ref =
    ctx.url.searchParams.get("ref") || ctx.message.castId?.fid.toString();
  let refSquared = ctx.url.searchParams.get("refSquared") ?? "";

  // update logic below to be dynamic for ref & refSquared
  // if check var (could be ref or refSquared)
  // if waitlisted?

  function checkWaitlistedUser(_fid: string, _waitlistId: number) {
    if (_fid !== "1") {
      const isWaitlistUser = await prisma.waitlistedUser.findFirst({
        where: {
          fid: parseInt(_fid),
          waitlistId: _waitlistId,
        },
      });
      return isWaitlistUser;
    }
  }

  if (ref) {
    checkWaitlistedUser(ref, waitlist.id);
  }
  if (refSquared) {
    checkWaitlistedUser(refSquared, waitlist.id);
  }

  if (ref && ref !== "1") {
    const isWaitlistUser = await prisma.waitlistedUser.findFirst({
      where: {
        fid: parseInt(ref),
      },
    });
    if (refSquared && refSquared !== "1") {
    }
    // if (!isWaitlistUser) {}
  }

  // ALREADY WAITLISTED
  const fid = ctx.message.requesterFid;
  const waitlistedUser = await prisma.waitlistedUser.findFirst({
    where: {
      waitlistId: waitlist.id,
      fid: fid,
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
        <Button
          action="link"
          key="2"
          target={createCastIntent(
            fid,
            waitlist.name,
            waitlist.slug,
            refSquared
          )}
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

  // Check if the user is already in the database
  const existingWaitlistedUser = await prisma.waitlistedUser.findFirst({
    where: { fid: fid },
  });

  let userToAdd;

  // User was found in database
  if (existingWaitlistedUser) {
    userToAdd = {
      ...existingWaitlistedUser,
      id: undefined,
      referrerFid: ref && ref !== "1" ? parseInt(ref) : null,
      referrerSquaredFid:
        refSquared && refSquared !== "1" ? parseInt(refSquared) : null,
      waitlistId: waitlist.id,
      waitlistedAt: new Date(),
    };
  }
  // Fetch from Airstack if user was not found in database
  else {
    const farcasterProfile: UserProfile | boolean | undefined =
      await fetchFarcasterProfile(fid.toString());
    if (!farcasterProfile) {
      // TODO: show error frame
      throw new Error("Invalid farcaster profile");
    }
    userToAdd = {
      ...formatAirstackUserData(farcasterProfile),
      waitlistId: waitlist.id,
      referrerFid: ref && ref !== "1" ? parseInt(ref) : null,
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
    if (powerBadgeRequirement?.value === "true") {
      if (!userToAdd?.powerBadge) {
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
  await prisma.waitlistedUser.create({
    data: userToAdd,
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
        target={createCastIntent(fid, refSquared, waitlist.name, waitlist.slug)}
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
