import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Contact Us & Book | LitWorks Media Agency",
  description: "Connect with LITWORKS to book professional reel creators and digital media experts in Chennai, Hyderabad, Nizamabad, Mancherial & Adilabad. Instant WhatsApp support & fast callbacks.",
  alternates: {
    canonical: "https://litworks.agency/contact",
  },
  openGraph: {
    title: "Contact Us & Book | LITWORKS Media",
    description: "Get in touch with LITWORKS for pricing details, package customization, and booking availability across Telangana & South India.",
    url: "https://litworks.agency/contact",
    siteName: "LITWORKS",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us & Book | LITWORKS Media",
    description: "Book instant reels, social media management, and ad campaigns.",
  }
};

const contactBreadcrumbSchema = {
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
      "name": "Contact",
      "item": "https://litworks.agency/contact"
    }
  ]
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactBreadcrumbSchema) }}
      />
      <Navbar />
      <main className="flex-grow pt-20 bg-black">
        <Contact />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </>
  );
}
