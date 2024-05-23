"use client";
import Link from "next/link";
import { Raleway } from "next/font/google";
const raleway = Raleway({ subsets: ["latin"] });
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Button, Image } from "@nextui-org/react";

export const Navbar = () => {
  return (
    <div className="p-4 bg-white">
      <nav className="flex justify-between items-center rounded-none">
        <Link href={"/"}>
          <Image
            src="/beearly-logo.svg"
            width={100}
            alt="Beearly logo"
            className="rounded-none"
          />
        </Link>
        <div className="flex flex-row gap-4 items-center">
          <Link href={"https://warpcast.com/~/channel/beearly"} target="_blank">
            <Button
              color="primary"
              variant="light"
              radius="sm"
              className="text-primary"
            >
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/farcaster-logo.svg"
                  alt="farcaster-logo"
                  className="h-4 rounded-none"
                />
                <div className="text-sm">Follow /beearly</div>
              </div>
            </Button>
          </Link>
          <DynamicWidget />
        </div>
      </nav>
    </div>
  );
};
