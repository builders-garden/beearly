import {
  FarcasterChannelsQuery,
  FarcasterQuery,
  IsFollowingQuery,
} from "./types";
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
        userAddress
        connectedAddresses {
          address
        }
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

const farcasterFollowQuery = /* GraphQL */ `
  query isFollowing($fid: Identity!, $followedNames: [Identity!]) {
    Wallet(input: { identity: $fid, blockchain: ethereum }) {
      socialFollowers(
        input: {
          filter: {
            identity: { _in: $followedNames }
            dappName: { _eq: farcaster }
          }
        }
      ) {
        Follower {
          dappName
          dappSlug
          followingProfileId
          followerProfileId
        }
      }
    }
  }
`;

interface FollowingQueryResponse {
  data: IsFollowingQuery | null;
  error: Error | null;
}

export const isUserFollowingUsers = async (
  fid: string,
  followedNames: string[]
) => {
  const { data, error }: FollowingQueryResponse = await fetchQuery(
    farcasterFollowQuery,
    {
      fid: `fc_fid:${fid}`,
      followedNames: followedNames.map((f) => `fc_fname:${f}`),
    }
  );
  if (
    error ||
    !data ||
    !data.Wallet ||
    !data.Wallet.socialFollowers ||
    !data.Wallet.socialFollowers.Follower ||
    data.Wallet.socialFollowers.Follower?.length === 0
  ) {
    return [];
  }
  return data.Wallet.socialFollowers.Follower;
};
