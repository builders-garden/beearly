export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Address: { input: any; output: any; }
  Any: { input: any; output: any; }
  DateRange: { input: any; output: any; }
  Identity: { input: any; output: any; }
  IntString: { input: any; output: any; }
  Map: { input: any; output: any; }
  Range: { input: any; output: any; }
  Time: { input: any; output: any; }
  TimeRange: { input: any; output: any; }
};

export type AccountOrderBy = {
  createdAtBlockTimestamp: InputMaybe<OrderBy>;
};

export type Address_Comparator_Exp = {
  _eq: InputMaybe<Scalars['Address']['input']>;
  _in: InputMaybe<Array<Scalars['Address']['input']>>;
  _ne: InputMaybe<Scalars['Address']['input']>;
  _nin: InputMaybe<Array<Scalars['Address']['input']>>;
};

export type AnimationUrlVariants = {
  original: Maybe<Scalars['String']['output']>;
};

export enum Audience {
  All = 'all',
  Farcaster = 'farcaster'
}

export type AudioVariants = {
  original: Maybe<Scalars['String']['output']>;
};

export enum Blockchain {
  Ethereum = 'ethereum'
}

export type Boolean_Comparator_Exp = {
  _eq: InputMaybe<Scalars['Boolean']['input']>;
};

export type CastValue = {
  formattedValue: Maybe<Scalars['Float']['output']>;
  hash: Maybe<Scalars['String']['output']>;
  rawValue: Maybe<Scalars['String']['output']>;
};

export type ConnectedAddress = {
  address: Maybe<Scalars['Address']['output']>;
  blockchain: Maybe<Scalars['String']['output']>;
  chainId: Maybe<Scalars['String']['output']>;
  timestamp: Maybe<Scalars['Time']['output']>;
};

export type Date_Range_Comparator_Exp = {
  _eq: InputMaybe<Scalars['String']['input']>;
};

export type Domain = {
  /** Avatar of the domain */
  avatar: Maybe<Scalars['String']['output']>;
  /** Blockchain where the NFT sale took place */
  blockchain: Blockchain;
  /** Unique identifier for the blockchain */
  chainId: Maybe<Scalars['String']['output']>;
  /** Block number when the domain was created */
  createdAtBlockNumber: Maybe<Scalars['Int']['output']>;
  /** Timestamp when the domain was created */
  createdAtBlockTimestamp: Maybe<Scalars['Time']['output']>;
  /** DApp name associated with the domain (e.g. ENS) */
  dappName: Maybe<DomainDappName>;
  /** DApp slug (contract version) associated with the domain */
  dappSlug: Maybe<DomainDappSlug>;
  /** Timestamp when the domain registration expires */
  expiryTimestamp: Maybe<Scalars['Time']['output']>;
  /** Domain registration cost in decimals */
  formattedRegistrationCost: Maybe<Scalars['Float']['output']>;
  /** Domain registration cost in native blockchain token in decimals */
  formattedRegistrationCostInNativeToken: Maybe<Scalars['Float']['output']>;
  /** Domain registration cost in USDC in decimals */
  formattedRegistrationCostInUSDC: Maybe<Scalars['Float']['output']>;
  /** Airstack unique identifier for the data point */
  id: Maybe<Scalars['ID']['output']>;
  /** Domain is name wrapped or not */
  isNameWrapped: Maybe<Scalars['Boolean']['output']>;
  /** Indicates if the domain is set to be primary - true or false */
  isPrimary: Maybe<Scalars['Boolean']['output']>;
  /** Airstack unique domain hash */
  labelHash: Maybe<Scalars['String']['output']>;
  /** Domain name without the domain ending, e.g. vitalik instead of vitalik.eth */
  labelName: Maybe<Scalars['String']['output']>;
  /** Block number when the domain was last updated */
  lastUpdatedBlockNumber: Maybe<Scalars['Int']['output']>;
  /** Timestamp when the domain was last updated */
  lastUpdatedBlockTimestamp: Maybe<Scalars['Time']['output']>;
  /** Manager of Domain */
  manager: Scalars['Address']['output'];
  /** Manager wallet related information, including address, domains, social profile, other token balances, and transfer history */
  managerDetails: Maybe<Wallet>;
  /** Multichain associated with the domain */
  multiChainAddresses: Maybe<Array<DomainMultiChainAddress>>;
  /** Full domain name, e.g. vitalik.eth */
  name: Maybe<Scalars['String']['output']>;
  /** Owner of token associated with the domain */
  owner: Scalars['Address']['output'];
  /** Owner wallet related information, including address, domains, social profile, other token balances, and transfer history */
  ownerDetails: Maybe<Wallet>;
  /** Parent domain name, if the entity is a subdomain */
  parent: Maybe<Scalars['String']['output']>;
  /** Nested query - can retrieve payment token data (name, symbol, etc.) */
  paymentToken: Maybe<Scalars['Address']['output']>;
  /** payment amount in blockchain native token for the domain */
  paymentTokenCostInNativeToken: Maybe<Scalars['Float']['output']>;
  /** payment amount in USDC for the domain */
  paymentTokenCostInUSDC: Maybe<Scalars['Float']['output']>;
  /** Domain registration cost */
  registrationCost: Maybe<Scalars['String']['output']>;
  /** Domain registration cost in blockchain native token */
  registrationCostInNativeToken: Maybe<Scalars['String']['output']>;
  /** Domain registration cost in USDC */
  registrationCostInUSDC: Maybe<Scalars['String']['output']>;
  /** Blockchain address to which the domain is resolved */
  resolvedAddress: Maybe<Scalars['Address']['output']>;
  /** Nested query - on-chain resolvedAddress wallet related information, including address, domains, social profile, other token balances, and transfer history */
  resolvedAddressDetails: Maybe<Wallet>;
  /** Resolver address associated with Domain */
  resolverAddress: Maybe<Scalars['Address']['output']>;
  /** Count of subdomains linked to the domain */
  subDomainCount: Maybe<Scalars['Int']['output']>;
  /** Nested query allowing to retrieve subdomain information associated with the domain */
  subDomains: Maybe<Array<Maybe<Domain>>>;
  /** Texts associated with the domain */
  texts: Maybe<Array<DomainTexts>>;
  /** Token Address associated with the domain, if applicable */
  tokenAddress: Scalars['Address']['output'];
  /** Domain Token ID associated with the domain, if applicable */
  tokenId: Maybe<Scalars['String']['output']>;
  /** Time-to-live value for the domain */
  ttl: Maybe<Scalars['String']['output']>;
};


export type DomainSubDomainsArgs = {
  input: InputMaybe<DomainsNestedInput>;
};

export enum DomainDappName {
  Ens = 'ens'
}

export type DomainDappName_Comparator_Exp = {
  _eq: InputMaybe<DomainDappName>;
  _in: InputMaybe<Array<DomainDappName>>;
};

export enum DomainDappSlug {
  EnsV1 = 'ens_v1'
}

export type DomainDappSlug_Comparator_Exp = {
  _eq: InputMaybe<DomainDappSlug>;
  _in: InputMaybe<Array<DomainDappSlug>>;
};

export type DomainFilter = {
  isPrimary: InputMaybe<Boolean_Comparator_Exp>;
  lastUpdatedBlockTimestamp: InputMaybe<Time_Comparator_Exp>;
  name: InputMaybe<String_Comparator_Exp>;
  owner: InputMaybe<Identity_Comparator_Exp>;
  resolvedAddress: InputMaybe<Address_Comparator_Exp>;
};

export type DomainMultiChainAddress = {
  /** address */
  address: Maybe<Scalars['String']['output']>;
  /** symbol according to SLIP-0044 */
  symbol: Maybe<Scalars['String']['output']>;
};

export type DomainOrderBy = {
  createdAtBlockTimestamp: InputMaybe<OrderBy>;
  expiryTimestamp: InputMaybe<OrderBy>;
  lastUpdatedBlockTimestamp: InputMaybe<OrderBy>;
};

export type DomainTexts = {
  /** key of the text */
  key: Maybe<Scalars['String']['output']>;
  /** value of the text */
  value: Maybe<Scalars['String']['output']>;
};

export type DomainsInput = {
  blockchain: Blockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: DomainFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<DomainOrderBy>>;
};

export type DomainsNestedInput = {
  blockchain: InputMaybe<Blockchain>;
  filter: InputMaybe<DomainFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<InputMaybe<DomainOrderBy>>>;
};

export type DomainsOutput = {
  Domain: Maybe<Array<Domain>>;
  pageInfo: Maybe<PageInfo>;
};

export enum EarnerType {
  ChannelFans = 'CHANNEL_FANS',
  Creator = 'CREATOR',
  CreatorFans = 'CREATOR_FANS',
  Network = 'NETWORK'
}

export enum EveryBlockchain {
  All = 'ALL'
}

export type FarcasterCast = {
  castValue: Maybe<CastValue>;
  castedAtTimestamp: Maybe<Scalars['Time']['output']>;
  castedBy: Maybe<Social>;
  channel: Maybe<FarcasterChannel>;
  embeds: Maybe<Array<Maybe<Scalars['Map']['output']>>>;
  fid: Maybe<Scalars['String']['output']>;
  frame: Maybe<FarcasterFrame>;
  hash: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['String']['output']>;
  mentions: Maybe<Array<Mentions>>;
  moxieEarningsSplit: Maybe<Array<Maybe<MoxieEarningsSplit>>>;
  notaTokenEarned: Maybe<SocialCapitalValue>;
  numberOfLikes: Maybe<Scalars['Int']['output']>;
  numberOfRecasts: Maybe<Scalars['Int']['output']>;
  numberOfReplies: Maybe<Scalars['Int']['output']>;
  parentCast: Maybe<FarcasterCast>;
  parentFid: Maybe<Scalars['String']['output']>;
  parentHash: Maybe<Scalars['String']['output']>;
  quotedCast: Maybe<Array<Maybe<FarcasterCast>>>;
  rawText: Maybe<Scalars['String']['output']>;
  rootParentUrl: Maybe<Scalars['String']['output']>;
  socialCapitalValue: Maybe<SocialCapitalValue>;
  text: Maybe<Scalars['String']['output']>;
  url: Maybe<Scalars['String']['output']>;
};

export type FarcasterCastFilter = {
  castedAtTimestamp: InputMaybe<Time_Comparator_Exp>;
  castedBy: InputMaybe<Identity_Comparator_Exp>;
  frameUrl: InputMaybe<String_Eq_In_Comparator_Exp>;
  hasEmbeds: InputMaybe<Boolean_Comparator_Exp>;
  hasFrames: InputMaybe<Boolean_Comparator_Exp>;
  hasMentions: InputMaybe<Boolean_Comparator_Exp>;
  hash: InputMaybe<String_Eq_In_Comparator_Exp>;
  rootParentUrl: InputMaybe<String_Eq_In_Comparator_Exp>;
  url: InputMaybe<String_Eq_In_Comparator_Exp>;
};

export type FarcasterCastInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterCastFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
};

export type FarcasterCastOutput = {
  Cast: Maybe<Array<FarcasterCast>>;
  pageInfo: Maybe<PageInfo>;
};

export type FarcasterChannel = {
  channelId: Scalars['String']['output'];
  createdAtTimestamp: Scalars['Time']['output'];
  dappName: Scalars['String']['output'];
  dappSlug: Scalars['String']['output'];
  description: Scalars['String']['output'];
  followerCount: Maybe<Scalars['Int']['output']>;
  /** Airstack unique identifier for the data point */
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  isModerationEnabled: Maybe<Scalars['Boolean']['output']>;
  leadIds: Maybe<Array<Scalars['String']['output']>>;
  leadProfiles: Maybe<Array<Social>>;
  moderatorIds: Maybe<Array<Scalars['String']['output']>>;
  moderatorProfiles: Maybe<Array<Social>>;
  name: Scalars['String']['output'];
  participants: Maybe<Array<FarcasterChannelParticipant>>;
  url: Scalars['String']['output'];
};


export type FarcasterChannelLeadProfilesArgs = {
  input: InputMaybe<SocialsNestedInput>;
};


export type FarcasterChannelModeratorProfilesArgs = {
  input: InputMaybe<SocialsNestedInput>;
};


export type FarcasterChannelParticipantsArgs = {
  input: InputMaybe<FarcasterChannelParticipantNestedInput>;
};

export enum FarcasterChannelActionType {
  Cast = 'cast',
  Follow = 'follow',
  Reply = 'reply'
}

export type FarcasterChannelActionType_Comparator_Exp = {
  _eq: InputMaybe<FarcasterChannelActionType>;
  _in: InputMaybe<Array<FarcasterChannelActionType>>;
};

export type FarcasterChannelFilter = {
  channelId: InputMaybe<Regex_String_Comparator_Exp>;
  createdAtTimestamp: InputMaybe<Time_Comparator_Exp>;
  leadId: InputMaybe<String_Comparator_Exp>;
  leadIdentity: InputMaybe<Identity_Comparator_Exp>;
  moderatorId: InputMaybe<String_Comparator_Exp>;
  moderatorIdentity: InputMaybe<Identity_Comparator_Exp>;
  name: InputMaybe<Regex_String_Comparator_Exp>;
  url: InputMaybe<String_Comparator_Exp>;
};

export type FarcasterChannelNestedInput = {
  blockchain: InputMaybe<EveryBlockchain>;
  filter: InputMaybe<FarcasterChannelFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<InputMaybe<FarcasterChannelOrderBy>>>;
};

export type FarcasterChannelOrderBy = {
  createdAtTimestamp: InputMaybe<OrderBy>;
  followerCount: InputMaybe<OrderBy>;
};

export type FarcasterChannelParticipant = {
  channel: Maybe<FarcasterChannel>;
  channelActions: Maybe<Array<FarcasterChannelActionType>>;
  channelId: Scalars['String']['output'];
  channelName: Scalars['String']['output'];
  dappName: Scalars['String']['output'];
  dappSlug: Scalars['String']['output'];
  /** Airstack unique identifier for the data point */
  id: Maybe<Scalars['ID']['output']>;
  lastActionTimestamp: Scalars['Time']['output'];
  lastCastedTimestamp: Maybe<Scalars['Time']['output']>;
  lastFollowedTimestamp: Maybe<Scalars['Time']['output']>;
  lastRepliedTimestamp: Maybe<Scalars['Time']['output']>;
  participant: Maybe<Social>;
  participantId: Scalars['String']['output'];
};


export type FarcasterChannelParticipantChannelArgs = {
  input: InputMaybe<FarcasterChannelNestedInput>;
};


export type FarcasterChannelParticipantParticipantArgs = {
  input: InputMaybe<SocialsNestedInput>;
};

export type FarcasterChannelParticipantFilter = {
  channelActions: InputMaybe<FarcasterChannelActionType_Comparator_Exp>;
  channelId: InputMaybe<Regex_String_Comparator_Exp>;
  channelName: InputMaybe<Regex_String_Comparator_Exp>;
  lastActionTimestamp: InputMaybe<Time_Comparator_Exp>;
  participant: InputMaybe<Identity_Comparator_Exp>;
};

export type FarcasterChannelParticipantNestedInput = {
  blockchain: InputMaybe<EveryBlockchain>;
  filter: InputMaybe<FarcasterChannelParticipantFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<InputMaybe<FarcasterChannelParticipantOrderBy>>>;
};

export type FarcasterChannelParticipantOrderBy = {
  lastActionTimestamp: InputMaybe<OrderBy>;
};

export type FarcasterChannelParticipantsInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterChannelParticipantFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<FarcasterChannelParticipantOrderBy>>;
};

export type FarcasterChannelParticipantsOutput = {
  FarcasterChannelParticipant: Maybe<Array<FarcasterChannelParticipant>>;
  pageInfo: Maybe<PageInfo>;
};

export type FarcasterChannelsInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: InputMaybe<FarcasterChannelFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<FarcasterChannelOrderBy>>;
};

export type FarcasterChannelsOutput = {
  FarcasterChannel: Maybe<Array<FarcasterChannel>>;
  pageInfo: Maybe<PageInfo>;
};

export type FarcasterFanTokenAuction = {
  auctionId: Maybe<Scalars['Int']['output']>;
  auctionSupply: Maybe<Scalars['Float']['output']>;
  channel: Maybe<FarcasterChannel>;
  decimals: Maybe<Scalars['Int']['output']>;
  entityId: Scalars['String']['output'];
  entityName: Maybe<Scalars['String']['output']>;
  entitySymbol: Maybe<Scalars['String']['output']>;
  entityType: FarcasterFanTokenAuctionEntityType;
  estimatedEndTimestamp: Scalars['Time']['output'];
  estimatedStartTimestamp: Scalars['Time']['output'];
  launchCastUrl: Maybe<Scalars['String']['output']>;
  minBiddingAmount: Maybe<Scalars['Float']['output']>;
  minFundingAmount: Maybe<Scalars['Float']['output']>;
  minPriceInMoxie: Maybe<Scalars['Float']['output']>;
  rewardDistributionPercentage: Maybe<RewardDistributionPercentage>;
  socials: Maybe<Array<Maybe<Social>>>;
  status: FarcasterFanTokenAuctionStatusType;
  subjectAddress: Maybe<Scalars['String']['output']>;
};


export type FarcasterFanTokenAuctionSocialsArgs = {
  input: InputMaybe<SocialsNestedInput>;
};

export enum FarcasterFanTokenAuctionEntityType {
  Channel = 'CHANNEL',
  Network = 'NETWORK',
  User = 'USER'
}

export type FarcasterFanTokenAuctionEntityType_Comparator_Exp = {
  _eq: InputMaybe<FarcasterFanTokenAuctionEntityType>;
  _in: InputMaybe<Array<FarcasterFanTokenAuctionEntityType>>;
};

export enum FarcasterFanTokenAuctionStatusType {
  Active = 'ACTIVE',
  Completed = 'COMPLETED',
  Upcoming = 'UPCOMING'
}

export type FarcasterFanTokenAuctionStatusType_Comparator_Exp = {
  _eq: InputMaybe<FarcasterFanTokenAuctionStatusType>;
  _in: InputMaybe<Array<FarcasterFanTokenAuctionStatusType>>;
};

export type FarcasterFanTokenAuctionsFilter = {
  entityId: InputMaybe<String_Eq_In_Comparator_Exp>;
  entityName: InputMaybe<String_Eq_In_Comparator_Exp>;
  entityType: FarcasterFanTokenAuctionEntityType_Comparator_Exp;
  status: InputMaybe<FarcasterFanTokenAuctionStatusType_Comparator_Exp>;
};

export type FarcasterFanTokenAuctionsInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterFanTokenAuctionsFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<FarcasterFanTokenAuctionsOrderBy>>;
};

export type FarcasterFanTokenAuctionsOrderBy = {
  estimatedEndTimestamp: InputMaybe<OrderBy>;
  estimatedStartTimestamp: InputMaybe<OrderBy>;
};

export type FarcasterFanTokenAuctionsOutput = {
  FarcasterFanTokenAuction: Maybe<Array<FarcasterFanTokenAuction>>;
  pageInfo: Maybe<PageInfo>;
};

export type FarcasterFrame = {
  buttons: Maybe<Array<FrameButton>>;
  castedAtTimestamp: Maybe<Scalars['Time']['output']>;
  frameHash: Maybe<Scalars['String']['output']>;
  frameUrl: Maybe<Scalars['String']['output']>;
  imageAspectRatio: Maybe<Scalars['String']['output']>;
  imageUrl: Maybe<Scalars['String']['output']>;
  inputText: Maybe<Scalars['String']['output']>;
  postUrl: Maybe<Scalars['String']['output']>;
  state: Maybe<Scalars['String']['output']>;
};

export type FarcasterFrameMessageInput = {
  filter: FarcasterFrameMessageInputFilter;
};

export type FarcasterFrameMessageInputFilter = {
  messageBytes: InputMaybe<Scalars['String']['input']>;
};

export type FarcasterFrameMessageOutput = {
  castedBy: Maybe<Social>;
  castedByFid: Maybe<Scalars['Int']['output']>;
  interactedBy: Maybe<Social>;
  interactedByFid: Maybe<Scalars['Int']['output']>;
  isValid: Maybe<Scalars['Boolean']['output']>;
  message: Maybe<FrameMessage>;
  messageByte: Maybe<Scalars['String']['output']>;
  messageRaw: Maybe<Scalars['Map']['output']>;
};

export type FarcasterMoxieClaimDetails = {
  availableClaimAmount: Maybe<Scalars['Float']['output']>;
  availableClaimAmountInWei: Maybe<Scalars['String']['output']>;
  chainId: Maybe<Scalars['String']['output']>;
  claimedAmount: Maybe<Scalars['Float']['output']>;
  claimedAmountInWei: Maybe<Scalars['String']['output']>;
  fid: Maybe<Scalars['String']['output']>;
  processingAmount: Maybe<Scalars['Float']['output']>;
  processingAmountInWei: Maybe<Scalars['String']['output']>;
  socials: Maybe<Array<Maybe<Social>>>;
  tokenAddress: Maybe<Scalars['String']['output']>;
};


export type FarcasterMoxieClaimDetailsSocialsArgs = {
  input: InputMaybe<SocialsNestedInput>;
};

export type FarcasterMoxieClaimDetailsFilter = {
  fid: InputMaybe<String_Eq_In_Comparator_Exp>;
};

export type FarcasterMoxieClaimDetailsInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterMoxieClaimDetailsFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<FarcasterMoxieClaimDetailsOrderBy>>;
};

export type FarcasterMoxieClaimDetailsOrderBy = {
  availableClaimAmount: InputMaybe<OrderBy>;
  claimedAmount: InputMaybe<OrderBy>;
  processingAmount: InputMaybe<OrderBy>;
};

export type FarcasterMoxieClaimDetailsOutput = {
  FarcasterMoxieClaimDetails: Maybe<Array<FarcasterMoxieClaimDetails>>;
  pageInfo: Maybe<PageInfo>;
};

export type FarcasterMoxieEarningStat = {
  allEarningsAmount: Maybe<Scalars['Float']['output']>;
  allEarningsAmountInWei: Maybe<Scalars['String']['output']>;
  castEarningsAmount: Maybe<Scalars['Float']['output']>;
  castEarningsAmountInWei: Maybe<Scalars['String']['output']>;
  channel: Maybe<FarcasterChannel>;
  endTimestamp: Scalars['Time']['output'];
  entityId: Scalars['String']['output'];
  entityType: FarcasterMoxieEarningStatsEntityType;
  frameDevEarningsAmount: Maybe<Scalars['Float']['output']>;
  frameDevEarningsAmountInWei: Maybe<Scalars['String']['output']>;
  otherEarningsAmount: Maybe<Scalars['Float']['output']>;
  otherEarningsAmountInWei: Maybe<Scalars['String']['output']>;
  socials: Maybe<Array<Maybe<Social>>>;
  splitDetails: Maybe<Array<FarcasterMoxieEarningStatSplitDetails>>;
  startTimestamp: Scalars['Time']['output'];
  timeframe: FarcasterMoxieEarningStatsTimeframe;
};


export type FarcasterMoxieEarningStatSocialsArgs = {
  input: InputMaybe<SocialsNestedInput>;
};

export type FarcasterMoxieEarningStatSplitDetails = {
  castEarningsAmount: Maybe<Scalars['Float']['output']>;
  castEarningsAmountInWei: Maybe<Scalars['String']['output']>;
  entityType: Scalars['String']['output'];
  frameDevEarningsAmount: Maybe<Scalars['Float']['output']>;
  frameDevEarningsAmountInWei: Maybe<Scalars['String']['output']>;
  otherEarningsAmount: Maybe<Scalars['Float']['output']>;
  otherEarningsAmountInWei: Maybe<Scalars['String']['output']>;
};

export enum FarcasterMoxieEarningStatsEntityType {
  Channel = 'CHANNEL',
  Network = 'NETWORK',
  User = 'USER'
}

export type FarcasterMoxieEarningStatsEntityType_Comparator_Exp = {
  _eq: InputMaybe<FarcasterMoxieEarningStatsEntityType>;
  _in: InputMaybe<Array<FarcasterMoxieEarningStatsEntityType>>;
};

export type FarcasterMoxieEarningStatsFilter = {
  entityId: InputMaybe<String_Eq_In_Comparator_Exp>;
  entityType: FarcasterMoxieEarningStatsEntityType_Comparator_Exp;
};

export type FarcasterMoxieEarningStatsInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterMoxieEarningStatsFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<FarcasterMoxieEarningStatsOrderBy>>;
  timeframe: FarcasterMoxieEarningStatsTimeframe;
};

export type FarcasterMoxieEarningStatsOrderBy = {
  allEarnings: InputMaybe<OrderBy>;
  castEarnings: InputMaybe<OrderBy>;
  frameDevEarnings: InputMaybe<OrderBy>;
  otherEarnings: InputMaybe<OrderBy>;
};

export type FarcasterMoxieEarningStatsOutput = {
  FarcasterMoxieEarningStat: Maybe<Array<FarcasterMoxieEarningStat>>;
  pageInfo: Maybe<PageInfo>;
};

export enum FarcasterMoxieEarningStatsTimeframe {
  Lifetime = 'LIFETIME',
  Today = 'TODAY',
  Weekly = 'WEEKLY'
}

export type FarcasterNotaEarningStat = {
  allEarningsAmount: Maybe<Scalars['Float']['output']>;
  allEarningsAmountInWei: Maybe<Scalars['String']['output']>;
  castEarningsAmount: Maybe<Scalars['Float']['output']>;
  castEarningsAmountInWei: Maybe<Scalars['String']['output']>;
  channel: Maybe<FarcasterChannel>;
  endTimestamp: Scalars['Time']['output'];
  entityId: Scalars['String']['output'];
  entityType: FarcasterFanTokenAuctionEntityType;
  frameDevEarningsAmount: Maybe<Scalars['Float']['output']>;
  frameDevEarningsAmountInWei: Maybe<Scalars['String']['output']>;
  otherEarningsAmount: Maybe<Scalars['Float']['output']>;
  otherEarningsAmountInWei: Maybe<Scalars['String']['output']>;
  socials: Maybe<Array<Maybe<Social>>>;
  startTimestamp: Scalars['Time']['output'];
  timeframe: FarcasterNotaEarningStatsTimeframe;
};


export type FarcasterNotaEarningStatSocialsArgs = {
  input: InputMaybe<SocialsNestedInput>;
};

export enum FarcasterNotaEarningStatsEntityType {
  Channel = 'CHANNEL',
  User = 'USER'
}

export type FarcasterNotaEarningStatsEntityType_Comparator_Exp = {
  _eq: InputMaybe<FarcasterNotaEarningStatsEntityType>;
  _in: InputMaybe<Array<FarcasterNotaEarningStatsEntityType>>;
};

export type FarcasterNotaEarningStatsFilter = {
  entityId: InputMaybe<String_Eq_In_Comparator_Exp>;
  entityType: FarcasterNotaEarningStatsEntityType_Comparator_Exp;
};

export type FarcasterNotaEarningStatsInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterNotaEarningStatsFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<FarcasterNotaEarningStatsOrderBy>>;
  timeframe: FarcasterNotaEarningStatsTimeframe;
};

export type FarcasterNotaEarningStatsOrderBy = {
  allEarnings: InputMaybe<OrderBy>;
  castEarnings: InputMaybe<OrderBy>;
  frameDevEarnings: InputMaybe<OrderBy>;
  otherEarnings: InputMaybe<OrderBy>;
};

export type FarcasterNotaEarningStatsOutput = {
  FarcasterNotaEarningStat: Maybe<Array<FarcasterNotaEarningStat>>;
  pageInfo: Maybe<PageInfo>;
};

export enum FarcasterNotaEarningStatsTimeframe {
  Lifetime = 'LIFETIME'
}

export type FarcasterQuotedRecastsFilter = {
  parentCastedBy: InputMaybe<Identity_Comparator_Exp>;
  parentHash: InputMaybe<String_Eq_In_Comparator_Exp>;
  parentUrl: InputMaybe<String_Eq_In_Comparator_Exp>;
  recastedBy: InputMaybe<Identity_Comparator_Exp>;
};

export type FarcasterQuotedRecastsInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterQuotedRecastsFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
};

export type FarcasterQuotedRecastsOutput = {
  QuotedRecast: Maybe<Array<FarcasterCast>>;
  pageInfo: Maybe<PageInfo>;
};

export type FarcasterReaction = {
  cast: Maybe<FarcasterCast>;
  castHash: Maybe<Scalars['String']['output']>;
  reactedBy: Maybe<Social>;
};

export enum FarcasterReactionCriteria {
  Liked = 'liked',
  Recasted = 'recasted',
  Replied = 'replied'
}

export type FarcasterReactionsFilter = {
  castHash: InputMaybe<String_Eq_In_Comparator_Exp>;
  castUrl: InputMaybe<String_Eq_In_Comparator_Exp>;
  channelId: InputMaybe<Regex_String_Comparator_Exp>;
  criteria: FarcasterReactionCriteria;
  frameUrl: InputMaybe<String_Eq_In_Comparator_Exp>;
  reactedBy: InputMaybe<Identity_Comparator_Exp>;
};

export type FarcasterReactionsInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterReactionsFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
};

export type FarcasterReactionsOutput = {
  Criteria: Maybe<FarcasterReactionCriteria>;
  Reaction: Maybe<Array<FarcasterReaction>>;
  pageInfo: Maybe<PageInfo>;
};

export type FarcasterRepliesFilter = {
  hash: InputMaybe<String_Eq_In_Comparator_Exp>;
  parentCastedBy: InputMaybe<Identity_Comparator_Exp>;
  parentHash: InputMaybe<String_Eq_In_Comparator_Exp>;
  parentUrl: InputMaybe<String_Eq_In_Comparator_Exp>;
  repliedBy: InputMaybe<Identity_Comparator_Exp>;
};

export type FarcasterRepliesInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: FarcasterRepliesFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
};

export type FarcasterRepliesOutput = {
  Reply: Maybe<Array<FarcasterCast>>;
  pageInfo: Maybe<PageInfo>;
};

export type FarcasterScore = {
  farBoost: Maybe<Scalars['Float']['output']>;
  farRank: Maybe<Scalars['Int']['output']>;
  farScore: Maybe<Scalars['Float']['output']>;
  farScoreRaw: Maybe<Scalars['String']['output']>;
  liquidityBoost: Maybe<Scalars['Float']['output']>;
  tvl: Maybe<Scalars['String']['output']>;
  tvlBoost: Maybe<Scalars['Float']['output']>;
};

export type Float_Comparator_Exp = {
  _eq: InputMaybe<Scalars['Float']['input']>;
  _gt: InputMaybe<Scalars['Float']['input']>;
  _gte: InputMaybe<Scalars['Float']['input']>;
  _in: InputMaybe<Array<Scalars['Float']['input']>>;
  _lt: InputMaybe<Scalars['Float']['input']>;
  _lte: InputMaybe<Scalars['Float']['input']>;
  _ne: InputMaybe<Scalars['Float']['input']>;
  _nin: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type FrameButton = {
  action: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['String']['output']>;
  index: Maybe<Scalars['Int']['output']>;
  label: Maybe<Scalars['String']['output']>;
  target: Maybe<Scalars['String']['output']>;
};

export type FrameMessage = {
  data: Maybe<FrameMessageData>;
  hash: Maybe<Scalars['String']['output']>;
  hashScheme: Maybe<Scalars['String']['output']>;
  signature: Maybe<Scalars['String']['output']>;
  signatureScheme: Maybe<Scalars['String']['output']>;
  signer: Maybe<Scalars['String']['output']>;
};

export type FrameMessageActionBody = {
  address: Maybe<Scalars['String']['output']>;
  buttonIndex: Maybe<Scalars['Int']['output']>;
  castId: Maybe<FrameMessageCastId>;
  inputText: Maybe<Scalars['String']['output']>;
  inputTextDecoded: Maybe<Scalars['String']['output']>;
  state: Maybe<Scalars['String']['output']>;
  stateDecoded: Maybe<Scalars['Any']['output']>;
  transactionHash: Maybe<Scalars['String']['output']>;
  transactionId: Maybe<Scalars['String']['output']>;
  url: Maybe<Scalars['String']['output']>;
  urlDecoded: Maybe<Scalars['String']['output']>;
};

export type FrameMessageCastId = {
  fid: Maybe<Scalars['Int']['output']>;
  hash: Maybe<Scalars['String']['output']>;
};

export type FrameMessageData = {
  fid: Maybe<Scalars['Int']['output']>;
  frameActionBody: Maybe<FrameMessageActionBody>;
  network: Maybe<Scalars['String']['output']>;
  time: Maybe<Scalars['Time']['output']>;
  type: Maybe<Scalars['String']['output']>;
};

export type Identity_Comparator_Exp = {
  _eq: InputMaybe<Scalars['Identity']['input']>;
  _in: InputMaybe<Array<Scalars['Identity']['input']>>;
};

export type ImageSizes = {
  extraSmall: Maybe<Scalars['String']['output']>;
  large: Maybe<Scalars['String']['output']>;
  medium: Maybe<Scalars['String']['output']>;
  original: Maybe<Scalars['String']['output']>;
  small: Maybe<Scalars['String']['output']>;
};

export type Int_Comparator_Exp = {
  _eq: InputMaybe<Scalars['Int']['input']>;
  _gt: InputMaybe<Scalars['Int']['input']>;
  _gte: InputMaybe<Scalars['Int']['input']>;
  _in: InputMaybe<Array<Scalars['Int']['input']>>;
  _lt: InputMaybe<Scalars['Int']['input']>;
  _lte: InputMaybe<Scalars['Int']['input']>;
  _ne: InputMaybe<Scalars['Int']['input']>;
  _nin: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Int_String_Comparator_Exp = {
  _eq: InputMaybe<Scalars['String']['input']>;
  _gt: InputMaybe<Scalars['String']['input']>;
  _gte: InputMaybe<Scalars['String']['input']>;
  _in: InputMaybe<Array<Scalars['String']['input']>>;
  _lt: InputMaybe<Scalars['String']['input']>;
  _lte: InputMaybe<Scalars['String']['input']>;
  _ne: InputMaybe<Scalars['String']['input']>;
  _nin: InputMaybe<Array<Scalars['String']['input']>>;
};

export type LogoSizes = {
  external: Maybe<Scalars['String']['output']>;
  large: Maybe<Scalars['String']['output']>;
  medium: Maybe<Scalars['String']['output']>;
  original: Maybe<Scalars['String']['output']>;
  small: Maybe<Scalars['String']['output']>;
};

export type Media = {
  animation_url: Maybe<AnimationUrlVariants>;
  audio: Maybe<AudioVariants>;
  image: Maybe<ImageSizes>;
  json: Maybe<Scalars['String']['output']>;
  video: Maybe<VideoVariants>;
};

export type Mentions = {
  fid: Maybe<Scalars['String']['output']>;
  position: Maybe<Scalars['Int']['output']>;
  profile: Maybe<Social>;
};

export type MoxieEarningsSplit = {
  earnerType: EarnerType;
  earningsAmount: Maybe<Scalars['Float']['output']>;
  earningsAmountInWei: Maybe<Scalars['String']['output']>;
};

export type NativeBalanceFilter = {
  formattedAmount: InputMaybe<Float_Comparator_Exp>;
  lastUpdatedTimestamp: InputMaybe<Time_Comparator_Exp>;
  owner: InputMaybe<Identity_Comparator_Exp>;
};

export type NativeBalanceOrderBy = {
  lastUpdatedTimestamp: InputMaybe<OrderBy>;
};

export enum OrderBy {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum OrderByAsIntString {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PageInfo = {
  hasNextPage: Scalars['Boolean']['output'];
  hasPrevPage: Scalars['Boolean']['output'];
  nextCursor: Scalars['String']['output'];
  prevCursor: Scalars['String']['output'];
};

export type PopularDapp = {
  address: Maybe<Scalars['String']['output']>;
  blockchain: Maybe<Scalars['String']['output']>;
  chainId: Maybe<Scalars['String']['output']>;
  criteria: Maybe<Scalars['String']['output']>;
  criteriaCount: Maybe<Scalars['Int']['output']>;
  description: Maybe<Scalars['String']['output']>;
  lastTransactionBlockNumber: Maybe<Scalars['Int']['output']>;
  lastTransactionHash: Maybe<Scalars['String']['output']>;
  lastTransactionTimestamp: Maybe<Scalars['Time']['output']>;
  name: Maybe<Scalars['String']['output']>;
  timeFrom: Maybe<Scalars['Time']['output']>;
  timeTo: Maybe<Scalars['Time']['output']>;
  userbase: Maybe<Scalars['String']['output']>;
  website: Maybe<Scalars['String']['output']>;
};

export enum PopularDappsCriteria {
  GasSpent = 'GAS_SPENT',
  TotalTransactions = 'TOTAL_TRANSACTIONS',
  UniqueUsers = 'UNIQUE_USERS'
}

export type Query = {
  Domains: Maybe<DomainsOutput>;
  FarcasterCasts: Maybe<FarcasterCastOutput>;
  FarcasterChannelParticipants: Maybe<FarcasterChannelParticipantsOutput>;
  FarcasterChannels: Maybe<FarcasterChannelsOutput>;
  FarcasterFanTokenAuctions: Maybe<FarcasterFanTokenAuctionsOutput>;
  FarcasterMoxieClaimDetails: Maybe<FarcasterMoxieClaimDetailsOutput>;
  FarcasterMoxieEarningStats: Maybe<FarcasterMoxieEarningStatsOutput>;
  FarcasterNotaEarningStats: Maybe<FarcasterNotaEarningStatsOutput>;
  FarcasterQuotedRecasts: Maybe<FarcasterQuotedRecastsOutput>;
  FarcasterReactions: Maybe<FarcasterReactionsOutput>;
  FarcasterReplies: Maybe<FarcasterRepliesOutput>;
  FarcasterValidateFrameMessage: Maybe<FarcasterFrameMessageOutput>;
  SocialFollowers: Maybe<SocialFollowerOutput>;
  SocialFollowings: Maybe<SocialFollowingOutput>;
  Socials: Maybe<SocialsOutput>;
  TrendingCasts: Maybe<TrendingCastsOutput>;
  Wallet: Maybe<Wallet>;
};


export type QueryDomainsArgs = {
  input: DomainsInput;
};


export type QueryFarcasterCastsArgs = {
  input: FarcasterCastInput;
};


export type QueryFarcasterChannelParticipantsArgs = {
  input: FarcasterChannelParticipantsInput;
};


export type QueryFarcasterChannelsArgs = {
  input: FarcasterChannelsInput;
};


export type QueryFarcasterFanTokenAuctionsArgs = {
  input: FarcasterFanTokenAuctionsInput;
};


export type QueryFarcasterMoxieClaimDetailsArgs = {
  input: FarcasterMoxieClaimDetailsInput;
};


export type QueryFarcasterMoxieEarningStatsArgs = {
  input: FarcasterMoxieEarningStatsInput;
};


export type QueryFarcasterNotaEarningStatsArgs = {
  input: FarcasterNotaEarningStatsInput;
};


export type QueryFarcasterQuotedRecastsArgs = {
  input: FarcasterQuotedRecastsInput;
};


export type QueryFarcasterReactionsArgs = {
  input: FarcasterReactionsInput;
};


export type QueryFarcasterRepliesArgs = {
  input: FarcasterRepliesInput;
};


export type QueryFarcasterValidateFrameMessageArgs = {
  input: FarcasterFrameMessageInput;
};


export type QuerySocialFollowersArgs = {
  input: SocialFollowerInput;
};


export type QuerySocialFollowingsArgs = {
  input: SocialFollowingInput;
};


export type QuerySocialsArgs = {
  input: SocialsInput;
};


export type QueryTrendingCastsArgs = {
  input: TrendingCastsInput;
};


export type QueryWalletArgs = {
  input: WalletInput;
};

export type Range_Comparator_Exp = {
  _eq: InputMaybe<Scalars['Int']['input']>;
};

export type Regex_String_Comparator_Exp = {
  _eq: InputMaybe<Scalars['String']['input']>;
  _gt: InputMaybe<Scalars['String']['input']>;
  _gte: InputMaybe<Scalars['String']['input']>;
  _in: InputMaybe<Array<Scalars['String']['input']>>;
  _lt: InputMaybe<Scalars['String']['input']>;
  _lte: InputMaybe<Scalars['String']['input']>;
  _ne: InputMaybe<Scalars['String']['input']>;
  _nin: InputMaybe<Array<Scalars['String']['input']>>;
  _regex: InputMaybe<Scalars['String']['input']>;
  _regex_in: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RewardDistributionPercentage = {
  channelFans: Scalars['Float']['output'];
  creator: Scalars['Float']['output'];
  creatorFans: Scalars['Float']['output'];
  network: Scalars['Float']['output'];
};

export type Simple_String_Comparator_Exp = {
  _eq: InputMaybe<Scalars['String']['input']>;
  _in: InputMaybe<Array<Scalars['String']['input']>>;
  _ne: InputMaybe<Scalars['String']['input']>;
  _nin: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Social = {
  /** Blockchain associated with the social identity */
  blockchain: Maybe<Blockchain>;
  /** Unique identifier for the blockchain */
  chainId: Maybe<Scalars['String']['output']>;
  connectedAddresses: Maybe<Array<ConnectedAddress>>;
  coverImageContentValue: Maybe<Media>;
  coverImageURI: Maybe<Scalars['String']['output']>;
  /** Social DApp name */
  dappName: Maybe<SocialDappName>;
  /** Social DApp slug (contract version) */
  dappSlug: Maybe<SocialDappSlug>;
  /** Airstack unique dapp version number */
  dappVersion: Maybe<Scalars['String']['output']>;
  farcasterScore: Maybe<FarcasterScore>;
  fnames: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  followerCount: Maybe<Scalars['Int']['output']>;
  followerTokenAddress: Maybe<Scalars['Address']['output']>;
  followers: Maybe<SocialFollowerOutput>;
  followingCount: Maybe<Scalars['Int']['output']>;
  followings: Maybe<SocialFollowingOutput>;
  handleTokenAddress: Maybe<Scalars['Address']['output']>;
  handleTokenId: Maybe<Scalars['String']['output']>;
  /** Airstack unique identifier for the data point */
  id: Maybe<Scalars['ID']['output']>;
  /** Blockchain address, ENS domain name, social identity such as Farcaster (for Farcaster use 'fc_fid:' prefix followed by the Farcaster user ID like fc_fid:5650, or use 'fc_fname:' prefix followed by the Farcaster user ID like 'fc_fname:vbuterin') */
  identity: Maybe<Scalars['Identity']['output']>;
  isDefault: Maybe<Scalars['Boolean']['output']>;
  location: Maybe<Scalars['String']['output']>;
  metadataURI: Maybe<Scalars['String']['output']>;
  profileBio: Maybe<Scalars['String']['output']>;
  profileCreatedAtBlockNumber: Maybe<Scalars['Int']['output']>;
  profileCreatedAtBlockTimestamp: Maybe<Scalars['Time']['output']>;
  profileDisplayName: Maybe<Scalars['String']['output']>;
  profileHandle: Maybe<Scalars['String']['output']>;
  profileImage: Maybe<Scalars['String']['output']>;
  profileImageContentValue: Maybe<Media>;
  profileLastUpdatedAtBlockNumber: Maybe<Scalars['Int']['output']>;
  profileLastUpdatedAtBlockTimestamp: Maybe<Scalars['Time']['output']>;
  profileMetadata: Maybe<Scalars['Map']['output']>;
  profileName: Maybe<Scalars['String']['output']>;
  profileTokenAddress: Maybe<Scalars['String']['output']>;
  profileTokenId: Maybe<Scalars['String']['output']>;
  profileTokenIdHex: Maybe<Scalars['String']['output']>;
  profileTokenUri: Maybe<Scalars['String']['output']>;
  profileUrl: Maybe<Scalars['String']['output']>;
  socialCapital: Maybe<SocialCapital>;
  twitterUserName: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['Time']['output']>;
  userAddress: Maybe<Scalars['Address']['output']>;
  userAddressDetails: Maybe<Wallet>;
  userAssociatedAddressDetails: Maybe<Array<Wallet>>;
  /** blockchain addresses associated with the social profile */
  userAssociatedAddresses: Maybe<Array<Scalars['Address']['output']>>;
  userCreatedAtBlockNumber: Maybe<Scalars['Int']['output']>;
  userCreatedAtBlockTimestamp: Maybe<Scalars['Time']['output']>;
  userHomeURL: Maybe<Scalars['String']['output']>;
  userId: Maybe<Scalars['String']['output']>;
  userLastUpdatedAtBlockNumber: Maybe<Scalars['Int']['output']>;
  userLastUpdatedAtBlockTimestamp: Maybe<Scalars['Time']['output']>;
  userRecoveryAddress: Maybe<Scalars['Address']['output']>;
  website: Maybe<Scalars['String']['output']>;
};


export type SocialFollowersArgs = {
  input: InputMaybe<SocialFollowerNestedInput>;
};


export type SocialFollowingsArgs = {
  input: InputMaybe<SocialFollowingNestedInput>;
};

export type SocialCapital = {
  farBoost: Maybe<Scalars['Float']['output']>;
  liquidityBoost: Maybe<Scalars['Float']['output']>;
  socialCapitalRank: Maybe<Scalars['Int']['output']>;
  socialCapitalScore: Maybe<Scalars['Float']['output']>;
  socialCapitalScoreRaw: Maybe<Scalars['String']['output']>;
  tvl: Maybe<Scalars['String']['output']>;
  tvlBoost: Maybe<Scalars['Float']['output']>;
};

export type SocialCapitalValue = {
  formattedValue: Maybe<Scalars['Float']['output']>;
  hash: Maybe<Scalars['String']['output']>;
  rawValue: Maybe<Scalars['String']['output']>;
};

export enum SocialDappName {
  Farcaster = 'farcaster'
}

export type SocialDappName_Comparator_Exp = {
  _eq: InputMaybe<SocialDappName>;
  _in: InputMaybe<Array<SocialDappName>>;
};

export enum SocialDappSlug {
  FarcasterGoerli = 'farcaster_goerli',
  FarcasterOptimism = 'farcaster_optimism',
  FarcasterV2Optimism = 'farcaster_v2_optimism',
  FarcasterV3Optimism = 'farcaster_v3_optimism'
}

export type SocialDappSlug_Comparator_Exp = {
  _eq: InputMaybe<SocialDappSlug>;
  _in: InputMaybe<Array<SocialDappSlug>>;
};

export type SocialFilter = {
  dappName: InputMaybe<SocialDappName_Comparator_Exp>;
  dappSlug: InputMaybe<SocialDappSlug_Comparator_Exp>;
  farRank: InputMaybe<Int_Comparator_Exp>;
  farScore: InputMaybe<Float_Comparator_Exp>;
  followerCount: InputMaybe<Int_Comparator_Exp>;
  followingCount: InputMaybe<Int_Comparator_Exp>;
  identity: InputMaybe<Identity_Comparator_Exp>;
  isDefault: InputMaybe<Boolean_Comparator_Exp>;
  profileCreatedAtBlockTimestamp: InputMaybe<Time_Comparator_Exp>;
  profileName: InputMaybe<Regex_String_Comparator_Exp>;
  socialCapitalRank: InputMaybe<Int_Comparator_Exp>;
  socialCapitalScore: InputMaybe<Float_Comparator_Exp>;
  updatedAt: InputMaybe<Time_Comparator_Exp>;
  userAssociatedAddresses: InputMaybe<Address_Comparator_Exp>;
  userId: InputMaybe<String_Comparator_Exp>;
};

export type SocialFollower = {
  blockNumber: Maybe<Scalars['Int']['output']>;
  blockchain: Maybe<EveryBlockchain>;
  dappName: Maybe<Scalars['String']['output']>;
  dappSlug: Maybe<Scalars['String']['output']>;
  followerAddress: Maybe<Wallet>;
  followerProfileId: Maybe<Scalars['String']['output']>;
  followerSince: Maybe<Scalars['Time']['output']>;
  followerTokenId: Maybe<Scalars['String']['output']>;
  followingAddress: Maybe<Wallet>;
  followingProfileId: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['ID']['output']>;
};

export type SocialFollowerFilter = {
  blockNumber: InputMaybe<Int_Comparator_Exp>;
  dappName: InputMaybe<SocialDappName_Comparator_Exp>;
  dappSlug: InputMaybe<SocialDappSlug_Comparator_Exp>;
  followerProfileId: InputMaybe<String_Comparator_Exp>;
  followerSince: InputMaybe<Time_Comparator_Exp>;
  followingProfileId: InputMaybe<String_Comparator_Exp>;
  identity: InputMaybe<Identity_Comparator_Exp>;
};

export type SocialFollowerInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: SocialFollowerFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<SocialFollowerOrderBy>>;
};

export type SocialFollowerNestedInput = {
  blockchain: InputMaybe<EveryBlockchain>;
  filter: InputMaybe<SocialFollowerFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<InputMaybe<SocialFollowerOrderBy>>>;
};

export type SocialFollowerOrderBy = {
  blockNumber: InputMaybe<OrderBy>;
  followerSince: InputMaybe<OrderBy>;
};

export type SocialFollowerOutput = {
  Follower: Maybe<Array<SocialFollower>>;
  pageInfo: Maybe<PageInfo>;
};

export type SocialFollowing = {
  blockNumber: Maybe<Scalars['Int']['output']>;
  blockchain: Maybe<EveryBlockchain>;
  dappName: Maybe<Scalars['String']['output']>;
  dappSlug: Maybe<Scalars['String']['output']>;
  followerAddress: Maybe<Wallet>;
  followerProfileId: Maybe<Scalars['String']['output']>;
  followerTokenId: Maybe<Scalars['String']['output']>;
  followingAddress: Maybe<Wallet>;
  followingProfileId: Maybe<Scalars['String']['output']>;
  followingSince: Maybe<Scalars['Time']['output']>;
  id: Maybe<Scalars['ID']['output']>;
};

export type SocialFollowingFilter = {
  blockNumber: InputMaybe<Int_Comparator_Exp>;
  dappName: InputMaybe<SocialDappName_Comparator_Exp>;
  dappSlug: InputMaybe<SocialDappSlug_Comparator_Exp>;
  followerProfileId: InputMaybe<String_Comparator_Exp>;
  followingProfileId: InputMaybe<String_Comparator_Exp>;
  followingSince: InputMaybe<Time_Comparator_Exp>;
  identity: InputMaybe<Identity_Comparator_Exp>;
};

export type SocialFollowingInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: SocialFollowingFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<SocialFollowingOrderBy>>;
};

export type SocialFollowingNestedInput = {
  blockchain: InputMaybe<EveryBlockchain>;
  filter: InputMaybe<SocialFollowingFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<InputMaybe<SocialFollowingOrderBy>>>;
};

export type SocialFollowingOrderBy = {
  blockNumber: InputMaybe<OrderBy>;
  followingSince: InputMaybe<OrderBy>;
};

export type SocialFollowingOutput = {
  Following: Maybe<Array<SocialFollowing>>;
  pageInfo: Maybe<PageInfo>;
};

export type SocialOrderBy = {
  farRank: InputMaybe<OrderBy>;
  farScore: InputMaybe<OrderBy>;
  followerCount: InputMaybe<OrderBy>;
  followingCount: InputMaybe<OrderBy>;
  profileCreatedAtBlockTimestamp: InputMaybe<OrderBy>;
  socialCapitalRank: InputMaybe<OrderBy>;
  socialCapitalScore: InputMaybe<OrderBy>;
  updatedAt: InputMaybe<OrderBy>;
};

export type SocialsInput = {
  blockchain: Blockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: SocialFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<SocialOrderBy>>;
};

export type SocialsNestedInput = {
  blockchain: InputMaybe<Blockchain>;
  filter: InputMaybe<SocialFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
};

export type SocialsOutput = {
  Social: Maybe<Array<Social>>;
  pageInfo: Maybe<PageInfo>;
};

export type String_Comparator_Exp = {
  _eq: InputMaybe<Scalars['String']['input']>;
  _gt: InputMaybe<Scalars['String']['input']>;
  _gte: InputMaybe<Scalars['String']['input']>;
  _in: InputMaybe<Array<Scalars['String']['input']>>;
  _lt: InputMaybe<Scalars['String']['input']>;
  _lte: InputMaybe<Scalars['String']['input']>;
  _ne: InputMaybe<Scalars['String']['input']>;
  _nin: InputMaybe<Array<Scalars['String']['input']>>;
};

export type String_Eq_Comparator_Exp = {
  _eq: InputMaybe<Scalars['String']['input']>;
};

export type String_Eq_In_Comparator_Exp = {
  _eq: InputMaybe<Scalars['String']['input']>;
  _in: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum TimeFrame {
  EightHours = 'eight_hours',
  OneDay = 'one_day',
  OneHour = 'one_hour',
  SevenDays = 'seven_days',
  TwoDays = 'two_days',
  TwoHours = 'two_hours'
}

export type Time_Comparator_Exp = {
  _eq: InputMaybe<Scalars['Time']['input']>;
  _gt: InputMaybe<Scalars['Time']['input']>;
  _gte: InputMaybe<Scalars['Time']['input']>;
  _in: InputMaybe<Array<Scalars['Time']['input']>>;
  _lt: InputMaybe<Scalars['Time']['input']>;
  _lte: InputMaybe<Scalars['Time']['input']>;
  _ne: InputMaybe<Scalars['Time']['input']>;
  _nin: InputMaybe<Array<Scalars['Time']['input']>>;
};

export type Time_Range_Comparator_Exp = {
  _eq: InputMaybe<Scalars['Int']['input']>;
};

export enum TokenType {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155'
}

export type TokenType_Comparator_Exp = {
  _eq: InputMaybe<TokenType>;
  _in: InputMaybe<Array<TokenType>>;
};

export type TrendingCast = {
  cast: Maybe<FarcasterCast>;
  castValueFormatted: Maybe<Scalars['Float']['output']>;
  castValueRaw: Maybe<Scalars['String']['output']>;
  channel: Maybe<FarcasterChannel>;
  criteria: Maybe<Scalars['String']['output']>;
  criteriaCount: Maybe<Scalars['Float']['output']>;
  fid: Maybe<Scalars['Int']['output']>;
  hash: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['String']['output']>;
  rootParentUrl: Maybe<Scalars['String']['output']>;
  socialCapitalValueFormatted: Maybe<Scalars['Float']['output']>;
  socialCapitalValueRaw: Maybe<Scalars['String']['output']>;
  timeFrom: Maybe<Scalars['Time']['output']>;
  timeTo: Maybe<Scalars['Time']['output']>;
};

export type TrendingCastFilter = {
  fid: InputMaybe<TrendingCast_Int_Comparator_Exp>;
  rootParentUrl: InputMaybe<String_Eq_Comparator_Exp>;
};

export enum TrendingCastTimeFrame {
  EightHours = 'eight_hours',
  FourHours = 'four_hours',
  OneDay = 'one_day',
  OneHour = 'one_hour',
  SevenDays = 'seven_days',
  TwelveHours = 'twelve_hours',
  TwoDays = 'two_days',
  TwoHours = 'two_hours'
}

export type TrendingCast_Int_Comparator_Exp = {
  _eq: InputMaybe<Scalars['Int']['input']>;
};

export enum TrendingCastsCriteria {
  Likes = 'likes',
  LikesRecastsReplies = 'likes_recasts_replies',
  Recasts = 'recasts',
  Replies = 'replies',
  SocialCapitalValue = 'social_capital_value'
}

export type TrendingCastsInput = {
  blockchain: EveryBlockchain;
  criteria: TrendingCastsCriteria;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: InputMaybe<TrendingCastFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  timeFrame: TrendingCastTimeFrame;
};

export type TrendingCastsOutput = {
  TrendingCast: Maybe<Array<TrendingCast>>;
  pageInfo: Maybe<PageInfo>;
};

export type TrendingFilter = {
  address: InputMaybe<Trending_Comparator_Exp>;
};

export type Trending_Comparator_Exp = {
  _eq: InputMaybe<Scalars['Address']['input']>;
  _in: InputMaybe<Array<Scalars['Address']['input']>>;
};

export type VideoVariants = {
  original: Maybe<Scalars['String']['output']>;
};

export type Wallet = {
  /** Returns addresses associated with the identity input */
  addresses: Maybe<Array<Scalars['Address']['output']>>;
  /** Nested query - allows querying domains owned by the address */
  domains: Maybe<Array<Domain>>;
  /** Blockchain address, ENS domain name, social identity such as Farcaster (for Farcaster use 'fc_fid:' prefix followed by the Farcaster user ID like fc_fid:5650, or use 'fc_fname:' prefix followed by the Farcaster user ID like 'fc_fname:vbuterin') */
  identity: Scalars['Identity']['output'];
  /** Nested query - allows returning primary domains, if applicable */
  primaryDomain: Maybe<Domain>;
  socialFollowers: Maybe<SocialFollowerOutput>;
  /** Represent On-chain smart-contract accounts */
  socialFollowings: Maybe<SocialFollowingOutput>;
  /** Returns social profile information related to the address */
  socials: Maybe<Array<Social>>;
};


export type WalletDomainsArgs = {
  input: InputMaybe<DomainsNestedInput>;
};


export type WalletSocialFollowersArgs = {
  input: InputMaybe<SocialFollowerNestedInput>;
};


export type WalletSocialFollowingsArgs = {
  input: InputMaybe<SocialFollowingNestedInput>;
};


export type WalletSocialsArgs = {
  input: InputMaybe<SocialsNestedInput>;
};

export type WalletInput = {
  identity: Scalars['Identity']['input'];
};

export type ProfileQueryVariables = Exact<{
  fid: Scalars['String']['input'];
}>;


export type ProfileQuery = { Socials: { Social: Array<{ userId: string | null, profileName: string | null, profileDisplayName: string | null, profileImage: string | null, userAddress: any | null, followerCount: number | null, followingCount: number | null, location: string | null, profileBio: string | null, connectedAddresses: Array<{ address: any | null, blockchain: string | null }> | null, socialCapital: { socialCapitalRank: number | null, socialCapitalScore: number | null } | null }> | null } | null };

export type FarcasterChannelsQueryVariables = Exact<{
  fid: Scalars['Identity']['input'];
  channels: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type FarcasterChannelsQuery = { FarcasterChannelParticipants: { FarcasterChannelParticipant: Array<{ channelId: string }> | null } | null };

export type IsFollowingQueryVariables = Exact<{
  fid: Scalars['Identity']['input'];
  followedNames: InputMaybe<Array<Scalars['Identity']['input']> | Scalars['Identity']['input']>;
}>;


export type IsFollowingQuery = { Wallet: { socialFollowers: { Follower: Array<{ dappName: string | null, dappSlug: string | null, followingProfileId: string | null, followerProfileId: string | null }> | null } | null } | null };

export type ProfilesQueryVariables = Exact<{
  fids: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  pointer: InputMaybe<Scalars['String']['input']>;
}>;


export type ProfilesQuery = { Socials: { Social: Array<{ userId: string | null, profileName: string | null, profileDisplayName: string | null, profileImage: string | null, userAddress: any | null, followerCount: number | null, followingCount: number | null, location: string | null, profileBio: string | null, connectedAddresses: Array<{ address: any | null, blockchain: string | null }> | null, socialCapital: { socialCapitalRank: number | null, socialCapitalScore: number | null } | null }> | null, pageInfo: { hasNextPage: boolean, nextCursor: string } | null } | null };
