import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { CheckoutStatus, WaitlistTier } from "@prisma/client";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const address = req.headers.get("x-address")!;
  const { requestId, tier, amount } = body;

  const checkout = await prisma.checkout.create({
    data: {
      address,
      requestId,
      tier,
      amount,
      status: CheckoutStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return NextResponse.json(checkout);
};

export const GET = async (req: NextRequest) => {
  const address = req.headers.get("x-address")!;

  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") as CheckoutStatus | null;
  const tier = (searchParams.get("tier") as WaitlistTier) || "";
  const claimable = searchParams.get("claimable") === "true";
  const checkouts = await prisma.checkout.findMany({
    where: {
      address,
      ...(status && { status }),
      ...(tier && { tier }),
      ...(claimable && { waitlistId: null }),
    },
  });

  return NextResponse.json(checkouts);
};
