import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ReelsSection from "@/components/ReelsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Cinematic Reels Portfolio Showcase | LITWORKS Media",
  description: "Watch our high-converting cinematic reels. Discover how our professional creators film and edit engaging, viral content for weddings, events, birthdays, and brands.",
  openGraph: {
    title: "Cinematic Reels Portfolio Showcase | LITWORKS Media",
    description: "Browse our gallery of trending reels. See our production quality, transition editing, and storytelling capabilities.",
    url: "https://litworks.agency/videos",
  }
};

const videoObjectSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "VideoObject",
        "name": "LITWORKS Cinematic Wedding Reel",
        "description": "Premium wedding cinematic highlights reel capturing instant emotional moments.",
        "thumbnailUrl": "https://litworks.agency/logo.png",
        "uploadDate": "2026-01-01T00:00:00Z",
        "contentUrl": "https://assets.mixkit.co/videos/preview/mixkit-romantic-wedding-couple-in-nature-41589-large.mp4"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "VideoObject",
        "name": "LITWORKS Car Delivery Celebration Reel",
        "description": "High-octane delivery ceremony reel with speed ramp transition edits.",
        "thumbnailUrl": "https://litworks.agency/logo.png",
        "uploadDate": "2026-01-01T00:00:00Z",
        "contentUrl": "https://assets.mixkit.co/videos/preview/mixkit-red-sports-car-driving-on-a-road-34282-large.mp4"
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "VideoObject",
        "name": "LITWORKS Birthday Celebration Highlights",
        "description": "Cinematic birthday party overview with guest interviews and candid cuts.",
        "thumbnailUrl": "https://litworks.agency/logo.png",
        "uploadDate": "2026-01-01T00:00:00Z",
        "contentUrl": "https://assets.mixkit.co/videos/preview/mixkit-birthday-cake-with-candles-burning-43093-large.mp4"
      }
    }
  ]
};

export default function VideosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectSchema) }}
      />
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
