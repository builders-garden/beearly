import { Button } from "@nextui-org/react";
import { PlusCircle } from "lucide-react";
import WaitlistList from "../../components/WaitlistList";
import { Waitlist } from "../../components/WaitlistItem";

const waitlists: Waitlist[] = [
  {
    id: "1",
    name: "Waitlist 1",
    slug: "waitlist-1",
    images: [
      "https://placehold.co/512x512/EEE/31343C",
      "https://placehold.co/512x512/EEE/31343C",
    ],
    externalUrl: "https://google.it/",
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2022-01-02T00:00:00Z",
  },
  {
    id: "2",
    name: "Waitlist 2",
    slug: "waitlist-2",
    images: [
      "https://placehold.co/512x512/EEE/1445C8",
      "https://placehold.co/512x512/EEE/1445C8",
    ],
    externalUrl: "https://stringz.xyz",
    createdAt: "2022-01-03T00:00:00Z",
    updatedAt: "2022-01-04T00:00:00Z",
  },
];

const Waitlists = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-4 items-center">
        <div className="text-6xl font-bold">Your waitlists</div>
        <Button size="lg" color="primary" className="font-semibold text-xl">
          <PlusCircle />
          Create a new waitlist
        </Button>
      </div>
      <WaitlistList waitlists={waitlists} />
    </div>
  );
};

export default Waitlists;
