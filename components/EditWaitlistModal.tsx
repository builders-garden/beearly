import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  DatePicker,
  Checkbox,
  Link,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import slugify from "slugify";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { FrameImage, onSelectedImageFile } from "./FrameImage";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { BASE_FRAME_URL } from "../lib/constants";
import { WaitlistImagesMode, WaitlistRequirementType } from "@prisma/client";
import { BeearlyButton } from "./BeearlyButton";
import { WaitlistWithRequirements } from "./WaitlistDetail";
import PremiumRequired from "./PremiumRequired";
import { getTokenAddressFromSymbolQuery } from "../lib/graphql";
import _ from "lodash";

export const EditWaitlistModal = ({
  waitlist,
  refetchWaitlist,
  isOpen,
  onOpenChange,
}: {
  waitlist: WaitlistWithRequirements;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refetchWaitlist: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(waitlist.name);
  const [endDate, setEndDate] = useState(
    parseAbsoluteToLocal(new Date(waitlist.endDate).toISOString())
  );
  const [externalUrl, setExternalUrl] = useState<string>(waitlist.externalUrl);
  const [joinButtonText, setJoinButtonText] = useState<string>(
    waitlist.joinButtonText || ""
  );
  const [hasCaptcha, setHasCaptcha] = useState<boolean>(waitlist.hasCaptcha);
  const [requiresEmail, setRequiresEmail] = useState<boolean>(
    waitlist.requiresEmail
  );
  const [isBuilderScoreRequired, setIsBuilderScoreRequired] = useState<boolean>(
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

  const [fanTokenType, setFanTokenType] = useState<string>(type);
  const [fanTokenName, setFanTokenName] = useState<string>(tokenName);
  const [fanTokenAmount, setFanTokenAmount] = useState<string>(amount);

  const [tokenNotFound, setTokenNotFound] = useState<boolean>(false);

  const [isFanTokenLauncher, setIsFanTokenLauncher] = useState<boolean>(
    waitlist.waitlistRequirements!.find(
      (r) => r.type === WaitlistRequirementType.FAN_TOKEN_LAUNCHER
    )?.value === "true"
  );
  const [requiredChannels, setRequiredChannels] = useState<string>(
    waitlist
      .waitlistRequirements!.filter(
        (r) => r.type === WaitlistRequirementType.CHANNEL_FOLLOW
      )
      ?.map((c) => c.value)
      .join(",")
  );
  const [requiredUsersFollow, setRequiredUsersFollow] = useState<string>(
    waitlist
      .waitlistRequirements!.filter(
        (r) => r.type === WaitlistRequirementType.USER_FOLLOW
      )
      ?.map((c) => c.value)
      .join(",")
  );

  const [selectedFileLanding, setSelectedFileLanding] = useState<File | null>(
    null
  );
  const [uploadedLandingImage, setUploadedLandingImage] = useState<
    string | null
  >(waitlist.imageLanding);
  const [selectedFileSuccess, setSelectedFileSuccess] = useState<File | null>(
    null
  );
  const [uploadedSuccessImage, setUploadedSuccessImage] = useState<
    string | null
  >(waitlist.imageSuccess);
  const [selectedFileNotEligible, setSelectedFileNotEligible] =
    useState<File | null>(null);
  const [uploadedNotEligibleImage, setUploadedNotEligibleImage] = useState<
    string | null
  >(waitlist.imageNotEligible);
  const [selectedFileClosed, setSelectedFileClosed] = useState<File | null>(
    null
  );
  const [uploadedClosedImage, setUploadedClosedImage] = useState<string | null>(
    waitlist.imageError
  );

  const [imagesMode, setImagesMode] = useState<WaitlistImagesMode>(
    waitlist.imagesMode
  );
  const [selectedFileLogo, setSelectedFileLogo] = useState<File | null>(null);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(
    waitlist.logo
  );
  const [imageTexts, setImageTexts] = useState({
    landing: waitlist.textLanding,
    success: waitlist.textSuccess,
    notEligible: waitlist.textNotEligible,
    closed: waitlist.textError,
  });
  const [textsLengthError, setTextsLengthError] = useState({
    landing: waitlist.textLanding ? waitlist.textLanding?.length > 120 : false,
    success: waitlist.textSuccess ? waitlist.textSuccess?.length > 120 : false,
    notEligible: waitlist.textNotEligible
      ? waitlist.textNotEligible?.length > 120
      : false,
    closed: waitlist.textError ? waitlist.textError?.length > 120 : false,
  });

  const isDisabled =
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

  const [error, setError] = useState<string>();
  const updateWaitlist = async () => {
    setLoading(true);
    if (
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
          textsLengthError.closed))
    ) {
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

    const res = await fetch(`/api/waitlists/${waitlist.id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      refetchWaitlist();
      onOpenChange(false);
    } else {
      const data = await res.json();
      setError(data.message);
    }
    setLoading(false);
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

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-3xl">
              Edit waitlist
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="font-semibold text-lg">Main details</div>
                  <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col gap-1 w-[50%]">
                      <div className="flex flex-row gap-1">
                        <div className="text-sm text-gray-500">Name</div>
                        {name !== waitlist.name && (
                          <div className="flex flex-row items-center justify-center">
                            <div className="text-xs text-yellow-400 items-center rounded-md gap-1">
                              (Changing name will disrupt pre-existing links)
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
                    <div className="flex flex-col gap-1 w-[50%]">
                      <div className="text-sm text-gray-500">Closing time</div>
                      <DatePicker
                        aria-labelledby="Closing time"
                        className="max-w-md"
                        granularity="minute"
                        variant="bordered"
                        minValue={parseAbsoluteToLocal(
                          new Date().toISOString()
                        )}
                        value={endDate}
                        onChange={setEndDate}
                      />

                      <div className="text-xs text-gray-500">
                        The time you want your waitlist to close
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col gap-1 w-[50%]">
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
                    <div className="flex flex-col gap-1 w-[50%]">
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
                        isDisabled={waitlist.tier === "FREE"}
                      />
                      <div className="text-xs text-gray-500">
                        A custom text you want to see on the button that users
                        will click to
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col gap-1 w-[50%]">
                      <div className="flex flex-row gap-1 items-center">
                        <div className="text-sm text-gray-500">
                          Captcha Step
                        </div>
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
                        Users must go through a simple captcha step before
                        joining
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-[50%]">
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
                        Enable Email Collection
                      </Checkbox>

                      <div className="text-xs text-gray-500">
                        Users must provide their email address before joining
                      </div>
                    </div>
                  </div>
                </div>

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
                        Recommended 250x250px - max 1MB (.jpg, .png, .gif)
                      </div>
                      <div className="flex flex-row gap-1 -mb-3">
                        <div className="w-[27%]">
                          <FrameImage
                            selectedFile={selectedFileLogo!}
                            uploadedImage={uploadedLogo ?? ""}
                            onSelectedFile={onSelectedImageFile(
                              setUploadedLogo,
                              setSelectedFileLogo
                            )}
                            label="Logo"
                            aspectRatio="1:1"
                          />
                        </div>
                        <div className="flex flex-row flex-grow items-center ml-6 gap-4">
                          <div className="flex flex-col flex-grow gap-3">
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between items-center text-xs text-gray-500 font-bold">
                                <span>Cover Image Text</span>
                                {textsLengthError.landing && (
                                  <span className="text-red-500 text-[11px] font-normal">
                                    Max 120 char.
                                  </span>
                                )}
                              </div>
                              <Input
                                type="text"
                                variant={"bordered"}
                                value={imageTexts.landing ?? ""}
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
                                placeholder="Click the button to join!"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between items-center text-xs text-gray-500 font-bold">
                                <span>Success Image Text</span>
                                {textsLengthError.success && (
                                  <span className="text-red-500 text-[11px] font-normal">
                                    Max 120 char.
                                  </span>
                                )}
                              </div>
                              <Input
                                type="text"
                                variant={"bordered"}
                                value={imageTexts.success ?? ""}
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
                                placeholder="Great, you're in!"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col flex-grow gap-3">
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between items-center text-xs text-gray-500 font-bold">
                                <span>Not Eligible Image Text</span>
                                {textsLengthError.notEligible && (
                                  <span className="text-red-500 text-[11px] font-normal">
                                    Max 120 char.
                                  </span>
                                )}
                              </div>
                              <Input
                                type="text"
                                variant={"bordered"}
                                value={imageTexts.notEligible ?? ""}
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
                                placeholder="You're not eligible."
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between items-center text-xs text-gray-500 font-bold">
                                <span>Closed Image Text</span>
                                {textsLengthError.closed && (
                                  <span className="text-red-500 text-[11px] font-normal">
                                    Max 120 char.
                                  </span>
                                )}
                              </div>
                              <Input
                                type="text"
                                variant={"bordered"}
                                value={imageTexts.closed ?? ""}
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
                                placeholder="The waitlist is closed."
                              />
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
                        Recommended 955x500px - max 1MB (.jpg, .png, .gif)
                      </div>
                      <div className="flex flex-row gap-1">
                        <div className="w-[50%]">
                          <FrameImage
                            selectedFile={selectedFileLanding!}
                            uploadedImage={uploadedLandingImage ?? ""}
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
                            uploadedImage={uploadedSuccessImage ?? ""}
                            onSelectedFile={onSelectedImageFile(
                              setUploadedSuccessImage,
                              setSelectedFileSuccess
                            )}
                            label="Success"
                            aspectRatio="1.91:1"
                          />
                        </div>
                      </div>
                      <div className="flex flex-row gap-1">
                        <div className="w-[50%]">
                          <FrameImage
                            selectedFile={selectedFileNotEligible!}
                            uploadedImage={uploadedNotEligibleImage ?? ""}
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
                            uploadedImage={uploadedClosedImage ?? ""}
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
                <div className="flex flex-col gap-2">
                  <div className="font-semibold text-lg">
                    Eligibility Requirements (optional)
                  </div>
                  <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col gap-1 w-[50%]">
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
                    <div className="flex flex-col gap-1 w-[50%]">
                      <div className="flex flex-row gap-1 items-center">
                        <div className="text-sm text-gray-500">
                          Follow users
                        </div>
                        <PremiumRequired />
                      </div>
                      <Input
                        type="text"
                        variant={"bordered"}
                        value={requiredUsersFollow}
                        onValueChange={setRequiredUsersFollow}
                        placeholder="dwr.eth,v,horsefacts"
                        isDisabled={waitlist.tier === "FREE"}
                      />
                      <div className="text-xs text-gray-500">
                        Comma separated list of usernames that the users must
                        follow to be eligible
                      </div>
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
                        defaultSelectedKeys={fanTokenType === "fid" ? "2" : "1"}
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
                        isDisabled={waitlist.tier === "FREE"}
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
                        isDisabled={waitlist.tier === "FREE"}
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
                        isDisabled={waitlist.tier === "FREE"}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      A channel or user fan token and the amount required to be
                      eligible to join the waitlist
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-col gap-1 w-[50%]">
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
                        isDisabled={waitlist.tier === "FREE"}
                      >
                        Proof of Humanity required
                      </Checkbox>
                      <div className="text-xs text-gray-500">
                        Eligibility requires a minimum Builder Score of 15,
                        demonstrating humanity
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-[50%]">
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
                        isDisabled={waitlist.tier === "FREE"}
                      >
                        Must be a fan token launcher
                      </Checkbox>

                      <div className="text-xs text-gray-500">
                        Users must have launched his own fan token to be
                        eligible
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="text-center justify-end flex flex-col">
              <>
                {error && (
                  <div className="flex flex-row justify-between">
                    <div></div>
                    <div className="text-xs flex flex-row bg-danger-500/10 text-danger-400 p-1 items-center rounded-md gap-1">
                      <Info size={12} className="text-danger-400" />
                      {error}
                    </div>
                  </div>
                )}

                <div className="flex flex-row justify-end items-end gap-2">
                  <Button
                    color="primary"
                    variant="light"
                    radius="sm"
                    onPress={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <BeearlyButton
                    onPress={updateWaitlist}
                    text="Save"
                    isLoading={loading}
                    isDisabled={isDisabled}
                  />
                </div>
              </>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
