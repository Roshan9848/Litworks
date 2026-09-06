import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import GlassyDock from "@/components/GlassyDock";
import PullToRefresh from "@/components/PullToRefresh";

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
  title: {
    default: "LITWORKS | Instant Reels, Social Media Management & Meta Ads Agency",
    template: "%s | LITWORKS Media",
  },
  description: "Premier creative media agency delivering cinematic Instant Reels (Weddings, Birthdays, Car Delivery, Events, Businesses), full-service social media management, high-ROI Meta Ads performance marketing, video editing, and graphic design across Chennai, Hyderabad, Nizamabad, Mancherial, and Adilabad.",
  metadataBase: new URL("https://litworks.agency"),
  alternates: {
    canonical: "https://litworks.agency",
  },
  keywords: [
    "LITWORKS", "LITWORKS Media", "Instant Reels", "Wedding Reels", "Birthday Reels", 
    "Car Delivery Reels", "Social Media Handling", "Instagram Management",
    "Performance Marketing", "Meta Ads Hyderabad", "Video Editing Agency", 
    "Poster Designing", "YouTube Thumbnails", "Creative Agency Telangana",
    "Instant Reels Hyderabad", "Instant Reels Chennai", "Instant Reels Nizamabad",
    "Instant Reels Mancherial", "Instant Reels Adilabad", "Event Videography Telangana",
    "Wedding Reel Makers", "Cinematic Reel Creators", "Digital Marketing Agency South India"
  ],
  authors: [{ name: "LITWORKS", url: "https://litworks.agency" }],
  creator: "LITWORKS",
  publisher: "LITWORKS Media",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "LITWORKS | Instant Reels, Social Media Management & Meta Ads",
    description: "Premier creative agency for cinematic Instant Reels delivered on-site in hours, full-service Instagram handling, and high-converting Meta Ads campaigns.",
    url: "https://litworks.agency",
    siteName: "LITWORKS",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "LITWORKS - Creative Media & Instant Reels Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LITWORKS | Instant Reels & Creative Media Agency",
    description: "Cinematic Instant Reels, Instagram Management, Meta Ads & Video Editing in Chennai, Hyderabad, Nizamabad, Mancherial & Adilabad.",
    images: ["/logo.png"],
    creator: "@litworks_media",
    site: "@litworks_media",
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
  category: "Creative Media & Digital Marketing Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === "true";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "LITWORKS",
    "legalName": "LITWORKS Media Agency",
    "alternateName": ["LitWorks", "LitWorks Media", "Litworks Agency"],
    "image": "https://litworks.agency/logo.png",
    "logo": "https://litworks.agency/logo.png",
    "@id": "https://litworks.agency/#organization",
    "url": "https://litworks.agency",
    "telephone": "+919110797354",
    "email": "litworks.media@gmail.com",
    "priceRange": "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "UPI, Credit Card, Debit Card, Net Banking, Cash",
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
      { "@type": "City", "name": "Chennai" },
      { "@type": "City", "name": "Hyderabad" },
      { "@type": "City", "name": "Nizamabad" },
      { "@type": "City", "name": "Mancherial" },
      { "@type": "City", "name": "Adilabad" }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.instagram.com/litworks.media/"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "LITWORKS Creative Media Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Instant Reels (Weddings, Events, Birthdays, Car Deliveries)",
            "description": "On-location shoot and same-day editing delivering viral cinematic 9:16 reels within hours."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Social Media Page Handling",
            "description": "Comprehensive Instagram and Facebook page management, content planning, and organic growth."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Meta Ads & Performance Marketing",
            "description": "High-conversion lead generation and e-commerce advertising across Meta platforms."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cinematic Video Editing & Post Production",
            "description": "Premium color grading, sound design, and speed-ramp transition video editing."
          }
        }
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LITWORKS",
    "url": "https://litworks.agency",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://litworks.agency/services?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
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
          "text": "We currently serve 5 key hubs: Chennai, Hyderabad, Nizamabad, Mancherial, and Adilabad. Our mobile creators and editors deploy directly to your event or business location."
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
          "text": "For our Instant Reel services, delivery happens on the same day—often within 2 to 4 hours of the shoot. For larger video editing projects, posters, or monthly management accounts, delivery ranges from 24 to 72 hours based on mutual alignment."
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
            <PullToRefresh />
            {children}
            <GlassyDock />
            <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="beforeInteractive" />
          </>
        )}
      </body>
    </html>
  );
}
