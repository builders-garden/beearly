"use client";
import Link from "next/link";
import { Raleway } from "next/font/google";
const raleway = Raleway({ subsets: ["latin"] });
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export const Navbar = () => {
  return (
    <div className="p-4 bg-white">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <div className="text-2xl text-primary font-black">
            <div className={raleway.className}>WAITLISTS</div>
          </div>
        </Link>
        <DynamicWidget />
      </nav>
    </div>
  );
};
