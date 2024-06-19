"use client";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { DatePicker, Checkbox, Input, Button, Link } from "@nextui-org/react";
import { ExternalLink, Info } from "lucide-react";
import { useState } from "react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import slugify from "slugify";
import { FrameImage } from "../../../components/FrameImage";
import {
  BASE_FRAME_URL,
  BASE_USDC_ADDRESS,
  BEEARLY_WALLET_ADDRESS,
} from "../../../lib/constants";
import { Waitlist, WaitlistTier } from "@prisma/client";
import { Image } from "@nextui-org/react";
import { title } from "process";
import PremiumRequired from "../../../components/PremiumRequired";
import { BeearlyButton } from "../../../components/BeearlyButton";
import { useCreateAndPayRequest } from "../../../lib/hooks/use-create-and-pay-request";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export const tiers = [
  {
    title: "Bumble Bee",
    price: "Free",
    image: "/bumble.svg",
    type: WaitlistTier.FREE,
  },
  {
    title: "Honey Bee",
    price: "25$",
    image: "/honey.svg",
    type: WaitlistTier.HONEY,
  },
  {
    title: "Queen Bee",
    price: "30$",
    image: "/queen.svg",
    type: WaitlistTier.QUEEN,
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
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    PaymentStatus.NOT_STARTED
  );
  const {
    mutate: createAndPayRequest,
    isPending: isCreateAndPayPending,
    isSuccess: isCreateAndPaySuccess,
  } = useCreateAndPayRequest({
    async onSuccess() {
      console.log("Successfully paid.");
      setPaymentStatus(PaymentStatus.SUCCESS);
      setButtonLoadingMessage("Creating waitlist");
      await createWaitlist();
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
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [endDate, setEndDate] = useState(
    parseAbsoluteToLocal(
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
    )
  );
  const [externalUrl, setExternalUrl] = useState<string>("");
  const [isPowerBadgeRequired, setIsPowerBadgeRequired] = useState<boolean>();
  const [requiredUsersFollow, setRequiredUsersFollow] = useState<string>();
  const [requiredChannels, setRequiredChannels] = useState<string>();
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
  const onSelectedLandingImageFile = (event: any) => {
    if (!event?.target?.files[0]) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setUploadedLandingImage(reader.result?.toString() || "");
    });
    reader.readAsDataURL(event.target.files[0]);
    setSelectedFileLanding(event?.target.files[0]);
  };
  const onSelectedSuccessImageFile = (event: any) => {
    if (!event?.target?.files[0]) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setUploadedSuccessImage(reader.result?.toString() || "");
    });
    reader.readAsDataURL(event.target.files[0]);
    setSelectedFileSuccess(event?.target.files[0]);
  };
  const onSelectedNotEligibleImageFile = (event: any) => {
    if (!event?.target?.files[0]) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setUploadedNotEligibleImage(reader.result?.toString() || "");
    });
    reader.readAsDataURL(event.target.files[0]);
    setSelectedFileNotEligible(event?.target.files[0]);
  };
  const onSelectedClosedImageFile = (event: any) => {
    if (!event?.target?.files[0]) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setUploadedClosedImage(reader.result?.toString() || "");
    });
    reader.readAsDataURL(event.target.files[0]);
    setSelectedFileClosed(event?.target.files[0]);
  };
  const isDisabled =
    !name ||
    !endDate ||
    !externalUrl ||
    !selectedFileLanding ||
    !selectedFileSuccess ||
    !selectedFileNotEligible ||
    !selectedFileClosed;

  const [error, setError] = useState<string>("");
  const confirmWaitlistCreation = async () => {
    if (selectedTier === WaitlistTier.FREE) {
      await createWaitlist();
      return;
    } else {
      const amount = selectedTier === WaitlistTier.HONEY ? 25 : 30;
      const description = `Creation of waitlist ${name} - ${selectedTier} tier`;
      await createAndPayRequest({
        setButtonLoadingMessage,
        amount: selectedTier === WaitlistTier.HONEY ? 25 : 30,
        payerAddress: address!,
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
    }
  };
  const createWaitlist = async () => {
    setLoading(true);
    setButtonLoadingMessage("Creating waitlist");
    if (
      !name ||
      !endDate ||
      !externalUrl ||
      !selectedFileLanding ||
      !selectedFileSuccess ||
      !selectedFileNotEligible ||
      !selectedFileClosed
    ) {
      setError("Please fill all the fields");
      setLoading(false);
      setButtonLoadingMessage("");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("endDate", endDate.toAbsoluteString());
    formData.append("externalUrl", externalUrl);
    formData.append("tier", selectedTier);
    formData.append("files[0]", selectedFileLanding);
    formData.append("files[1]", selectedFileSuccess);
    formData.append("files[2]", selectedFileNotEligible);
    formData.append("files[3]", selectedFileClosed);
    if (isPowerBadgeRequired?.toString()) {
      formData.append("isPowerBadgeRequired", isPowerBadgeRequired.toString());
    }
    if (requiredChannels) {
      formData.append("requiredChannels", requiredChannels.toString());
    }
    if (requiredUsersFollow) {
      formData.append("requiredUsersFollow", requiredUsersFollow.toString());
    }
    try {
      const res = await fetch("/api/waitlists", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setIsSuccess(true);
        router.push(`/waitlists/${data.slug}`);
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (e) {
      setError("An error occurred");
    } finally {
      setLoading(false);
      setButtonLoadingMessage("");
    }
  };

  const copyWaitlistFrameLink = () => {
    navigator.clipboard.writeText(
      `${BASE_FRAME_URL}/${slugify(name, { lower: true })}`
    );
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">New waitlist</h1>
      </div>
      <div className="mt-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <div className="font-semibold text-lg">Tier</div>
              <ExternalLink size={16} />
            </div>
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
                        setIsPowerBadgeRequired(false);
                        setRequiredUsersFollow("");
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
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-lg">Main details</div>
            <div className="flex flex-row gap-2 w-full">
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
              <div className="flex flex-col gap-1 w-[50%]">
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
          <div className="flex flex-row gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between">
                <div className="font-semibold text-lg">Add images</div>
                <div className="text-xs flex flex-row  text-gray-600 p-1 items-center rounded-md gap-1">
                  <Info size={12} className="text-gray-600" />
                  Recommended 955x500px - max 1MB (.jpg, .png, .gif)
                </div>
              </div>
              <div className="flex flex-row gap-1">
                <div className="w-[50%]">
                  <FrameImage
                    selectedFile={selectedFileLanding!}
                    uploadedImage={uploadedLandingImage}
                    onSelectedFile={onSelectedLandingImageFile}
                    label="Cover"
                  />
                </div>
                <div className="w-[50%]">
                  <FrameImage
                    selectedFile={selectedFileSuccess!}
                    uploadedImage={uploadedSuccessImage}
                    onSelectedFile={onSelectedSuccessImageFile}
                    label="Success"
                  />
                </div>
              </div>
              <div className="flex flex-row gap-1">
                <div className="w-[50%]">
                  <FrameImage
                    selectedFile={selectedFileNotEligible!}
                    uploadedImage={uploadedNotEligibleImage}
                    onSelectedFile={onSelectedNotEligibleImageFile}
                    label="Not Eligible"
                  />
                </div>
                <div className="w-[50%]">
                  <FrameImage
                    selectedFile={selectedFileClosed!}
                    uploadedImage={uploadedClosedImage}
                    onSelectedFile={onSelectedClosedImageFile}
                    label="Closed"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="font-semibold text-lg">
                Eligibility Requirements (optional)
              </div>
              <div className="flex flex-row gap-2 w-full">
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-gray-500">
                    Follow Channel IDs
                  </div>
                  <Input
                    type="text"
                    variant={"bordered"}
                    value={requiredChannels}
                    onValueChange={setRequiredChannels}
                    placeholder="build,base,farcaster"
                  />
                  <div className="text-xs text-gray-500">
                    Comma separated list of channel IDs that the users must
                    follow to be eligible
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-1 items-center">
                    <div className="text-sm text-gray-500">Follow users</div>
                    <PremiumRequired />
                  </div>
                  <Input
                    type="text"
                    variant={"bordered"}
                    value={requiredUsersFollow}
                    onValueChange={setRequiredUsersFollow}
                    placeholder="dwr.eth,v,horsefacts"
                    isDisabled={selectedTier === WaitlistTier.FREE}
                  />
                  <div className="text-xs text-gray-500">
                    Comma separated list of usernames that the users must follow
                    to be eligible
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4 w-full">
                <div className="flex flex-col gap-1 w-[50%]">
                  <div className="flex flex-row gap-1 items-center">
                    <div className="text-sm text-gray-500">Power Badge</div>
                    <PremiumRequired />
                  </div>
                  <Checkbox
                    isSelected={isPowerBadgeRequired}
                    onValueChange={setIsPowerBadgeRequired}
                    isDisabled={selectedTier === WaitlistTier.FREE}
                  >
                    Power Badge required
                  </Checkbox>

                  <div className="text-xs text-gray-500">
                    Users must have a Warpcast power badge to be eligible
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <Link href="/waitlists">
              <Button variant="light" color="primary">
                Cancel
              </Button>
            </Link>
            <BeearlyButton
              text={
                buttonLoadingMessage ? buttonLoadingMessage : "Create waitlist"
              }
              onPress={confirmWaitlistCreation}
              isLoading={isCreateAndPayPending}
              isDisabled={
                isCreateAndPayPending ||
                isConnecting ||
                !isConnected ||
                isDisabled
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}