// This is a public API endpoint that will be invoked by QStash.
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { BroadcastXMTPPayload } from "../../../../../lib/qstash/types";
import { sendXMTPMessage } from "../../../../../lib/xmtp";

async function handler(request: NextRequest) {
  // Get the payload from the request and extract the address and text
  const body: BroadcastXMTPPayload = await request.json();
  const { address, text } = body.data;

  // Try sending the XMTP message
  const response = await sendXMTPMessage(address, text);
  if (!response?.ok) {
    return NextResponse.json(
      {
        message: "Error sending XMTP message",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(
    {
      message: "XMTP message sent successfully",
    },
    {
      status: 200,
    }
  );
}

export const POST = verifySignatureAppRouter(handler);
