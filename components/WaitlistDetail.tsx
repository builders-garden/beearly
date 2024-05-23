"use client";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Image,
  Input,
  Link,
  Pagination,
  Spinner,
  Tab,
  Tabs,
  Tooltip,
} from "@nextui-org/react";
import {
  CheckCircleIcon,
  CopyCheck,
  CopyIcon,
  Edit,
  ExternalLink,
  ImageIcon,
  LinkIcon,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Waitlist,
  WaitlistRequirement,
  WaitlistRequirementType,
  WaitlistedUser,
} from "@prisma/client";
import { BASE_FRAME_URL, BASE_URL } from "../lib/constants";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import { UsersTable } from "./UsersTable";
import { EditWaitlistModal } from "./EditWaitlistModal";

export type WaitlistWithRequirements = Waitlist & {
  waitlistRequirements: WaitlistRequirement[];
};
// this is a card like element that displays a waitlist
export const WaitlistDetail = ({
  waitlist,
  setSelectedWaitlist,
  refetchWaitlists,
}: {
  waitlist: WaitlistWithRequirements;
  setSelectedWaitlist: (waitlist: WaitlistWithRequirements) => void;
  refetchWaitlists: () => void;
}) => {
  const [isPowerBadgeOnly, setIsPowerBadgeOnly] = useState<boolean>(false);
  const [count, setCount] = useState<number>(
    (waitlist as any)?._count?.waitlistedUsers
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("list");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<WaitlistedUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const jwt = getAuthToken();
  const { isConnected } = useAccount();
  const fetchUsers = useCallback(() => {
    setUsersLoading(true);
    let url = `/api/waitlists/${waitlist.id}/users?page=${page - 1}`;
    if (isPowerBadgeOnly) {
      url += "&powerBadge=true";
    }
    fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.results);
        setTotalPages(data.pages);
        setCount(data.count._all);
        setUsersLoading(false);
      });
  }, [waitlist.id, page, isPowerBadgeOnly, jwt]);
  useEffect(() => {
    if (jwt && isConnected) {
      fetchUsers();
    }
  }, [jwt, isConnected, fetchUsers, page]);
  const copyWaitlistFrameLink = () => {
    navigator.clipboard.writeText(`${BASE_FRAME_URL}/${waitlist.slug}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const requiredChannels = waitlist.waitlistRequirements
    ?.filter((r) => r.type === WaitlistRequirementType.CHANNEL_FOLLOW)
    ?.map((r) => r.value)
    ?.join(",");
  const isPowerBadgeRequired =
    waitlist.waitlistRequirements?.find(
      (r) => r.type === WaitlistRequirementType.POWER_BADGE
    )?.value || false;
  return (
    <div className="flex flex-col border-2 border-gray-200 rounded-xl h-lvh">
      <div className="flex flex-col px-4 py-2 gap-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-8 items-center">
            <div className="text-2xl font-semibold">{waitlist.name}</div>
          </div>
          <Button
            variant="light"
            className="text-gray-500"
            onPress={() => setIsEditModalOpen(true)}
          >
            <Edit />
            Edit
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row px-4 items-center gap-2">
          <div className="text-sm">Frame URL:</div>
          <div className="text-sm font-semibold">{`${BASE_FRAME_URL}/${waitlist.slug}`}</div>
          {isCopied ? (
            <CopyCheck size={12} className="text-success" />
          ) : (
            <CopyIcon
              size={12}
              className="text-primary cursor-pointer"
              onClick={copyWaitlistFrameLink}
            />
          )}
        </div>
        <div className="flex flex-row px-4 items-center gap-2">
          <div className="text-sm">Leaderboard URL:</div>
          <div className="text-sm font-semibold">{`${BASE_URL}/leaderboards/${waitlist.slug}`}</div>
          <Link href={`/leaderboards/${waitlist.slug}`} target="_blank">
            <ExternalLink size={12} />
          </Link>
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
        <Tab key="list" title={`Waitlisted Users · ${count || 0}`}>
          {usersLoading ? (
            <div className="flex flex-row justify-center items-center p-16">
              <Spinner />
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex flex-row px-4">
                <Checkbox
                  isSelected={isPowerBadgeOnly}
                  onChange={() => setIsPowerBadgeOnly(!isPowerBadgeOnly)}
                />
                Power Badge only ({count})
              </div>
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
                  <div className="text-gray-500 text-sm">Closed image</div>
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
        <Tab key="requirements" title="Requirements">
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-row gap-4 w-full">
              <div className="flex flex-col gap-1 w-[50%]">
                <div className="text-sm text-gray-500">Follow Channel IDs</div>
                <Input
                  type="text"
                  variant={"bordered"}
                  value={requiredChannels}
                  isDisabled
                />
                <div className="text-xs text-gray-500">
                  Comma separated list of channel IDs that the users must follow
                  to be eligible
                </div>
              </div>
              <div className="flex flex-col gap-1 w-[50%]">
                <div className="text-sm text-gray-500">Power Badge</div>
                <Checkbox
                  isSelected={isPowerBadgeRequired === "true"}
                  isDisabled
                >
                  Power Badge required
                </Checkbox>

                <div className="text-xs text-gray-500">
                  Users must have a Warpcast power badge to be eligible
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
      <EditWaitlistModal
        isOpen={isEditModalOpen}
        waitlist={
          waitlist as Waitlist & { waitlistRequirements: WaitlistRequirement[] }
        }
        onOpenChange={setIsEditModalOpen}
        setSelectedWaitlist={setSelectedWaitlist}
        refetchWaitlists={refetchWaitlists}
      />
    </div>
  );
};
