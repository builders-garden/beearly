import { Button, Link } from "@nextui-org/react";
import { ReactNode } from "react";

export const BeearlyButton = ({
  onPress,
  icon,
  iconPosition,
  text,
  isLoading,
  isDisabled,
  link,
}: {
  onPress?: () => void;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  text: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  link?: string;
}) => {
  if (!iconPosition) iconPosition = "left";
  return (
    <Button
      color="primary"
      className="w-fit text-black p-4"
      onPress={onPress}
      radius="sm"
      isLoading={isLoading}
      isDisabled={isDisabled}
    >
      <div className="flex flex-row gap-1 items-center">
        {iconPosition === "left" && icon}
        {link ? (
          <Link href={link} target="_blank">
            <div className="font-semibold text-black">{text}</div>
          </Link>
        ) : (
          <div className="font-semibold">{text}</div>
        )}
        {iconPosition === "right" && icon}
      </div>
    </Button>
  );
};
