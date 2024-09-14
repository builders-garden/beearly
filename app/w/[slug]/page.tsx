import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import { appURL } from "../../utils";
import prisma from "../../../lib/prisma";
import { redirect } from "next/navigation";
import { BeearlyButton } from "../../../components/BeearlyButton";
import { ExternalLinkIcon } from "lucide-react";
import { Image } from "@nextui-org/react";
import { WaitlistImagesMode } from "@prisma/client";

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
      images: [
        waitlist?.imagesMode === WaitlistImagesMode.ADVANCED
          ? waitlist?.imageLanding!
          : waitlist?.logo!,
      ],
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
    <div className="flex flex-col justify-center items-center gap-2">
      <Image
        src={waitlist.imageLanding ?? waitlist.logo ?? ""}
        alt="waitlist"
      />
      <BeearlyButton
        link={waitlist.externalUrl}
        text="Learn more"
        icon={<ExternalLinkIcon />}
      />
    </div>
  );
}
