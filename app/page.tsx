"use client";
import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import Link from "next/link";
import { appURL, currentURL } from "./utils";
import { Button } from "@nextui-org/button";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// This is a react server component only
export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div className="text-center flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col gap-1">
        <div className="text-6xl font-black">Waitlist</div>
        <div className="text-2xl font-semibold">
          Launch a waiting list on Farcaster
        </div>
      </div>
      {isConnected ? (
        <Button color="primary">
          <Link href="/waitlists">Get started</Link>
        </Button>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
