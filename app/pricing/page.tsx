import { Button, Image, Link } from "@nextui-org/react";
import { CheckIcon, DeleteIcon, XIcon } from "lucide-react";
import { BeearlyButton } from "../../components/BeearlyButton";
import TierCard from "../../components/TierCard";

// a page with 3 cards showing the pricing and features included in each tier
export default function Pricing() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col gap-2">
        <div className="text-4xl font-bold">Beearly Pricing</div>
        <div>*pricing is intended per waitlist</div>
      </div>
      <BeearlyButton link={"/waitlists/new"} text="Start now" />
      <div className="w-full flex sm:flex-row flex-col gap-4 justify-center items-center p-4 sm:p-24">
        <TierCard
          tierLogo="/bumble.svg"
          tierName="Bumble Bee"
          description="Just to get you started."
          price="FREE"
          requirementsOptions={[
            { name: "Channel follow", available: true },
            { name: "User follow", available: false },
            { name: "Power Badge", available: false },
            { name: "Proof of Humanity", available: false },
          ]}
          spamProtectionOptions={[{ name: "Captcha", available: false }]}
          features={[
            { name: "Waitlist Size: 100", available: true },
            {
              name: "Broadcast Direct Casts: 1 every 24 hours",
              available: true,
            },
            { name: "Export users", available: false },
            { name: "Email collection", available: false },
          ]}
          actionLink="/waitlists/new"
        />
        <TierCard
          tierLogo="/honey.svg"
          tierName="Honey Bee"
          description="More features and bigger audience."
          price="25$"
          requirementsOptions={[
            { name: "Channel follow", available: true },
            { name: "User follow", available: true },
            { name: "Power Badge", available: true },
            { name: "Proof of Humanity", available: true },
          ]}
          spamProtectionOptions={[{ name: "Captcha", available: true }]}
          features={[
            { name: "Waitlist Size: 500", available: true },
            {
              name: "Broadcast Direct Casts: 1 every 12 hours",
              available: true,
            },
            { name: "Export users", available: true },
            { name: "Email collection", available: true },
          ]}
          actionLink="/waitlists/new"
        />
        <TierCard
          isTopTier={true}
          tierLogo="/queen.svg"
          tierName="Queen Bee"
          description="Fully fledged waitlist with all the features you need."
          price="30$"
          requirementsOptions={[
            { name: "Channel follow", available: true },
            { name: "User follow", available: true },
            { name: "Power Badge", available: true },
            { name: "Proof of Humanity", available: true },
          ]}
          spamProtectionOptions={[{ name: "Captcha", available: true }]}
          features={[
            { name: "Waitlist Size: Unlimited ∞", available: true },
            {
              name: "Broadcast Direct Casts: 1 every 10 minutes",
              available: true,
            },
            { name: "Export users", available: true },
            { name: "Email collection", available: true },
          ]}
          actionLink="/waitlists/new"
        />
      </div>
    </div>
  );
}
