import { Queue, Worker } from "bullmq";
import { redisConnection } from "./connection";
import { sendXMTPMessage } from "../xmtp";

const XMTP_QUEUE_NAME = "xmtp-messages";

export interface MessageWithAddressBody {
  address: string;
  text: string;
}

/**
 * @dev this function processes the xmtp message from the queue, or directly if the queue is not available.
 * @param job the job to process
 */
export const processXMTPmessage = async (job: {
  data: MessageWithAddressBody;
}) => {
  const { address, text } = job.data;

  console.log(
    `[xmtp worker] [${Date.now()}] - new xmtp job received. iterating.`
  );

  await sendXMTPMessage(address, text);

  console.log(`[xmtp worker] [${Date.now()}] - xmtp job processed.`);
};

if (process.env.REDIS_HOST) {
  console.log(`[xmtp worker] [${Date.now()}] - starting xmtp worker.`);
  const xmtpWorker = new Worker(XMTP_QUEUE_NAME, processXMTPmessage, {
    connection: redisConnection,
  });
}

export const xmtpQueue = process.env.REDIS_HOST
  ? new Queue(XMTP_QUEUE_NAME, {
      connection: redisConnection,
    })
  : null;
