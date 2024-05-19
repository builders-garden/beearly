"use client";
import {
  Button,
  Card,
  CardBody,
  Image,
  Pagination,
  Spinner,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Edit, ExternalLink, ImageIcon, Link, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Waitlist, WaitlistedUser } from "@prisma/client";
import { BASE_FRAME_URL } from "../lib/constants";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import { UsersTable } from "./UsersTable";
import { EditWaitlistModal } from "./EditWaitlistModal";

// this is a card like element that displays a waitlist
export const WaitlistDetail = ({
  waitlist,
  setSelectedWaitlist,
  refetchWaitlists,
}: {
  waitlist: Waitlist;
  setSelectedWaitlist: (waitlist: Waitlist) => void;
  refetchWaitlists: () => void;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("list");
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<WaitlistedUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const jwt = getAuthToken();
  const { isConnected } = useAccount();
  const fetchUsers = useCallback(() => {
    setUsersLoading(true);
    fetch(`/api/waitlists/${waitlist.id}/users?page=${page - 1}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.results);
        setTotalPages(data.pages);
        setUsersLoading(false);
      });
  }, [jwt, waitlist, page]);
  useEffect(() => {
    if (jwt && isConnected) {
      fetchUsers();
    }
  }, [jwt, isConnected, fetchUsers, page]);
  return (
    <div className="flex flex-col border-2 border-gray-200 rounded-xl">
      <div className="flex flex-col p-4 gap-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-8 items-center">
            <div className="text-2xl font-semibold">{waitlist.name}</div>
          </div>
          <Button
            variant="light"
            className="text-gray-300"
            onPress={() => setIsEditModalOpen(true)}
          >
            <Edit />
            Edit
          </Button>
        </div>
      </div>
      <Tabs
        className="px-4"
        aria-label="tabs"
        variant="underlined"
        selectedKey={selected}
        color="primary"
        onSelectionChange={(value) => setSelected(value as string)}
      >
        <Tab
          key="list"
          title={`Waitlisted Users · ${
            (waitlist as any)?._count?.waitlistedUsers || 0
          }`}
        >
          {usersLoading ? (
            <div className="flex flex-row justify-center items-center p-16">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col">
              <UsersTable users={users} />
              <div className="flex flex-row justify-center items-center mb-4">
                <Pagination
                  isCompact
                  showControls
                  total={totalPages}
                  initialPage={1}
                  page={page}
                  onChange={setPage}
                  classNames={{
                    cursor: "text-black rounded-sm",
                  }}
                />
              </div>
            </div>
          )}
        </Tab>
        <Tab key="images" title="Images">
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-row gap-2 items-center w-full">
              <div className="flex flex-col gap-1 p-2 bg-gray-100 rounded-md">
                <div className="flex flex-row gap-2 items-center justify-center">
                  <ImageIcon size={16} className="text-gray-500" />
                  <div className="text-gray-500 text-sm">Landing image</div>
                </div>
                <Image
                  src={waitlist.imageLanding}
                  alt="waitlist-img"
                  className="w-[287px] h-[150px] rounded-lg"
                />
                <div className="w-full bg-gray-200 p-2 text-gray-400 rounded-md text-center">
                  Join Waitlist
                </div>
              </div>

              <div className="flex flex-col gap-1 p-2 bg-gray-100 rounded-md">
                <div className="flex flex-row gap-2 items-center justify-center">
                  <ImageIcon size={16} className="text-gray-500" />
                  <div className="text-gray-500 text-sm">Success image</div>
                </div>
                <Image
                  src={waitlist.imageSuccess}
                  alt="waitlist-img"
                  className="w-[287px] h-[150px] rounded-lg"
                />
                <div className="w-full bg-gray-200 p-2 text-gray-400 rounded-md text-center">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div>Learn more</div>
                    <ExternalLink size={16} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center w-full">
              <div className="flex flex-col gap-1 p-2 bg-gray-100 rounded-md">
                <div className="flex flex-row gap-2 items-center justify-center">
                  <ImageIcon size={16} className="text-gray-500" />
                  <div className="text-gray-500 text-sm">Landing image</div>
                </div>
                <Image
                  src={waitlist.imageNotEligible}
                  alt="waitlist-img"
                  className="w-[287px] h-[150px] rounded-lg"
                />
                <div className="w-full bg-gray-200 p-2 text-gray-400 rounded-md text-center">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div>Learn more</div>
                    <ExternalLink size={16} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-2 bg-gray-100 rounded-md">
                <div className="flex flex-row gap-2 items-center justify-center">
                  <ImageIcon size={16} className="text-gray-500" />
                  <div className="text-gray-500 text-sm">
                    Closed / Error image
                  </div>
                </div>
                <Image
                  src={waitlist.imageError}
                  alt="waitlist-img"
                  className="w-[287px] h-[150px] rounded-lg"
                />
                <div className="w-full bg-gray-200 p-2 text-gray-400 rounded-md text-center">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div>Learn more</div>
                    <ExternalLink size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
      <EditWaitlistModal
        isOpen={isEditModalOpen}
        waitlist={waitlist}
        onOpenChange={setIsEditModalOpen}
        setSelectedWaitlist={setSelectedWaitlist}
        refetchWaitlists={refetchWaitlists}
      />
    </div>
  );
};
