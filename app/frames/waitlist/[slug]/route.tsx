/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "../../frames";

const frameHandler = frames(async (ctx) => {
  if (!ctx?.message?.isValid) {
    throw new Error("Invalid message");
  }
  const slug = ctx.url.pathname.replace("/frames/waitlist/", "");
  const fid = ctx.message?.requesterFid;
  const userAddress =
    ctx.message?.requesterVerifiedAddresses &&
    ctx.message?.requesterVerifiedAddresses.length > 0
      ? ctx.message?.requesterVerifiedAddresses[0]
      : ctx.message?.verifiedWalletAddress; // XMTP user address

  console.log("slug", slug, "fid", fid, "userAddress", userAddress);

  return {
    image: (
      <div style={{ display: "flex", color: "red" }}>
        You joined the Waitlist {slug}
      </div>
    ),
    buttons: [
      <Button action="post" key="1" target="/waitlist">
        Home
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
