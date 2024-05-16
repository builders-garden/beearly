import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export const GET = async (
  req: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) => {
  const address = req.headers.get("x-address");

  const waitlist = await prisma.waitlist.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!waitlist) {
    return {
      status: 404,
      body: {
        message: "Waitlist not found",
      },
    };
  }

  const waitlistedUsers = await prisma.waitlistedUser.findMany({
    where: {
      waitlistId: parseInt(id),
    },
  });

  return NextResponse.json(waitlistedUsers);
};
