"use client";
import { DynamicWidget, getAuthToken } from "@dynamic-labs/sdk-react-core";
import {
  DatePicker,
  Checkbox,
  Input,
  Button,
  Link,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Switch,
  Tooltip,
} from "@nextui-org/react";
import {
  AlertCircle,
  CircleCheckBig,
  ExternalLink,
  Info,
  InfoIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import slugify from "slugify";
import {
  FrameImage,
  onSelectedImageFile,
} from "../../../components/FrameImage";
import {
  BASE_FRAME_URL,
  BASE_USDC_ADDRESS,
  BEEARLY_WALLET_ADDRESS,
} from "../../../lib/constants";
import {
  Checkout,
  CheckoutStatus,
  WaitlistImagesMode,
  WaitlistTier,
} from "@prisma/client";
import { Image } from "@nextui-org/react";
import PremiumRequired from "../../../components/PremiumRequired";
import { BeearlyButton } from "../../../components/BeearlyButton";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import _, { set } from "lodash";
import { getTokenAddressFromSymbolQuery } from "../../../lib/graphql";
import { parseUnits } from "viem";
import { useCreateAndPayRequest } from "../../../lib/hooks/use-create-and-pay-request";
import { FramePreview } from "../../../components/FramePreview";

const tiers = [
  {
    title: "Bumble Bee",
    price: "Free",
    image: "/bumble.svg",
    type: WaitlistTier.FREE,
    waitlistSize: "100 users",
    broadcastMessage: "1 every 24 hours",
    exportUsers: "No",
  },
  {
    title: "Honey Bee",
    price: "25 USDC",
    image: "/honey.svg",
    type: WaitlistTier.HONEY,
    waitlistSize: "500 users",
    broadcastMessage: "1 every 12 hours",
    exportUsers: "Yes",
  },
  {
    title: "Queen Bee",
    price: "30 USDC",
    image: "/queen.svg",
    type: WaitlistTier.QUEEN,
    waitlistSize: "Unlimited ∞",
    broadcastMessage: "1 every 10 minutes",
    exportUsers: "Yes",
  },
];

enum PaymentStatus {
  NOT_STARTED = "NOT_STARTED",
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  ERROR = "ERROR",
}

export default function NewWaitlist() {
  const router = useRouter();
  const { address, isConnected, isConnecting } = useAccount();
  const [buttonLoadingMessage, setButtonLoadingMessage] = useState<string>("");
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    PaymentStatus.NOT_STARTED
  );
  const jwt = getAuthToken();
  const {
    mutate: createAndPayRequest,
    isPending: isCreateAndPayPending,
    isSuccess: isCreateAndPaySuccess,
  } = useCreateAndPayRequest({
    async onSuccess(x: any) {
      console.log(x);
      console.log("Successfully paid.");
      setPaymentStatus(PaymentStatus.SUCCESS);
      setButtonLoadingMessage("");
      fetchCheckouts();
    },
    onError(error: any) {
      console.error(error);
      setButtonLoadingMessage("");
      setPaymentStatus(PaymentStatus.ERROR);
    },
  });
  const [selectedTier, setSelectedTier] = useState<WaitlistTier>(
    WaitlistTier.FREE
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [endDate, setEndDate] = useState(
    parseAbsoluteToLocal(
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
    )
  );
  const [externalUrl, setExternalUrl] = useState<string>("");
  const [joinButtonText, setJoinButtonText] = useState<string>("");
  const [requiredUsersFollow, setRequiredUsersFollow] = useState<string>("");
  const [requiredChannels, setRequiredChannels] = useState<string>("");
  const [isBuilderScoreRequired, setIsBuilderScoreRequired] =
    useState<boolean>();
  const [fanTokenType, setFanTokenType] = useState<string>("cid");
  const [fanTokenName, setFanTokenName] = useState<string>("");
  const [fanTokenAmount, setFanTokenAmount] = useState<string>("");
  const [isFanTokenLauncher, setIsFanTokenLauncher] = useState<boolean>();
  const [hasCaptcha, setHasCaptcha] = useState<boolean>(false);
  const [requiresEmail, setRequiresEmail] = useState<boolean>(false);
  const [selectedFileLanding, setSelectedFileLanding] = useState<File | null>(
    null
  );
  const [uploadedLandingImage, setUploadedLandingImage] = useState<string>("");
  const [selectedFileSuccess, setSelectedFileSuccess] = useState<File | null>(
    null
  );
  const [uploadedSuccessImage, setUploadedSuccessImage] = useState<string>("");
  const [selectedFileNotEligible, setSelectedFileNotEligible] =
    useState<File | null>(null);
  const [uploadedNotEligibleImage, setUploadedNotEligibleImage] =
    useState<string>("");
  const [selectedFileClosed, setSelectedFileClosed] = useState<File | null>(
    null
  );
  const [uploadedClosedImage, setUploadedClosedImage] = useState<string>("");

  const [tokenNotFound, setTokenNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [imagesMode, setImagesMode] = useState<WaitlistImagesMode>(
    WaitlistImagesMode.SIMPLE
  );
  const [selectedFileLogo, setSelectedFileLogo] = useState<File | null>(null);
  const [uploadedLogo, setUploadedLogo] = useState<string>("");
  const [imageTexts, setImageTexts] = useState({
    landing: "",
    success: "",
    notEligible: "",
    closed: "",
  });
  const [textsLengthError, setTextsLengthError] = useState({
    landing: false,
    success: false,
    notEligible: false,
    closed: false,
  });

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewType, setPreviewType] = useState<
    "landing" | "success" | "notEligible" | "closed"
  >("landing");

  const fetchCheckouts = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/checkouts?status=${CheckoutStatus.SUCCESS}&claimable=true`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setCheckouts(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, [jwt]);

  const confirmCheckout = async () => {
    const amount = selectedTier === WaitlistTier.HONEY ? 25 : 30;
    const description = `Creation of waitlist ${name} - ${selectedTier} tier`;
    createAndPayRequest({
      tier: selectedTier,
      amount,
      setButtonLoadingMessage,
      requestParams: {
        payerIdentity: address!,
        payeeIdentity: BEEARLY_WALLET_ADDRESS,
        signerIdentity: address!,
        paymentAddress: BEEARLY_WALLET_ADDRESS,
        expectedAmount: Number(parseUnits(amount.toString(), 6)),
        currencyAddress: BASE_USDC_ADDRESS,
        reason: description,
      },
    });
  };

  const createWaitlist = async () => {
    setLoading(true);
    if (
      !name ||
      !endDate ||
      !externalUrl ||
      (imagesMode === WaitlistImagesMode.ADVANCED &&
        (!selectedFileLanding ||
          !selectedFileSuccess ||
          !selectedFileNotEligible ||
          !selectedFileClosed)) ||
      (imagesMode === WaitlistImagesMode.SIMPLE &&
        (!selectedFileLogo ||
          !imageTexts.landing ||
          !imageTexts.success ||
          !imageTexts.notEligible ||
          !imageTexts.closed ||
          textsLengthError.landing ||
          textsLengthError.success ||
          textsLengthError.notEligible ||
          textsLengthError.closed))
    ) {
      setError("Please correctly fill all the required fields");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("endDate", endDate.toAbsoluteString());
    formData.append("externalUrl", externalUrl);
    formData.append("tier", selectedTier);
    formData.append("imagesMode", imagesMode);

    if (imagesMode === WaitlistImagesMode.ADVANCED) {
      formData.append("files[0]", selectedFileLanding!);
      formData.append("files[1]", selectedFileSuccess!);
      formData.append("files[2]", selectedFileNotEligible!);
      formData.append("files[3]", selectedFileClosed!);
    } else {
      formData.append("logoFile", selectedFileLogo!);
      formData.append("imageTexts", JSON.stringify(imageTexts));
      formData.append("textsLengthError", JSON.stringify(textsLengthError));
    }

    if (joinButtonText) {
      formData.append("joinButtonText", joinButtonText);
    }
    if (hasCaptcha) {
      formData.append("hasCaptcha", hasCaptcha.toString());
    }
    if (requiresEmail) {
      formData.append("requiresEmail", requiresEmail.toString());
    }
    if (isBuilderScoreRequired) {
      formData.append("requiredBuilderScore", "15");
    }
    if (requiredChannels) {
      formData.append("requiredChannels", requiredChannels.toString());
    }
    if (requiredUsersFollow) {
      formData.append("requiredUsersFollow", requiredUsersFollow.toString());
    }
    if (isFanTokenLauncher) {
      formData.append("isFanTokenLauncher", isFanTokenLauncher.toString());
    }
    if (fanTokenType && fanTokenName && !tokenNotFound) {
      formData.append(
        "fanTokenSymbolAndAmount",
        fanTokenType +
          ":" +
          fanTokenName +
          ";" +
          (fanTokenAmount && parseFloat(fanTokenAmount) > 0
            ? fanTokenAmount
            : "0")
      );
    }
    try {
      const res = await fetch("/api/waitlists", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setIsSuccess(true);
        router.push(`/waitlists/${data.id}`);
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (e) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // This function is used to check if the token exists and it's debounced to avoid making too many requests
  const debouncedCheckToken = useRef(
    _.debounce(async (fanTokenName, fanTokenType) => {
      if (!fanTokenType || !fanTokenName) {
        setTokenNotFound(false);
        return;
      }
      const data = await getTokenAddressFromSymbolQuery(
        fanTokenType + ":" + fanTokenName
      );
      if (!data) {
        setTokenNotFound(true);
      } else {
        setTokenNotFound(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    debouncedCheckToken(fanTokenName, fanTokenType);
  }, [fanTokenType, fanTokenName, debouncedCheckToken]);

  const selectedTierDetails = tiers.find((tier) => tier.type === selectedTier);
  const hasHoneyAvailable = checkouts.some(
    (checkout) => checkout.tier === WaitlistTier.HONEY
  );
  const hasQueenAvailable = checkouts.some(
    (checkout) => checkout.tier === WaitlistTier.QUEEN
  );
  const isTierAvailable =
    selectedTier === WaitlistTier.FREE ||
    (selectedTier === WaitlistTier.HONEY && hasHoneyAvailable) ||
    (selectedTier == WaitlistTier.QUEEN && hasQueenAvailable);
  const isWaitlistFormValid =
    name &&
    endDate &&
    externalUrl &&
    ((imagesMode === WaitlistImagesMode.ADVANCED &&
      selectedFileLanding &&
      selectedFileSuccess &&
      selectedFileNotEligible &&
      selectedFileClosed) ||
      (imagesMode === WaitlistImagesMode.SIMPLE &&
        selectedFileLogo &&
        imageTexts.landing &&
        imageTexts.success &&
        imageTexts.notEligible &&
        imageTexts.closed &&
        !textsLengthError.landing &&
        !textsLengthError.success &&
        !textsLengthError.notEligible &&
        !textsLengthError.closed));

  const isDisabled = !isWaitlistFormValid || !isTierAvailable;

  useEffect(() => {
    if (jwt && isConnected) {
      fetchCheckouts();
    }
  }, [jwt, isConnected, fetchCheckouts]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">New waitlist</h1>
      </div>
      <div className="mt-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Link href={"/pricing"} target="_blank" className="text-black">
              <div className="flex flex-row gap-2 items-center">
                <div className="font-semibold text-lg">Tier</div>
                <ExternalLink size={16} />
              </div>
            </Link>
            <div className="flex flex-row gap-8">
              <div className="flex flex-row gap-4">
                {tiers.map((tier) => {
                  if (selectedTier === tier.type) {
                    return (
                      <div
                        key={tier.type}
                        className="rounded-sm h-32 w-32 flex flex-col items-center text-center justify-center border-3 border-primary bg-primary/10 gap-1"
                      >
                        <Image
                          src={tier.image}
                          className="w-10 h-10"
                          alt={tier.title}
                        />
                        <div className="flex flex-col items-center text-center justify-center">
                          <div className="text-lg font-semibold text-center">
                            {tier.title}
                          </div>
                          <div className="text-sm">{tier.price}</div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={tier.type}
                      className="rounded-sm h-32 w-32 flex flex-col items-center text-center justify-center border border-gray-300 opacity-50 gap-1"
                      onClick={() => {
                        if (tier.type === WaitlistTier.FREE) {
                          setIsFanTokenLauncher(false);
                          setHasCaptcha(false);
                          setRequiresEmail(false);
                          setIsBuilderScoreRequired(false);
                          setJoinButtonText("");
                          setRequiredUsersFollow("");
                          setFanTokenAmount("");
                          setFanTokenName("");
                          setTokenNotFound(false);
                        }
                        setSelectedTier(tier.type);
                      }}
                    >
                      <Image
                        src={tier.image}
                        className="w-10 h-10"
                        alt={tier.title}
                      />
                      <div className="flex flex-col items-center text-center justify-center">
                        <div className="text-lg font-semibold text-center">
                          {tier.title}
                        </div>
                        <div className="text-sm">{tier.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col justify-between border-2 bg-blue-700/20 p-2 rounded-sm border-blue-700">
                <div className="flex flex-col text-sm">
                  <div className="flex flex-row gap-1">
                    <p>Waitlist size:</p>
                    <p>
                      <span className="font-semibold">
                        {selectedTierDetails?.waitlistSize}
                      </span>{" "}
                      {selectedTier !== WaitlistTier.QUEEN
                        ? "- we stop accepting new users after it"
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-row gap-1">
                    <p>Broadcast messages:</p>
                    <p className="font-semibold">
                      {selectedTierDetails?.broadcastMessage}
                    </p>
                  </div>
                  <div className="flex flex-row gap-1">
                    <p>Export users:</p>
                    <p className="font-semibold">
                      {selectedTierDetails?.exportUsers}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-8 justify-between">
                  {
                    // if the selected tier is available, show a message
                    isTierAvailable ? (
                      <div className="flex flex-row gap-2 items-center">
                        <CircleCheckBig size={16} className="text-blue-700" />
                        <p className="text-blue-700">Tier available</p>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-blue-700 text-white font-semibold w-fit"
                        onPress={confirmCheckout}
                        isLoading={isCreateAndPayPending}
                        isDisabled={isCreateAndPayPending}
                      >
                        {buttonLoadingMessage
                          ? buttonLoadingMessage
                          : `Pay ${selectedTierDetails?.price} to unlock`}
                      </Button>
                    )
                  }
                  <Link
                    href="/pricing"
                    target="_blank"
                    className="text-black underline"
                  >
                    <div className="flex flex-row gap-1 items-center">
                      <p className="text-xs">Learn more about pricing</p>
                      <InfoIcon size={14} />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-lg">Main details</div>
            <div className="flex flex-row gap-6 w-full">
              <div className="flex flex-col gap-1 w-[25%]">
                <div className="text-sm text-gray-500">Name</div>
                <Input
                  type="text"
                  variant={"bordered"}
                  value={name}
                  onValueChange={setName}
                  placeholder="Frame Example"
                />
                <div className="text-xs text-gray-500">
                  {BASE_FRAME_URL}/
                  <span className="font-semibold text-gray-800">{`${
                    name
                      ? slugify(name, {
                          lower: true,
                          replacement: "-",
                        })
                      : "<slug>"
                  }`}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 w-[25%]">
                <div className="text-sm text-gray-500">Closing time</div>
                <DatePicker
                  aria-labelledby="Closing time"
                  className="max-w-md"
                  granularity="minute"
                  variant="bordered"
                  minValue={parseAbsoluteToLocal(new Date().toISOString())}
                  value={endDate}
                  onChange={setEndDate}
                />

                <div className="text-xs text-gray-500">
                  The time you want your waitlist to close
                </div>
              </div>
              <div className="flex flex-col gap-1 w-[25%]">
                <div className="text-sm text-gray-500">External url</div>
                <Input
                  type="text"
                  variant={"bordered"}
                  value={externalUrl}
                  onValueChange={setExternalUrl}
                  placeholder="https://yourwebsite.xyz"
                />
                <div className="text-xs text-gray-500">
                  This is the website you want your users to visit after being
                  whitelist
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 w-full">
              <div className="flex flex-col gap-1 w-[25%]">
                <div className="flex flex-row gap-1 items-center">
                  <div className="text-sm text-gray-500">
                    Custom button text
                  </div>
                  <PremiumRequired />
                </div>
                <Input
                  type="text"
                  variant={"bordered"}
                  value={joinButtonText}
                  onValueChange={setJoinButtonText}
                  placeholder="Join My Waitlist, Get Access, etc."
                  isDisabled={selectedTier === WaitlistTier.FREE}
                />
                <div className="text-xs text-gray-500">
                  A custom text you want to see on the button that users will
                  click to
                </div>
              </div>
              <div className="flex flex-col gap-1 w-[25%]">
                <div className="flex flex-row gap-1 items-center">
                  <div className="text-sm text-gray-500">Captcha Step</div>
                  <PremiumRequired />
                </div>
                <Checkbox
                  isSelected={hasCaptcha}
                  onValueChange={setHasCaptcha}
                  isDisabled={selectedTier === "FREE"}
                >
                  Enable Captcha Step
                </Checkbox>

                <div className="text-xs text-gray-500">
                  Users must go through a simple captcha step before joining
                </div>
              </div>
              <div className="flex flex-col gap-1 w-[25%]">
                <div className="flex flex-row gap-1 items-center">
                  <div className="text-sm text-gray-500">Email Collection</div>
                  <PremiumRequired />
                </div>
                <Checkbox
                  isSelected={requiresEmail}
                  onValueChange={setRequiresEmail}
                  isDisabled={selectedTier === "FREE"}
                >
                  Enable Email collection
                </Checkbox>

                <div className="text-xs text-gray-500">
                  Users must provide their email address before joining
                </div>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-lg">Add images</div>
              <Tabs
                aria-label="Image upload options"
                selectedKey={imagesMode}
                onSelectionChange={(key) =>
                  setImagesMode(key as WaitlistImagesMode)
                }
              >
                <Tab key={WaitlistImagesMode.SIMPLE} title="Simple Mode">
                  <div className="text-xs flex flex-row text-gray-600 ml-2 -mt-2 items-center rounded-md gap-1">
                    <Info size={12} className="text-gray-600" />
                    <span className="py-1">
                      Recommended 250x250px - max 1MB (.jpg, .png, .gif)
                    </span>
                    <Switch
                      className="ml-6"
                      size="sm"
                      onValueChange={() =>
                        setIsPreviewVisible(!isPreviewVisible)
                      }
                      isSelected={isPreviewVisible}
                    >
                      Show Preview
                    </Switch>
                  </div>
                  <div className="flex relative items-center flex-row gap-1 -mb-3">
                    <FramePreview
                      imageTexts={imageTexts}
                      uploadedLogo={uploadedLogo}
                      setPreviewType={setPreviewType}
                      previewType={previewType}
                    />
                    <div
                      className={`z-10 bg-white flex transition-all duration-300 ${isPreviewVisible ? "ml-[320px]" : "ml-0"}`}
                    >
                      <div className="w-[22%]">
                        <FrameImage
                          selectedFile={selectedFileLogo!}
                          uploadedImage={uploadedLogo}
                          onSelectedFile={onSelectedImageFile(
                            setUploadedLogo,
                            setSelectedFileLogo
                          )}
                          label="Logo"
                          aspectRatio="1:1"
                        />
                      </div>
                      <div
                        className={`flex flex-row items-center transition-all duration-300 ${isPreviewVisible ? "gap-5 ml-8" : "gap-8 ml-10"}`}
                      >
                        <div
                          className={`flex flex-col transition-all duration-300 ${isPreviewVisible ? "w-[350px]" : "w-[450px]"} gap-2`}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="text-sm text-gray-500 font-bold">
                              Cover Image Text
                            </div>
                            <Input
                              type="text"
                              variant={"bordered"}
                              value={imageTexts.landing}
                              onValueChange={(value) => {
                                setImageTexts((prev) => ({
                                  ...prev,
                                  landing: value,
                                }));
                                setTextsLengthError((prev) => ({
                                  ...prev,
                                  landing: value.length > 120,
                                }));
                              }}
                              placeholder="Click on the button to join the waitlist!"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                The text that will appear on the cover image
                              </span>
                              {textsLengthError.landing && (
                                <span className="text-red-500 pr-1">
                                  Max 120 characters
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm text-gray-500 font-bold">
                              Success Image Text
                            </div>
                            <Input
                              type="text"
                              variant={"bordered"}
                              value={imageTexts.success}
                              onValueChange={(value) => {
                                setImageTexts((prev) => ({
                                  ...prev,
                                  success: value,
                                }));
                                setTextsLengthError((prev) => ({
                                  ...prev,
                                  success: value.length > 120,
                                }));
                              }}
                              placeholder="You're in! You're now part of the waitlist!"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                The text that will appear on the success image
                              </span>
                              {textsLengthError.success && (
                                <span className="text-red-500 pr-1">
                                  Max 120 characters
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`flex flex-col transition-all duration-300 ${isPreviewVisible ? "w-[350px]" : "w-[450px]"} gap-2`}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="text-sm text-gray-500 font-bold">
                              Not Eligible Image Text
                            </div>
                            <Input
                              type="text"
                              variant={"bordered"}
                              value={imageTexts.notEligible}
                              onValueChange={(value) => {
                                setImageTexts((prev) => ({
                                  ...prev,
                                  notEligible: value,
                                }));
                                setTextsLengthError((prev) => ({
                                  ...prev,
                                  notEligible: value.length > 120,
                                }));
                              }}
                              placeholder="You're not eligible to join this waitlist."
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                The text that will appear on the not eligible
                                image
                              </span>
                              {textsLengthError.notEligible && (
                                <span className="text-red-500 pr-1">
                                  Max 120 characters
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm text-gray-500 font-bold">
                              Closed Image Text
                            </div>
                            <Input
                              type="text"
                              variant={"bordered"}
                              value={imageTexts.closed}
                              onValueChange={(value) => {
                                setImageTexts((prev) => ({
                                  ...prev,
                                  closed: value,
                                }));
                                setTextsLengthError((prev) => ({
                                  ...prev,
                                  closed: value.length > 120,
                                }));
                              }}
                              placeholder="The waitlist is now closed."
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                The text that will appear on the closed image
                              </span>
                              {textsLengthError.closed && (
                                <span className="text-red-500 pr-1">
                                  Max 120 characters
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab key={WaitlistImagesMode.ADVANCED} title="Advanced Mode">
                  <div className="text-xs flex flex-row  text-gray-600 ml-2 -mt-2 items-center rounded-md gap-1">
                    <Info size={12} className="text-gray-600" />
                    <span className="py-1">
                      Recommended 955x500px - max 1MB (.jpg, .png, .gif)
                    </span>
                  </div>
                  <div className="flex flex-row gap-1 -mb-3">
                    <div className="w-[50%]">
                      <FrameImage
                        selectedFile={selectedFileLanding!}
                        uploadedImage={uploadedLandingImage}
                        onSelectedFile={onSelectedImageFile(
                          setUploadedLandingImage,
                          setSelectedFileLanding
                        )}
                        label="Cover"
                        aspectRatio="1.91:1"
                      />
                    </div>
                    <div className="w-[50%]">
                      <FrameImage
                        selectedFile={selectedFileSuccess!}
                        uploadedImage={uploadedSuccessImage}
                        onSelectedFile={onSelectedImageFile(
                          setUploadedSuccessImage,
                          setSelectedFileSuccess
                        )}
                        label="Success"
                        aspectRatio="1.91:1"
                      />
                    </div>
                    <div className="w-[50%]">
                      <FrameImage
                        selectedFile={selectedFileNotEligible!}
                        uploadedImage={uploadedNotEligibleImage}
                        onSelectedFile={onSelectedImageFile(
                          setUploadedNotEligibleImage,
                          setSelectedFileNotEligible
                        )}
                        label="Not Eligible"
                        aspectRatio="1.91:1"
                      />
                    </div>
                    <div className="w-[50%]">
                      <FrameImage
                        selectedFile={selectedFileClosed!}
                        uploadedImage={uploadedClosedImage}
                        onSelectedFile={onSelectedImageFile(
                          setUploadedClosedImage,
                          setSelectedFileClosed
                        )}
                        label="Closed (deadline or size limit)"
                        aspectRatio="1.91:1"
                      />
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-lg">
              Eligibility Requirements (optional)
            </div>
            <div className="flex flex-row gap-8 w-full">
              <div className="flex flex-col gap-1">
                <div className="text-sm text-gray-500">Follow Channel IDs</div>
                <Input
                  type="text"
                  variant={"bordered"}
                  value={requiredChannels}
                  onValueChange={setRequiredChannels}
                  placeholder="build,base,farcaster"
                />
                <div className="text-xs text-gray-500">
                  Comma separated list of channel IDs that the users must follow
                  to be eligible
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center">
                  <div className="text-sm text-gray-500">Follow users</div>
                  <PremiumRequired />
                </div>
                <div className="flex flex-row items-center gap-1">
                  <Input
                    type="text"
                    variant={"bordered"}
                    value={requiredUsersFollow}
                    onValueChange={setRequiredUsersFollow}
                    placeholder="dwr.eth,v,horsefacts"
                    isDisabled={selectedTier === WaitlistTier.FREE}
                  />
                  <Tooltip
                    content={
                      <div>
                        Click me to add{" "}
                        <span className="font-bold">@beearlybot</span> to the
                        follow list!
                        {selectedTier === WaitlistTier.FREE && (
                          <div>
                            This feature is only available with Honey Bee or
                            Queen Bee tier.
                          </div>
                        )}
                      </div>
                    }
                  >
                    {/* This div is needed to prevent the tooltip from breaking if button is disabled */}
                    <div>
                      <button
                        className={`text-xl ${selectedTier === WaitlistTier.FREE ? "opacity-50 cursor-default" : ""}`}
                        onClick={() =>
                          setRequiredUsersFollow((prev) => {
                            if (prev.includes("beearlybot")) return prev;
                            if (prev === "") return "beearlybot";
                            return (
                              prev +
                              (prev.endsWith(",")
                                ? "beearlybot"
                                : ",beearlybot")
                            );
                          })
                        }
                        disabled={selectedTier === WaitlistTier.FREE}
                      >
                        🐝
                      </button>
                    </div>
                  </Tooltip>
                </div>
                <div className="text-xs text-gray-500">
                  Comma separated list of usernames that the users must follow
                  to be eligible
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center">
                  <div className="text-sm text-gray-500">
                    Fan Token by{" "}
                    <span className="underline">
                      <Link
                        href="https://build.moxie.xyz/the-moxie-protocol/moxie-protocol/fan-tokens"
                        target="_blank"
                        className="underline"
                      >
                        Moxie
                      </Link>
                    </span>
                  </div>
                  <PremiumRequired />
                  {tokenNotFound ? (
                    <div className="text-xs text-red-700 pl-4">
                      Token not found
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-row gap-1">
                  <Select
                    aria-label="Fan Token"
                    className="w-[60%]"
                    defaultSelectedKeys="1"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setFanTokenType(
                        newValue === "1" ? "cid" : newValue === "2" ? "fid" : ""
                      );
                    }}
                    isDisabled={selectedTier === WaitlistTier.FREE}
                  >
                    <SelectItem key="1">Channel</SelectItem>
                    <SelectItem key="2">User FID</SelectItem>
                  </Select>
                  <Input
                    type="text"
                    variant={"bordered"}
                    value={fanTokenName}
                    onValueChange={async (e) => {
                      setFanTokenName(e);
                    }}
                    placeholder={
                      fanTokenType === "cid"
                        ? "Channel ID (e.g. farcaster)"
                        : fanTokenType === "fid"
                          ? "User FID (e.g. 3)"
                          : "User FID or Channel ID"
                    }
                    isDisabled={selectedTier === WaitlistTier.FREE}
                  />
                  <Input
                    className="w-[80%]"
                    type="Number"
                    min={0}
                    variant={"bordered"}
                    value={fanTokenAmount}
                    onValueChange={(e) => {
                      setFanTokenAmount(e);
                    }}
                    placeholder="amount"
                    isDisabled={selectedTier === WaitlistTier.FREE}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  A channel or user fan token and the amount required to be
                  eligible to join the waitlist
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-8 w-full">
              <div className="flex flex-col gap-1 w-[25%]">
                <div className="flex flex-row gap-1 items-center">
                  <div className="text-sm text-gray-500">
                    Proof of Humanity with{" "}
                    <span className="underline">
                      <Link
                        href="https://talentprotocol.notion.site/Builder-Score-FAQ-4e07c8df13514ce79661ed0d776d4741"
                        target="_blank"
                        className="underline"
                      >
                        Builder Score
                      </Link>
                    </span>
                  </div>
                  <PremiumRequired />
                </div>
                <Checkbox
                  isSelected={isBuilderScoreRequired}
                  onValueChange={setIsBuilderScoreRequired}
                  isDisabled={selectedTier === WaitlistTier.FREE}
                >
                  Proof of Humanity required
                </Checkbox>
                <div className="text-xs text-gray-500">
                  Eligibility requires a minimum Builder Score of 15,
                  demonstrating humanity
                </div>
              </div>
              <div className="flex flex-col gap-1 w-[25%]">
                <div className="flex flex-row gap-1 items-center">
                  <div className="text-sm text-gray-500">
                    Launched a Fan Token with{" "}
                    <span className="underline">
                      <Link
                        href="https://build.moxie.xyz/the-moxie-protocol/moxie-protocol/fan-tokens"
                        target="_blank"
                        className="underline"
                      >
                        Moxie
                      </Link>
                    </span>
                  </div>
                  <PremiumRequired />
                </div>
                <Checkbox
                  isSelected={isFanTokenLauncher}
                  onValueChange={setIsFanTokenLauncher}
                  isDisabled={selectedTier === WaitlistTier.FREE}
                >
                  Must be a fan token launcher
                </Checkbox>

                <div className="text-xs text-gray-500">
                  Users must have launched his own fan token to be eligible
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1 text-red-600">
              {
                // if there is an error, show the error
                error ? <div>{error}</div> : null
              }
              {!isWaitlistFormValid ? (
                <div className="flex flex-row gap-2 items-center">
                  <AlertCircle size={16} className="text-red-600" />
                  <div className="text-sm">
                    Make sure all the required fields are filled in correctly
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              {isTierAvailable ? (
                <div></div>
              ) : (
                <div className="flex flex-row gap-2 items-center">
                  <AlertCircle size={16} className="text-red-600" />
                  <div className="text-sm">
                    To create a {selectedTier} waitlist, you need to unlock it
                    first
                  </div>
                </div>
              )}
            </div>
            {isConnected ? (
              <div className="flex flex-row gap-4">
                <Link href="/waitlists">
                  <Button variant="light" color="primary">
                    Cancel
                  </Button>
                </Link>
                <BeearlyButton
                  text={
                    buttonLoadingMessage
                      ? buttonLoadingMessage
                      : "Create waitlist"
                  }
                  onPress={createWaitlist}
                  isLoading={loading}
                  isDisabled={isConnecting || !isConnected || isDisabled}
                />
              </div>
            ) : (
              <DynamicWidget />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
