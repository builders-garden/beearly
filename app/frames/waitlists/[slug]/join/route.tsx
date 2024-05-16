/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../../frames";
import prisma from "../../../../../lib/prisma";
import { fetchFarcasterProfile } from "../../../../../lib/airstack";

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
  });
  if (!waitlist) {
    // TODO: show error frame
    throw new Error("Invalid waitlist");
  }

  const fid = ctx.message?.requesterFid;
  const farcasterProfile = await fetchFarcasterProfile(fid.toString());
  if (!farcasterProfile) {
    // TODO: show error frame
    throw new Error("Invalid farcaster profile");
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
