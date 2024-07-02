export type UsersSyncPayload = {
  data: {
    offset: number;
  };
};

export type BroadcastDCPayload = {
  data: {
    fid: number;
    text: string;
  };
};

export type BroadcastXMTPPayload = {
  data: {
    address: string;
    text: string;
  };
};
