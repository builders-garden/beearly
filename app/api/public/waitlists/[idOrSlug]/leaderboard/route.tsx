import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export const GET = async (
  req: NextRequest,
  { params: { idOrSlug } }: { params: { idOrSlug: string } }
) => {
  const limit = new URL(req.url).searchParams.get("limit") || "10";
  const topReferrers = await prisma.waitlistedUser.groupBy({
    by: ["referrerFid"],
    where: {
      waitlistId: parseInt(idOrSlug),
      referrerFid: {
        not: null,
      },
    },
    _count: {
      referrerFid: true,
    },
    orderBy: {
      _count: {
        referrerFid: "desc",
      },
    },
    take: limit ? parseInt(limit) : 10,
  });
  return NextResponse.json(topReferrers);
};
