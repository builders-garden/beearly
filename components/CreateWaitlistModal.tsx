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
import { Frame, ImageIcon, Info, PlusSquare } from "lucide-react";
import { useState } from "react";
import slugify from "slugify";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { FrameImage } from "./FrameImage";

export const CreateWaitlistModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
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
  const [error, setError] = useState<string>("");

  return (
    <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-3xl">
              Create waitlist
            </ModalHeader>
            <ModalBody>
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
                        https://waitlist.cool/w/
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
              <div className="text-red-500">{error}</div>
              <div className="flex flex-row justify-end items-end gap-4">
                <Button color="primary" variant="light" radius="sm">
                  Cancel
                </Button>
                <Button color="primary" radius="sm">
                  Create
                </Button>
              </div>
              <div className="text-xs text-right text-gray-500 flex flex-row justify-end">
                *you can edit it at any time later
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
