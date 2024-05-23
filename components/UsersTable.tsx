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
} from "@nextui-org/react";
import { WaitlistedUser } from "@prisma/client";
import {
  ExternalLink,
  MessageCircleIcon,
  MessageSquareShare,
} from "lucide-react";
import Link from "next/link";

export const UsersTable = ({ users }: { users: WaitlistedUser[] }) => {
  return (
    <Table aria-label="Example static collection table" shadow="none">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>FID</TableColumn>
        <TableColumn>DATE</TableColumn>
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
                  <div className="text-sm text-gray-500">@{user.username}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>{user.fid}</TableCell>
            <TableCell>{new Date(user.waitlistedAt).toDateString()}</TableCell>
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
  );
};
