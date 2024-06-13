import { Client } from "@upstash/qstash";

export async function loadQstash(
  endpoint: string,
  offset: number
): Promise<{ response: string }> {
  // Get the Qstash client
  const qstashClient = new Client({
    token: process.env.QSTASH_TOKEN!,
  });

  // Send payload to the Qstash API
  try {
    await qstashClient.publishJSON({
      url: endpoint,
      body: {
        offset: offset,
      },
    });
    return { response: "ok" };
  } catch (error) {
    console.error("Error while publishing json to QStash: ", error);
    return { response: "ko" };
  }
}
