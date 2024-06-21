import { WaitlistedUser } from "@prisma/client";
import { UserProfile } from ".";

/**
 * @param user - The user with data coming from Airstack.
 * @returns The data ready to be written in the prisma database without the fields:
    | "id"
    | "waitlistId"
    | "createdAt"
    | "referrerFid"
    | "waitlistedAt"
    | "updatedAt"
 **/
export const formatAirstackUserData = (user: UserProfile) => {
  const databaseUserData: Omit<
    WaitlistedUser,
    | "id"
    | "waitlistId"
    | "createdAt"
    | "referrerFid"
    | "waitlistedAt"
    | "updatedAt"
  > = {
    fid: parseInt(user.userId!),
    address:
      user.connectedAddresses?.length! > 0
        ? user.connectedAddresses![0]!.address
        : user.userAddress,
    displayName: user.profileDisplayName ?? "",
    username: user.profileName ?? "",
    avatarUrl: user.profileImage ?? "",
    powerBadge: user.isFarcasterPowerUser,
    socialCapitalRank: user.socialCapital?.socialCapitalRank ?? 0,
    socialCapitalScore: user.socialCapital?.socialCapitalScore ?? 0,
    followerCount: user.followerCount ?? 0,
    followingCount: user.followingCount ?? 0,
    location: user.location ?? "",
    profileBio: user.profileBio ?? "",
  };
  return databaseUserData;
};
