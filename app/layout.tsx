import "./globals.css";

import { Navbar } from "../components/Navbar";
import Providers from "../components/Providers";

import { DM_Sans } from "next/font/google";
const dmSans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.className}>
      <body className="p-4">
        <Providers>
          <Navbar />
          <div className="px-8 py-4">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
