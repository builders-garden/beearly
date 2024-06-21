import { Button, Link, Tooltip } from "@nextui-org/react";
import { ReactNode } from "react";

export const BeearlyButton = ({
  onPress,
  icon,
  iconPosition,
  showTooltip,
  tooltipText,
  tooltipPlacement,
  text,
  isLoading,
  isDisabled,
  link,
  linkTarget,
}: {
  onPress?: () => void;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  showTooltip?: boolean;
  tooltipText?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  text: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  link?: string;
  linkTarget?: "_blank" | "_self" | "_parent" | "_top";
}) => {
  if (!iconPosition) iconPosition = "left";
  if (!tooltipPlacement) tooltipPlacement = "top";
  return (
    <Tooltip
      isDisabled={!showTooltip}
      showArrow={true}
      placement={tooltipPlacement}
      content={tooltipText}
    >
      {/* This div is needed to make the Tooltip work on disabled buttons */}
      <div>
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
              <Link href={link} target={linkTarget}>
                <div className="font-semibold text-black">{text}</div>
              </Link>
            ) : (
              <div className="font-semibold">{text}</div>
            )}
            {iconPosition === "right" && icon}
          </div>
        </Button>
      </div>
    </Tooltip>
  );
};
