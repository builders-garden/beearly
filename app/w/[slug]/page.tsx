import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import { appURL } from "../../utils";
import prisma from "../../../lib/prisma";
import { redirect } from "next/navigation";
import { BeearlyButton } from "../../../components/BeearlyButton";
import { ExternalLinkIcon, ZapIcon } from "lucide-react";
import { Image } from "@nextui-org/react";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: {
    slug: string;
  };
  searchParams: {
    ref?: string;
    refSquared?: string;
  };
}): Promise<Metadata> {
  const ref = searchParams.ref;
  const refSquared = searchParams.refSquared;
  const { slug } = params;
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      slug,
    },
  });
  const frameUrl = new URL(`/frames/waitlists/${slug}`, appURL());
  if (ref) {
    frameUrl.searchParams.set("ref", ref);
  }
  if (refSquared) {
    frameUrl.searchParams.set("refSquared", refSquared);
  }
  return {
    title: `Beearly - ${waitlist?.name}`,
    description: `Beearly - Launch your waiting list on Farcaster.`,
    openGraph: {
      title: `Beearly - ${waitlist?.name}`,
      description: `${waitlist!.name} waitlist, powered by Beearly`,
      type: "website",
      url: frameUrl.toString(),
      images: [waitlist?.imageLanding!],
    },
    other: {
      ...(await fetchMetadata(frameUrl)),
    },
  };
}

export default async function WaitlistShortPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      slug,
    },
  });
  if (!waitlist) {
    return redirect("/waitlists");
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 py-5">
      <div className="text-2xl font-bold">{waitlist.name}</div>
      <Image
        className="max-w-screen-lg border-medium border-default-100 my-5"
        src={waitlist.imageLanding}
        alt="waitlist landing image"
      />
      <div className="flex flex-row gap-5">
        <BeearlyButton
          link={waitlist.externalUrl}
          text="Learn more"
          icon={<ExternalLinkIcon />}
        />
        <BeearlyButton
          link={waitlist.externalUrl}
          text="Join Waitlist"
          icon={<ZapIcon />}
        />
      </div>
    </div>
  );
}
