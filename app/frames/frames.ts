import { farcasterHubContext, openframes } from "frames.js/middleware";
import { createFrames } from "frames.js/next";
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from "frames.js/xmtp";
import { FRAMES_BASE_PATH, appURL } from "../utils";
import { interBoldFontData } from "../../lib/fonts";

interface ImageOptions {
  aspectRatio: "1.91:1" | "1:1";
  height: number;
  width: number;
  fonts: {
    data: Buffer | ArrayBuffer;
    name: string;
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    style?: "normal" | "italic";
    lang?: string;
  }[];
}

export const defaultImageOptions: ImageOptions = {
  aspectRatio: "1.91:1",
  height: 1000,
  width: 1910,
  fonts: [
    {
      name: "Inter",
      data: interBoldFontData,
      weight: 700,
    },
  ],
};

export const frames = createFrames({
  basePath: FRAMES_BASE_PATH,
  baseUrl: appURL(),
  middleware: [
    farcasterHubContext({
      ...(process.env.NODE_ENV === "production"
        ? {
            hubHttpUrl: "https://hubs.airstack.xyz",
            hubRequestOptions: {
              headers: {
                "x-airstack-hubs": process.env.AIRSTACK_API_KEY as string,
              },
            },
          }
        : {
            hubHttpUrl: "http://localhost:3010/hub",
          }),
    }),
    openframes({
      clientProtocol: {
        id: "xmtp",
        version: "2024-02-09",
      },
      handler: {
        isValidPayload: (body: JSON) => isXmtpFrameActionPayload(body),
        getFrameMessage: async (body: JSON) => {
          if (!isXmtpFrameActionPayload(body)) {
            console.error("Invalid XMTP payload");
            return undefined;
          }
          const result = await getXmtpFrameMessage(body);

          return { ...result };
        },
      },
    }),
  ],
});
