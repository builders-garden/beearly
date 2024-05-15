"use client";
import { Button } from "@nextui-org/react";
import { PlusCircle } from "lucide-react";
import WaitlistTable from "../../components/WaitlistTable";
import { WaitlistDetail } from "../../components/WaitlistDetail";
import { useEffect, useState } from "react";
import { DynamicWidget, getAuthToken } from "@dynamic-labs/sdk-react-core";
import { Waitlist } from "@prisma/client";
import { useAccount } from "wagmi";
import { redirect } from "next/navigation";
import { CreateWaitlistModal } from "../../components/CreateWaitlistModal";

const Waitlists = () => {
  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
  const [selectedWaitlist, setSelectedWaitlist] = useState<Waitlist | null>();
  const [isOpen, setIsOpen] = useState(false);
  const jwt = getAuthToken();
  const { isConnected, isConnecting } = useAccount();
  useEffect(() => {
    if (jwt && isConnected) {
      fetch("/api/waitlists", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setWaitlists(data));
    }
  }, [jwt, isConnected]);

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-6xl font-bold">Your waitlists</div>
        <div className="flex flex-col p-24 items-center justify-center gap-4">
          <DynamicWidget
            innerButtonComponent={<Button>Login to view your waitlists</Button>}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-4 justify-between">
        <div className="text-6xl font-bold">Your waitlists</div>
        <Button
          size="lg"
          color="primary"
          className="font-semibold text-xl"
          onPress={() => {
            setIsOpen(true);
          }}
        >
          <PlusCircle />
          Create a new waitlist
        </Button>
      </div>
      <div className="flex flex-row gap-4">
        {
          // if there are no waitlists, show a message
          waitlists.length === 0 ? (
            <div className="flex flex-col mx-auto my-auto justify-center items-center gap-2 mt-24">
              <div className="text-2xl">You have no waitlists yet</div>
              <Button
                color="primary"
                className="w-fit"
                onPress={() => {
                  setIsOpen(true);
                }}
              >
                Create your first waitlist
              </Button>
            </div>
          ) : (
            <div className="w-[50%]">
              <WaitlistTable
                waitlists={waitlists}
                setSelectedWaitlist={setSelectedWaitlist}
              />
            </div>
          )
        }

        {selectedWaitlist && (
          <div className="w-[50%]">
            <WaitlistDetail waitlist={selectedWaitlist} />
          </div>
        )}
      </div>
      <CreateWaitlistModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
};

export default Waitlists;
