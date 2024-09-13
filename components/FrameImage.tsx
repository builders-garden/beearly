import { Image } from "@nextui-org/react";
import { ImageIcon, PlusSquare } from "lucide-react";
import toast from "react-hot-toast";

export const onSelectedImageFile =
  (setUploadedImage: (s: string) => void, setSelectedFile: (f: File) => void) =>
  (fileInputId: string) =>
  (event: any) => {
    const file = event.target.files[0];
    // Check if file is there
    if (!file) return;
    // Check if file size is greater than 1MB
    if (file && file.size > 1000000) {
      toast.error("File size is greater than 1MB", { position: "top-right" });
      (document.getElementById(fileInputId) as HTMLInputElement).value = "";
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setUploadedImage(reader.result?.toString() || "");
    });
    reader.readAsDataURL(event.target.files[0]);
    setSelectedFile(event?.target.files[0]);
  };

export const FrameImage = ({
  selectedFile,
  uploadedImage,
  onSelectedFile,
  label,
  aspectRatio,
}: {
  selectedFile: File;
  uploadedImage: string;
  onSelectedFile: (fileInputId: string) => (e: any) => void;
  label: string;
  aspectRatio: "1:1" | "1.91:1";
}) => {
  const fileInputId = `${label}-file-input`;
  return (
    <div
      className="m-2 bg-gray-100 w-full rounded-md flex flex-col items-center justify-center cursor-pointer"
      onClick={() => document.getElementById(fileInputId)!.click()}
    >
      {selectedFile || uploadedImage ? (
        <div className="m-2">
          <Image
            src={uploadedImage}
            className={`object-cover ${aspectRatio === "1.91:1" ? "w-[287px] h-[150px]" : "w-[150px] h-[150px]"} hover:opacity-35`}
            alt="success-image"
          />
        </div>
      ) : (
        <div
          className={`text-gray-400 bg-white my-2 ${aspectRatio === "1.91:1" ? "w-[287px] h-[150px]" : "w-[150px] h-[150px]"} rounded-md hover:border-primary hover:border-2 hover:border-dashed hover:text-primary `}
        >
          <div className="flex flex-col gap-1 justify-center items-center h-full my-auto">
            <PlusSquare size={24} />
            <div className="text-lg">Add image</div>
          </div>
        </div>
      )}
      <input
        type="file"
        id={fileInputId}
        className="hidden"
        onChange={onSelectedFile(fileInputId)}
      />
      <div className="flex flex-row gap-2 items-center justify-center pb-2">
        <ImageIcon size={16} className="text-gray-500" />
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
};
