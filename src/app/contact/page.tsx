import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

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
