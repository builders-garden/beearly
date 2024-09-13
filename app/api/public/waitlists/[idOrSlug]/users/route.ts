import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import {
  fetchFarcasterProfiles,
  UserProfile,
} from "../../../../../../lib/airstack";
import { formatAirstackUserData } from "../../../../../../lib/airstack/utils";
import { validateApiKey } from "../../../../../../lib/api-key";
import { getWaitlistByIdOrSlug } from "../../../../../../lib/db/waitlist";

export const POST = async (
  req: NextRequest,
  {
    params: { idOrSlug },
  }: {
    params: { idOrSlug: string };
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

    // If the key's waitlist ID doesn't match the user's waitlist ID, return a 401
    if (key.waitlist_id !== waitlist.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
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

    // Query the database for existing WaitlistedUser entries with the provided fids inside the waitlist
    const usersInWaitlist = await prisma.waitlistedUser.findMany({
      where: {
        fid: {
          in: parsedFids,
        },
        waitlistId: waitlist.id,
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
        waitlistId: waitlist.id,
        waitlistedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      ...usersInDatabase.map((user) => ({
        ...user,
        id: undefined,
        waitlistId: waitlist.id,
        referrerFid: null,
        waitlistedAt: new Date(),
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
