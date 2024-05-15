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
  const isDisabled =
    !name ||
    !endDate ||
    !externalUrl ||
    !selectedFileLanding ||
    !selectedFileSuccess;

  const [error, setError] = useState<string>("");
  const createWaitlist = async () => {
    setLoading(true);
    if (
      !name ||
      !endDate ||
      !externalUrl ||
      !selectedFileLanding ||
      !selectedFileSuccess
    ) {
      setError("Please fill all the fields");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("endDate", endDate.toAbsoluteString());
    formData.append("externalUrl", externalUrl);
    formData.append("files[0]", selectedFileLanding);
    formData.append("files[1]", selectedFileSuccess);
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
      setError("Error creating waitlist");
    }
    setLoading(false);
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
                    <div className="text-sm text-gray-300">or</div>
                    <Button color="primary" radius="sm" className="w-[33%]">
                      Visit Waitlist Page
                    </Button>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="text-center justify-end flex flex-col">
              {!isSuccess ? (
                <>
                  <div className="text-red-500">{error}</div>
                  <div className="flex flex-row justify-end items-end gap-4">
                    <Button color="primary" variant="light" radius="sm">
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      radius="sm"
                      onPress={createWaitlist}
                      isLoading={loading}
                      isDisabled={isDisabled}
                    >
                      Create
                    </Button>
                  </div>
                  <div className="text-xs text-right text-gray-500 flex flex-row justify-end">
                    *you can edit it at any time later
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
