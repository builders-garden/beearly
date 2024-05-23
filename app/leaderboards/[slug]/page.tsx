"use client";
import { Spinner } from "@nextui-org/react";
import { Waitlist } from "@prisma/client";
import { useEffect, useState } from "react";
import { ReferrersTable } from "../../../components/ReferrersTable";
import { LeaderboardUser } from "../../api/public/waitlists/[idOrSlug]/leaderboard/route";

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
