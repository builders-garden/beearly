import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Button, Image } from "@nextui-org/react";

type Feature = {
  name: string;
  available: boolean;
};

interface TierCardProps {
  tierLogo: string;
  tierName: string;
  description: string;
  price: string;
  features: Feature[];
  requirementsOptions: Feature[];
  spamProtectionOptions: Feature[];
  actionLink: string;
  isTopTier?: boolean;
}

const TierCard: React.FC<TierCardProps> = ({
  tierLogo,
  tierName,
  description,
  price,
  features,
  actionLink,
  requirementsOptions,
  spamProtectionOptions,
  isTopTier,
}) => {
  if (isTopTier) {
    return (
      <div className="w-full sm:w-1/3 rounded-sm p-[4px] bg-gradient-to-r from-[#B80000] to-[#FF930F]">
        <div className="bg-white rounded-sm p-4">
          <div className="flex flex-col gap-4 px-12">
            <div className="flex flex-col gap-1 items-center text-center">
              <Image src={tierLogo} alt="tier-logo" className="h-8 w-8" />
              <div className="text-xl font-bold">{tierName}</div>
              <div>{description}</div>
            </div>
            <div className="text-3xl font-bold text-center">{price}</div>
            <div className="flex flex-col gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-row gap-2 items-center">
                  {feature.available ? (
                    <CheckIcon size={20} className="text-green-500" />
                  ) : (
                    <XIcon size={20} className="text-red-500" />
                  )}
                  <p className={feature.available ? "" : "text-gray-300"}>
                    {feature.name}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Eligibility requirements</div>
              <div className="flex flex-col gap-1 ml-4">
                {requirementsOptions.map((feature, index) => (
                  <div key={index} className="flex flex-row gap-2">
                    {feature.available ? (
                      <CheckIcon size={20} className="text-green-500" />
                    ) : (
                      <XIcon size={20} className="text-red-500" />
                    )}
                    <p className={feature.available ? "" : "text-gray-300"}>
                      {feature.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Spam protection</div>
              <div className="flex flex-col gap-1 ml-4">
                {spamProtectionOptions.map((feature, index) => (
                  <div key={index} className="flex flex-row gap-2">
                    {feature.available ? (
                      <CheckIcon size={20} className="text-green-500" />
                    ) : (
                      <XIcon size={20} className="text-red-500" />
                    )}
                    <p className={feature.available ? "" : "text-gray-300"}>
                      {feature.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Link href={actionLink} target="_blank">
                <Button
                  radius="sm"
                  variant="solid"
                  className="text-white font-semibold bg-gradient-to-r from-[#B80000] to-[#FF930F]"
                >
                  Start now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full sm:w-1/3 rounded-sm p-4 border-2 border-gray-200">
      <div className="flex flex-col gap-4 px-12">
        <div className="flex flex-col gap-1 items-center text-center">
          <Image src={tierLogo} alt="tier-logo" className="h-8 w-8" />
          <div className="text-xl font-bold">{tierName}</div>
          <div>{description}</div>
        </div>
        <div className="text-3xl font-bold text-center">{price}</div>
        <div className="flex flex-col gap-2">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-row gap-2 items-center">
              {feature.available ? (
                <CheckIcon size={20} className="text-green-500" />
              ) : (
                <XIcon size={20} className="text-red-500" />
              )}
              <p className={feature.available ? "" : "text-gray-300"}>
                {feature.name}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Eligibility requirements</div>
          <div className="flex flex-col gap-1 ml-4">
            {requirementsOptions.map((feature, index) => (
              <div key={index} className="flex flex-row gap-2">
                {feature.available ? (
                  <CheckIcon size={20} className="text-green-500" />
                ) : (
                  <XIcon size={20} className="text-red-500" />
                )}
                <p className={feature.available ? "" : "text-gray-300"}>
                  {feature.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Spam protection</div>
          <div className="flex flex-col gap-1 ml-4">
            {spamProtectionOptions.map((feature, index) => (
              <div key={index} className="flex flex-row gap-2">
                {feature.available ? (
                  <CheckIcon size={20} className="text-green-500" />
                ) : (
                  <XIcon size={20} className="text-red-500" />
                )}
                <p className={feature.available ? "" : "text-gray-300"}>
                  {feature.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Link href={actionLink} target="_blank">
            <Button color="primary" variant="ghost" radius="sm">
              Start now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TierCard;
