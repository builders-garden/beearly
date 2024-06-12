import { NextRequest, NextResponse } from "next/server";
import { Client } from "@upstash/qstash";

export async function loadQstash(
  endpoint: string,
  offset: number
): Promise<{ response: string }> {
  // Get the Qstash client
  const qstashClient = new Client({
    token: process.env.QSTASH_TOKEN!, // Add this to .env file
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

export const GET = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  // Send the first payload to QStash to start sync users
  const { response } = await loadQstash(
    `${process.env.BASE_URL}/api/workers/sync-users`,
    0
  );
  if (response === "ko") {
    return NextResponse.json(
      {
        message: "Error while publishing json to QStash",
      },
      {
        status: 500,
      }
    );
  } else {
    return NextResponse.json(
      {
        message: "Payload sent to QStash",
      },
      {
        status: 200,
      }
    );
  }
};
