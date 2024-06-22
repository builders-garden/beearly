"use client";
import {
  Button,
  Checkbox,
  Image,
  Input,
  Link,
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
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Waitlist,
  WaitlistRequirement,
  WaitlistRequirementType,
  WaitlistedUser,
} from "@prisma/client";
import { BASE_FRAME_URL, BASE_URL } from "../lib/constants";
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
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("list");
  const [isCopied, setIsCopied] = useState<boolean>(false);
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
  const requiredUsersFollow =
    waitlist.waitlistRequirements
      ?.filter((r) => r.type === WaitlistRequirementType.USER_FOLLOW)
      ?.map((r) => r.value)
      ?.join(",") || "";

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
        <Tab
          key="list"
          title={`Waitlisted Users · ${
            (waitlist as any)._count?.waitlistedUsers || 0
          }`}
        >
          <UsersTable waitlistTier={waitlist.tier} waitlistId={waitlist.id} />
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
                  <div className="text-gray-500 text-sm">
                    Not eligible image
                  </div>
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
                <div className="text-sm text-gray-500">Follow Users</div>
                <Input
                  type="text"
                  variant={"bordered"}
                  value={requiredUsersFollow}
                  isDisabled
                />
                <div className="text-xs text-gray-500">
                  Comma separated list of usernames that the users must follow
                  to be eligible
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 w-full">
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
    </div>
  );
};
