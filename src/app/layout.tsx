import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/db/queries";
import { UserProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Noto_Sans } from "next/font/google";

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

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  weight: ["400", "700"],
  display: "auto",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Flow Arena - ვიდეო ჟურნალი",
  description: "Flow Arena - ვიდეო ჟურნალი",
  openGraph: {
    title: "Flow Arena - ვიდეო ჟურნალი",
    description: "Flow Arena - ვიდეო ჟურნალი",
    url: "https://flowarena.vercel.app/",
    siteName: "Flow Arena",
    images: [
      {
        url: "https://utfs.io/f/VceiTwSJdQ3PrLtUGtZimIZ9LUWO7wM4jQqs0Cl2zDfuEbTS",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flow Arena - ვიდეო ჟურნალი",
    description: "Flow Arena - ვიდეო ჟურნალი",
    images: [
      "https://utfs.io/f/VceiTwSJdQ3PrLtUGtZimIZ9LUWO7wM4jQqs0Cl2zDfuEbTS",
    ],
  },
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
          notoSans.className,
          "antialiased min-h-screen bg-background scroll-smooth"
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
