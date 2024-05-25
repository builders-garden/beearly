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

  const totalItems = await prisma.waitlistedUser.count({
    select: {
      _all: true,
      powerBadge: true,
    },
    where: {
      waitlistId: parseInt(id),
    },
  });
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

  return NextResponse.json({
    results: waitlistedUsers,
    pages:
      powerBadge === "true"
        ? Math.ceil(totalItems.powerBadge / parseInt(limit))
        : Math.ceil(totalItems._all / parseInt(limit)),
    count: totalItems,
  });
};
