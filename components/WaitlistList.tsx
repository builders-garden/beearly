"use client";

import Link from "next/link";
import { Waitlist, WaitlistItem } from "./WaitlistItem";

export default function WaitlistList({ waitlists }: { waitlists: Waitlist[] }) {
  return (
    <div className="grid grid-cols-4 gap-8">
      {waitlists.map((waitlist) => (
        <Link href={`/waitlists/${waitlist.slug}`} key={waitlist.id}>
          <WaitlistItem waitlist={waitlist} />
        </Link>
      ))}
    </div>
  );
}
