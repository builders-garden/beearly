/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../../frames";
import prisma from "../../../../../lib/prisma";
import {
  fetchFarcasterProfile,
  fetchFidFromAddress,
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
import { validateCaptchaChallenge } from "../../../../../lib/captcha";
import { appURL } from "../../../../utils";
import { getTalentPassportByWalletOrId } from "../../../../../lib/talent";
import { validateReferrer } from "../../../../../lib/db/utils";
import { publishToQstash } from "../../../../../lib/qstash";

const frameHandler = frames(async (ctx) => {
  // Check if the message exists and is valid when sent from Farcaster
  if (
    !ctx?.message ||
    (ctx.clientProtocol?.id === "farcaster" && !ctx?.message?.isValid)
  ) {
    throw new Error("Invalid message");
  }

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

  // Get the captcha id, ref and refSquared from the search params
  const captchaId = ctx.url.searchParams.get("id");
  const email = ctx.url.searchParams.get("email") ?? ctx.message.inputText;
  let ref =
    ctx.url.searchParams.get("ref") || ctx.message.castId?.fid.toString();
  const refSquared = ctx.url.searchParams.get("refSquared");

  // If the waitlist requires solving a captcha, validate the user's answer
  if (waitlist.hasCaptcha) {
    if (!captchaId) {
      // TODO: show error frame
      throw new Error("Invalid captcha id");
    }
    const inputText = ctx.message.inputText;
    const isCaptchaPassed = await validateCaptchaChallenge(
      parseInt(captchaId),
      inputText
    );
    if (!isCaptchaPassed) {
      return {
        image: (
          <div tw="relative flex items-center justify-center">
            <img src={`${appURL()}/captcha/incorrect.png`} tw="absolute" />
          </div>
        ),
        buttons: [
          <Button
            action="post"
            key="1"
            target={{
              pathname: `/captcha/${slug}`,
              search:
                `${email ? `email=${email}` : ""}` +
                `${ref ? `&ref=${ref}` : ""}` +
                `${ref && refSquared ? `&refSquared=${refSquared}` : ""}`,
            }}
          >
            🔄 Try again
          </Button>,
        ],
      };
    }
  }

  // If the waitlist requires the email, validate the email input
  // If the waitlist has a captcha requirement, the email was already validated in the /captcha/[slug] endpoint
  if (waitlist.requiresEmail && !waitlist.hasCaptcha) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !regex.test(email)) {
      return {
        image: (
          <div tw="relative flex items-center justify-center">
            <img src={`${appURL()}/email/invalid.png`} tw="absolute" />
          </div>
        ),
        buttons: [
          <Button
            action="post"
            key="1"
            target={{
              pathname: `/waitlists/${slug}`,
              search:
                `${ref ? `ref=${ref}` : ""}` +
                `${ref && refSquared ? `&refSquared=${refSquared}` : ""}`,
            }}
          >
            🔄 Try again
          </Button>,
        ],
      };
    }
  }

  // Get the user's fid from the message if it exists
  let fid: number | undefined = ctx.message.requesterFid;

  // Get the user's fid through Airstack if the call is made from the XMTP protocol
  if (ctx.clientProtocol?.id === "xmtp") {
    const response = await fetchFidFromAddress(
      ctx.message?.verifiedWalletAddress as `0x${string}`
    );
    if (!response) {
      throw new Error("Address not found on Farcaster");
    }
    fid = parseInt(response);
  }

  // Check if the user is already waitlisted, if so show the success frame and return
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

  // If the waitlist has ended, show the error frame
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

  // Check if the user is already in the database (in a different waitlist)
  const existingWaitlistedUser = await prisma.waitlistedUser.findFirst({
    where: { fid: fid },
  });

  let userToAdd;

  // User was found in database
  if (existingWaitlistedUser) {
    userToAdd = {
      ...existingWaitlistedUser,
      id: undefined,
      email: email ? email : existingWaitlistedUser.email,
      referrerFid: await validateReferrer(ref, waitlist.id),
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
      email: email ?? null,
      referrerFid: await validateReferrer(ref, waitlist.id),
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
                pathname: waitlist.hasCaptcha
                  ? `/captcha/${slug}`
                  : `/waitlists/${slug}/join`,
                search:
                  `${email ? `email=${email}` : ""}` +
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
                pathname: waitlist.hasCaptcha
                  ? `/captcha/${slug}`
                  : `/waitlists/${slug}/join`,
                search:
                  `${email ? `email=${email}` : ""}` +
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
                pathname: waitlist.hasCaptcha
                  ? `/captcha/${slug}`
                  : `/waitlists/${slug}/join`,
                search:
                  `${email ? `email=${email}` : ""}` +
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
    if (requiredBuilderScore) {
      const talentPassportProfile = await getTalentPassportByWalletOrId(
        userToAdd.address
      );

      if (
        !talentPassportProfile ||
        talentPassportProfile.passport.score <
          parseInt(requiredBuilderScore.value)
      ) {
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
                pathname: waitlist.hasCaptcha
                  ? `/captcha/${slug}`
                  : `/waitlists/${slug}/join`,
                search:
                  `${email ? `email=${email}` : ""}` +
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

  // Send the user a direct cast to notify them that they have been waitlisted
  if (process.env.NODE_ENV === "production") {
    const enrichedMessage = `📢🐝\n\nCongratulations!\nYou have succesfully joined ${waitlist.name} (${waitlist.externalUrl}) waitlist.`;
    // Send the direct cast by publishing it to Qstash
    const res = await publishToQstash(
      `${process.env.BASE_URL}/api/qstash/workers/broadcast`,
      { fid: fid, text: enrichedMessage },
      0
    );
    if (res.response !== "ok") {
      console.error("Failed to send join notification direct cast");
    }
  }

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
