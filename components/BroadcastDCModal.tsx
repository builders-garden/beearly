import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Checkbox,
} from "@nextui-org/react";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BeearlyButton } from "./BeearlyButton";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";

export default function BroadcastDCModal({
  isOpen,
  onOpenChange,
  waitlistId,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  waitlistId: number;
}) {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string | null>();
  const [isPowerBadgeOnly, setIsPowerBadgeOnly] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const jwt = getAuthToken();
  const canSend = text.length > 0;
  const sendMessage = async () => {
    // send message
    setIsLoading(true);
    const res = await fetch(`/api/waitlists/${waitlistId}/users/notify`, {
      method: "POST",
      body: JSON.stringify({
        fids: ["all"],
        powerBadge: isPowerBadgeOnly,
        message: text,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (res.ok) {
      setText("");
      onOpenChange(false);
    } else {
      console.error("Failed to send broadcast", res);
      const data = await res.json();
      setError(
        data.message ||
          "An error occurred while sending the broadcast.Please try again later."
      );
    }
    setIsLoading(false);
  };
  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-2xl">
              Send Direct Cast broadcast on Warpcast
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                <p className="text-lg">
                  Send a broadcast message on Warpcast to all your waitlisted
                  users.
                </p>
                <div className="flex flex-col gap-2 p-2 bg-primary/20 rounded-sm">
                  <div className="flex flex-row gap-2 items-center">
                    <InfoIcon size={20} className="text-primary" />
                    <p className="font-semibold text-primary">
                      Read carefully before sending
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <p className="undeline text-primary">
                      Direct Casts are sent by the official{" "}
                      <span className="font-bold underline">
                        <Link
                          href="https://warpcast.com/beearlybot"
                          target="_blank"
                        >
                          @beearlybot
                        </Link>
                      </span>{" "}
                      account.
                    </p>
                    <p className="undeline text-primary">
                      You can send a message{" "}
                      <span className="font-bold">every 12 hours</span>. Avoid{" "}
                      <span className="font-bold">spamming</span> or sending
                      irrelevant messages to your users.
                    </p>
                    <p className="undeline text-primary"></p>
                    <p className="undeline text-primary">
                      Intro yourself and your project,{" "}
                      <span className="font-bold">
                        mentioning your Farcaster handle/username
                      </span>{" "}
                      in the beginning.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Textarea
                    variant="flat"
                    label="Message"
                    labelPlacement="outside"
                    placeholder="Hey all, here @limone.eth from Beearly. Excited to announce our new feature..."
                    value={text}
                    onValueChange={setText}
                    className="mt-4"
                    radius="sm"
                  />
                </div>
                <Checkbox
                  isSelected={isPowerBadgeOnly}
                  onValueChange={setIsPowerBadgeOnly}
                >
                  Send only to Power Badge users (recommended)
                </Checkbox>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col justify-end text-right gap-2">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex flex-row gap-2 items-center justify-end">
                  <Button color="primary" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <BeearlyButton
                    onPress={sendMessage}
                    text="Send broadcast"
                    isDisabled={!canSend}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
