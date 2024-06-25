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

// this frameHandler called when user clicks "join waitlist" button of frame
const frameHandler = frames(async (ctx) => {
  // Check if the message is valid
  if (!ctx?.message?.isValid) {
    throw new Error("Invalid message");
  }

  // Go find the waitlist the user clicked to join (error if it doesn't exist)
  // Get the waitlist slug and fetch the waitlist from the database
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

  // If the waitlist is full, show the error frame
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

  // Get the ref and refSquared from the search params
  let ref =
    ctx.url.searchParams.get("ref") || ctx.message.castId?.fid.toString();
  const refSquared = ctx.url.searchParams.get("refSquared");

  // Check if the ref and refSquared are waitlisted users
  async function checkWaitlistedUser(_fid: string, _waitlistId: number) {
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
  const isRefInWaitlist =
    ref && (await checkWaitlistedUser(ref, waitlist.id)) ? true : false;
  const isRefSquaredInWaitlist =
    refSquared && (await checkWaitlistedUser(refSquared, waitlist.id))
      ? true
      : false;

  // if user already in THIS waitlist, don't add to database, show success frame
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
          target={createCastIntent(fid, waitlist.name, slug!, ref)}
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

  // if waitlist end date is passed, show error frame
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

  // Define user to add, copying from db or fetching from Airstack
  const anyWaitlistUser = await prisma.waitlistedUser.findFirst({
    where: { fid: fid },
  });

  let userToAdd;

  // if user already in ANY waitlist, get user data from our db
  if (anyWaitlistUser) {
    userToAdd = {
      ...anyWaitlistUser,
      id: undefined,
      referrerFid: ref && isRefInWaitlist ? parseInt(ref) : null,
      referrerSquaredFid:
        refSquared && isRefSquaredInWaitlist ? parseInt(refSquared) : null,
      waitlistId: waitlist.id,
      waitlistedAt: new Date(),
    };
  }
  // If user not already in  ANY waitlist, fetch from Airstack
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
      referrerFid: ref && isRefInWaitlist ? parseInt(ref) : null,
      referrerSquaredFid:
        refSquared && isRefSquaredInWaitlist ? parseInt(refSquared) : null,
      waitlistedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // requirements check: power badge, channel follow, user follow
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
              target={{
                pathname: `/waitlists/${slug}/join`,
                search:
                  `${ref ? `&ref=${ref}` : ""}` +
                  `${ref && refSquared ? `&refSquared=${refSquared}` : ""}`,
              }}
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
              target={{
                pathname: `/waitlists/${slug}/join`,
                search:
                  `${ref ? `&ref=${ref}` : ""}` +
                  `${ref && refSquared ? `&refSquared=${refSquared}` : ""}`,
              }}
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
              target={{
                pathname: `/waitlists/${slug}/join`,
                search:
                  `${ref ? `&ref=${ref}` : ""}` +
                  `${ref && refSquared ? `&refSquared=${refSquared}` : ""}`,
              }}
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
        target={createCastIntent(fid, waitlist.name, slug!, ref)}
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
