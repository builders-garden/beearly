"use client";

import { Waitlist, WaitlistItem } from "./WaitlistItem";

export default function WaitlistList({ waitlists }: { waitlists: Waitlist[] }) {
  return (
    <div className="grid grid-cols-4 gap-8">
      {waitlists.map((waitlist) => (
        <WaitlistItem key={waitlist.id} waitlist={waitlist} />
      ))}
    </div>
  );
}
