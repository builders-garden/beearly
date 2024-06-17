// This is a public API endpoint that will be invoked by QStash.
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { publishToQstash } from "../../../../../lib/qstash";
import { UsersSyncPayload } from "../../../../../lib/qstash/types";
import prisma from "../../../../../lib/prisma";
import {
  fetchFarcasterProfiles,
  UserProfile,
} from "../../../../../lib/airstack";

async function handler(request: NextRequest) {
  // Get the payload from the request and extract the offset
  const body: UsersSyncPayload = await request.json();
  const { offset } = body;

  // Declaring the batch size
  const batchSize = 400;

  try {
    // Read users from the WaitlistedUser Model in the database, grouped by fid with and taken with an offset
    const usersBatch = await prisma.waitlistedUser.groupBy({
      by: ["fid"],
      skip: offset,
      take: batchSize,
      orderBy: { fid: "asc" },
    });

    // Do the syncing work if there is at least one user in the batch (nobody is left behind!)
    if (usersBatch.length > 0) {
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

      // Creating chunks of users to update in the database in a concurrent way
      const usersToUpdateChunks: UserProfile[][] = [];
      const chunkSize = 200;

      for (let i = 0; i < usersToUpdate.length; i += chunkSize) {
        usersToUpdateChunks.push(usersToUpdate.slice(i, i + chunkSize));
      }

      // Concurrently update the users in the database with the new information
      for (const chunk of usersToUpdateChunks) {
        await Promise.all(
          chunk.map(async (user) => {
            return prisma.waitlistedUser.updateMany({
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

                // We may add...

                // follower count
                // following count
                // location
                // profile Bio
                // Social Capital Rank
                // Social Capital Score
              },
            });
          })
        );
      }
    }

    // Exit if there are no more users to sync
    if (usersBatch.length < batchSize) {
      return new NextResponse("No more users to sync", { status: 200 });
    }
  } catch (error) {
    return new NextResponse(
      `Error while syncing batch #${((offset % batchSize) + 1).toString()}`,
      {
        status: 500,
      }
    );
  } finally {
    // Send the next payload to QStash to continue syncing users, whatever the outcome
    const { response } = await publishToQstash(
      `${process.env.BASE_URL}/api/qstash/workers/sync-users`,
      offset + batchSize
    );
    if (response === "ko") {
      throw new Error("Error while publishing json to QStash");
    }

    return new NextResponse(
      `Successfully sent batch #${((offset % batchSize) + 2).toString()} to QStash`,
      {
        status: 200,
      }
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
