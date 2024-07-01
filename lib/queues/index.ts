import {
  MessageWithFarcasterIdBody,
  dcsQueue,
  processDC,
} from "./direct-casts";
import {
  MessageWithAddressBody,
  processXMTPmessage,
  xmtpQueue,
} from "./xmtp-messages";

// Constants to define the job names
const DCS_JOB_NAME = "create-dc";
const XMTP_JOB_NAME = "send-xmtp";

/**
 * @dev this function adds a new job to the dcs queue, or processes it directly if the queue is not available.
 * @param {MessageWithFarcasterIdBody} data the data to put in the queue or process directly
 */
export const addToDCsQueue = async (data: MessageWithFarcasterIdBody) => {
  if (dcsQueue) {
    console.log(
      `[dcs] [${new Date(Date.now()).toLocaleString()}] - adding dc to queue.`
    );
    await dcsQueue.add(DCS_JOB_NAME, data);
    return;
  }
  console.log(
    `[dcs] [${new Date(Date.now()).toLocaleString()}] - processing dc directly.`
  );
  await processDC({ data });
};

/**
 * @dev this function adds a new job to the xmtp queue, or processes it directly if the queue is not available.
 * @param {MessageWithAddressBody} data the data to put in the queue or process directly
 */
export const addToXMTPQueue = async (data: MessageWithAddressBody) => {
  if (xmtpQueue) {
    console.log(
      `[xmtp] [${new Date(Date.now()).toLocaleString()}] - adding xmtp message to queue.`
    );
    await xmtpQueue.add(XMTP_JOB_NAME, data);
    return;
  }
  console.log(
    `[xmtp] [${new Date(Date.now()).toLocaleString()}] - processing xmtp message directly.`
  );
  await processXMTPmessage({ data });
};
