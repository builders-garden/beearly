import { BASE_FRAME_URL } from "./constants";

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

export const createCastIntent = (
  fid: number,
  waitlistName: string,
  waitlistSlug: string,
  referrerFid?: string
) => {
  //const waitlistFrameUrl = `${BASE_FRAME_URL}/${waitlistSlug}?ref=${fid}`;
  const waitlistFrameUrl = `https://beearly.club/w/${waitlistSlug}?ref=${fid}&refSquared=${referrerFid}`;
  const text = `I've joined ${waitlistName} waitlist!\n\nJoin through the frame below and help me climb up the leaderboard!\n\nPowered by /beearly 🐝`;
  const finalURL = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(waitlistFrameUrl)}`;
  console.log(finalURL);
  return finalURL;
};

export const createReferralCastIntent = (
  waitlistName: string,
  waitlistSlug: string
) => {
  //const waitlistFrameUrl = `${BASE_FRAME_URL}/${waitlistSlug}?ref=${fid}`;
  const waitlistFrameUrl = `https://beearly.club/w/${waitlistSlug}`;
  const text = `Join ${waitlistName} waitlist through the frame below and help me climb up the leaderboard!\n\nPowered by /beearly 🐝`;
  const urlFriendlyText = encodeURIComponent(text);
  return `https://warpcast.com/~/compose?text=${urlFriendlyText}&embeds[]=${waitlistFrameUrl}`;
};
