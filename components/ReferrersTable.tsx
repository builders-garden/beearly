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
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { LeaderboardUser } from "../app/api/public/waitlists/[idOrSlug]/leaderboard/route";

export const ReferrersTable = ({ users }: { users: LeaderboardUser[] }) => {
  return (
    <Table aria-label="Example static collection table" shadow="none">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>FID</TableColumn>
        <TableColumn>#REFERRALS</TableColumn>
        <TableColumn>#REFERRALS^2</TableColumn>
        <TableColumn>
          <div></div>
        </TableColumn>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.fid}>
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
            <TableCell>{user.referrals}</TableCell>
            <TableCell>{user.referralsSquared}</TableCell>
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
