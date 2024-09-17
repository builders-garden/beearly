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
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { AlertCircle, Info } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import slugify from "slugify";
import {
  WaitlistImagesMode,
  WaitlistRequirementType,
  WaitlistTier,
} from "@prisma/client";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { BASE_FRAME_URL } from "../../../../lib/constants";
import { getTokenAddressFromSymbolQuery } from "../../../../lib/graphql";
import PremiumRequired from "../../../../components/PremiumRequired";
import { FramePreview } from "../../../../components/FramePreview";
import {
  FrameImage,
  onSelectedImageFile,
} from "../../../../components/FrameImage";
import { BeearlyButton } from "../../../../components/BeearlyButton";
import { WaitlistWithRequirements } from "../../../../components/WaitlistDetail";
import toast from "react-hot-toast";

export default function EditWaitlist({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [waitlist, setWaitlist] = useState<WaitlistWithRequirements | null>();
  const [isWaitlistLoading, setWaitlistLoading] = useState(true);
  const { isConnected, isConnecting } = useAccount();
  const jwt = getAuthToken();

  // Fetches the waitlist data
  const fetchWaitlist = useCallback(() => {
    setWaitlistLoading(true);
    fetch(`/api/waitlists/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Waitlist not found") {
          setWaitlist(null);
        } else {
          console.log(data);
          setWaitlist(data);
        }
      })
      .finally(() => {
        setWaitlistLoading(false);
      });
  }, [id, jwt]);

  useEffect(() => {
    if (jwt && isConnected) {
      fetchWaitlist();
    }
  }, [jwt, isConnected, fetchWaitlist]);

  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [endDate, setEndDate] = useState(
    parseAbsoluteToLocal(
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
    )
  );
  const [externalUrl, setExternalUrl] = useState<string>("");
  const [joinButtonText, setJoinButtonText] = useState<string>("");
  const [hasCaptcha, setHasCaptcha] = useState<boolean>(false);
  const [requiresEmail, setRequiresEmail] = useState<boolean>(false);
  const [isBuilderScoreRequired, setIsBuilderScoreRequired] =
    useState<boolean>(false);
  const [fanTokenType, setFanTokenType] = useState<string>("cid");
  const [fanTokenName, setFanTokenName] = useState<string>("");
  const [fanTokenAmount, setFanTokenAmount] = useState<string>("");
  const [tokenNotFound, setTokenNotFound] = useState<boolean>(false);
  const [isFanTokenLauncher, setIsFanTokenLauncher] = useState<boolean>(false);
  const [requiredChannels, setRequiredChannels] = useState<string>("");
  const [requiredUsersFollow, setRequiredUsersFollow] = useState<string>("");
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

  useEffect(() => {
    if (waitlist) {
      setName(waitlist.name ?? "");
      setEndDate(
        parseAbsoluteToLocal(
          new Date(
            waitlist.endDate ?? Date.now() + 1000 * 60 * 60 * 24 * 7
          ).toISOString()
        )
      );
      setExternalUrl(waitlist.externalUrl ?? "");
      setJoinButtonText(waitlist.joinButtonText ?? "");
      setHasCaptcha(waitlist.hasCaptcha ?? false);
      setRequiresEmail(waitlist.requiresEmail ?? false);
      setIsBuilderScoreRequired(
        waitlist.waitlistRequirements!.find(
          (r) => r.type === WaitlistRequirementType.TALENT_BUILDER_SCORE
        )?.value === "15"
      );
      const fanTokenSymbolAndAmount: string[] | undefined = waitlist
        .waitlistRequirements!.find(
          (r) => r.type === WaitlistRequirementType.FAN_TOKEN_BALANCE
        )
        ?.value.split(";");
      const type = fanTokenSymbolAndAmount?.[0]?.split(":")[0] ?? "cid";
      const tokenName = fanTokenSymbolAndAmount?.[0]?.split(":")[1] ?? "";
      const amount = fanTokenSymbolAndAmount?.[1] ?? "";
      setFanTokenType(type);
      setFanTokenName(tokenName);
      setFanTokenAmount(amount);
      setIsFanTokenLauncher(
        waitlist.waitlistRequirements!.find(
          (r) => r.type === WaitlistRequirementType.FAN_TOKEN_LAUNCHER
        )?.value === "true"
      );
      setRequiredChannels(
        waitlist.waitlistRequirements
          ? waitlist
              .waitlistRequirements!.filter(
                (r) => r.type === WaitlistRequirementType.CHANNEL_FOLLOW
              )
              ?.map((c) => c.value)
              .join(",")
          : ""
      );
      setRequiredUsersFollow(
        waitlist.waitlistRequirements
          ? waitlist
              .waitlistRequirements!.filter(
                (r) => r.type === WaitlistRequirementType.USER_FOLLOW
              )
              ?.map((c) => c.value)
              .join(",")
          : ""
      );
      setUploadedLandingImage(waitlist.imageLanding ?? "");
      setUploadedSuccessImage(waitlist.imageSuccess ?? "");
      setUploadedNotEligibleImage(waitlist.imageNotEligible ?? "");
      setUploadedClosedImage(waitlist.imageError ?? "");
      setUploadedLogo(waitlist.logo ?? "");
      setImageTexts({
        landing: waitlist.textLanding ?? "",
        success: waitlist.textSuccess ?? "",
        notEligible: waitlist.textNotEligible ?? "",
        closed: waitlist.textError ?? "",
      });
      setTextsLengthError({
        landing: (waitlist.textLanding ?? "").length > 120,
        success: (waitlist.textSuccess ?? "").length > 120,
        notEligible: (waitlist.textNotEligible ?? "").length > 120,
        closed: (waitlist.textError ?? "").length > 120,
      });
      setImagesMode(waitlist.imagesMode ?? WaitlistImagesMode.SIMPLE);
    }
  }, [waitlist]);

  const isFormNotValid =
    !name ||
    !endDate ||
    !externalUrl ||
    (imagesMode === WaitlistImagesMode.ADVANCED &&
      ((!selectedFileLanding && !uploadedLandingImage) ||
        (!selectedFileSuccess && !uploadedSuccessImage) ||
        (!selectedFileNotEligible && !uploadedNotEligibleImage) ||
        (!selectedFileClosed && !uploadedClosedImage))) ||
    (imagesMode === WaitlistImagesMode.SIMPLE &&
      ((!selectedFileLogo && !uploadedLogo) ||
        !imageTexts.landing ||
        !imageTexts.success ||
        !imageTexts.notEligible ||
        !imageTexts.closed ||
        textsLengthError.landing ||
        textsLengthError.success ||
        textsLengthError.notEligible ||
        textsLengthError.closed));

  const updateWaitlist = async () => {
    setLoading(true);
    if (isFormNotValid) {
      setError("Please fill all the fields");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("endDate", endDate.toAbsoluteString());
    formData.append("externalUrl", externalUrl);
    if (joinButtonText) formData.append("joinButtonText", joinButtonText);
    formData.append("imagesMode", imagesMode);

    if (imagesMode === WaitlistImagesMode.ADVANCED) {
      if (selectedFileLanding) formData.append("files[0]", selectedFileLanding);
      if (selectedFileSuccess) formData.append("files[1]", selectedFileSuccess);
      if (selectedFileNotEligible)
        formData.append("files[2]", selectedFileNotEligible);
      if (selectedFileClosed) formData.append("files[3]", selectedFileClosed);
    } else {
      if (selectedFileLogo) formData.append("logoFile", selectedFileLogo);
      formData.append("imageTexts", JSON.stringify(imageTexts));
      formData.append("textsLengthError", JSON.stringify(textsLengthError));
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
    if (isFanTokenLauncher) {
      formData.append("isFanTokenLauncher", isFanTokenLauncher.toString());
    }
    if (requiredChannels) {
      formData.append("requiredChannels", requiredChannels.toString());
    }
    if (requiredUsersFollow) {
      formData.append("requiredUsersFollow", requiredUsersFollow.toString());
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

    if (waitlist) {
      const res = await fetch(`/api/waitlists/${waitlist.id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      });
      if (res.ok) {
        toast.success("Waitlist updated successfully", {
          position: "top-right",
        });
      } else {
        const data = await res.json();
        toast.error("An error occurred while updating the waitlist", {
          position: "top-right",
        });
        setError(data.message);
      }
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

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-3xl font-bold">Waitlist</div>
        <div className="flex flex-col p-24 items-center justify-center gap-4">
          <DynamicWidget />
        </div>
      </div>
    );
  }

  return (
    <div>
      {isWaitlistLoading && (
        <div className="flex flex-col mx-auto my-auto justify-center items-center gap-2 mt-24">
          <Spinner />
          <div className="text-2xl">Loading your waitlist details...</div>
        </div>
      )}
      {!waitlist && !isWaitlistLoading && (
        <div className="flex flex-col mx-auto my-auto justify-center items-center gap-2 mt-24">
          <div className="text-2xl">Waitlist not found</div>
        </div>
      )}
      {waitlist && !isWaitlistLoading && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Edit waitlist</h1>
          </div>
          <div className="mt-4">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <div className="font-semibold text-lg">Main details</div>
                <div className="flex flex-row gap-6 w-full">
                  <div className="flex flex-col gap-1 w-[25%]">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Name</span>
                      {name !== waitlist.name && (
                        <div className="flex flex-row items-center justify-center">
                          <div className="text-xs text-yellow-400 items-center rounded-md gap-1">
                            Changing name will disrupt pre-existing links
                          </div>
                        </div>
                      )}
                    </div>
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
                      This is the website you want your users to visit after
                      being whitelist
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
                      isDisabled={waitlist.tier === WaitlistTier.FREE}
                    />
                    <div className="text-xs text-gray-500">
                      A custom text you want to see on the button that users
                      will click to
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
                      isDisabled={waitlist.tier === "FREE"}
                    >
                      Enable Captcha Step
                    </Checkbox>

                    <div className="text-xs text-gray-500">
                      Users must go through a simple captcha step before joining
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-[25%]">
                    <div className="flex flex-row gap-1 items-center">
                      <div className="text-sm text-gray-500">
                        Email Collection
                      </div>
                      <PremiumRequired />
                    </div>
                    <Checkbox
                      isSelected={requiresEmail}
                      onValueChange={setRequiresEmail}
                      isDisabled={waitlist.tier === "FREE"}
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
                                    The text that will appear on the success
                                    image
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
                                    The text that will appear on the not
                                    eligible image
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
                                    The text that will appear on the closed
                                    image
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
                    <Tab
                      key={WaitlistImagesMode.ADVANCED}
                      title="Advanced Mode"
                    >
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
                    <div className="flex flex-row gap-1">
                      <Input
                        type="text"
                        variant={"bordered"}
                        value={requiredUsersFollow}
                        onValueChange={setRequiredUsersFollow}
                        placeholder="dwr.eth,v,horsefacts"
                        isDisabled={waitlist.tier === WaitlistTier.FREE}
                      />
                      <Tooltip content="Click me to add @beearlybot to the follow list!">
                        <button
                          className="text-xl"
                          onClick={() =>
                            setRequiredUsersFollow((prev) => {
                              if (prev === "") return "beearlybot";
                              return prev + ",beearlybot";
                            })
                          }
                        >
                          🐝
                        </button>
                      </Tooltip>
                    </div>
                    <div className="text-xs text-gray-500">
                      Comma separated list of usernames that the users must
                      follow to be eligible
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
                            newValue === "1"
                              ? "cid"
                              : newValue === "2"
                                ? "fid"
                                : ""
                          );
                        }}
                        isDisabled={waitlist.tier === WaitlistTier.FREE}
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
                        isDisabled={waitlist.tier === WaitlistTier.FREE}
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
                        isDisabled={waitlist.tier === WaitlistTier.FREE}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      A channel or user fan token and the amount required to be
                      eligible to join the waitlist
                    </div>
                  </div>
                </div>
                <div className="flex flex-row w-full">
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
                      isDisabled={waitlist.tier === WaitlistTier.FREE}
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
                      isDisabled={waitlist.tier === WaitlistTier.FREE}
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
                  {isFormNotValid ? (
                    <div className="flex flex-row gap-2 items-center">
                      <AlertCircle size={16} className="text-red-600" />
                      <div className="text-sm">
                        Make sure all the required fields are filled in
                        correctly
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                {isConnected ? (
                  <div className="flex flex-row gap-4">
                    <Link href={`/waitlists/${waitlist.id}`}>
                      <Button variant="light" color="primary">
                        Cancel
                      </Button>
                    </Link>
                    <BeearlyButton
                      text="Save"
                      onPress={updateWaitlist}
                      isLoading={loading}
                      isDisabled={
                        isConnecting || !isConnected || isFormNotValid
                      }
                    />
                  </div>
                ) : (
                  <DynamicWidget />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
