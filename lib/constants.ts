import { WaitlistTier } from "@prisma/client";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export const BASE_FRAME_URL = `${BASE_URL}/w`;

// BEEARLY WALLET ADDRESS FOR PAYMENTS
export const BEEARLY_WALLET_ADDRESS =
  (process.env.NODE_ENV === "development"
    ? process.env.BEEARLY_WALLET_ADDRESS_DEV
    : process.env.BEEARLY_WALLET_ADDRESS_PROD)?.toLowerCase();

// MOXIE GRAPHQL CLIENTS URLS
export const MOXIE_STATS_GRAPHQL_URL =
  "https://api.studio.thegraph.com/query/23537/moxie_protocol_stats_mainnet/version/latest";
export const MOXIE_VESTING_GRAPHQL_URL =
  "https://api.studio.thegraph.com/query/23537/moxie_vesting_mainnet/version/latest";

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
