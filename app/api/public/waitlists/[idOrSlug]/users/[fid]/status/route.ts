import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "../../../../../../../../lib/api-key";
import prisma from "../../../../../../../../lib/prisma";
import { getWaitlistByIdOrSlug } from "../../../../../../../../lib/db/waitlist";

export const GET = async (
  req: NextRequest,
  {
    params: { fid, idOrSlug },
  }: {
    params: { fid: string; idOrSlug: string };
  }
) => {
  try {
    // Validate and get the API key
    const { apiKey: key, valid } = await validateApiKey(req);

    // If the API key is invalid, return a 401
    if (!valid || !key) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Find the waitlist associated with the id or slug based on the type
    const waitlist = await getWaitlistByIdOrSlug(idOrSlug);

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

    // If the key's waitlist ID doesn't match the user's waitlist ID, return a 403
    if (key.waitlist_id !== waitlist.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    // If the key's waitlist ID doesn't match the user's waitlist ID, return a 403
    if (key.waitlist_id !== waitlist.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    // Check the status of the user
    const parsedFid = parseInt(fid);
    const user = await prisma.waitlistedUser.findUnique({
      where: {
        fid: parsedFid,
        waitlistId: waitlist.id,
        waitlistId_fid: { waitlistId: waitlist.id, fid: parsedFid },
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
