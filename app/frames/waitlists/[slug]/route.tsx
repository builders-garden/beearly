import { Button } from "frames.js/next";
import { defaultImageOptions, frames } from "../../frames";
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
        <div tw="flex h-full w-full">
          <img
            src={`${process.env.BASE_URL}/default-frame-images/cover.png`}
            alt="cover"
          />
          <div tw="flex absolute top-40 h-[415px] w-full justify-center items-center px-18 text-black font-bold text-[79px] text-center">
            {waitlist.textLanding}
          </div>
          <div tw="absolute bottom-44 w-full flex justify-center items-center">
            <img
              tw="rounded-2xl"
              src={waitlist.logo!}
              alt="waitlist-logo"
              width={250}
              height={250}
            />
          </div>
        </div>
      ),
    imageOptions: defaultImageOptions,
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
