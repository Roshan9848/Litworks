import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LITWORKS | Instant Reels & Creative Media Agency",
    short_name: "LITWORKS",
    description: "Cinematic Instant Reels, Social Media Management, Meta Ads, Video Editing and Graphic Design across Chennai, Hyderabad, Nizamabad, Mancherial, and Adilabad.",
    start_url: "/launch",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
