// A library of functions that are not CRUD but are used to help with database operations
import prisma from "../prisma";

/**
 * @param referrerFid - The referrer's fid
 * @param waitlistId - The waitlist id
 * @returns The referrer's fid as a number or null if referrerFid is not a valid referrer for that waitlist or does not exist
 **/
export const validateReferrer = async (
  referrerFid: string | undefined,
  waitlistId: number
): Promise<number | null> => {
  try {
    if (!referrerFid || referrerFid === "1") {
      return null;
    }

    // Check if the referrer exists in the given waitlist
    const referrer = await prisma.waitlistedUser.findFirst({
      where: {
        waitlistId: waitlistId,
        fid: parseInt(referrerFid),
      },
    });

    if (!referrer) {
      return null;
    }

    return parseInt(referrerFid);
  } catch (e) {
    console.log("Error while validating the referrer: ", e);
    return null;
  }
};
