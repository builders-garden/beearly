/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../frames";
import prisma from "../../../../lib/prisma";

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

  return {
    image: waitlist.imageLanding,
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
        Join Waitlist
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
