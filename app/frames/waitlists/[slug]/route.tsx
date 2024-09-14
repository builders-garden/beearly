/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../frames";
import prisma from "../../../../lib/prisma";
import { WaitlistImagesMode } from "@prisma/client";

const frameHandler = frames(async (ctx) => {
  const ref = ctx.url.searchParams.get("ref");
  const refSquared = ctx.url.searchParams.get("refSquared");
  const slug = ctx.url.pathname.split("/").pop();
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      slug,
    },
  });
  if (!waitlist) {
    // TODO: show an error image
    throw new Error("Invalid waitlist");
  }

  // The button target's pathname depends on if the waitlist requires solving a captcha or not
  const pathname = waitlist.hasCaptcha
    ? `/captcha/${slug}`
    : `/waitlists/${slug}/join`;

  // Get the join button text from the database, if it doesn't exist or it's empty, use the default text
  const joinButtonText = waitlist.joinButtonText || "Join Waitlist";

  return {
    image:
      waitlist.imagesMode === WaitlistImagesMode.ADVANCED ? (
        waitlist.imageLanding!
      ) : (
        <div
          tw="flex w-[1910px] h-[1000px]"
          style={{
            backgroundImage: `url("${process.env.BASE_URL}/default-frame-images/cover.png")`,
          }}
        >
          <div tw="flex text-white px-18 py-32">{waitlist.textLanding}</div>
        </div>
      ),
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    textInput: waitlist.requiresEmail ? "Enter your email address" : undefined,
    buttons: [
      <Button
        action="post"
        key="1"
        target={{
          pathname: pathname,
          search:
            `${ref ? `ref=${ref}` : ""}` +
            `${ref && refSquared ? `&refSquared=${refSquared}` : ""}`,
        }}
      >
        {joinButtonText}
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
