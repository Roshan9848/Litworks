import Navbar from "@/components/Navbar";
import ReelsSection from "@/components/ReelsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

export default function VideosPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20 bg-black">
        <ReelsSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </>
  );
}
