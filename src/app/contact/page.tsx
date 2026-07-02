import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Contact Us & Book | LITWORKS Media",
  description: "Connect with LITWORKS. Send booking queries, get quotes, or discuss your event content plan with our creators. Operating in Telangana & Andhra Pradesh.",
  openGraph: {
    title: "Contact Us & Book | LITWORKS Media",
    description: "Get in touch with LITWORKS for pricing details, package customization, and booking availability.",
    url: "https://litworks.agency/contact",
  }
};

export default function ContactPage() {
  return (
    <>
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
