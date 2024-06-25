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

////////////////////////////////////////////////

// Punti totali Giulio: 105 = 35 + 25 + 45
// Giulio: 35 joined

// Mattia: 25 joined
// Limone: 45 joined
// ...

// Punti totali = 35 + (25 + 45)/ratio
// Giulio: 35 joined http://localhost:3000/w/mostro-di-scheggia?ref=4

// Mattia: 25 joined
// Limone: 45 joined
// ...

// joe = 50 + 10
// jim = 20 + 70
// jack = 40 + 0
// john = 0 + 40

// lista1 = [joe: 50, jim: 20, jack: 40]
// lista2 = [joe: 1000, jim: 7000, john: 4000]

// check for elements in lista2 that aren't in lista 1
// lista1 = [joe: 50, jim: 20, jack: 40, john: 40]
// lista2 = [joe: 10, jim: 70]

// sum lista1 & lista2
// for x in lista1
//   for y in lista2
//     if lista1.fid == lista2.referrerFid
//       x += y

////////////////////////////////////////////////
// async function getLeaderboard(prisma) {
//   // Fetch referrer counts
//   const referrerCounts = await prisma.waitlistedUser.groupBy({
//     by: ['referrerFid'],
//     _count: {
//       referrerFid: true,
//     },
//     where: {
//       referrerFid: {
//         not: null,
//       },
//     },
//   });

//   // Fetch referrerSquared counts and halve the counts
//   const referrerSquaredCounts = await prisma.waitlistedUser.groupBy({
//     by: ['referrerSquaredFid'],
//     _count: {
//       referrerSquaredFid: true,
//     },
//     where: {
//       referrerSquaredFid: {
//         not: null,
//       },
//     },
//   }).then(results => results.map(result => ({
//     ...result,
//     _count: { referrerSquaredFid: result._count.referrerSquaredFid * 0.5 },
//   })));

//   // Combine counts
//   const combinedCounts = {};
//   referrerCounts.forEach(({ referrerFid, _count }) => {
//     combinedCounts[referrerFid] = (_count.referrerFid || 0);
//   });
//   referrerSquaredCounts.forEach(({ referrerSquaredFid, _count }) => {
//     combinedCounts[referrerSquaredFid] = (_count.referrerSquaredFid || 0) + (combinedCounts[referrerSquaredFid] || 0);
//   });

////////////////////////////////////////////////

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
      // referralsSquared: referrer._count.referrerSquaredFid,
      ...referrerProfile,
    };
  });
  return NextResponse.json(mergedData);
};
