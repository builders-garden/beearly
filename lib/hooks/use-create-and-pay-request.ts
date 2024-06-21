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

interface UseCreateAndPayRequestParams {
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

  return useMutation({
    mutationFn: async ({
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

      console.log("Waiting confirmation...");
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
        throw new Error(message);
      }

      setButtonLoadingMessage("Sending payment");
      // Send payment transaction
      await sendPaymentTransaction(requestData, ethersSigner!);

      console.log("Payment sent");
      return createdRequest.requestId;
    },
    ...options,
  });
}
