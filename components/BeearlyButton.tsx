import { Button } from "@nextui-org/react";
import { ReactNode } from "react";

export const BeearlyButton = ({
  onPress,
  icon,
  text,
}: {
  onPress: () => void;
  icon?: ReactNode;
  text: string;
}) => {
  return (
    <Button
      color="primary"
      className="w-fit text-black p-4"
      onPress={onPress}
      radius="sm"
    >
      <div className="flex flex-row gap-1 items-center">
        {icon}
        <div className="font-semibold">{text}</div>
      </div>
    </Button>
  );
};
