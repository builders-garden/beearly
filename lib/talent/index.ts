interface PassportSocial {
  follower_count: string;
  following_count: string;
  location: string;
  profile_bio: string;
  profile_display_name: string;
  profile_image_url: string;
  profile_name: string;
  profile_url: string;
  source: string;
}

interface PassportProfile {
  bio: string;
  display_name: string;
  location: string;
  tags: string[];
}

interface Passport {
  calculating_score: boolean;
  connections_score: number;
  credentials_score: number;
  credibility_score: number;
  last_calculated_at: string;
  score: number;
  passport_profile: PassportProfile;
  merged: boolean;
  passport_socials: PassportSocial[];
}

interface TalentPassportUserResponse {
  passport: Passport;
}

/**
 * Gets a Talent Passport User using the wallet address.
 * @param wallet - The wallet address of the Talent Passport.
 * @returns The Talent Passport User or null if not found.
 **/
export const getTalentPassportByWallet = async (
  wallet: string
): Promise<TalentPassportUserResponse | null> => {
  const response = await fetch(
    `https://api.talentprotocol.com/api/v2/passports/${wallet}`,
    {
      method: "GET",
      headers: { "X-API-KEY": process.env.TALENT_API_KEY! },
    }
  );

  if (!response.ok) {
    return null;
  }

  return await response.json();
};
