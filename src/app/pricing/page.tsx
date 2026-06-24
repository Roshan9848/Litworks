import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

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
