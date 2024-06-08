// This is a library with functions to interact with the waitlist table in the database.
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
 * @param slugName - The slug name of the waitlist.
 * @returns the first found waitlist with the given slug name.
 */
export const findFirstWaitlist = async (slugName: string) => {
  return await prisma.waitlist.findFirst({
    where: {
      slug: slugName,
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
export const createWaitlist = async (payload: { data: any }) => {
  return await prisma.waitlist.create(payload);
};
