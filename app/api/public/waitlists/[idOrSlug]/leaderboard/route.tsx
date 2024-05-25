import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export interface LeaderboardUser {
  referrals: number;
  fid: number;
  displayName: string;
  username: string;
  avatarUrl: string;
  powerBadge: string;
}

export const GET = async (
  req: NextRequest,
  { params: { idOrSlug } }: { params: { idOrSlug: string } }
) => {
  const page = new URL(req.url).searchParams.get("page") || "0";
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
    skip: page ? parseInt(page) * parseInt(limit) : 0,
  });
  const referrers = await prisma.waitlistedUser.findMany({
    where: {
      fid: {
        in: topReferrers.map((r) => r.referrerFid!),
      },
    },
    select: {
      fid: true,
      displayName: true,
      username: true,
      avatarUrl: true,
      powerBadge: true,
      // Include any other fields you need
    },
  });
  const mergedData = topReferrers.map((referrer) => {
    const referrerProfile = referrers.find(
      (profile) => profile.fid === referrer.referrerFid
    );
    return {
      referrals: referrer._count.referrerFid,
      ...referrerProfile,
    };
  });
  return NextResponse.json(mergedData);
};
