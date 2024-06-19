import {
  hasSufficientFunds,
  payRequest,
} from "@requestnetwork/payment-processor";
import {
  approveErc20,
  hasErc20Approval,
} from "@requestnetwork/payment-processor";
import { Types } from "@requestnetwork/request-client.js";
import { Signer, providers } from "ethers";

// This function checks the balance and approval (if not it calls the approve) of the payer passing a requestData.
// So getRequestData in retrieve-request should be called first
export const processPayment = async (
  requestData: Types.IRequestData,
  payerAddress: string,
  provider: providers.Provider,
  signer: Signer
): Promise<{ success: boolean; message: string }> => {
  // Check if there are sufficient funds
  const hasFunds = await hasSufficientFunds({
    request: requestData,
    address: payerAddress,
    providerOptions: {
      provider,
    },
  });

  // If there are insufficient funds, you might want to handle this case,
  // for example, by throwing an error or returning a specific response
  if (!hasFunds) {
    console.error("Insufficient funds for the transaction.");
    return {
      success: false,
      message: "Insufficient funds for the transaction.",
    };
  }

  // Check ERC20 token approval
  const hasApproval = await hasErc20Approval(
    requestData,
    payerAddress,
    provider
  );

  // If approval is not yet given, then approve
  if (!hasApproval) {
    const approvalTx = await approveErc20(requestData, signer);
    await approvalTx.wait(); // wait for the transaction to be confirmed
  }

  // Return some success response or the next action
  return { success: true, message: "Ready for payment" };
};

export const sendPaymentTransaction = async (
  requestData: Types.IRequestData,
  signer: Signer
) => {
  const paymentTx = await payRequest(requestData, signer);
  return await paymentTx.wait(0); // wait for the transaction to be confirmed
};
