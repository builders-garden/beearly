import { Select, SelectItem } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

export const FramePreview = ({
  imageTexts,
  uploadedLogo,
  setPreviewType,
  previewType,
}: {
  imageTexts: {
    landing: string;
    success: string;
    notEligible: string;
    closed: string;
  };
  uploadedLogo: string;
  setPreviewType: (
    type: "landing" | "success" | "notEligible" | "closed"
  ) => void;
  previewType: "landing" | "success" | "notEligible" | "closed";
}) => {
  return (
    <div className="z-0 absolute m-2 bg-gray-100 rounded-md flex flex-col items-center justify-center">
      <div className="relative mt-2 mx-2">
        <Image
          src={
            previewType === "landing"
              ? "/default-frame-images/cover.png"
              : previewType === "success"
                ? "/default-frame-images/success.png"
                : previewType === "notEligible"
                  ? "/default-frame-images/not-eligible.png"
                  : "/default-frame-images/closed.png"
          }
          className="object-cover w-[287px] h-[150px] rounded-md"
          alt="success-image"
        />
        <div className="z-10 absolute flex items-center justify-center top-6 px-3 w-full h-[61px] text-black font-semibold text-sm text-center leading-[17px]">
          {imageTexts[previewType]}
        </div>
        <div className="z-10 absolute flex justify-center bottom-7 w-full">
          {uploadedLogo ? (
            <img
              className="rounded-sm"
              src={uploadedLogo}
              alt="uploaded-logo"
              width={32}
              height={32}
            />
          ) : null}
        </div>
      </div>
      <div className="w-full px-2">
        <Select
          size="sm"
          defaultSelectedKeys={[previewType]}
          onChange={(e) => setPreviewType(e.target.value as any)}
          className="w-full py-0.5 px-1 text-sm"
        >
          <SelectItem key="landing" value="landing">
            Landing
          </SelectItem>
          <SelectItem key="success" value="success">
            Success
          </SelectItem>
          <SelectItem key="notEligible" value="notEligible">
            Not Eligible
          </SelectItem>
          <SelectItem key="closed" value="closed">
            Closed
          </SelectItem>
        </Select>
      </div>
    </div>
  );
};
