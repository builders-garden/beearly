import { Metadata } from "next";
import prisma from "../../../lib/prisma";
import Leaderboard from "../../../components/Leaderboard";

const description = [
  "BUILD is a meme and a social game designed to reward builders via",
  "onchain nominations.",
].join(" ");

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      slug,
    },
  });
  const metadata: Metadata = {
    title: `Beearly - ${waitlist?.name} Leaderboard`,
    description: `Check out the top referrers on the ${waitlist?.name} waitlist.`,
    openGraph: {
      title: `Beearly - ${waitlist?.name} Leaderboard`,
      description: `Check out the top referrers on the ${waitlist?.name} waitlist.`,
      type: "website",
      url: "https://beearly.club",
      images: [waitlist?.imageLanding!],
    },
    twitter: {
      title: `Beearly - ${waitlist?.name} Leaderboard`,
      description: `Check out the top referrers on the ${waitlist?.name} waitlist.`,
      images: [waitlist?.imageLanding!],
    },
  };
  return {
    ...metadata,
  };
}

export default function PublicLeadearboardPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return <Leaderboard waitlistSlug={slug} />;
}
