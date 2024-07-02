// This is a public API endpoint that will be invoked by QStash.
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { BroadcastDCPayload } from "../../../../../lib/qstash/types";
import { sendDirectCast } from "../../../../../lib/farcaster";

async function handler(request: NextRequest) {
  // Get the payload from the request and extract the fid and text
  const body: BroadcastDCPayload = await request.json();
  const { fid, text } = body.data;

  // Try sending the direct cast
  const response = await sendDirectCast(fid, text);
  if (!response.ok) {
    return NextResponse.json(
      {
        message: "Error sending direct cast",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(
    {
      message: "Direct cast sent successfully",
    },
    {
      status: 200,
    }
  );
}

export const POST = verifySignatureAppRouter(handler);
