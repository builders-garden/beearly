import { NextRequest, NextResponse } from "next/server";
import { searchFarcasterUsers } from "../../../../lib/airstack";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "10";
  const q = searchParams.get("q") || "";

  if (!q) {
    return NextResponse.json([]);
  }

  const users = await searchFarcasterUsers(q, parseInt(limit));

  return NextResponse.json(users);
};
