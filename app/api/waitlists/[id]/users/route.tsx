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

  const waitlist = await prisma.waitlist.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!waitlist) {
    return NextResponse.json({
      message: "Waitlist not found",
    }, {
      status: 404,
    })
  }

  const totalItems = await prisma.waitlistedUser.count({
    where: {
      waitlistId: parseInt(id),
    },
  });
  const waitlistedUsers = await prisma.waitlistedUser.findMany({
    where: {
      waitlistId: parseInt(id),
    },
    take: parseInt(limit),
    skip: parseInt(page) * parseInt(limit),
    orderBy: {
      [orderBy]: orderDirection,
    },
  });

  return NextResponse.json({
    results: waitlistedUsers,
    pages: Math.ceil(totalItems / parseInt(limit)),
  });
};
