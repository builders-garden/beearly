import prisma from "./prisma";

const generateRandomNumberInRange = (start: number, end: number) =>
  Math.floor(Math.random() * end) + start;

/**
 * Gets a captcha challenge record from the database
 * @param id - The id of the captcha challenge record in the database
 * @returns The captcha challenge record from the database
 **/
export const getCaptchaChallenge = async (id: number) => {
  return await prisma.captchaChallenge.findUnique({
    where: {
      id: id,
    },
  });
};

/**
 * Generates a new captcha challenge record in the database
 * @param userAddress - The address of the user that is trying to solve the captcha
 * @param waitlistId - The id of the waitlist that the user is trying to join
 * @returns The id of the new captcha challenge record created in the database and the two numbers the user needs to add
 **/
export const generateCaptchaChallenge = async (
  userAddress: string,
  waitlistId: number
) => {
  const numA = generateRandomNumberInRange(10, 20);
  const numB = generateRandomNumberInRange(10, 20);
  const newChallenge = await prisma.captchaChallenge.create({
    data: {
      waitlistId: waitlistId,
      userAddress: userAddress,
      numA: numA,
      numB: numB,
      result: numA + numB,
      createdAt: new Date(),
    },
  });
  return {
    id: newChallenge.id,
    numA,
    numB,
  };
};

/**
 * Deletes a captcha challenge record from the database
 * @param id - The id of the captcha challenge record in the database
 **/
export const deleteCaptchaChallenge = async (id: number) =>
  await prisma.captchaChallenge.delete({
    where: {
      id: id,
    },
  });

/**
 * Validates a captcha challenge
 * @param id - The id of the captcha challenge record in the database
 * @param result - The result proposed by the user to the captcha challenge
 * @returns Whether the result is correct or not
 **/
export const validateCaptchaChallenge = async (
  id: number,
  result: string | undefined
) => {
  // If the result is not a number, return false
  if (!result || isNaN(parseInt(result))) {
    return false;
  }

  // Get the captcha challenge from the database
  const captchaChallenge = await getCaptchaChallenge(id);
  if (!captchaChallenge) {
    return false;
  }

  // Check if the result is correct
  const { result: storedResult } = captchaChallenge;
  return parseInt(result) === storedResult;
};
