/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../frames";
import prisma from "../../../../lib/prisma";

const frameHandler = frames(async (ctx) => {
  if (!ctx?.message?.isValid) {
    console.log(ctx.message?.isValid);
    throw new Error("Invalid message");
  }
  const slug = ctx.url.pathname.replace("/frames/waitlist/", "");
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      slug,
    },
  });
  if (!waitlist) {
    // TODO: show a basic metadata
    throw new Error("Invalid waitlist");
  }

  return {
    image: waitlist.imageLanding,
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    buttons: [
      <Button
        action="post"
        key="1"
        target={{ pathname: `/waitlists/${waitlist.slug}/join` }}
      >
        Join waitlist
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
