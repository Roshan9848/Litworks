import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import GlassyDock from "@/components/GlassyDock";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

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

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "LITWORKS",
    "image": "https://litworks.agency/logo.png",
    "@id": "https://litworks.agency/#localbusiness",
    "url": "https://litworks.agency",
    "telephone": "+919110797354",
    "email": "litworks.media@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Madhapur",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500081",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.4483,
      "longitude": 78.3915
    },
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Telangana"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Andhra Pradesh"
      }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.instagram.com/litworks.media/"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an Instant Reel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An Instant Reel is short-form video content shot, compiled, and edited on-site during your event (weddings, birthdays, car deliveries, or business launches). Our team works live to deliver cinematic, post-ready reels within hours, allowing you to publish and share the moments while the buzz is still active."
        }
      },
      {
        "@type": "Question",
        "name": "Which cities do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We currently serve key cities in Telangana (Hyderabad, Karimnagar, Nizamabad, Armoor) and Andhra Pradesh (Vijayawada, Visakhapatnam/Vizag). If you are looking for services in these regions, we deploy our teams directly to your location."
        }
      },
      {
        "@type": "Question",
        "name": "Do you handle Instagram pages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we handle complete social media page management for Instagram and Facebook. This includes custom content planning, post grid layout designs, graphic asset creation, copy writing, and systematic posting to grow organic engagement."
        }
      },
      {
        "@type": "Question",
        "name": "Do you run Meta Ads?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We run highly targeted performance marketing campaigns across Meta (Facebook & Instagram Ads). We specialize in lead generation, sales conversion, website traffic growth, and localized brand awareness campaigns customized to your monthly budget."
        }
      },
      {
        "@type": "Question",
        "name": "How fast is delivery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For our 'Instant' services (like Instant Reels), delivery happens on the same day—often within 2 to 4 hours of the shoot. For larger video editing projects, posters, or monthly management accounts, delivery ranges from 24 to 72 hours based on mutual alignment."
        }
      }
    ]
  };

  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
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
            <GlassyDock />
            <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="beforeInteractive" />
          </>
        )}
      </body>
    </html>
  );
}
