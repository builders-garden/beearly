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
 * Gets a Talent Passport User using the wallet address or his id.
 * @param walletOrId - A wallet address connected to the Talent Passport or the user's ID.
 * @returns The Talent Passport User or null if not found.
 **/
export const getTalentPassportByWalletOrId = async (
  walletOrId: string
): Promise<TalentPassportUserResponse | null> => {
  // Try to fetch the Talent Passport User
  const response = await fetch(
    `https://api.talentprotocol.com/api/v2/passports/${walletOrId}`,
    {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.TALENT_API_KEY!,
        "Content-Type": "application/json",
      },
    }
  );

  // Get the JSON response
  const responseJson = await response.json();

  // If the response is not ok or the JSON is empty, return null
  if (!response.ok || !responseJson) {
    return null;
  }

  // Return the Talent Passport User
  return responseJson;
};
