import { Link } from "@nextui-org/react";

export default function NavbarLink({
  isActive,
  text,
  link,
}: {
  isActive: boolean;
  text: string;
  link: string;
}) {
  return (
    <Link href={link} className="text-black">
      <div className="flex flex-col gap-2">
        <div
          className={`text-lg ${isActive ? "font-semibold border-b-2 border-primary" : "font-medium border-b-2 border-transparent"}`}
        >
          {text}
        </div>
      </div>
    </Link>
  );
}
