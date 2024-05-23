import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import { appURL } from "../../utils";
import prisma from "../../../lib/prisma";
import { redirect } from "next/navigation";
import { BeearlyButton } from "../../../components/BeearlyButton";
import { ExternalLinkIcon } from "lucide-react";
import { Image } from "@nextui-org/react";
import { frame } from "framer-motion";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: {
    slug: string;
  };
  searchParams: {
    ref?: string;
  };
}): Promise<Metadata> {
  const ref = searchParams.ref;
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
  return {
    title: `Beearly - ${waitlist?.name}`,
    description: `Beearly - Launch your waiting list on Farcaster.`,
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
      <Image src={waitlist.imageLanding} alt="waitlist" />
      <BeearlyButton
        link={waitlist.externalUrl}
        text="Learn more"
        icon={<ExternalLinkIcon />}
      />
    </div>
  );
}
