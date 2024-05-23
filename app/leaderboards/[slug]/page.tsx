"use client";
import { Spinner } from "@nextui-org/react";
import { Waitlist } from "@prisma/client";
import { useEffect, useState } from "react";
import { ReferrersTable } from "../../../components/ReferrersTable";
import { LeaderboardUser } from "../../api/public/waitlists/[idOrSlug]/leaderboard/route";
import { Metadata } from "next";
import prisma from "../../../lib/prisma";

const description = [
  "BUILD is a meme and a social game designed to reward builders via",
  "onchain nominations.",
].join(" ");

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      slug,
    },
  });
  const metadata: Metadata = {
    title: `Beearly - ${waitlist?.name} Leaderboard`,
    description: `Check out the top referrers on the ${waitlist?.name} waitlist.`,
    openGraph: {
      title: `Beearly - ${waitlist?.name} Leaderboard`,
      description: `Check out the top referrers on the ${waitlist?.name} waitlist.`,
      type: "website",
      url: "https://beearly.club",
      images: [waitlist?.imageLanding!],
    },
    twitter: {
      title: `Beearly - ${waitlist?.name} Leaderboard`,
      description: `Check out the top referrers on the ${waitlist?.name} waitlist.`,
      images: [waitlist?.imageLanding!],
    },
  };
  return {
    ...metadata,
  };
}

export default function PublicLeadearboardPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const [waitlist, setWaitlist] = useState<Waitlist>();
  const [topReferrers, setTopReferrers] = useState<LeaderboardUser[]>();
  const [isWaitlistLoading, setIsWaitlstLoading] = useState(true);
  const [isTopReferrersLoading, setIsTopReferrersLoading] = useState(true);

  useEffect(() => {
    const fetchWaitlist = async () => {
      const response = await fetch(`/api/public/waitlists/${slug}`);
      const data = await response.json();
      setWaitlist(data);
      setIsWaitlstLoading(false);
    };

    fetchWaitlist();
  }, [slug]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await fetch(
        `/api/public/waitlists/${waitlist!.id}/leaderboard?limit=10`
      );
      const data = await response.json();
      setTopReferrers(data);
      setIsTopReferrersLoading(false);
    };
    if (waitlist) {
      fetchLeaderboard();
    }
  }, [waitlist]);

  if (isWaitlistLoading || isTopReferrersLoading) {
    return (
      <div className="flex flex-col mx-auto my-auto justify-center items-center gap-2 mt-24">
        <Spinner />
        <div className="text-2xl">Loading leaderboard...</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center w-fit mx-auto">
      <div className="text-4xl font-bold">{waitlist!.name}</div>
      <div className="text-2xl font-semibold">
        Waitlist Referrals Leaderboard
      </div>
      {topReferrers?.length! > 0 && <ReferrersTable users={topReferrers!} />}
      {!topReferrers?.length! && (
        <div className="mt-16">No referrals activated so far.</div>
      )}
    </div>
  );
}
