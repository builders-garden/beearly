import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export const GET = async (
  req: NextRequest,
  {
    params: { fid },
  }: {
    params: { fid: string };
  }
) => {
  try {
    // Get the API key from the headers
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Check if the API key exists in the database
    const key = await prisma.apiKey.findUnique({
      where: {
        key: apiKey,
      },
    });

    // If the API key doesn't exist, return a 404
    if (!key || key.mode === "w") {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Get the waitlist id from the API key
    const waitlistId = key.waitlist_id;

    // Find the waitlist associated with the id
    const waitlist = await prisma.waitlist.findUnique({
      where: {
        id: key.waitlist_id,
      },
    });

    // If the waitlist doesn't exist, return a 404
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

    // Check the status of the user
    const parsedFid = parseInt(fid);
    const user = await prisma.waitlistedUser.findUnique({
      where: {
        fid: parsedFid,
        waitlistId: waitlistId,
        waitlistId_fid: { waitlistId: waitlistId, fid: parsedFid },
      },
    });

    // If the user doesn't exist, return a 404
    if (!user) {
      return NextResponse.json(
        {
          message: "User not in waitlist",
        },
        {
          status: 404,
        }
      );
    }

    // If the user exists, return a 200 with their status
    return NextResponse.json(user.status, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};
