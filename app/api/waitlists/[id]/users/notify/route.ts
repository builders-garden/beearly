import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { addToDCsQueue } from "../../../../../../lib/queues";

export const POST = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const body = await req.json();
  const { fids, powerBadge, message } = body;
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!waitlist) {
    return NextResponse.json(
      {
        message: "Waitlist not found",
      },
      {
        status: 404,
      }
    );
  }

  let fidsToNotify: number[];
  if (!fids || fids[0] === "all") {
    fidsToNotify = await prisma.waitlistedUser
      .findMany({
        where: {
          waitlistId: parseInt(id),
          ...(powerBadge && {
            powerBadge: true,
          }),
        },
        select: {
          fid: true,
        },
      })
      .then((users) => users.map((user) => user.fid));
  } else {
    fidsToNotify = fids.map((fid: string) => parseInt(fid));
  }

  try {
    /*await Promise.all(
      fidsToNotify.map((fid) => addToDCsQueue({ fid, text: message }))
    );*/
    console.log({
      username: process.env.REDIS_USERNAME!,
      password: process.env.REDIS_PASSWORD!,
      host: process.env.REDIS_HOST!,
      port: parseInt(process.env.REDIS_PORT!),
      enableOfflineQueue: false,
    });
  } catch (e) {
    console.error("Failed to send broadcast", e);
    return NextResponse.json(
      {
        message:
          "An error occurred while sending the broadcast. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({ success: true });
};
