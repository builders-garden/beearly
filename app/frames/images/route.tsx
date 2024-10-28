import { createImagesWorker } from "frames.js/middleware/images-worker/next";
import { interBoldFontData } from "../../../lib/fonts";

const imagesRoute = createImagesWorker({
  secret: process.env.IMAGES_WORKER_SECRET as string,
  imageOptions: {
    debug: false,
    sizes: {
      "1:1": {
        width: 1000,
        height: 1000,
      },
      "1.91:1": {
        width: 1910,
        height: 1000,
      },
    },
    fonts: [
      {
        name: "Inter",
        data: interBoldFontData,
        weight: 700,
      },
    ],
  },
});

export const GET = imagesRoute();
