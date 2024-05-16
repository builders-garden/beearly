import { FarcasterQuery } from "./types";
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
