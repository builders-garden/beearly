"use client";
import { Button, Card, CardBody, Image, Tab, Tabs } from "@nextui-org/react";
import { Edit, Link, Users } from "lucide-react";
import { useState } from "react";
import { UsersTable } from "./UsersTable";
import { Waitlist } from "@prisma/client";

// this is a card like element that displays a waitlist
export const WaitlistDetail = ({ waitlist }: { waitlist: Waitlist }) => {
  const [selected, setSelected] = useState<string>("list");

  return (
    <div className="flex flex-col border-2 border-gray-400 rounded-xl">
      <div className="flex flex-col p-4 gap-2 rounded-tr-xl rounded-tl-xl">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-8 items-center">
            <div className="text-3xl font-bold">{waitlist.name}</div>
            <div className="flex flex-row gap-2 items-center">
              <Link size={20} />
              <div className="text-lg">https://waitlist.cool/w/waitlist</div>
            </div>
          </div>
          <Button variant="bordered" color="primary">
            <Edit />
            Edit
          </Button>
        </div>
      </div>
      <Tabs
        className="px-4"
        aria-label="tabs"
        selectedKey={selected}
        onSelectionChange={(value) => setSelected(value as string)}
      >
        <Tab key="images" title="Images">
          <div className="flex flex-col gap-2 p-4">
            <div className="text-xl font-medium">Images</div>
            <div className="flex flex-row gap-16 items-center">
              <Image
                src={waitlist.imageLanding}
                alt="waitlist-img"
                className="h-48 w-48"
              />
              <Image
                src={waitlist.imageSuccess}
                alt="waitlist-img"
                className="h-48 w-48"
              />
            </div>
          </div>
        </Tab>
        {
          //<Tab key="list" title="Users">
          //<UsersTable users={users} />
          //</Tab>
        }
      </Tabs>
    </div>
  );
};
