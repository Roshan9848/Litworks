import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Workflow from "@/components/Workflow";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Creative Marketing & Digital Services | LITWORKS Agency",
  description: "Explore our range of creative services: Social Media Page Handling, Targeted Meta Ads (Instagram & FB) Campaigns, Cinematic Reels Video Editing, and Professional Graphic Design.",
  openGraph: {
    title: "Creative Marketing & Digital Services | LITWORKS Agency",
    description: "Grow your brand organic reach and conversions with our social media, ads management, video editing, and graphic design services.",
    url: "https://litworks.agency/services",
  }
};

export default function ServicesPage() {
  return (
    <>
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
