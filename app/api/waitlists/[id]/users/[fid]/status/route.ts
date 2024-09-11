import { WaitlistedUserStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../../lib/prisma";

export const PUT = async (
  req: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) => {
  try {
    // Get the address from the request headers
    const address = req.headers.get("x-address")!;

    // Find the waitlist associated with the id and the address
    const waitlist = await prisma.waitlist.findUnique({
      where: {
        id: parseInt(id),
        userAddress: address,
      },
    });

    // If the waitlist doesn't exist, return a 404
    if (!waitlist) {
      return NextResponse.json(
        {
          message: "Waitlist not found",
        },
        {
          status: 404,
        }
      );
    }

    // Getting the status from the body of the request
    const { status, userFid } = await req.json();

    // Check if the status is valid
    if (
      !status ||
      (status !== WaitlistedUserStatus.APPROVED &&
        status !== WaitlistedUserStatus.WAITLISTED)
    ) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Update the status of the user and return a 200
    await prisma.waitlistedUser.update({
      where: {
        fid: userFid,
        waitlistId: parseInt(id),
        waitlistId_fid: {
          waitlistId: parseInt(id),
          fid: userFid,
        },
      },
      data: {
        status,
      },
    });
    return NextResponse.json({ message: "Status updated" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};
