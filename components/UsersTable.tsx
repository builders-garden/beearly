import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Button,
  Image,
} from "@nextui-org/react";
import { User, Edit } from "lucide-react";

export interface User {
  displayName: string;
  username: string;
  avatarUrl: string;
  powerBadge?: boolean;
  fid: string;
  date: string;
}

export const UsersTable = ({ users }: { users: User[] }) => {
  return (
    <Table aria-label="Example static collection table" shadow="none">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>FID</TableColumn>
        <TableColumn>DATE</TableColumn>
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
                  src={user.avatarUrl}
                  alt="user-image"
                  className="h-8 w-8"
                />
                <div className="flex flex-row items-center gap-2">
                  <div className="text-sm">
                    {user.displayName.length > 20
                      ? `${user.displayName.substring(0, 20)}...`
                      : `${user.displayName}`}
                  </div>
                  <Image
                    src="/power-badge.png"
                    className="h-4 w-4"
                    radius="full"
                    alt="power-badge"
                  />
                  <div className="text-sm text-gray-500">@{user.username}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>{user.fid}</TableCell>
            <TableCell>{new Date(user.date).toDateString()}</TableCell>
            <TableCell>
              <Button variant="bordered" color="primary">
                <Edit />
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
