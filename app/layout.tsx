import type { Metadata } from "next";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import Providers from "../components/Providers";
import { Navbar } from "../components/Navbar";

import { Raleway } from "next/font/google";
const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  // without a title, warpcast won't validate your frame
  title: "frames.js starter",
  description: "...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={raleway.className}>
      <body className="p-4">
        <Providers>
          <Navbar />
          <div className="p-16">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
