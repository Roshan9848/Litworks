import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Pricing Plans & Packages | LITWORKS Media",
  description: "View pricing packages for Instant Reels (Hourly, Half-Day) and Wedding & Event Reels. Book instantly online, choose your date and secure your shoot slot.",
  openGraph: {
    title: "Pricing Plans & Packages | LITWORKS Media",
    description: "Book professional reel makers in Telangana & AP. Transparent pricing for weddings, events, birthdays, and business shoots.",
    url: "https://litworks.agency/pricing",
  }
};

export default function PricingPage() {
  return (
    <>
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
