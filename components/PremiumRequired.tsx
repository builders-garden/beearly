import { Image, Tooltip } from "@nextui-org/react";

export default function PremiumRequired() {
  return (
    <Tooltip content="This feature is only available with Honey Bee or Queen Bee tier.">
      <div className="flex flex-row justify-start">
        <Image src={"/honey.svg"} className="w-4 h-4" alt={"honey"} />
        <Image src={"/queen.svg"} className="w-4 h-4" alt={"queen"} />
      </div>
    </Tooltip>
  );
}
