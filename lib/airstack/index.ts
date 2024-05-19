import { FarcasterChannelsQuery, FarcasterQuery } from "./types";
import { fetchQuery, init } from "@airstack/node";

if (!process.env.AIRSTACK_API_KEY) {
  throw new Error("AIRSTACK_API_KEY is missing");
}

init(process.env.AIRSTACK_API_KEY!);
const query = /* GraphQL */ `
  query Farcaster($fid: String!) {
    Socials(
      input: {
        filter: { dappName: { _eq: farcaster }, userId: { _eq: $fid } }
        blockchain: ethereum
      }
    ) {
      Social {
        userId
        profileName
        profileDisplayName
        profileImage
        isFarcasterPowerUser
      }
    }
  }
`;

interface QueryResponse {
  data: FarcasterQuery | null;
  error: Error | null;
}

interface Error {
  message: string;
}

export const fetchFarcasterProfile = async (fid: string) => {
  const { data, error }: QueryResponse = await fetchQuery(query, { fid });
  if (
    error ||
    !data ||
    !data.Socials ||
    !data.Socials.Social ||
    data.Socials.Social?.length === 0
  ) {
    return false;
  }
  return data.Socials.Social[0];
};

const channelsQuery = /* GraphQL */ `
  query FarcasterChannels($fid: Identity!, $channels: [String!]) {
    FarcasterChannelParticipants(
      input: {
        filter: {
          participant: { _eq: $fid }
          channelId: { _in: $channels }
          channelActions: { _eq: follow }
        }
        blockchain: ALL
      }
    ) {
      FarcasterChannelParticipant {
        channelId
      }
    }
  }
`;

interface ChannelsQueryResponse {
  data: FarcasterChannelsQuery | null;
  error: Error | null;
}

interface Error {
  message: string;
}

export const fetchFarcasterChannels = async (
  fid: string,
  channels: string[]
) => {
  const { data, error }: ChannelsQueryResponse = await fetchQuery(
    channelsQuery,
    { fid: `fc_fid:${fid}`, channels }
  );
  if (
    error ||
    !data ||
    !data.FarcasterChannelParticipants ||
    !data.FarcasterChannelParticipants.FarcasterChannelParticipant ||
    data.FarcasterChannelParticipants.FarcasterChannelParticipant?.length === 0
  ) {
    return [];
  }
  return data.FarcasterChannelParticipants.FarcasterChannelParticipant;
};
