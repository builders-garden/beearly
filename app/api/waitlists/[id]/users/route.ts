import { NextRequest, NextResponse } from "next/server";
import {
  fetchFarcasterProfiles,
  UserProfile,
} from "../../../../../lib/airstack";
import prisma from "../../../../../lib/prisma";

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
    const { fids }: { fids: number[] } = body;

    // Query the database for existing WaitlistedUser entries with the provided fids
    const existingUsers = await prisma.waitlistedUser.findMany({
      where: {
        fid: {
          in: fids,
        },
      },
      select: {
        fid: true,
      },
    });

    // Extracting the fids of existing users
    const existingFids = new Set(existingUsers.map((user) => user.fid));

    // Filter out the fids that are already in the database
    const fidsNotInDatabase = fids.filter((fid) => !existingFids.has(fid));

    // Transforming the fids not in db array to a string array to satisfy the Airstack query
    const fidsString = fidsNotInDatabase.map((fid) => fid.toString());

    // Calling Airstack API many times to get all users' profiles
    const newUsers: UserProfile[] = [];
    let pointer = "";

    do {
      const res = await fetchFarcasterProfiles(fidsString, pointer);
      if (res) {
        const { profiles, pageInfo } = res;
        newUsers.push(...profiles);
        pointer = pageInfo.nextCursor;
      }
    } while (pointer);

    // Bulk insert new users
    const result = await prisma.waitlistedUser.createMany({
      data: newUsers.map((user) => ({
        waitlistId: parseInt(id),
        fid: parseInt(user.userId!),
        address: user.userAddress,
        displayName: user.profileDisplayName ?? "",
        username: user.profileName ?? "",
        avatarUrl: user.profileImage ?? "",
        powerBadge: user.isFarcasterPowerUser,
        waitlistedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
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
