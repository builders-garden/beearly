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
} from "@nextui-org/react";
import { WaitlistedUser } from "@prisma/client";
import { count } from "console";
import { ChevronDown, ChevronUp, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { useAccount } from "wagmi";
import BroadcastDCModal from "./BroadcastDCModal";

enum OrderByMode {
  WAITLISTED_AT = "waitlistedAt",
  REFERRALS = "referrals",
}

export const UsersTable = ({ waitlistId }: { waitlistId: number }) => {
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] =
    useState<boolean>(false);
  const [isPowerBadgeOnly, setIsPowerBadgeOnly] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>("waitlistedAt");
  const [orderDirection, setOrderDirection] = useState<string>("desc");
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<WaitlistedUser[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
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
  const fetchUsers = useCallback(() => {
    setUsersLoading(true);
    let url = `/api/waitlists/${waitlistId}/users?page=${
      page - 1
    }&orderBy=${orderBy}&orderDirection=${orderDirection}`;
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
        setTotalCount(data.count._all);
        setUsersLoading(false);
      });
  }, [waitlistId, page, orderBy, orderDirection, isPowerBadgeOnly, jwt]);
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
      <div className="flex flex-row justify-between items-center px-4 justify-between ">
        <div className="flex flex-row items-center">
        <div>
            <Checkbox
              isSelected={isPowerBadgeOnly}
              onChange={() => setIsPowerBadgeOnly(!isPowerBadgeOnly)}
            />
            Power Badge only ({totalCount})
        </div>
        <Button
          color="primary"
          className="text-primary"
          variant="flat"
          onPress={() => setIsBroadcastModalOpen(true)}
        >
          Send Broadcast DC
        </Button>
        </div>
        <Button color="primary" variant="flat" onPress={exportUsers}>
          <Download size={16} />
          Export users
        </Button>
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
          <TableColumn>
            <div></div>
          </TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.fid} className="cursor-pointer">
              <TableCell>
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    radius="full"
                    src={user.avatarUrl!}
                    alt="user-image"
                    className="h-8 w-8"
                  />
                  <div className="flex flex-row items-center gap-2">
                    <div className="text-sm">
                      {user.displayName.length > 20
                        ? `${user.displayName.substring(0, 20)}...`
                        : `${user.displayName}`}
                    </div>
                    {user.powerBadge && (
                      <Image
                        src="/power-badge.png"
                        className="h-4 w-4"
                        radius="full"
                        alt="power-badge"
                      />
                    )}
                    <div className="text-sm text-gray-500">
                      @{user.username}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{(user as any)?._count?.referrals}</TableCell>
              <TableCell>
                {new Date(user.waitlistedAt).toDateString()}
              </TableCell>
              <TableCell>
                <Tooltip
                  key={"tooltip-" + user.fid}
                  className="cursor-none"
                  radius="sm"
                  content={
                    <div className="flex flex-row items-center gap-2">
                      <Image
                        className="h-4 w-4"
                        src="/warpcast-logo.svg"
                        alt="warpcast-logo"
                        radius="none"
                      />
                      <div>Soon Warpcast Direct Cast integration!</div>
                    </div>
                  }
                >
                  <div className="opacity-40">
                    <Image
                      className="h-4 w-4"
                      src="/warpcast-logo.svg"
                      alt="warpcast-logo"
                      radius="none"
                    />
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Link
                  href={`https://warpcast.com/${user.username}`}
                  target="_blank"
                >
                  <ExternalLink size={16} />
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
      />
    </div>
  );
};
