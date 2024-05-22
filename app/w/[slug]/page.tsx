import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import { appURL } from "../../utils";
import prisma from "../../../lib/prisma";
import { redirect } from "next/navigation";
import { BeearlyButton } from "../../../components/BeearlyButton";
import { ExternalLinkIcon } from "lucide-react";
import { Image } from "@nextui-org/react";

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata> {
  const { slug } = params;
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      slug,
    },
  });
  return {
    title: `Beearly - ${waitlist?.name}`,
    description: `Beearly - Launch your waiting list on Farcaster.`,
    other: {
      ...(await fetchMetadata(new URL(`/frames/waitlists/${slug}`, appURL()))),
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
