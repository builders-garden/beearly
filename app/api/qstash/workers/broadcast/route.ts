// This is a public API endpoint that will be invoked by QStash.
import { NextRequest, NextResponse } from "next/server";
import { sendDirectCast } from "../../../../../lib/farcaster";
import { sendXMTPMessage } from "../../../../../lib/xmtp";

export async function POST(request: NextRequest) {
  // Get the payload from the request and extract the fid and text
  const body: {
    data: {
      fid: number | undefined;
      address: string | undefined;
      text: string | undefined;
    };
  } = await request.json();
  const { fid, address, text } = body.data;

  try {
    if (!text) {
      throw new Error("No text provided");
    }
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
    } else {
      throw new Error("No fid or address provided");
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error sending broadcast message: " + error.message,
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
