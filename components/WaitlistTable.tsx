"use client";

import Link from "next/link";
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
} from "@nextui-org/react";
import { ChevronRight, Hash, LinkIcon, Users } from "lucide-react";
import { WaitlistWithRequirements } from "./WaitlistDetail";

export default function WaitlistTable({
  waitlists,
  setSelectedWaitlist,
}: {
  waitlists: WaitlistWithRequirements[];
  setSelectedWaitlist: (waitlist: WaitlistWithRequirements) => void;
}) {
  return (
    <Table
      aria-label="Example static collection table"
      shadow="none"
      border={1}
    >
      <TableHeader>
        <TableColumn>
          <div className="flex flex-row items-center gap-1">
            <Hash size={12} />
            Name
          </div>
        </TableColumn>
        <TableColumn>
          <div className="flex flex-row items-center gap-1">
            <Users size={12} />
            Waitlist Users
          </div>
        </TableColumn>
        <TableColumn>
          <div className="flex flex-row items-center gap-1">
            <LinkIcon size={12} />
            Link
          </div>
        </TableColumn>
        <TableColumn>
          <div></div>
        </TableColumn>
      </TableHeader>
      <TableBody>
        {waitlists.map((waitlist) => (
          <TableRow
            key={waitlist.id}
            className="border-bottom-2 border-gray-200"
          >
            <TableCell className="cursor-pointer">
              <Link
                href={`/waitlists/${waitlist.id}`}
                className="hover:text-primary"
              >
                {waitlist.name}
              </Link>
            </TableCell>
            <TableCell>
              <div className="text-blue-500">
                {(waitlist as any)?._count?.waitlistedUsers}
              </div>
            </TableCell>
            <TableCell>
              <a
                href={waitlist.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {waitlist.externalUrl.replace("https://", "")}
              </a>
            </TableCell>
            <TableCell className="cursor-pointer">
              <Link href={`/waitlists/${waitlist.id}`}>
                <ChevronRight size={16} className="hover:text-primary" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
