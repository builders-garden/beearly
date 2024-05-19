"use client";

import Link from "next/link";
import { Button } from "@nextui-org/button";
import { useAccount } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { BeearlyButton } from "../components/BeearlyButton";

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
        <BeearlyButton
          text="Get started"
          link="/waitlists"
          onPress={() => {}}
        />
      ) : (
        <DynamicWidget />
      )}
    </div>
  );
}
