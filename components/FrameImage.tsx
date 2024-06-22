import { Image } from "@nextui-org/react";
import { ImageIcon, PlusSquare } from "lucide-react";

export const onSelectedImageFile =
  (setUploadedImage: (s: string) => void, setSelectedFile: (f: any) => void) =>
  (event: any) => {
    if (!event?.target?.files[0]) return;
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
}: {
  selectedFile: File;
  uploadedImage: string;
  onSelectedFile: (e: any) => void;
  label: string;
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
            className="object-cover w-[287px] h-[150px] hover:opacity-35"
            alt="success-image"
          />
        </div>
      ) : (
        <div className="text-gray-400 w-[287px] bg-white my-2 h-[150px] rounded-md hover:border-primary hover:border-2 hover:border-dashed hover:text-primary ">
          <div className="flex flex-col gap-1 justify-center items-center h-full my-auto  hover:text-primary">
            <PlusSquare size={24} />
            <div className="text-lg">Add image</div>
          </div>
        </div>
      )}
      <input
        type="file"
        id={fileInputId}
        className="hidden"
        onChange={onSelectedFile}
      />
      <div className="flex flex-row gap-2 items-center justify-center pb-2">
        <ImageIcon size={16} className="text-gray-500" />
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
};
