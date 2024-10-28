import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { publishToQstash } from "../../../../../../lib/qstash";
import { TIERS } from "../../../../../../lib/constants";

export const POST = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  // Get the payload from the request and extract the offset
  const body = await req.json();
  const { fids, message } = body;
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

  // check if lastMessage was sent earlier than cooldown
  if (
    lastMessageSent &&
    new Date().getTime() - lastMessageSent.createdAt.getTime() <
      TIERS[waitlist.tier].broadcastDCCooldown
  ) {
    const nextMessageTime = new Date(
      lastMessageSent.createdAt.getTime() +
        TIERS[waitlist.tier].broadcastDCCooldown
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

  let usersToNotify: { fid: number; address: string }[];
  if (!fids || fids[0] === "all") {
    usersToNotify = await prisma.waitlistedUser.findMany({
      where: {
        waitlistId: parseInt(id),
      },
      select: {
        fid: true,
        address: true,
      },
    });
  } else {
    const fidsToNotify = fids.map((fid: string) => parseInt(fid));
    usersToNotify = await prisma.waitlistedUser.findMany({
      where: {
        waitlistId: parseInt(id),
        fid: {
          in: fidsToNotify,
        },
      },
      select: {
        fid: true,
        address: true,
      },
    });
  }

  const enrichedMessage = `📢🐝\n\n"${message}"\n\nYou are receiveing this message because you joined ${waitlist.name} (${waitlist.externalUrl}) waitlist.`;

  try {
    await Promise.all([
      notifyOnWarpcast(usersToNotify, enrichedMessage),
      notifyOnXMTP(usersToNotify, enrichedMessage),
    ]);
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
    // Save the message in the database
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

const notifyOnWarpcast = async (users: { fid: number }[], text: string) => {
  // Send Warpcast message to all the desired users
  try {
    await Promise.all(
      users.map((user) =>
        publishToQstash(
          `${process.env.BASE_URL}/api/qstash/workers/broadcast`,
          { fid: user.fid, text },
          0
        )
      )
    );
  } catch (e) {
    console.error("Failed to send broadcast on Warpcast", e);
    return NextResponse.json(
      {
        message:
          "An error occurred while sending the broadcast on Warpcast. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
};

const notifyOnXMTP = async (users: { address: string }[], text: string) => {
  // Send XMTP message to all the desired users
  try {
    await Promise.all(
      users.map((user) =>
        publishToQstash(
          `${process.env.BASE_URL}/api/qstash/workers/broadcast`,
          { address: user.address, text },
          0
        )
      )
    );
  } catch (e) {
    console.error("Failed to send broadcast on XMTP", e);
    return NextResponse.json(
      {
        message:
          "An error occurred while sending the broadcast on XMTP. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
};
