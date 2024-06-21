import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { CheckoutStatus } from "@prisma/client";

export const POST = async (req: NextRequest) => {
  const address = req.headers.get("x-address")!;

  const body = await req.json();
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
