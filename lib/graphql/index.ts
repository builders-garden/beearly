import { gql, GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient(
  "https://api.studio.thegraph.com/query/23537/moxie_protocol_stats_mainnet/version/latest"
);

const userBalancesQuery = gql`
  query UserBalances($fanTokenSymbol: String!) {
    subjectTokens(where: { symbol: $fanTokenSymbol }) {
      portfolio {
        balance
        user {
          id
        }
      }
    }
  }
`;

interface UserBalancesResponse {
  subjectTokens: { portfolio: { balance: string; user: { id: string } }[] }[];
}

/**
 * @param symbol - The symbol of the fan token to get balances for
 * @returns The user balances for the fan token in the form of a UserBalancesResponse object
 **/
export const getFanTokenBalances = async (
  symbol: string
): Promise<UserBalancesResponse | null> => {
  if (!symbol) {
    return null;
  }
  try {
    const data: UserBalancesResponse = await graphQLClient.request(
      userBalancesQuery,
      {
        fanTokenSymbol: symbol,
      }
    );
    if (!data || !data.subjectTokens || data.subjectTokens.length === 0) {
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
};
