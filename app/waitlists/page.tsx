"use client";
import { Button } from "@nextui-org/react";
import { PlusCircle } from "lucide-react";
import WaitlistTable from "../../components/WaitlistTable";
import { Waitlist, WaitlistDetail } from "../../components/WaitlistDetail";
import { useState } from "react";

const waitlists: Waitlist[] = [
  {
    id: "1",
    name: "Waitlist 1",
    slug: "waitlist-1",
    images: [
      "https://placehold.co/512x512/EEE/31343C",
      "https://placehold.co/512x512/EEE/31343C",
    ],
    externalUrl: "https://google.it/",
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2022-01-02T00:00:00Z",
  },
  {
    id: "2",
    name: "Waitlist 2",
    slug: "waitlist-2",
    images: [
      "https://placehold.co/512x512/EEE/1445C8",
      "https://placehold.co/512x512/EEE/1445C8",
    ],
    externalUrl: "https://stringz.xyz",
    createdAt: "2022-01-03T00:00:00Z",
    updatedAt: "2022-01-04T00:00:00Z",
  },
];

const Waitlists = () => {
  const [selectedWaitlist, setSelectedWaitlist] = useState<Waitlist | null>(
    waitlists[0]!
  );
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-4 items-center">
        <div className="text-6xl font-bold">Your waitlists</div>
        <Button size="lg" color="primary" className="font-semibold text-xl">
          <PlusCircle />
          Create a new waitlist
        </Button>
      </div>
      <div className="flex flex-row gap-4">
        <div className="w-[50%]">
          <WaitlistTable
            waitlists={waitlists}
            setSelectedWaitlist={setSelectedWaitlist}
          />
        </div>
        {selectedWaitlist && (
          <div className="w-[50%]">
            <WaitlistDetail waitlist={selectedWaitlist} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Waitlists;
