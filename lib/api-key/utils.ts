import { HttpMethod } from "./types";

const allowedMethods: { [key: string]: HttpMethod[] } = {
  r: ["GET"],
  w: ["POST", "PUT", "DELETE", "PATCH"],
  rw: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

/**
 * @param apiKeyMode - The mode of the API key
 * @param method - The HTTP method of the request
 * @returns A boolean indicating whether the API key mode is valid for the method
 */
export const isApiKeyModeValid = (
  apiKeyMode: string,
  method: HttpMethod
): boolean => {
  // Gets the methods allowed for that specific API key mode
  const correspondingMethods = allowedMethods[apiKeyMode];

  // If the API key mode doesn't exist, return false
  if (!correspondingMethods) {
    return false;
  }

  // Else, return whether the method is allowed for that API key mode
  return correspondingMethods.includes(method);
};
