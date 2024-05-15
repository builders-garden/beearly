import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Navbar } from "../components/Navbar";
import Providers from "../components/Providers";

import { Raleway } from "next/font/google";
const raleway = Raleway({ subsets: ["latin"] });

import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import { FRAMES_BASE_PATH, vercelURL } from "./utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Waitlist frame",
    description: "Your product's waitlist on Farcaster",
    other: {
      ...(await fetchMetadata(new URL(FRAMES_BASE_PATH, vercelURL()))),
    },
  };
}

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
