import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useAccount, useWalletClient } from "wagmi";
import { getRequestClient } from "../request-network";
import {
  CreateRequestParams,
  createRequestParameters,
} from "../request-network/create-request";
import {
  processPayment,
  sendPaymentTransaction,
} from "../request-network/pay-request";
import { getRequestData } from "../request-network/retrieve-requests";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { useEthersV5Provider } from "./use-ethers-v5-provider";
import { useEthersV5Signer } from "./use-ethers-v5-signer";
import { base } from "viem/chains";
import { CheckoutStatus, WaitlistTier } from "@prisma/client";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";

interface UseCreateAndPayRequestParams {
  tier: WaitlistTier;
  amount: number;
  requestParams: CreateRequestParams;
  setButtonLoadingMessage: (message: string) => void;
}

export function useCreateAndPayRequest(
  options?: Omit<
    UseMutationOptions<string, Error, UseCreateAndPayRequestParams, unknown>,
    "mutationFn"
  >
) {
  const { address } = useAccount();

  const { data: walletClient } = useWalletClient();
  const ethersProvider = useEthersV5Provider({ chainId: base.id });
  const ethersSigner = useEthersV5Signer({ chainId: base.id });
  const jwt = getAuthToken();

  const createCheckout = async (data: {
    requestId: string;
    tier: WaitlistTier;
    amount: number;
  }) => {
    try {
      const res = await fetch(`/api/checkouts/`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateCheckout = async (
    requestId: string,
    data: {
      status: CheckoutStatus;
    }
  ) => {
    try {
      const res = await fetch(`/api/checkouts/${requestId}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return useMutation({
    mutationFn: async ({
      tier,
      amount,
      requestParams,
      setButtonLoadingMessage,
    }: UseCreateAndPayRequestParams) => {
      setButtonLoadingMessage("Preparing checkout");
      const signer = new Web3SignatureProvider(walletClient);
      if (!address || !signer) throw new Error("Account not initialized");
      if (!walletClient) throw new Error("Wallet client not initialized");

      // Create request
      const requestCreateParameters = createRequestParameters(requestParams);

      console.log("Getting request client...");
      const requestClient = getRequestClient(walletClient);

      console.log("Creating request..." + requestCreateParameters);
      const createdRequest = await requestClient.createRequest(
        requestCreateParameters
      );

      await createCheckout({
        requestId: createdRequest.requestId,
        tier,
        amount,
      });

      await console.log("Waiting confirmation...");
      const confirmedRequestData = await createdRequest.waitForConfirmation();

      console.log("Request created", confirmedRequestData.requestId);

      // Prepare for payment
      const requestData = await getRequestData(
        requestClient,
        confirmedRequestData.requestId
      );

      console.log("Request data", requestData);
      console.log("Processing payment...");
      setButtonLoadingMessage("Preparing payment");
      const { success, message } = await processPayment(
        requestData,
        address,
        ethersProvider,
        ethersSigner!
      );
      if (!success) {
        console.error(message);
        await updateCheckout(createdRequest.requestId, {
          status: CheckoutStatus.ERROR,
        });
        throw new Error(message);
      }

      setButtonLoadingMessage("Sending payment");
      // Send payment transaction
      await sendPaymentTransaction(requestData, ethersSigner!);

      await updateCheckout(createdRequest.requestId, {
        status: CheckoutStatus.SUCCESS,
      });

      console.log("Payment sent");
      return createdRequest.requestId;
    },
    ...options,
  });
}
