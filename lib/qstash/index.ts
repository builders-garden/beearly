import { Client } from "@upstash/qstash";

/**
 * Publish data to Qstash that will be sent to the specified endpoint after a delay
 * @param endpoint - The endpoint that will be invoked by Qstash
 * @param data - The data to publish, as a JSON object
 * @param delay - The delay in seconds before the data is sent back from Qstash to the API endpoint
 * @returns The response from the Qstash API as a JSON object. If the response is "ok", the data was successfully published to Qstash
 **/
export async function publishToQstash(
  endpoint: string,
  data: { [key: string]: any },
  delay: number
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
        data: data,
      },
      delay: delay,
    });
    return { response: "ok" };
  } catch (error) {
    console.error("Error while publishing json to QStash: ", error);
    return { response: "ko" };
  }
}
