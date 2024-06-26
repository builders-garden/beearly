import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Button,
  Image,
  Tooltip,
  Spinner,
  Checkbox,
  Pagination,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { WaitlistTier, WaitlistedUser } from "@prisma/client";
import { count } from "console";
import {
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  InfoIcon,
  PlusCircle,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import BroadcastDCModal from "./BroadcastDCModal";
import { AddWaitlistedUsersModal } from "./AddWaitlistedUsersModal";
import { TIERS } from "../lib/constants";

enum OrderByMode {
  WAITLISTED_AT = "waitlistedAt",
  REFERRALS = "referrals",
  FOLLOWERS = "followerCount",
  FOLLOWING = "followingCount",
  SOCIAL_CAPITAL_SCORE = "socialCapitalScore",
  SOCIAL_CAPITAL_RANK = "socialCapitalRank",
}

export const UsersTable = ({
  waitlistId,
  waitlistTier,
}: {
  waitlistId: number;
  waitlistTier: WaitlistTier;
}) => {
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] =
    useState<boolean>(false);
  const [isAddUsersModalOpen, setIsAddUsersModalOpen] =
    useState<boolean>(false);
  const [isPowerBadgeOnly, setIsPowerBadgeOnly] = useState<boolean>(false);
  const [limit, setLimit] = useState(new Set(["10"]));
  const [orderBy, setOrderBy] = useState<string>("waitlistedAt");
  const [orderDirection, setOrderDirection] = useState<string>("desc");
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<WaitlistedUser[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [powerBadgeUsersCount, setPowerBadgeUsersCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const jwt = getAuthToken();
  const { isConnected } = useAccount();
  const exportUsers = useCallback(() => {
    fetch(`/api/waitlists/${waitlistId}/users/export`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users.csv";
        a.click();
      });
  }, [waitlistId, jwt]);
  const selectedlimit = useMemo(
    () => Array.from(limit).join(", ").replaceAll("_", " "),
    [limit]
  );
  const fetchUsers = useCallback(() => {
    setUsersLoading(true);
    let url = `/api/waitlists/${waitlistId}/users?page=${page - 1}&orderBy=${orderBy}&orderDirection=${orderDirection}&limit=${selectedlimit}`;
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
        setTotalCount(data.count);
        setPowerBadgeUsersCount(data.powerBadgeUsersCount);
        setUsersLoading(false);
      });
  }, [
    waitlistId,
    page,
    orderBy,
    orderDirection,
    selectedlimit,
    isPowerBadgeOnly,
    jwt,
  ]);
  useEffect(() => {
    if (jwt && isConnected) {
      fetchUsers();
    }
  }, [jwt, isConnected, fetchUsers, page]);

  if (usersLoading && !users.length) {
    return (
      <div className="flex flex-row justify-center items-center p-16">
        <Spinner />
      </div>
    );
  }

  const toggleOrderBy = (mode: OrderByMode) => {
    setOrderBy(mode);
    setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between items-center px-4 ">
        <div className="flex flex-row items-center gap-4">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="capitalize">
                {selectedlimit} <ChevronDown size={16} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="limit selector"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={limit}
              onSelectionChange={setLimit as any}
            >
              <DropdownItem key="10">10</DropdownItem>
              <DropdownItem key="25">25</DropdownItem>
              <DropdownItem key="50">50</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div>
            <Checkbox
              isSelected={isPowerBadgeOnly}
              onChange={() => setIsPowerBadgeOnly(!isPowerBadgeOnly)}
            />
            Power Badge only ({powerBadgeUsersCount}/{totalCount})
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Button
            color="primary"
            className="text-primary"
            variant="flat"
            onPress={() => setIsBroadcastModalOpen(true)}
          >
            <Send size={16} />
            Broadcast
          </Button>
          <Button
            color="primary"
            variant="flat"
            onPress={() => setIsAddUsersModalOpen(true)}
          >
            <PlusCircle size={16} />
            Add users
          </Button>
          <Tooltip
            isDisabled={TIERS[waitlistTier].allowExportUsers}
            content="This feature is only available for Honey tier and above."
          >
            <Button
              color="primary"
              variant="flat"
              onPress={() => {
                if (!TIERS[waitlistTier].allowExportUsers) {
                  return;
                }
                exportUsers();
              }}
              // isDisabled={waitlistTier === WaitlistTier.FREE}
            >
              <Download size={16} />
              Export users
            </Button>
          </Tooltip>
        </div>
      </div>
      <Table aria-label="Example static collection table" shadow="none">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>
            <div
              className="flex flex-row gap-1 items-center cursor-pointer"
              onClick={() => toggleOrderBy(OrderByMode.REFERRALS)}
            >
              <div>REFERRALS</div>
              {orderBy === OrderByMode.REFERRALS ? (
                orderDirection === "asc" ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )
              ) : (
                <div></div>
              )}
            </div>
          </TableColumn>
          <TableColumn>
            <div
              className="flex flex-row gap-1 items-center cursor-pointer"
              onClick={() => toggleOrderBy(OrderByMode.FOLLOWERS)}
            >
              <div>FOLLOWERS</div>
              {orderBy === OrderByMode.FOLLOWERS ? (
                orderDirection === "asc" ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )
              ) : (
                <div></div>
              )}
            </div>
          </TableColumn>
          <TableColumn>
            <div
              className="flex flex-row gap-1 items-center cursor-pointer"
              onClick={() => toggleOrderBy(OrderByMode.FOLLOWING)}
            >
              <div>FOLLOWING</div>
              {orderBy === OrderByMode.FOLLOWING ? (
                orderDirection === "asc" ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )
              ) : (
                <div></div>
              )}
            </div>
          </TableColumn>
          <TableColumn>
            <div className="cursor-pointer flex flex-row gap-1 items-center">
              <div
                className="flex flex-row gap-1 items-center cursor-pointer"
                onClick={() => toggleOrderBy(OrderByMode.SOCIAL_CAPITAL_SCORE)}
              >
                <div>SOCIAL SCORE</div>
                {orderBy === OrderByMode.SOCIAL_CAPITAL_SCORE ? (
                  orderDirection === "asc" ? (
                    <ChevronUp size={12} />
                  ) : (
                    <ChevronDown size={12} />
                  )
                ) : (
                  <div></div>
                )}
              </div>
              <Tooltip
                radius="sm"
                size="sm"
                content={
                  <div>
                    Social Capital Scores (SCS) area measure of each Farcaster{" "}
                    <br></br>user&apos;s influence in the network.{" "}
                    <Link
                      href={
                        "https://docs.airstack.xyz/airstack-docs-and-faqs/farcaster/farcaster/social-capital"
                      }
                      target="_blank"
                    >
                      <span className="font-bold">
                        Click here to learn more.
                      </span>
                    </Link>
                  </div>
                }
              >
                <InfoIcon size={14} />
              </Tooltip>
            </div>
          </TableColumn>
          <TableColumn>
            <div className="cursor-pointer flex flex-row gap-1 items-center">
              <div
                className="flex flex-row gap-1 items-center cursor-pointer"
                onClick={() => toggleOrderBy(OrderByMode.SOCIAL_CAPITAL_RANK)}
              >
                <div>SOCIAL RANK</div>
                {orderBy === OrderByMode.SOCIAL_CAPITAL_RANK ? (
                  orderDirection === "asc" ? (
                    <ChevronUp size={12} />
                  ) : (
                    <ChevronDown size={12} />
                  )
                ) : (
                  <div></div>
                )}
              </div>
              <Tooltip
                radius="sm"
                size="sm"
                content={
                  <div>
                    Social Capital Scores (SCS) area measure of each Farcaster{" "}
                    <br></br>user&apos;s influence in the network.{" "}
                    <Link
                      href={
                        "https://docs.airstack.xyz/airstack-docs-and-faqs/farcaster/farcaster/social-capital"
                      }
                      target="_blank"
                    >
                      <span className="font-bold">
                        Click here to learn more.
                      </span>
                    </Link>
                  </div>
                }
              >
                <InfoIcon size={14} />
              </Tooltip>
            </div>
          </TableColumn>
          <TableColumn>
            <div
              className="flex flex-row gap-1 items-center cursor-pointer"
              onClick={() => toggleOrderBy(OrderByMode.WAITLISTED_AT)}
            >
              <div>DATE</div>
              {orderBy === OrderByMode.WAITLISTED_AT ? (
                orderDirection === "asc" ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )
              ) : (
                <div></div>
              )}
            </div>
          </TableColumn>
          <TableColumn>
            <div></div>
          </TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.fid} className="cursor-pointer">
              <TableCell>
                <Link
                  href={`https://warpcast.com/${user.username}`}
                  target="_blank"
                >
                  <div className="flex flex-row gap-2 items-center cursor-pointer">
                    <Image
                      radius="full"
                      src={user.avatarUrl!}
                      alt="user-image"
                      className="h-8 w-8"
                    />
                    <div className="flex flex-col">
                      <div className="flex flex-row items-center gap-1">
                        <div>{user.displayName}</div>
                        {user.powerBadge && (
                          <Image
                            src="/power-badge.png"
                            className="h-3 w-3"
                            radius="full"
                            alt="power-badge"
                          />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        @{user.username} • #{user.fid}
                      </div>
                    </div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>{(user as any)?._count?.referrals}</TableCell>
              <TableCell>{user.followerCount}</TableCell>
              <TableCell>{user.followingCount}</TableCell>
              <TableCell>{user.socialCapitalScore}</TableCell>
              <TableCell>{user.socialCapitalRank}</TableCell>
              <TableCell>
                {new Date(user.waitlistedAt).toDateString()}
              </TableCell>
              <TableCell>
                <Link
                  href={`https://warpcast.com/${user.username}`}
                  target="_blank"
                >
                  <Image
                    className="h-4 w-4"
                    src="/warpcast-logo.svg"
                    alt="warpcast-logo"
                    radius="none"
                  />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
      <BroadcastDCModal
        isOpen={isBroadcastModalOpen}
        onOpenChange={setIsBroadcastModalOpen}
        waitlistId={waitlistId}
        waitlistTier={waitlistTier}
      />
      <AddWaitlistedUsersModal
        onOpenChange={setIsAddUsersModalOpen}
        isOpen={isAddUsersModalOpen}
        waitlistId={waitlistId}
        refetchUsers={fetchUsers}
      />
    </div>
  );
};
