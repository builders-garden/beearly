"use client";
import { Button, Image, Spinner } from "@nextui-org/react";
import WaitlistTable from "../../components/WaitlistTable";
import {
  WaitlistDetail,
  WaitlistWithRequirements,
} from "../../components/WaitlistDetail";
import { useCallback, useEffect, useState } from "react";
import { DynamicWidget, getAuthToken } from "@dynamic-labs/sdk-react-core";
import { Waitlist } from "@prisma/client";
import { useAccount } from "wagmi";
import { CreateWaitlistModal } from "../../components/CreateWaitlistModal";
import { BeearlyButton } from "../../components/BeearlyButton";
import { PlusSquare } from "lucide-react";

const Waitlists = () => {
  const [waitlists, setWaitlists] = useState<WaitlistWithRequirements[]>([]);
  const [selectedWaitlist, setSelectedWaitlist] =
    useState<WaitlistWithRequirements | null>();
  const [isOpen, setIsOpen] = useState(false);
  const jwt = getAuthToken();
  const [waitlistsLoading, setWaitlistsLoading] = useState(true);
  const { isConnected } = useAccount();
  const fetchWaitlists = useCallback(() => {
    setWaitlistsLoading(true);
    fetch("/api/waitlists", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setWaitlists(data);
        setWaitlistsLoading(false);
      });
  }, [jwt]);
  useEffect(() => {
    if (jwt && isConnected) {
      fetchWaitlists();
    }
  }, [jwt, isConnected, fetchWaitlists]);

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-3xl font-bold">Waitlists</div>
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
        <div className="text-4xl font-medium">Waitlists</div>
        <BeearlyButton
          onPress={() => {
            setIsOpen(true);
          }}
          icon={
            <div className="rounded-2xl">
              <PlusSquare
                radius={"lg"}
                fill="black"
                className="text-primary rounded-xl"
                size={24}
              />
            </div>
          }
          text="New waitlist"
        />
      </div>
      {
        // if waitlists are loading, show a loading message
        waitlistsLoading ? (
          <div className="flex flex-col mx-auto my-auto justify-center items-center gap-2 mt-24">
            <Spinner />
            <div className="text-2xl">Loading your waitlists...</div>
          </div>
        ) : (
          <div className="flex flex-row gap-4 h-svh">
            {
              // if there are no waitlists, show a message
              waitlists.length === 0 ? (
                <div className="flex flex-col mx-auto my-auto justify-center items-center gap-4 mt-24">
                  <Image
                    src="/empty-waitlists.png"
                    alt="empty-state"
                    width={200}
                  />
                  <div className="flex flex-col gap-2 justify-center text-center">
                    <div className="text-2xl font-semibold text-center">
                      You don&apos;t have any waitlist
                    </div>
                    <div className="text-lg text-gray-400">
                      Create your first waitlist and publish it, we all need to
                      Beearly!
                    </div>
                  </div>
                  <BeearlyButton
                    onPress={() => {
                      setIsOpen(true);
                    }}
                    icon={
                      <div className="rounded-2xl">
                        <PlusSquare
                          radius={"lg"}
                          fill="black"
                          className="text-primary rounded-xl"
                          size={24}
                        />
                      </div>
                    }
                    text="New waitlist"
                  />
                </div>
              ) : (
                <div className="w-[50%] border-2 border-gray-200 rounded-xl">
                  {!waitlistsLoading && (
                    <WaitlistTable
                      waitlists={waitlists}
                      setSelectedWaitlist={setSelectedWaitlist}
                    />
                  )}
                </div>
              )
            }

            {selectedWaitlist && !waitlistsLoading && (
              <div className="w-[50%]">
                <WaitlistDetail
                  waitlist={selectedWaitlist}
                  setSelectedWaitlist={setSelectedWaitlist}
                  refetchWaitlists={fetchWaitlists}
                />
              </div>
            )}
          </div>
        )
      }

      <CreateWaitlistModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        refetchWaitlists={fetchWaitlists}
      />
    </div>
  );
};

export default Waitlists;
