"use client";

import { Spinner } from "@nextui-org/react";
import { Waitlist } from "@prisma/client";
import { useState, useEffect } from "react";
import { LeaderboardUser } from "../app/api/public/waitlists/[idOrSlug]/leaderboard/route";
import { ReferrersTable } from "./ReferrersTable";
import { BeearlyButton } from "./BeearlyButton";
import { ExternalLink } from "lucide-react";
import { createReferralCastIntent } from "../lib/warpcast";

export default function Leaderboard({
  waitlistSlug,
}: {
  waitlistSlug: string;
}) {
  const [waitlist, setWaitlist] = useState<Waitlist>();
  const [topReferrers, setTopReferrers] = useState<LeaderboardUser[]>();
  const [isWaitlistLoading, setIsWaitlstLoading] = useState(true);
  const [isTopReferrersLoading, setIsTopReferrersLoading] = useState(true);

  useEffect(() => {
    const fetchWaitlist = async () => {
      const response = await fetch(`/api/public/waitlists/${waitlistSlug}`);
      const data = await response.json();
      setWaitlist(data);
      setIsWaitlstLoading(false);
    };

    fetchWaitlist();
  }, [waitlistSlug]);

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
      <BeearlyButton
        text="Share and climb the leaderboard"
        icon={<ExternalLink size={16} />}
        iconPosition="right"
        link={createReferralCastIntent(waitlist!.name, waitlist!.slug)}
      />
    </div>
  );
}
