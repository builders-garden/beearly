import { NextRequest } from "next/server";
import prisma from "../prisma";
import { ApiKey } from "@prisma/client";
import { isApiKeyModeValid } from "./utils";
import { HttpMethod } from "./types";

/**
 * @param keyId - The ID of the API key
 * @param path - The path of the request
 * @param method - The HTTP method of the request
 */
export const createApiKeyLog = async (
  keyId: number,
  path: string,
  method: HttpMethod
) => {
  try {
    // Create an API request log in the database
    await prisma.apiRequest.create({
      data: {
        api_key_id: keyId,
        path: path,
        method: method as string,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error(
      "Could not create a new ApiRequest log in the database, error: ",
      error
    );
  }
};

/**
 * @param req - The NextRequest object
 * @returns An object containing the API key and whether it is valid
 */
export const validateApiKey = async (
  req: NextRequest
): Promise<{ apiKey: ApiKey | null; valid: boolean }> => {
  try {
    // Get the API key from the headers and check if it exists
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return {
        apiKey: null,
        valid: false,
      };
    }

    // Check if the API key exists in the database
    const key = await prisma.apiKey.findUnique({
      where: {
        key: apiKey,
      },
    });

    // Get the HTTP method of the request
    const method = req.method as HttpMethod;

    // If the API key doesn't exist in the database or the mode is incorrect, return false
    if (!key || !isApiKeyModeValid(key.mode, method)) {
      return {
        apiKey: null,
        valid: false,
      };
    }

    // Create an API request log in the database
    await createApiKeyLog(
      key.id,
      req.url.replace(`${process.env.BASE_URL}`, ""),
      method
    );

    // Return the API key and that it is valid
    return {
      apiKey: key,
      valid: true,
    };
  } catch (error) {
    console.error("Could not validate the API key, error: ", error);
    return {
      apiKey: null,
      valid: false,
    };
  }
};
