import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export interface LeaderboardUser {
  referrals: number;
  referralsSquared: number;
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
      referrerSquaredFid: true,
    },
    orderBy: {
      _count: {
        referrerFid: "desc",
      },
    },
    take: limit ? parseInt(limit) : 500, // a sensible upper limit? consider we have to sort
    skip: page ? parseInt(page) * parseInt(limit) : 0,
  });

  const top10 = topReferrers
    .sort(
      (a, b) =>
        b._count.referrerFid +
        b._count.referrerSquaredFid -
        (a._count.referrerFid + a._count.referrerSquaredFid)
    )
    .slice(0, 10);

  const referrers = await prisma.waitlistedUser.findMany({
    where: {
      fid: {
        in: top10.map((r) => r.referrerFid!),
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
  const mergedData = top10.map((referrer) => {
    const referrerProfile = referrers.find(
      (profile) => profile.fid === referrer.referrerFid
    );
    return {
      referrals: referrer._count.referrerFid,
      referralsSquared: referrer._count.referrerSquaredFid,
      ...referrerProfile,
    };
  });
  return NextResponse.json(mergedData);
};
