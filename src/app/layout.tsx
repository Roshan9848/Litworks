import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "LITWORKS | Turning Moments & Brands Into Instant Impact",
  description: "We create cinematic Instant Reels (Wedding, Birthday, Car Delivery, Event, Business), manage social media, run Meta Ads/performance marketing campaigns, edit videos, design posters, and help businesses grow online in Telangana & Andhra Pradesh.",
  metadataBase: new URL("https://litworks.agency"),
  keywords: [
    "LITWORKS", "Instant Reels", "Wedding Reels", "Birthday Reels", 
    "Car Delivery Reels", "Social Media Handling", "Instagram Management",
    "Performance Marketing", "Meta Ads Hyderabad", "Video Editing", 
    "Poster Designing", "YouTube Thumbnails", "Creative Agency Telangana",
    "Creative Agency Andhra Pradesh", "Hyderabad", "Vijayawada", "Vizag"
  ],
  authors: [{ name: "LITWORKS" }],
  openGraph: {
    title: "LITWORKS | Turning Moments & Brands Into Instant Impact",
    description: "We create cinematic Instant Reels, manage social media, run performance marketing, edit videos, and design graphics for brands and individuals.",
    url: "https://litworks.agency",
    siteName: "LITWORKS",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "LITWORKS Logo",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" }
    ],
    apple: [
      { url: "/favicon.png" }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === "true";

  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="bg-black text-white antialiased selection:bg-brand-orange selection:text-black min-h-screen">
        {isMaintenance ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black z-50 p-4">
            <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
              <img
                src="/stay-tuned.png"
                alt="LITWORKS - Stay Tuned"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        ) : (
          <>
            {children}
            <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="beforeInteractive" />
          </>
        )}
      </body>
    </html>
  );
}
