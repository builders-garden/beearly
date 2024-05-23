import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { Waitlist } from "@prisma/client";

export const GET = async (
  req: NextRequest,
  { params: { idOrSlug } }: { params: { idOrSlug: string } }
) => {
  let waitlist: Waitlist | null;
  if (isNaN(parseInt(idOrSlug))) {
    waitlist = await prisma.waitlist.findUnique({
      where: {
        slug: idOrSlug,
      },
    });
  } else {
    waitlist = await prisma.waitlist.findUnique({
      where: {
        id: parseInt(idOrSlug),
      },
    });
  }
  
  if (!waitlist) {
    return NextResponse.json(
      {
        message: "Waitlist not found",
      },
      { status: 404 }
    );
  }
  return NextResponse.json(waitlist);
};
