import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export const GET = async (
  req: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) => {
  const address = req.headers.get("x-address");

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "10";
  const page = searchParams.get("page") || "0";
  const orderBy = searchParams.get("orderBy") || "waitlistedAt";
  const orderDirection = searchParams.get("orderDirection") || "desc";
  const powerBadge = searchParams.get("powerBadge") || "";

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
