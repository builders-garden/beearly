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

/** Represents on-chain smart contract account */
export type Account = {
  /** Nested query - on-chain wallet related information, including address, domains, social profile, other token balances, and transfer history */
  address: Wallet;
  /** Blockchain where account is created */
  blockchain: Maybe<TokenBlockchain>;
  /** Block number of the account creation transaction */
  createdAtBlockNumber: Maybe<Scalars['Int']['output']>;
  /** Block timestamp of the account creation transaction */
  createdAtBlockTimestamp: Maybe<Scalars['Time']['output']>;
  /** Transaction Hash of the account creation transaction */
  creationTransactionHash: Maybe<Scalars['String']['output']>;
  /** Address of deployer */
  deployer: Maybe<Scalars['String']['output']>;
  /** Airstack unique identifier for the account */
  id: Scalars['ID']['output'];
  /** ERC6551 standard : Implementation address of on chain smart contract account */
  implementation: Maybe<Scalars['String']['output']>;
  /** Token NFT associated with erc-6551 */
  nft: Maybe<TokenNft>;
  /** ERC6551 standard : Registry used to deploy smart contract wallet */
  registry: Maybe<Scalars['Address']['output']>;
  /** ERC6551 standard salt for account creation */
  salt: Maybe<Scalars['String']['output']>;
  /** Standard of account-  ERC6551, Safe etc */
  standard: AccountStandard;
  /** ERC6551 standard: Address of ERC721 token */
  tokenAddress: Maybe<Scalars['Address']['output']>;
  /** ERC6551 standard: tokenId of ERC721 token */
  tokenId: Maybe<Scalars['String']['output']>;
  /** Block number of the account updation transaction */
  updatedAtBlockNumber: Maybe<Scalars['Int']['output']>;
  /** Block timestamp of the account updation transaction */
  updatedAtBlockTimestamp: Maybe<Scalars['Time']['output']>;
};

export type AccountFilter = {
  address: InputMaybe<Identity_Comparator_Exp>;
  createdAtBlockTimestamp: InputMaybe<Time_Comparator_Exp>;
  implementation: InputMaybe<Address_Comparator_Exp>;
  registry: InputMaybe<Address_Comparator_Exp>;
  salt: InputMaybe<String_Eq_Comparator_Exp>;
  standard: InputMaybe<AccountStandard_Comparator_Exp>;
  tokenAddress: InputMaybe<Address_Comparator_Exp>;
  tokenId: InputMaybe<String_Comparator_Exp>;
};

export type AccountOrderBy = {
  createdAtBlockTimestamp: InputMaybe<OrderBy>;
};

export enum AccountStandard {
  Erc6551 = 'ERC6551'
}

export type AccountStandard_Comparator_Exp = {
  _eq: InputMaybe<AccountStandard>;
  _in: InputMaybe<Array<AccountStandard>>;
};

export type AccountsInput = {
  blockchain: TokenBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: InputMaybe<AccountFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<AccountOrderBy>>;
};

export type AccountsNestedInput = {
  blockchain: InputMaybe<TokenBlockchain>;
  filter: InputMaybe<AccountFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<InputMaybe<AccountOrderBy>>>;
  showOptimisticAddress: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountsOutput = {
  Account: Maybe<Array<Account>>;
  pageInfo: Maybe<PageInfo>;
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

export type ContractMetadata = {
  /** Description of the token, mirrored from the smart contract */
  description: Maybe<Scalars['String']['output']>;
  externalLink: Maybe<Scalars['String']['output']>;
  /** Royalties recipient address, mirrored from the smart contract */
  feeRecipient: Maybe<Scalars['String']['output']>;
  image: Maybe<Scalars['String']['output']>;
  /** Name of the token, mirrored from the smart contract */
  name: Maybe<Scalars['String']['output']>;
  sellerFeeBasisPoints: Maybe<Scalars['Int']['output']>;
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
  paymentToken: Maybe<Token>;
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
  /** Token nft associated with the domain, if applicable */
  tokenNft: Maybe<TokenNft>;
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
  startTimestamp: Scalars['Time']['output'];
  timeframe: FarcasterMoxieEarningStatsTimeframe;
};


export type FarcasterMoxieEarningStatSocialsArgs = {
  input: InputMaybe<SocialsNestedInput>;
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
  farRank: Maybe<Scalars['Int']['output']>;
  farScore: Maybe<Scalars['Float']['output']>;
  farScoreRaw: Maybe<Scalars['String']['output']>;
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

export type NativeBalance = {
  /** Token amount the address currently holds */
  amount: Scalars['String']['output'];
  /** Blockchain where the token smart contract is deployed */
  blockchain: Maybe<NativeBalanceBlockchain>;
  /** Unique identifier for the blockchain */
  chainId: Scalars['String']['output'];
  /** Formatted token balance in decimals */
  formattedAmount: Maybe<Scalars['Float']['output']>;
  /** Airstack unique identifier for the data point */
  id: Scalars['ID']['output'];
  /** Block number of the latest token balance change happened */
  lastUpdatedBlock: Scalars['Int']['output'];
  /** Timestamp of the latest token balance change happened */
  lastUpdatedTimestamp: Maybe<Scalars['Time']['output']>;
  /** Nested Query allowing to retrieve address, domain names, social profiles of the owner */
  owner: Wallet;
};

export enum NativeBalanceBlockchain {
  Degen = 'degen'
}

export type NativeBalanceFilter = {
  formattedAmount: InputMaybe<Float_Comparator_Exp>;
  lastUpdatedTimestamp: InputMaybe<Time_Comparator_Exp>;
  owner: InputMaybe<Identity_Comparator_Exp>;
};

export type NativeBalanceOrderBy = {
  lastUpdatedTimestamp: InputMaybe<OrderBy>;
};

export type NativeBalancesInput = {
  blockchain: NativeBalanceBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: NativeBalanceFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<NativeBalanceOrderBy>>;
};

export type NativeBalancesOutput = {
  NativeBalance: Maybe<Array<NativeBalance>>;
  pageInfo: Maybe<PageInfo>;
};

export type NftAttribute = {
  displayType: Maybe<Scalars['String']['output']>;
  maxValue: Maybe<Scalars['String']['output']>;
  /** NFT attribute type as defined in the smart contract, e.g. background */
  trait_type: Maybe<Scalars['String']['output']>;
  /** NFT attribute value as defined in the smart contract, e.g. blue */
  value: Maybe<Scalars['String']['output']>;
};

export type NftAttributeFilter = {
  trait_type: InputMaybe<String_Comparator_Exp>;
  value: InputMaybe<String_Comparator_Exp>;
};

export type NftAttributesInput = {
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: NftAttributeFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
};

export type NftAttributesOutput = {
  NftAttribute: Maybe<Array<NftAttribute>>;
  pageInfo: Maybe<PageInfo>;
};

export type NftMetadata = {
  animationUrl: Maybe<Scalars['String']['output']>;
  attributes: Maybe<Array<NftAttribute>>;
  backgroundColor: Maybe<Scalars['String']['output']>;
  /** Description of the token, mirrored from the smart contract */
  description: Maybe<Scalars['String']['output']>;
  externalUrl: Maybe<Scalars['String']['output']>;
  /** Link to the token image, mirrored from the smart contract */
  image: Maybe<Scalars['String']['output']>;
  imageData: Maybe<Scalars['String']['output']>;
  /** Name of the token, mirrored from the smart contract */
  name: Maybe<Scalars['String']['output']>;
  youtubeUrl: Maybe<Scalars['String']['output']>;
};

export type NftMetadataFilter = {
  attributes: InputMaybe<NftAttributeFilter>;
  name: InputMaybe<String_Comparator_Exp>;
};

export type NftMetadataOrderBy = {
  attributes: InputMaybe<OrderBy>;
};

export type NftMetadatasInput = {
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: NftMetadataFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<NftMetadataOrderBy>>;
};

export type NftMetadatasOutput = {
  NftMetadata: Maybe<Array<NftMetadata>>;
  pageInfo: Maybe<PageInfo>;
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

export type Poap = {
  attendee: Maybe<PoapAttendee>;
  /** Blockchain associated with the Poap */
  blockchain: Maybe<EveryBlockchain>;
  /** Unique identifier for the blockchain */
  chainId: Maybe<Scalars['String']['output']>;
  /** Block Number when POAP was created */
  createdAtBlockNumber: Maybe<Scalars['Int']['output']>;
  /** Time when POAP was created */
  createdAtBlockTimestamp: Maybe<Scalars['Time']['output']>;
  /** Poap DApp name */
  dappName: Maybe<PoapDappName>;
  /** Poap DApp slug (contract version) */
  dappSlug: Maybe<PoapDappSlug>;
  /** Airstack unique dapp version number */
  dappVersion: Maybe<Scalars['String']['output']>;
  /** Poap event id */
  eventId: Maybe<Scalars['String']['output']>;
  /** Airstack unique identifier for the data point */
  id: Maybe<Scalars['ID']['output']>;
  mintHash: Maybe<Scalars['String']['output']>;
  mintOrder: Maybe<Scalars['Int']['output']>;
  owner: Wallet;
  poapEvent: Maybe<PoapEvent>;
  /** POAP Contract Address */
  tokenAddress: Maybe<Scalars['String']['output']>;
  tokenId: Maybe<Scalars['String']['output']>;
  tokenUri: Maybe<Scalars['String']['output']>;
  transferCount: Maybe<Scalars['Int']['output']>;
};

export type PoapAttendee = {
  owner: Wallet;
  totalPoapOwned: Maybe<Scalars['Int']['output']>;
};

export type PoapAttendeesOutput = {
  PoapAttendee: Maybe<Array<PoapAttendee>>;
  pageInfo: Maybe<PageInfo>;
};

export enum PoapDappName {
  Poap = 'poap'
}

export type PoapDappName_Comparator_Exp = {
  _eq: InputMaybe<PoapDappName>;
  _in: InputMaybe<Array<PoapDappName>>;
};

export enum PoapDappSlug {
  PoapGnosis = 'poap_gnosis',
  PoapMainnet = 'poap_mainnet'
}

export type PoapDappSlug_Comparator_Exp = {
  _eq: InputMaybe<PoapDappSlug>;
  _in: InputMaybe<Array<PoapDappSlug>>;
};

export type PoapEvent = {
  /** Blockchain where the marketplace data is calculated from */
  blockchain: Maybe<EveryBlockchain>;
  /** Unique identifier for the blockchain */
  chainId: Maybe<Scalars['String']['output']>;
  city: Maybe<Scalars['String']['output']>;
  contentType: Maybe<Scalars['String']['output']>;
  contentValue: Maybe<Media>;
  country: Maybe<Scalars['String']['output']>;
  dappName: Maybe<PoapDappName>;
  dappSlug: PoapDappSlug;
  dappVersion: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  endDate: Maybe<Scalars['Time']['output']>;
  eventId: Maybe<Scalars['String']['output']>;
  eventName: Maybe<Scalars['String']['output']>;
  /** The Event URL */
  eventURL: Maybe<Scalars['String']['output']>;
  /** Airstack unique identifier for the data point */
  id: Scalars['ID']['output'];
  /** If Event is Virtual or not */
  isVirtualEvent: Maybe<Scalars['Boolean']['output']>;
  metadata: Maybe<Scalars['Map']['output']>;
  poaps: Maybe<Array<Poap>>;
  startDate: Maybe<Scalars['Time']['output']>;
  tokenMints: Maybe<Scalars['Int']['output']>;
};


export type PoapEventPoapsArgs = {
  input: InputMaybe<PoapsNestedInput>;
};

export type PoapEventFilter = {
  city: InputMaybe<String_Comparator_Exp>;
  country: InputMaybe<String_Comparator_Exp>;
  dappName: InputMaybe<PoapDappName_Comparator_Exp>;
  dappSlug: InputMaybe<PoapDappSlug_Comparator_Exp>;
  endDate: InputMaybe<String_Comparator_Exp>;
  eventId: InputMaybe<String_Comparator_Exp>;
  eventName: InputMaybe<Regex_String_Comparator_Exp>;
  isVirtualEvent: InputMaybe<Boolean_Comparator_Exp>;
  startDate: InputMaybe<String_Comparator_Exp>;
  tokenMints: InputMaybe<Int_Comparator_Exp>;
};

export type PoapEventOrderBy = {
  endDate: InputMaybe<OrderBy>;
  startDate: InputMaybe<OrderBy>;
  tokenMints: InputMaybe<OrderBy>;
};

export type PoapEventsInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: PoapEventFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<PoapEventOrderBy>>;
};

export type PoapEventsOutput = {
  PoapEvent: Maybe<Array<PoapEvent>>;
  pageInfo: Maybe<PageInfo>;
};

export type PoapFilter = {
  createdAtBlockNumber: InputMaybe<Int_Comparator_Exp>;
  dappName: InputMaybe<PoapDappName_Comparator_Exp>;
  dappSlug: InputMaybe<PoapDappSlug_Comparator_Exp>;
  eventId: InputMaybe<String_Comparator_Exp>;
  owner: InputMaybe<Identity_Comparator_Exp>;
  tokenId: InputMaybe<String_Comparator_Exp>;
};

export type PoapOrderBy = {
  createdAtBlockNumber: InputMaybe<OrderBy>;
};

export type PoapsInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: PoapFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<PoapOrderBy>>;
};

export type PoapsNestedInput = {
  blockchain: InputMaybe<EveryBlockchain>;
  filter: InputMaybe<PoapFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<InputMaybe<PoapOrderBy>>>;
};

export type PoapsOutput = {
  Poap: Maybe<Array<Poap>>;
  pageInfo: Maybe<PageInfo>;
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

export type PopularDappsInput = {
  blockchain: TrendingBlockchain;
  criteria: PopularDappsCriteria;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: InputMaybe<TrendingFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  timeFrame: TimeFrame;
  userbase: Audience;
};

export type PopularDappsOutput = {
  PopularDapps: Maybe<Array<PopularDapp>>;
  pageInfo: Maybe<PageInfo>;
};

export type ProjectDetails = {
  collectionName: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  discordUrl: Maybe<Scalars['String']['output']>;
  externalUrl: Maybe<Scalars['String']['output']>;
  imageUrl: Maybe<Scalars['String']['output']>;
  twitterUrl: Maybe<Scalars['String']['output']>;
};

export type Query = {
  Accounts: Maybe<AccountsOutput>;
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
  PoapEvents: Maybe<PoapEventsOutput>;
  Poaps: Maybe<PoapsOutput>;
  SocialFollowers: Maybe<SocialFollowerOutput>;
  SocialFollowings: Maybe<SocialFollowingOutput>;
  Socials: Maybe<SocialsOutput>;
  TokenBalances: Maybe<TokenBalancesOutput>;
  TokenNfts: Maybe<TokenNftsOutput>;
  TokenTransfers: Maybe<TokenTransfersOutput>;
  Tokens: Maybe<TokensOutput>;
  TrendingCasts: Maybe<TrendingCastsOutput>;
  TrendingMints: Maybe<TrendingMintsOutput>;
  TrendingSwaps: Maybe<TrendingSwapsOutput>;
  TrendingTokens: Maybe<TrendingTokensOutput>;
  Wallet: Maybe<Wallet>;
  XMTPs: Maybe<XmtPsOutput>;
};


export type QueryAccountsArgs = {
  input: AccountsInput;
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


export type QueryPoapEventsArgs = {
  input: PoapEventsInput;
};


export type QueryPoapsArgs = {
  input: PoapsInput;
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


export type QueryTokenBalancesArgs = {
  input: TokenBalancesInput;
};


export type QueryTokenNftsArgs = {
  input: TokenNftsInput;
};


export type QueryTokenTransfersArgs = {
  input: TokenTransfersInput;
};


export type QueryTokensArgs = {
  input: TokensInput;
};


export type QueryTrendingCastsArgs = {
  input: TrendingCastsInput;
};


export type QueryTrendingMintsArgs = {
  input: TrendingMintsInput;
};


export type QueryTrendingSwapsArgs = {
  input: TrendingSwapsInput;
};


export type QueryTrendingTokensArgs = {
  input: TrendingTokensInput;
};


export type QueryWalletArgs = {
  input: WalletInput;
};


export type QueryXmtPsArgs = {
  input: XmtPsInput;
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

export type Simple_String_Comparator_Exp = {
  _eq: InputMaybe<Scalars['String']['input']>;
  _in: InputMaybe<Array<Scalars['String']['input']>>;
  _ne: InputMaybe<Scalars['String']['input']>;
  _nin: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Snapshot = {
  amount: Maybe<Scalars['String']['output']>;
  blockchain: Maybe<TokenBlockchain>;
  chainId: Maybe<Scalars['String']['output']>;
  endBlockNumber: Maybe<Scalars['Int']['output']>;
  endBlockTimestamp: Maybe<Scalars['Time']['output']>;
  formattedAmount: Maybe<Scalars['Float']['output']>;
  /** Airstack unique identifier for the data point */
  id: Scalars['ID']['output'];
  owner: Wallet;
  startBlockNumber: Maybe<Scalars['Int']['output']>;
  startBlockTimestamp: Maybe<Scalars['Time']['output']>;
  token: Maybe<Token>;
  tokenAddress: Scalars['Address']['output'];
  tokenId: Maybe<Scalars['String']['output']>;
  tokenNft: Maybe<TokenNft>;
  tokenType: Maybe<TokenType>;
};

export type SnapshotFilter = {
  blockNumber: InputMaybe<Range_Comparator_Exp>;
  date: InputMaybe<Date_Range_Comparator_Exp>;
  owner: InputMaybe<Identity_Comparator_Exp>;
  timestamp: InputMaybe<Time_Range_Comparator_Exp>;
  tokenAddress: InputMaybe<Address_Comparator_Exp>;
  tokenId: InputMaybe<String_Comparator_Exp>;
  tokenType: InputMaybe<TokenType_Comparator_Exp>;
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
  /** Blockchain address, ENS domain name, social identity such as Farcaster (for Farcaster use 'fc_fid:' prefix followed by the Farcaster user ID like fc_fid:5650, or use 'fc_fname:' prefix followed by the Farcaster user ID like 'fc_fname:vbuterin') or Lens (e.g. 'stani.lens) */
  identity: Maybe<Scalars['Identity']['output']>;
  isDefault: Maybe<Scalars['Boolean']['output']>;
  isFarcasterPowerUser: Maybe<Scalars['Boolean']['output']>;
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
  socialCapitalRank: Maybe<Scalars['Int']['output']>;
  socialCapitalScore: Maybe<Scalars['Float']['output']>;
  socialCapitalScoreRaw: Maybe<Scalars['String']['output']>;
};

export type SocialCapitalValue = {
  formattedValue: Maybe<Scalars['Float']['output']>;
  hash: Maybe<Scalars['String']['output']>;
  rawValue: Maybe<Scalars['String']['output']>;
};

export enum SocialDappName {
  Farcaster = 'farcaster',
  Lens = 'lens'
}

export type SocialDappName_Comparator_Exp = {
  _eq: InputMaybe<SocialDappName>;
  _in: InputMaybe<Array<SocialDappName>>;
};

export enum SocialDappSlug {
  FarcasterGoerli = 'farcaster_goerli',
  FarcasterOptimism = 'farcaster_optimism',
  FarcasterV2Optimism = 'farcaster_v2_optimism',
  FarcasterV3Optimism = 'farcaster_v3_optimism',
  LensPolygon = 'lens_polygon',
  LensV2Polygon = 'lens_v2_polygon'
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

export type Token = {
  /** Smart contract address of the token */
  address: Scalars['Address']['output'];
  /** Base URI of the token contract */
  baseURI: Maybe<Scalars['String']['output']>;
  /** Blockchain where the token smart contract is deployed */
  blockchain: Maybe<TokenBlockchain>;
  /** Unique identifier for the blockchain */
  chainId: Maybe<Scalars['String']['output']>;
  /** Token contract metadata object */
  contractMetaData: Maybe<ContractMetadata>;
  /** URI for the token's contract metadata */
  contractMetaDataURI: Maybe<Scalars['String']['output']>;
  /** The number of decimal places this token uses, default to 18 */
  decimals: Maybe<Scalars['Int']['output']>;
  /** Airstack unique identifier for the contract */
  id: Maybe<Scalars['ID']['output']>;
  /** Indicates if the token is set to be spam - true or false */
  isSpam: Maybe<Scalars['Boolean']['output']>;
  /** Block number of the token's most recent transfer */
  lastTransferBlock: Maybe<Scalars['Int']['output']>;
  /** Transaction hash of the token's most recent transfer */
  lastTransferHash: Maybe<Scalars['String']['output']>;
  /** Timestamp of the token's most recent transfer */
  lastTransferTimestamp: Maybe<Scalars['Time']['output']>;
  /** Logo image for the contract in various sizes (if available) */
  logo: Maybe<LogoSizes>;
  /** Name of the token, mirrored from the smart contract */
  name: Maybe<Scalars['String']['output']>;
  /** The owner of the token contract */
  owner: Maybe<Wallet>;
  /** off-chain data for the token project */
  projectDetails: Maybe<ProjectDetails>;
  /** Token contract metadata as it appears inside the contract */
  rawContractMetaData: Maybe<Scalars['Map']['output']>;
  /** Symbol of the token, mirrored from the smart contract */
  symbol: Maybe<Scalars['String']['output']>;
  /** Nested Query - allows querying the tokenBalance information */
  tokenBalances: Maybe<Array<TokenBalance>>;
  /** Nested Query - allows querying the tokenNFTs information */
  tokenNfts: Maybe<Array<TokenNft>>;
  /** Returns count of all NFT token attribute types and values for the given smart contract */
  tokenTraits: Maybe<Scalars['Map']['output']>;
  /** Amount of tokens in the protocol */
  totalSupply: Maybe<Scalars['String']['output']>;
  /** Token type: ERC20, ERC721, or ERC1155 */
  type: Maybe<TokenType>;
};


export type TokenTokenBalancesArgs = {
  input: InputMaybe<TokenBalancesNestedInput>;
};


export type TokenTokenNftsArgs = {
  input: InputMaybe<TokenNftsNestedInput>;
};

export type TokenBalance = {
  /** Token amount the address currently holds */
  amount: Scalars['String']['output'];
  /** Blockchain where the token smart contract is deployed */
  blockchain: Maybe<TokenBlockchain>;
  /** Unique identifier for the blockchain */
  chainId: Scalars['String']['output'];
  /** Formatted token balance in decimals */
  formattedAmount: Maybe<Scalars['Float']['output']>;
  /** Airstack unique identifier for the data point */
  id: Scalars['ID']['output'];
  /** Block number of the latest token balance change happened */
  lastUpdatedBlock: Scalars['Int']['output'];
  /** Timestamp of the latest token balance change happened */
  lastUpdatedTimestamp: Maybe<Scalars['Time']['output']>;
  /** Nested Query allowing to retrieve address, domain names, social profiles of the owner */
  owner: Wallet;
  /** Nested Query - allows retrieving token contract level data */
  token: Maybe<Token>;
  /** Smart contract address of the token */
  tokenAddress: Scalars['Address']['output'];
  /** Unique NFT token ID */
  tokenId: Maybe<Scalars['String']['output']>;
  /** Nested Query - allows retrieving token NFT contract level data, such as images, traits, and so on */
  tokenNfts: Maybe<TokenNft>;
  /** Nested Query - allows retrieving token transfer history */
  tokenTransfers: Maybe<Array<TokenTransfer>>;
  /** Token type: ERC20, ERC721, or ERC1155 */
  tokenType: Maybe<TokenType>;
};


export type TokenBalanceTokenTransfersArgs = {
  input: InputMaybe<TokenTransfersNestedInput>;
};

export type TokenBalanceFilter = {
  formattedAmount: InputMaybe<Float_Comparator_Exp>;
  lastUpdatedTimestamp: InputMaybe<Time_Comparator_Exp>;
  owner: InputMaybe<Identity_Comparator_Exp>;
  tokenAddress: InputMaybe<Address_Comparator_Exp>;
  tokenId: InputMaybe<String_Comparator_Exp>;
  tokenType: InputMaybe<TokenType_Comparator_Exp>;
};

export type TokenBalanceOrderBy = {
  lastUpdatedTimestamp: InputMaybe<OrderBy>;
};

export type TokenBalancesInput = {
  blockchain: TokenBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: TokenBalanceFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<TokenBalanceOrderBy>>;
};

export type TokenBalancesNestedInput = {
  blockchain: InputMaybe<TokenBlockchain>;
  filter: InputMaybe<TokenBalanceFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<InputMaybe<TokenBalanceOrderBy>>>;
};

export type TokenBalancesOutput = {
  TokenBalance: Maybe<Array<TokenBalance>>;
  pageInfo: Maybe<PageInfo>;
};

export enum TokenBlockchain {
  Base = 'base',
  Degen = 'degen',
  Ethereum = 'ethereum',
  Gold = 'gold',
  Ham = 'ham',
  Stp = 'stp',
  Zora = 'zora'
}

export type TokenFilter = {
  address: InputMaybe<Address_Comparator_Exp>;
  isSpam: InputMaybe<Boolean_Comparator_Exp>;
  name: InputMaybe<String_Comparator_Exp>;
  owner: InputMaybe<Identity_Comparator_Exp>;
  symbol: InputMaybe<String_Comparator_Exp>;
  type: InputMaybe<TokenType_Comparator_Exp>;
};

export type TokenNft = {
  /** Smart contract address of the token */
  address: Scalars['Address']['output'];
  /** Blockchain where the token smart contract is deployed */
  blockchain: Maybe<TokenBlockchain>;
  /** Unique identifier for the blockchain */
  chainId: Scalars['String']['output'];
  /** Content type of the NFT token (image, video, audio, etc.) */
  contentType: Maybe<Scalars['String']['output']>;
  /** NFT Media - resized images, animation, videos, etc. */
  contentValue: Maybe<Media>;
  /** Nested Query - allows querying the erc6551 account */
  erc6551Accounts: Maybe<Array<Account>>;
  /** Airstack unique identifier for the NFT token */
  id: Scalars['ID']['output'];
  /** Block number of the NFT token most recent transfer */
  lastTransferBlock: Maybe<Scalars['Int']['output']>;
  /** Transaction hash of the NFT token most recent transfer */
  lastTransferHash: Maybe<Scalars['String']['output']>;
  /** Timestamp of the NFT token most recent transfer */
  lastTransferTimestamp: Maybe<Scalars['Time']['output']>;
  /** NFT token metadata and attributes */
  metaData: Maybe<NftMetadata>;
  /** NFT token metadata, mirrored from the smart contract */
  rawMetaData: Maybe<Scalars['Map']['output']>;
  /** Nested Query - allows retrieving token contract level data */
  token: Maybe<Token>;
  /** Nested Query - allows querying the tokenBalance information */
  tokenBalances: Maybe<Array<TokenBalance>>;
  /** Unique NFT token ID */
  tokenId: Scalars['String']['output'];
  /** Nested Query - allows querying the tokenTransfer information */
  tokenTransfers: Maybe<Array<TokenTransfer>>;
  /** NFT token URI */
  tokenURI: Maybe<Scalars['String']['output']>;
  /** Amount of NFT tokens in the protocol */
  totalSupply: Maybe<Scalars['String']['output']>;
  /** NFT Token type: ERC721, or ERC1155 */
  type: Maybe<TokenType>;
};


export type TokenNftErc6551AccountsArgs = {
  input: InputMaybe<AccountsNestedInput>;
};


export type TokenNftTokenBalancesArgs = {
  input: InputMaybe<TokenBalancesNestedInput>;
};


export type TokenNftTokenTransfersArgs = {
  input: InputMaybe<TokenTransfersNestedInput>;
};

export type TokenNftFilter = {
  address: InputMaybe<Address_Comparator_Exp>;
  metaData: InputMaybe<NftMetadataFilter>;
  tokenId: InputMaybe<String_Comparator_Exp>;
};

export type TokenNftOrderBy = {
  tokenId: InputMaybe<OrderBy>;
};

export type TokenNftsInput = {
  blockchain: TokenBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: TokenNftFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<TokenNftOrderBy>>;
};

export type TokenNftsNestedInput = {
  blockchain: InputMaybe<TokenBlockchain>;
  filter: InputMaybe<TokenNftFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<InputMaybe<TokenNftOrderBy>>>;
};

export type TokenNftsOutput = {
  TokenNft: Maybe<Array<TokenNft>>;
  pageInfo: Maybe<PageInfo>;
};

export type TokenTransfer = {
  /** Token amount in the transfer */
  amount: Maybe<Scalars['String']['output']>;
  /** Token amounts in the transfer, if applicable. This mostly occurs in ERC1155 batch transfers */
  amounts: Maybe<Array<Scalars['String']['output']>>;
  /** Block number of the token transfer */
  blockNumber: Maybe<Scalars['Int']['output']>;
  /** Block timestamp of the token transfer */
  blockTimestamp: Maybe<Scalars['Time']['output']>;
  /** Blockchain where the token transfer took place */
  blockchain: Maybe<TokenBlockchain>;
  /** Unique identifier for the blockchain */
  chainId: Maybe<Scalars['String']['output']>;
  /** Formatted transfer amount in decimals */
  formattedAmount: Maybe<Scalars['Float']['output']>;
  /** Nested query - sender wallet related information, including address, domains, social profile, other token balances, and transfer history */
  from: Maybe<Wallet>;
  /** Airstack unique identifier for the data point */
  id: Maybe<Scalars['ID']['output']>;
  /** Nested query - operator wallet (if the transaction was facilitated via smart contract) related information, including address, domains, social profile, other token balances, and transfer history */
  operator: Maybe<Wallet>;
  /** Nested query - recipient wallet related information, including address, domains, social profile, other token balances, and transfer history */
  to: Maybe<Wallet>;
  /** Nested Query - allows retrieving token contract level data */
  token: Maybe<Token>;
  /** Transferred token smart contract address */
  tokenAddress: Maybe<Scalars['Address']['output']>;
  /** Unique NFT token ID */
  tokenId: Maybe<Scalars['String']['output']>;
  /** Unique NFT token IDs if multiple NFTs were a part of the transfer */
  tokenIds: Maybe<Array<Scalars['String']['output']>>;
  /** Nested Query - allows retrieving token Token NFT level data, such as images, traits, and so on for each unique NFT in the transfer */
  tokenNft: Maybe<TokenNft>;
  /** Token type: ERC20, ERC721, or ERC1155 */
  tokenType: Maybe<TokenType>;
  /** Token transfer transction hash */
  transactionHash: Scalars['String']['output'];
  /** Type of the token transfer */
  type: Maybe<TokenTransferType>;
};

export type TokenTransferFilter = {
  blockTimestamp: InputMaybe<Time_Comparator_Exp>;
  formattedAmount: InputMaybe<Float_Comparator_Exp>;
  from: InputMaybe<Identity_Comparator_Exp>;
  operator: InputMaybe<Identity_Comparator_Exp>;
  to: InputMaybe<Identity_Comparator_Exp>;
  tokenAddress: InputMaybe<Address_Comparator_Exp>;
  tokenId: InputMaybe<String_Comparator_Exp>;
  tokenType: InputMaybe<TokenType_Comparator_Exp>;
  transactionHash: InputMaybe<String_Comparator_Exp>;
  type: InputMaybe<TokenTransferType_Comparator_Exp>;
};

export type TokenTransferOrderBy = {
  blockTimestamp: InputMaybe<OrderBy>;
};

export enum TokenTransferType {
  Burn = 'BURN',
  Mint = 'MINT',
  Transfer = 'TRANSFER'
}

export type TokenTransferType_Comparator_Exp = {
  _eq: InputMaybe<TokenTransferType>;
  _in: InputMaybe<Array<TokenTransferType>>;
};

export type TokenTransfersInput = {
  blockchain: TokenBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: TokenTransferFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<TokenTransferOrderBy>>;
};

export type TokenTransfersNestedInput = {
  blockchain: InputMaybe<TokenBlockchain>;
  filter: InputMaybe<TokenTransferFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  order: InputMaybe<Array<InputMaybe<TokenTransferOrderBy>>>;
};

export type TokenTransfersOutput = {
  TokenTransfer: Maybe<Array<TokenTransfer>>;
  pageInfo: Maybe<PageInfo>;
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

export type TokensInput = {
  blockchain: TokenBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: TokenFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
};

export type TokensOutput = {
  Token: Maybe<Array<Token>>;
  pageInfo: Maybe<PageInfo>;
};

export enum TrendingBlockchain {
  Base = 'base',
  Degen = 'degen'
}

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

export type TrendingMint = {
  address: Maybe<Scalars['String']['output']>;
  audience: Maybe<Scalars['String']['output']>;
  blockchain: Maybe<Scalars['String']['output']>;
  chainId: Maybe<Scalars['String']['output']>;
  criteria: Maybe<Scalars['String']['output']>;
  criteriaCount: Maybe<Scalars['Int']['output']>;
  erc1155TokenID: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['String']['output']>;
  timeFrom: Maybe<Scalars['Time']['output']>;
  timeTo: Maybe<Scalars['Time']['output']>;
  token: Maybe<Token>;
};

export enum TrendingMintsCriteria {
  TotalMints = 'total_mints',
  UniqueWallets = 'unique_wallets'
}

export type TrendingMintsInput = {
  audience: Audience;
  blockchain: TrendingBlockchain;
  criteria: TrendingMintsCriteria;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: InputMaybe<TrendingFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  timeFrame: TimeFrame;
};

export type TrendingMintsOutput = {
  TrendingMint: Maybe<Array<TrendingMint>>;
  pageInfo: Maybe<PageInfo>;
};

export type TrendingSwap = {
  address: Maybe<Scalars['String']['output']>;
  blockchain: Maybe<Scalars['String']['output']>;
  buyTransactionCount: Maybe<Scalars['Int']['output']>;
  buyVolume: Maybe<Scalars['Float']['output']>;
  chainId: Maybe<Scalars['String']['output']>;
  criteria: Maybe<Scalars['String']['output']>;
  id: Maybe<Scalars['String']['output']>;
  sellTransactionCount: Maybe<Scalars['Int']['output']>;
  sellVolume: Maybe<Scalars['Float']['output']>;
  timeFrom: Maybe<Scalars['Time']['output']>;
  timeTo: Maybe<Scalars['Time']['output']>;
  token: Maybe<Token>;
  totalTransactionCount: Maybe<Scalars['Int']['output']>;
  totalUniqueWallets: Maybe<Scalars['Int']['output']>;
  totalVolume: Maybe<Scalars['Float']['output']>;
  uniqueBuyWallets: Maybe<Scalars['Int']['output']>;
  uniqueSellWallets: Maybe<Scalars['Int']['output']>;
};

export enum TrendingSwapsBlockchain {
  Base = 'base',
  Ethereum = 'ethereum'
}

export enum TrendingSwapsCriteria {
  BuyTransactionCount = 'buy_transaction_count',
  BuyVolume = 'buy_volume',
  SellTransactionCount = 'sell_transaction_count',
  SellVolume = 'sell_volume',
  TotalTransactionCount = 'total_transaction_count',
  TotalUniqueWallets = 'total_unique_wallets',
  TotalVolume = 'total_volume',
  UniqueBuyWallets = 'unique_buy_wallets',
  UniqueSellWallets = 'unique_sell_wallets'
}

export type TrendingSwapsFilter = {
  address: InputMaybe<Trending_Comparator_Exp>;
};

export type TrendingSwapsInput = {
  blockchain: TrendingSwapsBlockchain;
  criteria: TrendingSwapsCriteria;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: InputMaybe<TrendingSwapsFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  timeFrame: TimeFrame;
};

export type TrendingSwapsOutput = {
  TrendingSwap: Maybe<Array<TrendingSwap>>;
  pageInfo: Maybe<PageInfo>;
};

export type TrendingToken = {
  address: Maybe<Scalars['String']['output']>;
  audience: Maybe<Scalars['String']['output']>;
  blockchain: Maybe<Scalars['String']['output']>;
  chainId: Maybe<Scalars['String']['output']>;
  criteria: Maybe<Scalars['String']['output']>;
  criteriaCount: Maybe<Scalars['Int']['output']>;
  id: Maybe<Scalars['String']['output']>;
  timeFrom: Maybe<Scalars['Time']['output']>;
  timeTo: Maybe<Scalars['Time']['output']>;
  token: Maybe<Token>;
  uniqueHolders: Maybe<Scalars['Int']['output']>;
};

export enum TrendingTokensCriteria {
  TotalTransfers = 'total_transfers',
  UniqueHolders = 'unique_holders',
  UniqueWallets = 'unique_wallets'
}

export type TrendingTokensFilter = {
  address: InputMaybe<Trending_Comparator_Exp>;
};

export type TrendingTokensInput = {
  audience: Audience;
  blockchain: TrendingBlockchain;
  criteria: TrendingTokensCriteria;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: InputMaybe<TrendingTokensFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
  timeFrame: TimeFrame;
  transferType: TrendingTokensTransferType;
};

export type TrendingTokensOutput = {
  TrendingToken: Maybe<Array<TrendingToken>>;
  pageInfo: Maybe<PageInfo>;
};

export enum TrendingTokensTransferType {
  All = 'all',
  SelfInitiated = 'self_initiated'
}

export type Trending_Comparator_Exp = {
  _eq: InputMaybe<Scalars['Address']['input']>;
  _in: InputMaybe<Array<Scalars['Address']['input']>>;
};

export type VideoVariants = {
  original: Maybe<Scalars['String']['output']>;
};

export type Wallet = {
  /** Represent On-chain smart-contract accounts */
  accounts: Maybe<Array<Account>>;
  /** Returns addresses associated with the identity input */
  addresses: Maybe<Array<Scalars['Address']['output']>>;
  /** Blockchain associated with the provided identity */
  blockchain: Maybe<TokenBlockchain>;
  /** Nested query - allows querying domains owned by the address */
  domains: Maybe<Array<Domain>>;
  /** Blockchain address, ENS domain name, social identity such as Farcaster (for Farcaster use 'fc_fid:' prefix followed by the Farcaster user ID like fc_fid:5650, or use 'fc_fname:' prefix followed by the Farcaster user ID like 'fc_fname:vbuterin') or Lens (e.g. 'stani.lens) */
  identity: Scalars['Identity']['output'];
  /** Returns Poaps owned by the address */
  poaps: Maybe<Array<Poap>>;
  /** Nested query - allows returning primary domains, if applicable */
  primaryDomain: Maybe<Domain>;
  socialFollowers: Maybe<SocialFollowerOutput>;
  socialFollowings: Maybe<SocialFollowingOutput>;
  /** Returns social profile information related to the address */
  socials: Maybe<Array<Social>>;
  /** Nested query - allows returning token balances */
  tokenBalances: Maybe<Array<TokenBalance>>;
  /** Nested query - allows returning token transfers and related information */
  tokenTransfers: Maybe<Array<TokenTransfer>>;
  /** Nested query - allows querying the XMTP enabled addresses */
  xmtp: Maybe<Array<Xmtp>>;
};


export type WalletAccountsArgs = {
  input: InputMaybe<AccountsNestedInput>;
};


export type WalletDomainsArgs = {
  input: InputMaybe<DomainsNestedInput>;
};


export type WalletPoapsArgs = {
  input: InputMaybe<PoapsNestedInput>;
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


export type WalletTokenBalancesArgs = {
  input: InputMaybe<TokenBalancesNestedInput>;
};


export type WalletTokenTransfersArgs = {
  input: InputMaybe<TokenTransfersNestedInput>;
};


export type WalletXmtpArgs = {
  input: InputMaybe<XmtPsNestedInput>;
};

export type WalletInput = {
  blockchain: TokenBlockchain;
  identity: Scalars['Identity']['input'];
};

export type Xmtp = {
  blockchain: Maybe<EveryBlockchain>;
  /** Airstack unique identifier for the data point */
  id: Maybe<Scalars['ID']['output']>;
  isXMTPEnabled: Maybe<Scalars['Boolean']['output']>;
  owner: Maybe<Wallet>;
};

export type XmtpFilter = {
  owner: InputMaybe<Identity_Comparator_Exp>;
};

export type XmtPsInput = {
  blockchain: EveryBlockchain;
  cursor: InputMaybe<Scalars['String']['input']>;
  filter: XmtpFilter;
  limit: InputMaybe<Scalars['Int']['input']>;
};

export type XmtPsNestedInput = {
  blockchain: InputMaybe<EveryBlockchain>;
  filter: InputMaybe<XmtpFilter>;
  limit: InputMaybe<Scalars['Int']['input']>;
};

export type XmtPsOutput = {
  XMTP: Maybe<Array<Xmtp>>;
  pageInfo: Maybe<PageInfo>;
};

export type ProfileQueryVariables = Exact<{
  fid: Scalars['String']['input'];
}>;


export type ProfileQuery = { Socials: { Social: Array<{ userId: string | null, profileName: string | null, profileDisplayName: string | null, profileImage: string | null, isFarcasterPowerUser: boolean | null, userAddress: any | null, followerCount: number | null, followingCount: number | null, location: string | null, profileBio: string | null, connectedAddresses: Array<{ address: any | null, blockchain: string | null }> | null, socialCapital: { socialCapitalRank: number | null, socialCapitalScore: number | null } | null }> | null } | null };

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


export type ProfilesQuery = { Socials: { Social: Array<{ userId: string | null, profileName: string | null, profileDisplayName: string | null, profileImage: string | null, isFarcasterPowerUser: boolean | null, userAddress: any | null, followerCount: number | null, followingCount: number | null, location: string | null, profileBio: string | null, connectedAddresses: Array<{ address: any | null, blockchain: string | null }> | null, socialCapital: { socialCapitalRank: number | null, socialCapitalScore: number | null } | null }> | null, pageInfo: { hasNextPage: boolean, nextCursor: string } | null } | null };
