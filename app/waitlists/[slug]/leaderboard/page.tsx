"use client";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import prisma from "../../../../lib/prisma";
import { Waitlist } from "@prisma/client";
import { useEffect, useState } from "react";

export default function PublicLeadearboardPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const [waitlist, setWaitlist] = useState<Waitlist>();
  const [topReferrers, setTopReferrers] = useState<any[]>();
  const [isWaitlistLoading, setIsWaitlstLoading] = useState(true);
  const [isTopReferrersLoading, setIsTopReferrersLoading] = useState(true);

  useEffect(() => {
    const fetchWaitlist = async () => {
      const response = await fetch(`/api/public/waitlists/${slug}`);
      const data = await response.json();
      setWaitlist(data);
      setIsWaitlstLoading(false);
    };
    const fetchLeaderboard = async () => {
      const response = await fetch(
        `/api/public/waitlists/${slug}/leaderboard?limit=10`
      );
      const data = await response.json();
      setTopReferrers(data);
      setIsTopReferrersLoading(false);
    };

    fetchWaitlist();
    fetchLeaderboard();
  }, [slug]);

  if (isWaitlistLoading || isTopReferrersLoading) {
    return (
      <div className="flex flex-col mx-auto my-auto justify-center items-center gap-2 mt-24">
        <Spinner />
        <div className="text-2xl">Loading leaderboard...</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-4xl font-bold">{waitlist!.name}</div>
      <div className="text-2xl font-semibold">Waitlist Top Referrers</div>

      {topReferrers && (
        <Table aria-label="Example static collection table" shadow="none">
          <TableHeader>
            <TableColumn>
              <div>Referrer FID</div>
            </TableColumn>
            <TableColumn>
              <div>Referrals</div>
            </TableColumn>
          </TableHeader>
          <TableBody>
            {topReferrers!.map((referrer, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div>{referrer.referrerFid}</div>
                </TableCell>
                <TableCell>
                  <div>{referrer._count.referrerFid}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
