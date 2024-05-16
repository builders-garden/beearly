import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import { appURL } from "../../utils";
import prisma from "../../../lib/prisma";
import { redirect } from "next/navigation";

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
  console.log(new URL(`/frames/waitlists/${slug}`, appURL()));
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
  return <div>{waitlist.name}</div>;
}
