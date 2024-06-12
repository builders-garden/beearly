import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Autocomplete,
  AutocompleteItem,
  Avatar,
} from "@nextui-org/react";
import { Info, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BeearlyButton } from "./BeearlyButton";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import _ from "lodash";
import { Image } from "@nextui-org/react";

export const AddWaitlistedUsersModal = ({
  waitlistId,
  isOpen,
  onOpenChange,
  refetchUsers,
}: {
  waitlistId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refetchUsers: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [text, setText] = useState<string>("");
  const jwt = getAuthToken();

  const [error, setError] = useState<string>();

  const addUsers = async () => {
    setLoading(true);
    setError(undefined);

    try {
      // Add users to waitlist
      const res = await fetch(`/api/waitlists/${waitlistId}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fids: selectedUsers.map((u) => u.userId),
        }),
      });
      onOpenChange(false);
      refetchUsers();
    } catch (e) {
      setError("Failed to add users to waitlist");
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = useCallback(
    _.debounce(async (text: string) => {
      setUsersLoading(true);
      // Search users
      const res = await fetch(`/api/farcaster/users?q=${text}&limit=5`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await res.json();
      setUsers(data);
      setUsersLoading(false);
    }, 500), // 500ms debounce time
    [jwt]
  );

  useEffect(() => {
    if (text.length > 0) {
      searchUsers(text);
    }
  }, [searchUsers, text]);

  const addUser = (user: any) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const removeUser = (user: any) => {
    setSelectedUsers(selectedUsers.filter((u) => u.userId !== user.userId));
  };

  const isDisabled = selectedUsers.length === 0;

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-3xl">
              Add users to waitlist
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Autocomplete
                  classNames={{
                    listboxWrapper: "max-h-[320px]",
                    selectorButton: "text-default-500",
                  }}
                  isLoading={usersLoading}
                  defaultItems={users || []}
                  inputProps={{
                    classNames: {
                      input: "ml-1",
                      inputWrapper: "h-[48px]",
                    },
                  }}
                  onInputChange={(value) => setText(value)}
                  value={text}
                  listboxProps={{
                    hideSelectedIcon: true,
                    itemClasses: {
                      base: [
                        "rounded-small",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[hover=true]:bg-default-200",
                        "data-[selectable=true]:focus:bg-default-100",
                        "data-[focus-visible=true]:ring-default-500",
                      ],
                    },
                  }}
                  aria-label="Select a user to add to the waitlist"
                  placeholder="Search on Farcaster"
                  popoverProps={{
                    offset: 10,
                    classNames: {
                      base: "rounded-small",
                      content:
                        "p-1 border-small border-default-100 bg-background",
                    },
                  }}
                  startContent={
                    <SearchIcon
                      className="text-default-400"
                      strokeWidth={2.5}
                      size={20}
                    />
                  }
                  radius="sm"
                  variant="bordered"
                >
                  {(item) => (
                    <AutocompleteItem
                      key={item.userId!}
                      textValue={item.profileDisplayName!}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <Avatar
                            alt={item.profileName!}
                            className="flex-shrink-0"
                            size="sm"
                            src={item.profileImage!}
                          />
                          <div className="flex flex-col">
                            <div className="flex flex-row gap-1 items-center">
                              <span className="text-small">
                                {item.profileDisplayName}
                              </span>
                              {item.isFarcasterPowerUser ? (
                                <Image
                                  src="/power-badge.png"
                                  className="h-3 w-3"
                                  radius="full"
                                  alt="power-badge"
                                />
                              ) : (
                                ""
                              )}
                            </div>
                            <span className="text-tiny text-default-400">
                              @{item.profileName} • #{item.userId}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="border-small font-medium"
                          radius="sm"
                          size="sm"
                          color="primary"
                          variant="bordered"
                          onPress={() => addUser(item)}
                        >
                          Add
                        </Button>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <div className="flex flex-col gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex flex-row justify-between items-center gap-2 p-2 rounded-sm"
                    >
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={user.profileName}
                          className="flex-shrink-0"
                          size="sm"
                          src={user.profileImage}
                        />
                        <div className="flex flex-col">
                          <div className="flex flex-row gap-1 items-center">
                            <span className="text-small">
                              {user.profileDisplayName}
                            </span>
                            {user.isFarcasterPowerUser ? (
                              <Image
                                src="/power-badge.png"
                                className="h-3 w-3"
                                radius="full"
                                alt="power-badge"
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <span className="text-tiny text-default-400">
                            @{user.profileName} • #{user.userId}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="border-small font-medium"
                        radius="sm"
                        size="sm"
                        color="primary"
                        variant="bordered"
                        onPress={() => removeUser(user)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="text-center justify-end flex flex-col">
              <>
                {error && (
                  <div className="flex flex-row justify-between">
                    <div></div>
                    <div className="text-xs flex flex-row bg-danger-500/10 text-danger-400 p-1 items-center rounded-sm gap-1">
                      <Info size={12} className="text-danger-400" />
                      {error}
                    </div>
                  </div>
                )}

                <div className="flex flex-row justify-end items-end gap-2">
                  <Button
                    color="primary"
                    variant="light"
                    radius="sm"
                    onPress={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <BeearlyButton
                    onPress={addUsers}
                    text="Add users"
                    isLoading={loading}
                    isDisabled={isDisabled}
                  />
                </div>
              </>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
