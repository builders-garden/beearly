import { Client } from "@xmtp/xmtp-js";
import { GrpcApiClient } from "@xmtp/grpc-api-client";
import { Wallet } from "ethers";

/**
 * @dev this function creates a new xmtp client
 * @returns {Promise<Client>} The promise of the newly created xmtp client
 */
const createXMTPClient = async (): Promise<Client> => {
  let wallet: Wallet;
  wallet = new Wallet(process.env.BEEARLY_PRIVATE_KEY as string);

  const client = await Client.create(wallet, {
    env: "production",
    apiClientFactory: GrpcApiClient.fromOptions,
  });

  return client;
};

/**
 * @dev this function sends a xmtp message to the given recipient
 * @param {string} recipient wallet address of the recipient
 * @param {string} text the text of the message to send
 */
export const sendXMTPMessage = async (recipient: string, text: string) => {
  const client = await createXMTPClient();

  const conversations = await client.conversations.list();
  const conversation = conversations.find((c) => c.peerAddress === recipient);

  if (conversation) {
    // send the message to the existing conversation
    await conversation.send(text);
  } else {
    // create new conversation
    const canMessage = await client.canMessage(recipient);
    if (!canMessage) {
      throw new Error(`${recipient} cannot be messaged.`);
    }
    const newConversation =
      await client.conversations.newConversation(recipient);
    await newConversation.send(text);
  }
};
