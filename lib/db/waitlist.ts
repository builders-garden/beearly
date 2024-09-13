// This is a library with functions to interact with the waitlist table in the database.
import { Waitlist } from "@prisma/client";
import prisma from "../prisma";

/**
 * @param address - The user's address.
 * @returns all waitlists that the user has created.
 **/
export const getUserWaitlists = async (
  address: string
): Promise<Waitlist[]> => {
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
export const getUserWaitlistsCount = async (
  address: string
): Promise<number> => {
  return await prisma.waitlist.count({
    where: {
      userAddress: address!,
    },
  });
};

/**
 * @param slugName - The slug of the waitlist.
 * @returns the first found waitlist with the given slug name.
 */
export const getWaitlistBySlug = async (
  slug: string
): Promise<Waitlist | null> => {
  return await prisma.waitlist.findFirst({
    where: {
      slug: slug,
    },
  });
};

/**
 * @param waitlistId - The id of the waitlist.
 * @returns the first found waitlist with the given id.
 */
export const getWaitlistById = async (
  waitlistId: number
): Promise<Waitlist | null> => {
  return await prisma.waitlist.findFirst({
    where: {
      id: waitlistId,
    },
  });
};

/**
 * @param idOrSlug - The id or slug of the waitlist.
 * @returns the first found waitlist with the given id or slug or null if not found.
 */
export const getWaitlistByIdOrSlug = async (
  idOrSlug: string
): Promise<Waitlist | null> => {
  // Find the waitlist associated with the id or slug based on the type
  let waitlist;
  if (isNaN(parseInt(idOrSlug))) {
    // Find the waitlist associated with the slug
    waitlist = await prisma.waitlist.findFirst({
      where: {
        slug: idOrSlug,
      },
    });
  } else {
    // Find the waitlist associated with the id
    waitlist = await prisma.waitlist.findFirst({
      where: {
        id: parseInt(idOrSlug),
      },
    });
  }
  return waitlist;
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
export const createWaitlist = async (payload: {
  data: Omit<Waitlist, "id">;
}) => {
  return await prisma.waitlist.create(payload);
};
