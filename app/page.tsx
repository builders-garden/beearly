"use client";

import Link from "next/link";
import { Button, Image } from "@nextui-org/react";
import { useAccount } from "wagmi";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { BeearlyButton } from "../components/BeearlyButton";

// This is a react server component only
export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="h-screen flex flex-col justify-between items-center pb-16">
      <div className="text-center flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col gap-1 items-center justify-center">
          <Image
            alt="beearly-logo"
            src="/beearly-logo.svg"
            className="h-32"
            radius="none"
          />
          <div className="text-2xl font-semibold">
            Manage early access to your product with Frames on Farcaster
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
      <div>
        Made with ❤️ by{" "}
        <Link
          href={"https://builders.garden"}
          className="underline"
          target="_blank"
        >
          builders.garden
        </Link>
      </div>
    </div>
  );
}
