import { v4 as uuidv4 } from "uuid";
/**
 * @dev this function sends a direct cast to the given recipient
 * @param {string} text the text of the cast to send
 * @param {number} recipient farcaster id of the recipient
 */
export const sendDirectCast = async (recipient: number, text: string) => {
  if (!process.env.WARPCAST_API_KEY) {
    console.log("No WARPCAST_API_KEY found, skipping direct cast send.");
    return { ok: false };
  }
  const res = await fetch("https://api.warpcast.com/v2/ext-send-direct-cast", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.WARPCAST_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipientFid: recipient,
      message: text,
      idempotencyKey: uuidv4(),
    }),
  });
  if (!res.ok) {
    console.error(`error sending direct cast to ${recipient}.`);
    return { ok: false };
  }
  console.log(`direct cast sent to ${recipient}.`);
  return { ok: true };
};
