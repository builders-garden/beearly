import { Button, Link } from "@nextui-org/react";
import { ReactNode } from "react";

export const BeearlyButton = ({
  onPress,
  icon,
  text,
  isLoading,
  isDisabled,
  link,
}: {
  onPress: () => void;
  icon?: ReactNode;
  text: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  link?: string;
}) => {
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
        {icon}
        {link ? (
          <Link href={link}>
            <div className="font-semibold text-black">{text}</div>
          </Link>
        ) : (
          <div className="font-semibold">{text}</div>
        )}
      </div>
    </Button>
  );
};
