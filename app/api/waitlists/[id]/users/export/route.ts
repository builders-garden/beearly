import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { Readable } from "stream";

export const dynamic = "force-dynamic";

export const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const waitlist = await prisma.waitlist.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
  if (!waitlist) {
    return NextResponse.json(
      {
        message: "Waitlist not found",
      },
      { status: 404 }
    );
  }
  const users = await prisma.waitlistedUser.findMany({
    where: {
      waitlistId: waitlist.id,
    },
    select: {
      fid: true,
      username: true,
      displayName: true,
      powerBadge: true,
      address: true,
    },
  });
  const csv = ["fid,username,displayName,address,powerBadge"]
    .concat(
      users.map((user) => {
        return [
          user.fid,
          user.username.trim().replace(/\r?\n|\r/g, ""),
          user.displayName.trim().replace(/\r?\n|\r/g, ""),
          user.address,
          user.powerBadge,
        ].join(",");
      })
    )
    .join("\n");
  const data = Buffer.from(csv, "utf-8");
  return new Response(data, {
    headers: {
      "Content-type": "text/csv",
      "Content-Disposition": "attachment; filename=`${waitlist.name}.csv`",
    },
  });
};
