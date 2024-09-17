"use client";
import { DynamicWidget, getAuthToken } from "@dynamic-labs/sdk-react-core";
import { Button, Image, Spinner } from "@nextui-org/react";
import { Waitlist } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { UsersTable } from "../../../components/UsersTable";
import { BASE_FRAME_URL, BASE_URL, TIERS } from "../../../lib/constants";
import {
  CheckCircleIcon,
  Clipboard,
  Edit,
  ExternalLink,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const WaitlistPage = ({ params: { id } }: { params: { id: string } }) => {
  const router = useRouter();
  const [waitlist, setWaitlist] = useState<Waitlist | null>();
  const [isWaitlistLoading, setWaitlistLoading] = useState(true);
  const [isFrameUrlCopied, setIsFrameUrlCopied] = useState(false);
  const { isConnected } = useAccount();
  const jwt = getAuthToken();
  const fetchWaitlist = useCallback(() => {
    setWaitlistLoading(true);
    fetch(`/api/waitlists/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Waitlist not found") {
          setWaitlist(null);
        } else {
          setWaitlist(data);
        }
      })
      .finally(() => {
        setWaitlistLoading(false);
      });
  }, [id, jwt]);

  useEffect(() => {
    if (jwt && isConnected) {
      fetchWaitlist();
    }
  }, [jwt, isConnected, fetchWaitlist]);

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-3xl font-bold">Waitlist</div>
        <div className="flex flex-col p-24 items-center justify-center gap-4">
          <DynamicWidget />
        </div>
      </div>
    );
  }

  const copyWaitlistFrameLink = () => {
    navigator.clipboard.writeText(`${BASE_FRAME_URL}/${waitlist?.slug}`);
    setIsFrameUrlCopied(true);
    setTimeout(() => {
      setIsFrameUrlCopied(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-3xl font-bold">Waitlist Detail</div>
      {isWaitlistLoading && <Spinner color="primary" />}
      {!waitlist && !isWaitlistLoading && <div>Waitlist not found</div>}
      {waitlist && !isWaitlistLoading && (
        <div className="flex flex-col gap-8">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2 items-center">
              <div className="text-2xl font-medium">{waitlist?.name}</div>
              <Link
                href={`https://warpcast.com/~/developers/frames?url=https%3A%2F%2Fbeearly.club/w/${waitlist.slug}`}
                target="_blank"
              >
                <Button
                  size="sm"
                  color="primary"
                  className="text-primary"
                  variant="flat"
                  onPress={() => {}}
                >
                  <ExternalLink size={16} />
                  Test Frame
                </Button>
              </Link>
            </div>
            <Button
              variant="light"
              className="text-gray-500"
              onPress={() => router.push(`/waitlists/${waitlist.id}/edit`)}
            >
              <Edit />
              Edit
            </Button>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col gap-1">
              <Link href={"/pricing"} target="_blank">
                <div className="flex flex-row gap-1 items-center cursor-point">
                  <div className="text-xs font-medium">Tier</div>
                  <ExternalLinkIcon size={12} />
                </div>
              </Link>

              <div className="flex flex-row gap-1 items-center rounded-sm p-1 w-fit bg-gray-50 ">
                <p>{waitlist.tier}</p>
                <Image
                  src={TIERS[waitlist.tier].image}
                  alt="tier-logo"
                  className="h-5 w-5"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium">Frame URL</div>
              <div className="flex flex-row gap-2 rounded-sm p-1 w-fit bg-gray-50 items-center">
                <div className="text-gray-400">{`${BASE_FRAME_URL}/${waitlist.slug}`}</div>
                {!isFrameUrlCopied ? (
                  <Clipboard
                    size={16}
                    className="text-gray-400 cursor-pointer"
                    onClick={() => {
                      copyWaitlistFrameLink();
                    }}
                  />
                ) : (
                  <CheckCircleIcon className="text-success-400" size={16} />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium">
                Referrals Leaderboard URL
              </div>
              <Link
                href={`${BASE_URL}/leaderboards/${waitlist.slug}`}
                target="_blank"
              >
                <div className="flex flex-row gap-2 rounded-sm p-1 w-fit bg-gray-50 items-center">
                  <div className="text-gray-400">{`${BASE_URL}/leaderboards/${waitlist.slug}`}</div>
                  <ExternalLink
                    size={16}
                    className="text-gray-400 cursor-pointer"
                  />
                </div>
              </Link>
            </div>
          </div>
          {waitlist && !isWaitlistLoading && (
            <UsersTable waitlistId={waitlist.id} waitlistTier={waitlist.tier} />
          )}
        </div>
      )}
    </div>
  );
};

export default WaitlistPage;
