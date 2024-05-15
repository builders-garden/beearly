"use client";
import { Button } from "@nextui-org/react";
import { PlusCircle } from "lucide-react";
import WaitlistTable from "../../components/WaitlistTable";
import { WaitlistDetail } from "../../components/WaitlistDetail";
import { useState } from "react";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { Waitlist } from "@prisma/client";

const Waitlists = () => {
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [selectedWaitlist, setSelectedWaitlist] = useState<Waitlist | null>();
  const jwt = getAuthToken();
  console.log(jwt);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-4 justify-between">
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
