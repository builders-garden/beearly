import "./globals.css";

import { Navbar } from "../components/Navbar";
import Providers from "../components/Providers";

import { Toaster } from "react-hot-toast";

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
          <Toaster
            toastOptions={{
              style: {
                border: "1px solid #000",
                fontSize: "1.30rem",
                padding: "1.2rem",
                paddingLeft: "1rem",
                gap: "5px",
              },
            }}
            containerStyle={{
              right: 30,
              top: 15,
            }}
            gutter={15}
          />
          <div className="px-8 py-4">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
