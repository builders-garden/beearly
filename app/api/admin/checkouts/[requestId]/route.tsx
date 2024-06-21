import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export const PUT = async (
  req: NextRequest,
  {
    params: { requestId },
  }: {
    params: { requestId: string };
  }
) => {
  const body = await req.json();
  const { status, waitlistId, address } = body;

  const existingCheckout = await prisma.checkout.findFirst({
    where: { requestId, address },
  });

  if (!existingCheckout) {
    return NextResponse.json(
      {
        message: "Checkout not found",
      },
      {
        status: 404,
      }
    );
  }

  const checkout = await prisma.checkout.update({
    where: { requestId, address },
    data: {
      ...(status && { status }),
      ...(waitlistId && { waitlistId }),
    },
  });

  return NextResponse.json(checkout);
};
