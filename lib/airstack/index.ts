import {
  FarcasterChannelsQuery,
  ProfileQuery,
  IsFollowingQuery,
  ProfilesQuery,
} from "./types";
import { fetchQuery, init } from "@airstack/node";

if (!process.env.AIRSTACK_API_KEY) {
  throw new Error("AIRSTACK_API_KEY is missing");
}

init(process.env.AIRSTACK_API_KEY!);

const profileQuery = /* GraphQL */ `
  query Profile($fid: String!) {
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
        socialCapital {
          socialCapitalRank
          socialCapitalScore
        }
        followerCount
        followingCount
        location
        profileBio
      }
    }
  }
`;

interface ProfileQueryResponse {
  data: ProfileQuery | null;
  error: Error | null;
}

interface Error {
  message: string;
}

export const fetchFarcasterProfile = async (fid: string) => {
  const { data, error }: ProfileQueryResponse = await fetchQuery(profileQuery, {
    fid,
  });
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

const profilesQuery = /* GraphQL */ `
  query Profiles($fids: [String!], $pointer: String) {
    Socials(
      input: {
        filter: { dappName: { _eq: farcaster }, userId: { _in: $fids } }
        blockchain: ethereum
        cursor: $pointer
        limit: 200
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
        socialCapital {
          socialCapitalRank
          socialCapitalScore
        }
        followerCount
        followingCount
        location
        profileBio
      }
      pageInfo {
        hasNextPage
        nextCursor
      }
    }
  }
`;

interface ProfilesQueryResponse {
  data: ProfilesQuery | null;
  error: Error | null;
}

export interface UserProfile {
  userId: string | null;
  profileName: string | null;
  profileDisplayName: string | null;
  profileImage: string | null;
  isFarcasterPowerUser: boolean | null;
  userAddress: any | null;
  connectedAddresses:
    | {
        address: any | null;
      }[]
    | null;
  socialCapital: {
    socialCapitalRank: number | null;
    socialCapitalScore: number | null;
  } | null;
  followerCount: number | null;
  followingCount: number | null;
  location: string | null;
  profileBio: string | null;
}

export const fetchFarcasterProfiles = async (
  fids: string[],
  pointer: string
) => {
  const { data, error }: ProfilesQueryResponse = await fetchQuery(
    profilesQuery,
    {
      fids,
      pointer,
    }
  );
  if (
    error ||
    !data ||
    !data.Socials ||
    !data.Socials.Social ||
    !data.Socials.pageInfo ||
    data.Socials.Social?.length === 0
  ) {
    return false;
  }
  return { profiles: data.Socials.Social, pageInfo: data.Socials.pageInfo };
};

const farcasterUsersQuery = `
query FarcasterUsers($profileName: String, $limit: Int) {
  Socials(
    input: {
      filter: {
        profileName: {_regex: $profileName},
        dappName: {_eq: farcaster}
      },
      blockchain: ethereum,
      limit: $limit,
      order: {socialCapitalRank: ASC}
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
      socialCapital {
        socialCapitalRank
        socialCapitalScore
      }
      location
      profileBio
      followerCount
      followingCount
    }
  }
}
`;

export const searchFarcasterUsers = async (profileName: string, limit = 10) => {
  const { data, error }: ProfilesQueryResponse = await fetchQuery(
    farcasterUsersQuery,
    {
      profileName,
      limit,
    }
  );
  if (error || !data || !data.Socials || !data.Socials.Social) {
    return [];
  }
  return data.Socials.Social;
};
