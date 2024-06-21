import { Types, Utils } from "@requestnetwork/request-client.js";
import { ICreateRequestParameters } from "@requestnetwork/request-client.js/dist/types";

export interface CreateRequestParams {
  payeeIdentity: string;
  payerIdentity: string;
  signerIdentity: string;
  expectedAmount: string | number;
  paymentAddress: string;
  reason: string;
  currencyAddress: string;
}

/*---------------------------------------------------------------------------------------------------------*/
// GLOSSARY
// payeeIdentity -> beneficiary of the request payment for storage and notification purpose
// payerIdentity -> payer of the request payment for storage and notification purpose
// paymentAddress -> beneficiary of the request payment for the actual payment. paymentAddress and payeeIdentity can be different. For simplicity they should be the same
// signer -> who creates the payment request. It should be both the payerIdentity and payeeIdentity
/*---------------------------------------------------------------------------------------------------------*/

// Payment request creation. It can be called both by the payer or payee of a request. It is used both to create a standard and a swap-to-pay request
export const createRequestParameters = ({
  payeeIdentity,
  payerIdentity,
  signerIdentity,
  expectedAmount,
  paymentAddress,
  reason,
  currencyAddress,
}: CreateRequestParams) => {
  const requestCreateParameters: ICreateRequestParameters = {
    requestInfo: {
      currency: {
        type: Types.RequestLogic.CURRENCY.ERC20,
        value: currencyAddress,
        network: "base",
      },
      expectedAmount: expectedAmount,
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity,
      },
      timestamp: Utils.getCurrentTimestampInSecond(),
    },
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT as any, // ANY_TO_ERC20_PROXY maybe we should use this for swap-and-pay
      parameters: {
        paymentNetworkName: "base",
        paymentAddress: paymentAddress, // should be equal to payeeIdentity for simplicity. But it's not mandatory
        feeAddress: "0x0000000000000000000000000000000000000000",
        feeAmount: "0",
      },
    },
    contentData: {
      reason: reason, // TODO: this param could be the groupId reference ??
    },
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: signerIdentity,
    },
  };

  return requestCreateParameters;
};
