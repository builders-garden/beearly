import { gql, GraphQLClient } from "graphql-request";
import {
  MOXIE_STATS_GRAPHQL_URL,
  MOXIE_VESTING_GRAPHQL_URL,
} from "../constants";

const getGraphQlClient = (url: string) => {
  return new GraphQLClient(url);
};

const userBalancesQuery = gql`
  query UserBalances($userAddresses: [ID!], $fanTokenAddress: String) {
    users(where: { id_in: $userAddresses }) {
      portfolio(where: { subjectToken: $fanTokenAddress }) {
        balance
      }
    }
  }
`;

interface UserBalancesResponse {
  users: { portfolio: { balance: string }[] }[];
}

/**
 * @param userAddresses - An array of addresses of the user you want to get the balance for
 * @param fanTokenSymbol - The symbol of the fan token
 * @returns The sum of balances of the specified fan token in all the user's addresses, or null if not found
 **/
export const getUserTotalBalance = async (
  userAddresses: string[],
  fanTokenSymbol: string
): Promise<number | null> => {
  if (
    userAddresses.length === 0 ||
    !fanTokenSymbol ||
    !(fanTokenSymbol.startsWith("fid:") || fanTokenSymbol.startsWith("cid:"))
  ) {
    return null;
  }
  try {
    const fanTokenAddress =
      await getTokenAddressFromSymbolQuery(fanTokenSymbol);
    if (!fanTokenAddress) {
      return null;
    }
    const graphQLClient = getGraphQlClient(MOXIE_STATS_GRAPHQL_URL);
    const data: UserBalancesResponse = await graphQLClient.request(
      userBalancesQuery,
      {
        userAddresses: userAddresses,
        fanTokenAddress: fanTokenAddress,
      }
    );
    if (!data?.users) {
      return null;
    }
    let totalBalance = 0;
    data.users.forEach((user) => {
      if (user?.portfolio?.[0]?.balance) {
        totalBalance += parseInt(user.portfolio[0].balance);
      }
    });
    return totalBalance;
  } catch (e: any) {
    return null;
  }
};

const tokenAddressFromSymbolQuery = gql`
  query TokenAddressFromSymbol($fanTokenSymbol: String!) {
    subjectTokens(where: { symbol: $fanTokenSymbol }) {
      id
    }
  }
`;

interface TokenAddressFromSymbolResponse {
  subjectTokens: { id: string }[];
}

/**
 * @param symbol - The symbol of the fan token you want to get the address for
 * @returns The address of the fan token, or null if not found
 **/
export const getTokenAddressFromSymbolQuery = async (
  fanTokenSymbol: string
): Promise<string | null> => {
  if (
    !fanTokenSymbol ||
    !(fanTokenSymbol.startsWith("fid:") || fanTokenSymbol.startsWith("cid:"))
  ) {
    return null;
  }
  try {
    const graphQLClient = getGraphQlClient(MOXIE_STATS_GRAPHQL_URL);
    const data: TokenAddressFromSymbolResponse = await graphQLClient.request(
      tokenAddressFromSymbolQuery,
      {
        fanTokenSymbol: fanTokenSymbol,
      }
    );
    if (!data?.subjectTokens?.[0]?.id) {
      return null;
    }
    return data.subjectTokens[0].id;
  } catch (e) {
    return null;
  }
};

export const userVestingAddressesQuery = gql`
  query UserVestingAddresses($beneficiaryAddresses: [Bytes!]) {
    tokenLockWallets(where: { beneficiary_in: $beneficiaryAddresses }) {
      address: id
    }
  }
`;

interface UserVestingAddressesResponse {
  tokenLockWallets: { address: string }[];
}

/**
 * @param userAddresses - An array of addresses of the user
 * @returns An array of vesting addresses, empty if no vesting addresses are found
 **/
export const getUserVestingAddresses = async (
  userAddresses: string[]
): Promise<string[]> => {
  if (userAddresses.length === 0) {
    return [];
  }
  try {
    const graphQLClient = getGraphQlClient(MOXIE_VESTING_GRAPHQL_URL);
    const data: UserVestingAddressesResponse = await graphQLClient.request(
      userVestingAddressesQuery,
      {
        beneficiaryAddresses: userAddresses,
      }
    );
    if (!data?.tokenLockWallets) {
      return [];
    }
    const vestingAddresses = data.tokenLockWallets.map(
      (wallet) => wallet.address
    );
    return vestingAddresses;
  } catch (e) {
    return [];
  }
};
