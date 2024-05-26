import {
  MessageWithFarcasterIdBody,
  dcsQueue,
  processDC,
} from "./direct-casts";

const DCS_JOB_NAME = "create-dc";

export const addToDCsQueue = async (data: MessageWithFarcasterIdBody) => {
  if (dcsQueue) {
    await dcsQueue.add(DCS_JOB_NAME, data);
    return;
  }

  await processDC({ data });
};
