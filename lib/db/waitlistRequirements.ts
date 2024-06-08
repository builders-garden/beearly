// This is a library with functions to interact with the waitlistRequirements table in the database.
import prisma from "../prisma";

/**
 * Create a WaitlistRequirement.
 * @param {WaitlistRequirementCreateArgs} payload - Payload to create a WaitlistRequirement.
 * @example
 * // Create one WaitlistRequirement
 * const WaitlistRequirement = await createWaitlistRequirement({
 *   data: {
 *     // ... data to create a WaitlistRequirement
 *   }
 * })
 *
 **/
export const createWaitlistRequirement = async (payload: { data: any }) => {
  return await prisma.waitlistRequirement.create(payload);
};

/**
 * Create many WaitlistRequirements.
 * @param {WaitlistRequirementCreateManyArgs} payload - Payload to create many WaitlistRequirements.
 * @example
 * // Create many WaitlistRequirements
 * const waitlistRequirement = await createManyWaitlistRequirements({
 *   data: [
 *     // ... provide data here
 *   ]
 * })
 *
 **/
export const createManyWaitlistRequirements = async (payload: { data: any }) => {
  return await prisma.waitlistRequirement.createMany(payload);
};
