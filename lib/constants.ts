import { WaitlistTier } from "@prisma/client";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export const BASE_FRAME_URL = `${BASE_URL}/w`;

// BEEARLY WALLET ADDRESS FOR PAYMENTS
export const BEEARLY_WALLET_ADDRESS =
  BASE_URL === "http://localhost:3000"
    ? "0x1358155a15930f89eBc787a34Eb4ccfd9720bC62"
    : "0x65De452f106bdea2a438C9ba48bD2a0A2A7B825e";

export const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const TIERS = {
  [WaitlistTier.FREE]: {
    image: "/bumble.svg",
    size: 100,
    allowExportUsers: false,
    // 24 hours cooldown
    broadcastDCCooldown: 86400000,
    broadcastDCCooldownText: "24 hours",
  },
  [WaitlistTier.HONEY]: {
    image: "/honey.svg",
    size: 500,
    allowExportUsers: true,
    // 12 hours cooldown
    broadcastDCCooldown: 43200000,
    broadcastDCCooldownText: "12 hours",
  },
  [WaitlistTier.QUEEN]: {
    image: "/queen.svg",
    size: -1,
    allowExportUsers: true,
    // 10 minutes cooldown
    broadcastDCCooldown: 600000,
    broadcastDCCooldownText: "10 minutes",
  },
};
