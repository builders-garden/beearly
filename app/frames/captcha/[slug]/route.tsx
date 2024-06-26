import { Button } from "frames.js/next";
import { generateCaptchaChallenge } from "../../../../lib/captcha";
import { frames } from "../../frames";
import prisma from "../../../../lib/prisma";
import { appURL } from "../../../utils";

const frameHandler = frames(async (ctx) => {
  // Check if the message is valid
  if (!ctx?.message?.isValid) {
    throw new Error("Invalid message");
  }

  // Get the waitlist slug
  const slug = ctx.url.pathname.split("/").pop();

  // Get the waitlist from the database
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      slug,
    },
  });

  if (!waitlist) {
    // TODO: show error frame
    throw new Error("Invalid waitlist");
  }

  // Get the search params containing the user fid, ref, refSquared and email
  const ref = ctx.url.searchParams.get("ref");
  const refSquared = ctx.url.searchParams.get("refSquared");
  const fid = ctx.message.castId?.fid.toString()!;
  const email = ctx.url.searchParams.get("email") ?? ctx.message.inputText;

  // If the waitlist requires the email, validate the email input
  if (waitlist.requiresEmail) {
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

  const { id, numA, numB } = await generateCaptchaChallenge(
    parseInt(fid),
    waitlist.id
  );
  return {
    image: (
      <div tw="relative flex items-center justify-center">
        <img src={`${appURL()}/captcha/challenge.png`} tw="absolute" />
        <div tw="relative flex items-center justify-center text-8xl pt-40 text-black font-bold">
          {numA} + {numB} = ?
        </div>
      </div>
    ),
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    textInput: "Enter the result",
    buttons: [
      <Button
        action="post"
        key="1"
        target={{
          pathname: `/waitlists/${slug}/join`,
          search:
            `?id=${id}` +
            `${email ? `&email=${email}` : ""}` +
            `${ref ? `&ref=${ref}` : ""}` +
            `${ref && refSquared ? `&refSquared=${refSquared}` : ""}`,
        }}
      >
        🔢 Submit captcha
      </Button>,
    ],
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
