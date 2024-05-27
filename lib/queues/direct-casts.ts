import { Queue, Worker } from "bullmq";
import { sendDirectCast } from "../farcaster";
import { redisConnection } from "./connection";

const DCS_QUEUE_NAME = "dcs";

export interface MessageWithFarcasterIdBody {
  fid: number;
  text: string;
}

/**
 * @dev this function process the dc message from the queue, or directly if the queue is not available.
 * @param job the job to process
 */
export const processDC = async (job: { data: MessageWithFarcasterIdBody }) => {
  const { text, fid } = job.data;

  console.log(`[dcs worker] [${Date.now()}] - new dc received. iterating.`);

  await sendDirectCast(fid, text);

  console.log(`[dcs worker] [${Date.now()}] - dc job processed.`);
};

if (process.env.REDIS_HOST) {
  console.log(`[dcs worker] [${Date.now()}] - starting dcs worker.`);
  // @ts-ignore
  const dcsWorker = new Worker(DCS_QUEUE_NAME, processDC, {
    connection: redisConnection,
  });
}

export const dcsQueue = process.env.REDIS_HOST
  ? new Queue(DCS_QUEUE_NAME, {
      connection: redisConnection,
    })
  : null;
