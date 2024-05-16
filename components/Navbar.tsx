"use client";
import Link from "next/link";
import { Raleway } from "next/font/google";
const raleway = Raleway({ subsets: ["latin"] });
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Image } from "@nextui-org/react";

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
        <DynamicWidget />
      </nav>
    </div>
  );
};
