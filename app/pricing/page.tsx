import { Button, Image, Link } from "@nextui-org/react";
import { CheckIcon, DeleteIcon, XIcon } from "lucide-react";
import { BeearlyButton } from "../../components/BeearlyButton";

// a page with 3 cards showing the pricing and features included in each tier
export default function Pricing() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col gap-2">
        <div className="text-4xl font-bold">Beearly Pricing</div>
        <div>*pricing is intended per waitlist</div>
      </div>
      <BeearlyButton link={"/waitlists/new"} text="Start now" />
      <div className="w-full flex flex-row gap-4 justify-center items-center p-24">
        <div className="w-[30%] rounded-sm p-4 border-2 border-gray-200">
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col gap-1 items-center text-center">
              <Image src="/bumble.svg" alt="tier-logo" className="h-8 w-8" />
              <div className="text-xl font-bold">Bumble Bee</div>
              <div>Just to get you started.</div>
            </div>
            <div className="text-3xl font-bold">FREE</div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center">
                <CheckIcon size={20} className="text-green-500" />
                <p>
                  Waitlist Size: <span className="font-semibold">100</span>
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  Waitlist requirements options
                </div>
                <div className="flex flex-col gap-1 ml-4">
                  <div className="flex flex-row gap-2 items-center text-sm">
                    <CheckIcon size={16} className="text-green-500" />
                    <p>Channel follow</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center text-sm">
                    <XIcon size={16} className="text-red-500" />
                    <p className="text-gray-300">User follow</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center text-sm">
                    <XIcon size={16} className="text-red-500" />
                    <p className="text-gray-300">Power Badge</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <CheckIcon size={20} className="text-green-500" />
                <p>
                  Broadcast Direct Casts:{" "}
                  <span className="font-semibold">1 every 24 hours</span>
                </p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <XIcon size={20} className="text-red-500" />
                <p className="text-gray-300">Export users</p>
              </div>
            </div>
            <Link href={"/waitlists/new"} target="_blank">
              <Button color="primary" variant="ghost">
                Start now
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-[30%] rounded-sm p-4 border-2 border-gray-200">
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col gap-1 items-center text-center">
              <Image src="/honey.svg" alt="tier-logo" className="h-8 w-8" />
              <div className="text-xl font-bold">Honey Bee</div>
              <div>More features and bigger audience.</div>
            </div>
            <div className="text-3xl font-bold">25$</div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center">
                <CheckIcon size={20} className="text-green-500" />
                <p>
                  Waitlist Size: <span className="font-semibold">500</span>
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  Waitlist requirements options
                </div>
                <div className="flex flex-col gap-1 ml-4">
                  <div className="flex flex-row gap-2 items-center text-sm">
                    <CheckIcon size={16} className="text-green-500" />
                    <p>Channel follow</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center text-sm">
                    <CheckIcon size={16} className="text-green-500" />
                    <p>User follow</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center text-sm">
                    <CheckIcon size={16} className="text-green-500" />
                    <p>Power Badge</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <CheckIcon size={20} className="text-green-500" />
                <p>
                  Broadcast Direct Casts:{" "}
                  <span className="font-semibold">1 every 12 hours</span>
                </p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <CheckIcon size={20} className="text-green-500" />
                <p>Export users</p>
              </div>
            </div>
            <Link href={"/waitlists/new"} target="_blank">
              <Button color="primary" variant="ghost">
                Start now
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-[30%] rounded-sm p-[4px] bg-gradient-to-r from-[#B80000] to-[#FF930F]">
          <div className="bg-white rounded-sm p-4">
            <div className="flex flex-col gap-4 items-center">
              <div className="flex flex-col gap-1 items-center text-center">
                <Image src="/queen.svg" alt="tier-logo" className="h-8 w-8" />
                <div className="text-xl font-bold">Queen Bee</div>
                <div>
                  Fully fledged waitlist with all the features you need.
                </div>
              </div>
              <div className="text-3xl font-bold">30$</div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <CheckIcon size={20} className="text-green-500" />
                  <p>
                    Waitlist Size:{" "}
                    <span className="font-semibold">Unlimited ∞</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="font-semibold">
                    Waitlist requirements options
                  </div>
                  <div className="flex flex-col gap-1 ml-4">
                    <div className="flex flex-row gap-2 items-center text-sm">
                      <CheckIcon size={16} className="text-green-500" />
                      <p>Channel follow</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center text-sm">
                      <CheckIcon size={16} className="text-green-500" />
                      <p>User follow</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center text-sm">
                      <CheckIcon size={16} className="text-green-500" />
                      <p>Power Badge</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <CheckIcon size={20} className="text-green-500" />
                  <p>
                    Broadcast Direct Casts:{" "}
                    <span className="font-semibold">1 every 10 minutes</span>
                  </p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <CheckIcon size={20} className="text-green-500" />
                  <p>Export users</p>
                </div>
              </div>
              <Link href={"/waitlists/new"} target="_blank">
                <Button
                  className="text-white font-semibold bg-gradient-to-r from-[#B80000] to-[#FF930F]"
                  variant="solid"
                >
                  Start now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
