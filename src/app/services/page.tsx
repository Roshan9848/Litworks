import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Workflow from "@/components/Workflow";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Creative Marketing & Digital Services | Social Media & Ads",
  description: "Explore our range of creative services: Social Media Page Handling, Targeted Meta Ads (Instagram & FB) Campaigns, Cinematic Reels Video Editing, and Professional Graphic Design across Chennai, Hyderabad, Nizamabad, Mancherial & Adilabad.",
  alternates: {
    canonical: "https://litworks.agency/services",
  },
  openGraph: {
    title: "Creative Marketing & Digital Services | LITWORKS Agency",
    description: "Grow your brand organic reach and conversions with our social media, ads management, video editing, and graphic design services in Chennai, Hyderabad, Nizamabad, Mancherial & Adilabad.",
    url: "https://litworks.agency/services",
    siteName: "LITWORKS",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Marketing & Digital Services | LITWORKS Agency",
    description: "Social media management, high-performance Meta Ads, cinematic video editing, and graphic design.",
  }
};

const servicesBreadcrumbSchema = {
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
      "name": "Services",
      "item": "https://litworks.agency/services"
    }
  ]
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesBreadcrumbSchema) }}
      />
      <Navbar />
      <main className="flex-grow pt-20 bg-black">
        <Services />
        <WhyChooseUs />
        <Workflow />
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </>
  );
}
