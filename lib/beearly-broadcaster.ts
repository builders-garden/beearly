export enum BeearlySender {
  BEEARLYBOT = "beearlybot",
}

export enum ChannelService {
  FarcasterDC = "farcaster-dc",
  XMTP = "xmtp",
}

export const publishToBeearlyBroadcaster = async (message: {
  text: string;
  sender: BeearlySender;
  receiver: string | number;
  channels: ChannelService[];
}) => {
  try {
    await fetch(`${process.env.BEEARLYBOT_API_URL}/api/beearly-broadcaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-beearlybot-api-key": process.env.BEEARLYBOT_API_KEY!,
      },
      body: JSON.stringify(message),
    });
  } catch (e) {
    console.error("Failed to send broadcast on Beearly Broadcaster", e);
    return {
      ok: false,
      error:
        "An error occurred while sending the broadcast on Beearly Broadcaster. Please try again later.",
    };
  }
};
