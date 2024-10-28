"use client";
import Link from "next/link";
import { Raleway } from "next/font/google";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Button, Image } from "@nextui-org/react";
import { BeearlyButton } from "./BeearlyButton";
import { PlusSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import NavbarLink from "./NavbarLink";

export const Navbar = () => {
  const pathname = usePathname();

  const isActive = (linkPath: string) => pathname === linkPath;

  return (
    <div className="p-4 bg-white">
      <nav className="flex justify-between items-center rounded-none">
        <div className="flex flex-row gap-8 items-center">
          <Image
            src="/beearly-logo.svg"
            width={100}
            alt="Beearly logo"
            className="rounded-none"
          />
          <div className="flex flex-row gap-4">
            <NavbarLink isActive={isActive("/")} text="Home" link="/" />
            <NavbarLink
              isActive={isActive("/waitlists")}
              text="Waitlists"
              link="/waitlists"
            />

            <NavbarLink
              isActive={isActive("/pricing")}
              text="Pricing"
              link="/pricing"
            />
          </div>
        </div>

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
          <BeearlyButton
            link="/waitlists/new"
            icon={
              <div className="rounded-2xl">
                <PlusSquare
                  radius={"lg"}
                  fill="black"
                  className="text-primary rounded-xl"
                  size={24}
                />
              </div>
            }
            text="New waitlist"
          />
          <DynamicWidget />
        </div>
      </nav>
    </div>
  );
};
