// This is a library with functions to interact with the waitlist table in the database.
import { Waitlist } from "@prisma/client";
import prisma from "../prisma";

/**
 * @param address - The user's address.
 * @returns all waitlists that the user has created.
 **/
export const getUserWaitlists = async (address: string) => {
  return await prisma.waitlist.findMany({
    where: {
      userAddress: address!,
    },
    include: {
      _count: {
        select: { waitlistedUsers: true },
      },
      waitlistRequirements: true,
    },
  });
};

/**
 * @param address - The user's address.
 * @returns the number of waitlists the user has created.
 */
export const getUserWaitlistsCount = async (address: string): Promise<number> => {
  return (
    await prisma.waitlist.findMany({
      where: {
        userAddress: address!,
      },
      include: {
        _count: {
          select: { waitlistedUsers: true },
        },
        waitlistRequirements: true,
      },
    })
  ).length;
};

/**
 * @param slugName - The slug of the waitlist.
 * @returns the first found waitlist with the given slug name.
 */
export const getWaitlistBySlug = async (slug: string) => {
  return await prisma.waitlist.findFirst({
    where: {
      slug: slug,
    },
  });
};

/**
 * Create a Waitlist.
 * @param {WaitlistCreateArgs} payload - Payload to create a Waitlist.
 * @example
 * // Create one Waitlist
 * const Waitlist = await createWaitlist({
 *   data: {
 *     // ... data to create a Waitlist
 *   }
 * })
 *
 **/
export const createWaitlist = async (payload: { data: Omit<Waitlist, "id"> }) => {
  return await prisma.waitlist.create(payload);
};
