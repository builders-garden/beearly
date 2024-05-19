import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  DatePicker,
  Image,
} from "@nextui-org/react";
import { CopyIcon, Frame, ImageIcon, Info, PlusSquare } from "lucide-react";
import { useState } from "react";
import slugify from "slugify";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { FrameImage } from "./FrameImage";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { BASE_FRAME_URL } from "../lib/constants";
import { BeearlyButton } from "./BeearlyButton";

export const CreateWaitlistModal = ({
  isOpen,
  onOpenChange,
  refetchWaitlists,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refetchWaitlists: () => void;
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [endDate, setEndDate] = useState(
    parseAbsoluteToLocal(
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
    )
  );
  const [externalUrl, setExternalUrl] = useState<string>("");
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
  const createWaitlist = async () => {
    setLoading(true);
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
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("endDate", endDate.toAbsoluteString());
    formData.append("externalUrl", externalUrl);
    formData.append("files[0]", selectedFileLanding);
    formData.append("files[1]", selectedFileSuccess);
    formData.append("files[2]", selectedFileNotEligible);
    formData.append("files[3]", selectedFileClosed);
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
        refetchWaitlists();
        setIsSuccess(true);
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

  const copyWaitlistFrameLink = () => {
    navigator.clipboard.writeText(
      `${BASE_FRAME_URL}/${slugify(name, { lower: true })}`
    );
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-3xl">
              {isSuccess ? "Waitlist created" : "Create waitlist"}
            </ModalHeader>
            <ModalBody>
              {!isSuccess ? (
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="font-semibold text-lg">Main details</div>
                    <div className="flex flex-row gap-4 w-full">
                      <div className="flex flex-col gap-1 w-[50%]">
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
                        <div className="text-sm text-gray-500">
                          Closing time
                        </div>
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
                    <div className="flex flex-col gap-1">
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
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-between">
                      <div className="font-semibold text-lg">Add images</div>
                      <div className="text-xs flex flex-row bg-blue-500/10 text-blue-400 p-1 items-center rounded-md gap-1">
                        <Info size={12} className="text-blue-400" />
                        Recommended 955x500 px
                      </div>
                    </div>
                    <div className="flex flex-row gap-2">
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
                    <div className="flex flex-row gap-2">
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
                          label="Closed / Error"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <div>
                    Copy the URL on Farcaster and start getting waitlist
                    registrations!
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <div className="w-[60%] p-2 rounded-lg border-2 border-gray-200 flex flex-row justify-between items-center">
                      <div className="text-gray-400">
                        {BASE_FRAME_URL}/
                        <span className="font-bold">{`${
                          name
                            ? slugify(name, {
                                lower: true,
                                replacement: "-",
                              })
                            : "<slug>"
                        }`}</span>
                      </div>
                      <CopyIcon
                        size={16}
                        className="text-primary cursor-pointer"
                        onClick={copyWaitlistFrameLink}
                      />
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="text-center justify-end flex flex-col">
              {!isSuccess ? (
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
                  <div className="flex flex-row justify-end items-end gap-4">
                    <Button
                      color="primary"
                      variant="light"
                      radius="sm"
                      onPress={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <BeearlyButton
                      onPress={createWaitlist}
                      isLoading={loading}
                      isDisabled={isDisabled}
                      text="Create"
                    />
                  </div>
                  <div className="text-xs text-right text-gray-500 flex flex-row justify-end">
                    *you can edit this at any time later
                  </div>
                </>
              ) : (
                <div></div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
