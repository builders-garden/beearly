import { WaitlistedUser } from "@prisma/client";
import { UserProfile } from ".";

/**
 * @param user - The user with data coming from Airstack.
 * @returns The first ethereum address from the connectedAddresses array or the userAddress if there are no connectedAddresses
 **/
export const findFirstEthereumAddress = (user: UserProfile) => {
  if (user.connectedAddresses?.length! > 0) {
    for (const address of user.connectedAddresses!) {
      if (address.blockchain === "ethereum") {
        return address.address!;
      }
    }
  }
  return user.userAddress!;
};

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
  // Taking the first ethereum address from the connectedAddresses array or the userAddress if there are no connectedAddresses
  const userAddress = findFirstEthereumAddress(user);

  const databaseUserData: Omit<
    WaitlistedUser,
    | "id"
    | "waitlistId"
    | "createdAt"
    | "referrerFid"
    | "waitlistedAt"
    | "email"
    | "updatedAt"
  > = {
    fid: parseInt(user.userId!),
    address: userAddress,
    displayName: user.profileDisplayName?.trim().replace(/\r?\n|\r/g, "") || "",
    username: user.profileName?.trim().replace(/\r?\n|\r/g, "") || "",
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
