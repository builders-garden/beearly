// This is a public API endpoint that will be invoked by QStash.
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { loadQstash } from "../../../../../lib/qstash";
import { UsersSyncPayload } from "../../../../../lib/qstash/types";
import prisma from "../../../../../lib/prisma";
import {
  fetchFarcasterProfiles,
  UserProfile,
} from "../../../../../lib/airstack";

async function handler(request: NextRequest) {
  // Get the payload from the request and extract the offset
  const body: UsersSyncPayload = await request.json();
  console.log(JSON.stringify(body));
  const { offset } = body;

  try {
    // Read users from the WaitlistedUser Model in the database, grouped by fid with [offset]
    const usersBatch = await prisma.waitlistedUser.findMany({
      distinct: ["fid"],
      skip: offset,
      take: 400,
      orderBy: { fid: "asc" },
    });

    // Transforming the fids number array to a string array to satisfy the Airstack query
    const fidsString = usersBatch.map((fid) => fid.toString());

    // Call Airstack to fetch all useful information about the users in the batch
    const usersToUpdate: UserProfile[] = [];
    let pointer = "";

    do {
      const res = await fetchFarcasterProfiles(fidsString, pointer);
      if (res) {
        const { profiles, pageInfo } = res;
        usersToUpdate.push(...profiles);
        pointer = pageInfo.nextCursor;
      }
    } while (pointer);

    // Update the users in the database with the new information
    for (const user of usersToUpdate) {
      await prisma.waitlistedUser.updateMany({
        where: {
          fid: parseInt(user.userId!),
        },
        data: {
          address: user.userAddress,
          displayName: user.profileDisplayName ?? "",
          username: user.profileName ?? "",
          avatarUrl: user.profileImage ?? "",
          powerBadge: user.isFarcasterPowerUser,
          updatedAt: new Date(),
        },
      });
    }

    // exit if there are no more users to sync
    if (usersBatch.length < 400) {
      return new NextResponse("No more users to sync", { status: 200 });
    }
  } catch (error) {
    return new NextResponse("Error while syncing a batch of users", {
      status: 500,
    });
  } finally {
    // Send the next payload to QStash to continue syncing users, whatever the outcome
    const { response } = await loadQstash(
      `${process.env.BASE_URL}/api/qstash/workers/sync-users`,
      offset + 400
    );
    if (response === "ko") {
      throw new Error("Error while publishing json to QStash");
    }

    return new NextResponse("Successfully sent another batch to update", {
      status: 200,
    });
  }
}

export const POST = verifySignatureAppRouter(handler);
