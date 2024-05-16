/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../../frames";
import prisma from "../../../../../lib/prisma";

const frameHandler = frames(async (ctx) => {
  if (!ctx?.message?.isValid) {
    console.log(ctx.message?.isValid);
    throw new Error("Invalid message");
  }
  console.log("HEREEE");
  const slug = ctx.url.pathname
    .replace("/frames/waitlist/", "")
    .replace("/join", "");
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
