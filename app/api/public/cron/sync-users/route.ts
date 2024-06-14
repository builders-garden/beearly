import { NextRequest, NextResponse } from "next/server";
import { publishToQstash } from "../../../../../lib/qstash";

export const GET = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");

  // Check if the request is authorized to run the cron job
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  // Send the first payload to QStash to start sync users
  const { response } = await publishToQstash(
    `${process.env.BASE_URL}/api/qstash/workers/sync-users`,
    0
  );

  // Check if the payload was sent successfully
  if (response === "ko") {
    return NextResponse.json(
      {
        message: "Error while publishing json to QStash",
      },
      {
        status: 400,
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
