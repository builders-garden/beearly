interface ChannelFollow {
  following: boolean;
  followedAt?: number;
}

export const isUserFollowingChannels = async (
  fid: number,
  channels: string[]
) => {
  const results = await Promise.all(
    channels.map((channel) => isUserFollowingChannel(fid, channel))
  );
  return results.every((result) => result?.following);
};

export const isUserFollowingChannel = async (
  fid: number,
  channel: string
): Promise<ChannelFollow> => {
  const response = await fetch(
    `https://api.warpcast.com/v1/user-channel?fid=${fid}&channelId=${channel}`
  );
  const data = await response.json();
  return data.result;
};
