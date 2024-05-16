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
import {
  AlertCircle,
  CopyIcon,
  Frame,
  ImageIcon,
  Info,
  MessageCircleWarning,
  PlusSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { FrameImage } from "./FrameImage";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { BASE_FRAME_URL } from "../lib/constants";
import { Waitlist } from "@prisma/client";
import { BeearlyButton } from "./BeearlyButton";

export const EditWaitlistModal = ({
  waitlist,
  setSelectedWaitlist,
  refetchWaitlists,
  isOpen,
  onOpenChange,
}: {
  waitlist: Waitlist;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setSelectedWaitlist: (waitlist: Waitlist) => void;
  refetchWaitlists: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(waitlist.name);
  const [endDate, setEndDate] = useState(
    parseAbsoluteToLocal(new Date(waitlist.endDate).toISOString())
  );
  const [externalUrl, setExternalUrl] = useState<string>(waitlist.externalUrl);
  const [selectedFileLanding, setSelectedFileLanding] = useState<File | null>(
    null
  );

  const [uploadedLandingImage, setUploadedLandingImage] = useState<string>(
    waitlist.imageLanding
  );
  const [selectedFileSuccess, setSelectedFileSuccess] = useState<File | null>(
    null
  );
  const [uploadedSuccessImage, setUploadedSuccessImage] = useState<string>(
    waitlist.imageSuccess
  );
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
    (!selectedFileLanding && !uploadedLandingImage) ||
    (!selectedFileSuccess && !uploadedSuccessImage);

  const [error, setError] = useState<string>();
  const updateWaitlist = async () => {
    setLoading(true);
    if (
      !name ||
      !endDate ||
      !externalUrl ||
      (!selectedFileLanding && !uploadedLandingImage) ||
      (!selectedFileSuccess && !uploadedSuccessImage)
    ) {
      setError("Please fill all the fields");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("endDate", endDate.toAbsoluteString());
    formData.append("externalUrl", externalUrl);
    if (selectedFileLanding) formData.append("files[0]", selectedFileLanding);
    if (selectedFileSuccess) formData.append("files[1]", selectedFileSuccess);
    const res = await fetch(`/api/waitlists/${waitlist.id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setSelectedWaitlist(data);
      refetchWaitlists();
      onOpenChange(false);
    } else {
      const data = await res.json();
      setError(data.message);
    }
    setLoading(false);
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-3xl">
              Edit waitlist
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <div className="font-semibold text-lg">Main details</div>
                  <div className="flex flex-row gap-4 w-full">
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
