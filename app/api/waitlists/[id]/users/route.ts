import { NextRequest, NextResponse } from "next/server";
import {
  fetchFarcasterProfiles,
  UserProfile,
} from "../../../../../lib/airstack";
import prisma from "../../../../../lib/prisma";
import { formatAirstackUserData } from "../../../../../lib/airstack/utils";
import { TIERS } from "../../../../../lib/constants";

export const GET = async (
  req: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) => {
  const address = req.headers.get("x-address")!;

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "10";
  const page = searchParams.get("page") || "0";
  const orderBy = searchParams.get("orderBy") || "waitlistedAt";
  const orderDirection = searchParams.get("orderDirection") || "desc";
  const powerBadge = searchParams.get("powerBadge") || "";

  const waitlist = await prisma.waitlist.findUnique({
    where: {
      id: parseInt(id),
      userAddress: address,
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

  const [totalCount, powerBadgeCount] = await Promise.all([
    prisma.waitlistedUser.count({
      where: {
        waitlistId: parseInt(id),
      },
    }),
    prisma.waitlistedUser.count({
      where: {
        waitlistId: parseInt(id),
        powerBadge: true,
      },
    }),
  ]);
  const waitlistedUsers = await prisma.waitlistedUser.findMany({
    where: {
      waitlistId: parseInt(id),
      ...(powerBadge.toString().length > 0 && {
        powerBadge: powerBadge === "true",
      }),
    },
    take: parseInt(limit),
    skip: parseInt(page) * parseInt(limit),
    orderBy: {
      ...(orderBy === "referrals"
        ? {
            referrals: {
              _count: orderDirection as "asc" | "desc",
            },
          }
        : { [orderBy]: orderDirection }),
    },
    include: {
      referrals: true,
      _count: {
        select: {
          referrals: true,
        },
      },
    },
  });

  const finalCount = powerBadge === "true" ? powerBadgeCount : totalCount;

  return NextResponse.json({
    results: waitlistedUsers,
    pages: Math.ceil(finalCount / parseInt(limit)),
    count: finalCount,
    powerBadgeUsersCount: powerBadgeCount,
  });
};

export const POST = async (
  req: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) => {
  try {
    // Get the address from the request headers
    const address = req.headers.get("x-address")!;

    // Find the waitlist associated with the id and the address
    const waitlist = await prisma.waitlist.findUnique({
      where: {
        id: parseInt(id),
        userAddress: address,
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

    if (waitlist._count.waitlistedUsers >= TIERS[waitlist.tier].size) {
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
        waitlistId: parseInt(id),
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
        waitlistId: parseInt(id),
        waitlistedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      ...usersInDatabase.map((user) => ({
        ...user,
        id: undefined,
        waitlistId: parseInt(id),
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
