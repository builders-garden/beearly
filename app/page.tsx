"use client";

import Link from "next/link";
import { Button, Image, LinkIcon } from "@nextui-org/react";
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
        <div className="flex flex-row items-center gap-4">
          {isConnected ? (
            <BeearlyButton
              text="Launch app"
              link="/waitlists"
              onPress={() => {}}
            />
          ) : (
            <DynamicWidget />
          )}
          <Link href={"https://warpcast.com/~/channel/beearly"} target="_blank">
            <Button
              color="primary"
              variant="ghost"
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
        </div>
        <div className="flex flex-row gap-4 mt-16">
          <Link
            href="https://warpcast.com/limone.eth/0xfb8963b9"
            target="_blank"
          >
            <Image
              src="/stringz-waitlist.png"
              className="h-96"
              alt="example"
              radius="sm"
            />
          </Link>
          <Link href="https://warpcast.com/yar0x/0xfc9dc826" target="_blank">
            <Image
              src="/powerfeed-waitlist.png"
              className="h-96"
              alt="example"
              radius="sm"
            />
          </Link>
          <Link href="https://warpcast.com/lottopgf/0x2c619fc5" target="_blank">
            <Image
              src="/otto-waitlist.png"
              className="h-96"
              alt="example"
              radius="sm"
            />
          </Link>
        </div>
      </div>
      <div className="mt-8">
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
