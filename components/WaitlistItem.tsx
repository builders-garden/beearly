"use client";
import { Image } from "@nextui-org/react";

export interface Waitlist {
  id: string;
  name: string;
  slug: string;
  images: string[];
  externalUrl: string;
  createdAt: string;
  updatedAt: string;
}

// this is a card like element that displays a waitlist
export const WaitlistItem = ({ waitlist }: { waitlist: Waitlist }) => {
  console.log(waitlist.images[0]!);
  return (
    <div className="bg-card rounded-lg p-4 shadow-md">
      <div className="flex flex-cols items-center">
        <div className="ml-4">
          <div className="text-lg font-semibold text-primary">
            {waitlist.name}
          </div>
          <div className="flex-shrink-0">
            <Image
              className="h-16 w-16 rounded-lg"
              src={waitlist.images[0]!}
              alt="main-image"
              width={64}
              height={64}
            />
          </div>
          <div className="text-sm text-muted">{waitlist.slug}</div>
        </div>
      </div>
      <div className="mt-4">
        <a
          href={waitlist.externalUrl}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          {waitlist.externalUrl}
        </a>
      </div>
    </div>
  );
};
