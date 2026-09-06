import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Pricing Plans & Packages | Instant Reels & Media Shoots",
  description: "Transparent pricing packages for Instant Reels (Hourly, Half-Day, Full Event), Weddings, Birthdays, Car Delivery and Business shoots in Chennai, Hyderabad, Nizamabad, Mancherial & Adilabad.",
  alternates: {
    canonical: "https://litworks.agency/pricing",
  },
  openGraph: {
    title: "Pricing Plans & Packages | LITWORKS Media",
    description: "Book professional reel makers in Chennai, Hyderabad, Nizamabad, Mancherial & Adilabad. Transparent pricing for weddings, events, birthdays, and business shoots.",
    url: "https://litworks.agency/pricing",
    siteName: "LITWORKS",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans & Packages | LITWORKS Media",
    description: "Transparent Instant Reel pricing and fast bookings across Chennai, Hyderabad, Nizamabad, Mancherial, and Adilabad.",
  }
};

const pricingBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://litworks.agency"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Pricing",
      "item": "https://litworks.agency/pricing"
    }
  ]
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingBreadcrumbSchema) }}
      />
      <Navbar />
      <main className="flex-grow pt-20 bg-black">
        <Pricing />
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </>
  );
}
