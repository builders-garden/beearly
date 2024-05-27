import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { addToDCsQueue } from "../../../../../../lib/queues";
import { MESSAGE_COOLDOWN } from "../../../../../../lib/constants";

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

  const lastMessageSent = await prisma.waitlistMessages.findFirst({
    where: {
      waitlistId: parseInt(id),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // check if lastMessage was sent in the last 12 hours
  if (
    lastMessageSent &&
    new Date().getTime() - lastMessageSent.createdAt.getTime() <
      MESSAGE_COOLDOWN
  ) {
    const nextMessageTime = new Date(
      lastMessageSent.createdAt.getTime() + MESSAGE_COOLDOWN
    );
    return NextResponse.json(
      {
        message: `Next message can be sent from ${nextMessageTime.toLocaleString()}.`,
      },
      {
        status: 400,
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

  const enrichedMessage = `📢🐝\n\n"${message}"\n\nYou are receiveing this message because you joined ${waitlist.name} (${waitlist.externalUrl}) waitlist.`;
  try {
    await Promise.all(
      fidsToNotify.map((fid) => addToDCsQueue({ fid, text: enrichedMessage }))
    );
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
  } finally {
    await prisma.waitlistMessages.create({
      data: {
        waitlistId: parseInt(id),
        message: enrichedMessage,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ success: true });
};
