import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/db/queries";
import { UserProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Flow Arena - ვიდეო ჟურნალი",
  description: "Flow Arena - ვიდეო ჟურნალი",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userPromise = getUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen bg-background"
        )}
      >
        <UserProvider userPromise={userPromise}>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
