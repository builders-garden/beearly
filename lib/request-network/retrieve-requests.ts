import { RequestNetwork } from "@requestnetwork/request-client.js";

// Retrieve a request from its requestId (should be saved in our DB)
export const getRequestData = async (
  requestClient: RequestNetwork,
  requestId: string
) => {
  try {
    const request = await requestClient.fromRequestId(requestId);
    const requestData = request.getData();
    return requestData;
  } catch (error) {
    console.error("Error fetching request data:", error);
    throw error; // or handle the error as needed
  }
};
