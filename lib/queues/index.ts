import {
  MessageWithFarcasterIdBody,
  dcsQueue,
  processDC,
} from "./direct-casts";

const DCS_JOB_NAME = "create-dc";

export const addToDCsQueue = async (data: MessageWithFarcasterIdBody) => {
  if (dcsQueue) {
    console.log(`[dcs] [${Date.now()}] - adding dc to queue.`);
    await dcsQueue.add(DCS_JOB_NAME, data);
    return;
  }
  console.log(`[dcs] [${Date.now()}] - processing dc directly.`);
  await processDC({ data });
};
