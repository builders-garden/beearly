import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { TIERS } from "../../../../lib/constants";
import { fetchFarcasterProfiles, UserProfile } from "../../../../lib/airstack";
import { formatAirstackUserData } from "../../../../lib/airstack/utils";
import { WaitlistTier } from "@prisma/client";

export const POST = async (req: NextRequest) => {
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
    if (!key || key.mode === "r") {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Create an API request log in the database
    await prisma.apiRequest.create({
      data: {
        api_key_id: key.id,
        path: req.url.replace(`${process.env.BASE_URL}`, ""),
        method: "POST",
        createdAt: new Date(),
      },
    });

    // get the x-waitlist-id from the headers that surely exists because of the middleware
    const waitlistId = key.waitlist_id;

    // Find the waitlist associated with the id
    const waitlist = await prisma.waitlist.findUnique({
      where: {
        id: waitlistId,
      },
      include: {
        _count: {
          select: {
            waitlistedUsers: true,
          },
        },
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

    // Getting the body of the request and the fid array
    // if the body is not in the correct format, return a 400
    const body = await req.json();
    if (!body || !body.fids) {
      return NextResponse.json(
        {
          message: "Incorrect payload format",
        },
        {
          status: 400,
        }
      );
    }
    const { fids }: { fids: string[] } = body;
    const parsedFids = fids.map((fid) => parseInt(fid));

    if (
      waitlist.tier !== WaitlistTier.QUEEN &&
      waitlist._count.waitlistedUsers >= TIERS[waitlist.tier].size
    ) {
      return NextResponse.json(
        {
          message: "Waitlist is full, upgrade tier to add more users",
        },
        {
          status: 400,
        }
      );
    }

    // Query the database for existing WaitlistedUser entries with the provided fids inside the waitlist
    const usersInWaitlist = await prisma.waitlistedUser.findMany({
      where: {
        fid: {
          in: parsedFids,
        },
        waitlistId: waitlistId,
      },
      select: {
        fid: true,
      },
    });

    // Create a Set of fids already in the waitlist
    const fidsInWaitlistSet = new Set(usersInWaitlist.map((user) => user.fid));

    // Filter out the fids that are already in the waitlist
    const fidsNotInWaitlist = parsedFids.filter(
      (fid) => !fidsInWaitlistSet.has(fid)
    );

    // Query the Database to get the already existing users' profiles
    const usersInDatabase = await prisma.waitlistedUser.findMany({
      distinct: ["fid"],
      where: {
        fid: {
          in: fidsNotInWaitlist,
        },
      },
    });

    // Create a Set of fids already in the database
    const fidsInDatabaseSet = new Set(usersInDatabase.map((user) => user.fid));

    // Filter out the fids we already have in the database
    const fidsToFind = fidsNotInWaitlist.filter(
      (fid) => !fidsInDatabaseSet.has(fid)
    );

    // Transforming the fids not in waitlist array to a string array to satisfy the Airstack query
    const fidsToFindString = fidsToFind.map((fid) => fid.toString());

    // Calling Airstack API many times to get all users' profiles
    const usersFound: UserProfile[] = [];
    let pointer = "";

    do {
      const res = await fetchFarcasterProfiles(fidsToFindString, pointer);
      if (res) {
        const { profiles } = res;
        usersFound.push(...profiles);
      }
      pointer = res ? res.pageInfo.nextCursor : "";
    } while (pointer);

    // Concat the users we already have in the database with the users found through Airstack
    const allUsersToAdd = [
      ...usersFound.map((user) => ({
        ...formatAirstackUserData(user),
        waitlistId: waitlistId,
        waitlistedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      ...usersInDatabase.map((user) => ({
        ...user,
        id: undefined,
        waitlistId: waitlistId,
      })),
    ];

    // Bulk insert the Database
    const result = await prisma.waitlistedUser.createMany({
      data: allUsersToAdd,
    });

    return NextResponse.json(
      { message: "Success", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while adding users" },
      { status: 500 }
    );
  }
};
