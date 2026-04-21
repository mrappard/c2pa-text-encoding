import "~/styles/globals.css";

import { type Metadata } from "next";


import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Hidden Text C2PA",
  description: "An example project using C2PA to encode text.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
