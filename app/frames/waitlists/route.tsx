/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../frames";

const frameHandler = frames(async (ctx) => {
  if (!ctx?.message?.isValid) {
    throw new Error("Invalid message");
  }
  const slug = ctx.url.pathname.replace("/frames/waitlists", "");
  console.log("slug", slug);

  return {
    image: <div>Join waitlist 1</div>,
    buttons: [
      <Button action="post" key="1" target="/waitlist/1">
        Join the Waitlist
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
