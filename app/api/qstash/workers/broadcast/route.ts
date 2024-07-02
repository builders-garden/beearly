// This is a public API endpoint that will be invoked by QStash.
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { sendDirectCast } from "../../../../../lib/farcaster";
import { sendXMTPMessage } from "../../../../../lib/xmtp";

export async function POST(request: NextRequest) {
  console.log("Broadcast message received");
  // Get the payload from the request and extract the fid and text
  const body: any = await request.json();
  const { fid, address, text } = body.data;

  try {
    if (fid) {
      // Try sending the direct cast
      const response = await sendDirectCast(fid, text);
      if (!response.ok) {
        throw new Error("Error sending direct cast");
      }
    } else if (address) {
      // Try sending the XMTP message
      const response = await sendXMTPMessage(address, text);
      if (!response.ok) {
        throw new Error("Error sending XMTP message");
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error sending broadcast message",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(
    {
      message: "Broadcast message sent successfully",
    },
    {
      status: 200,
    }
  );
}
