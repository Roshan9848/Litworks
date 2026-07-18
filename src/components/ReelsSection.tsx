"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";

interface ReelItem {
  url: string;
  title: string;
  instagramUrl?: string;
}

export default function ReelsSection() {
  const defaultReels: ReelItem[] = [
    {
      url: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-42260-large.mp4",
      title: "Neon Night Commercial",
    },
    {
      url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
      title: "Nature Brand Reel",
    },
    {
      url: "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-dj-hands-at-work-41710-large.mp4",
      title: "Cinematic DJ Promo",
    },
    {
      url: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-cell-phone-by-the-sea-at-sunset-41716-large.mp4",
      title: "Sunset Travel Vibe",
    },
    {
      url: "https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-in-the-blue-ocean-from-above-43022-large.mp4",
      title: "Drone Ocean Wave",
    },
    {
      url: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-neon-lights-42253-large.mp4",
      title: "Neon Dance Studio",
    },
  ];

  const [heading, setHeading] = useState("Cinematic Reels in Action");
  const [subheading, setSubheading] = useState("Portfolio Showcase");
  const [reels, setReels] = useState<ReelItem[]>(defaultReels);
  const [loading, setLoading] = useState(true);

  // Autoplay sequence state
  const [activePlayingIndex, setActivePlayingIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetch("/api/website-content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cms && data.cms.videos) {
          if (data.cms.videos.heading) setHeading(data.cms.videos.heading);
          if (data.cms.videos.subheading) setSubheading(data.cms.videos.subheading);
          if (data.cms.videos.items && data.cms.videos.items.length > 0) {
            const dbItems = data.cms.videos.items;
            const padded = [...dbItems];
            for (let i = dbItems.length; i < 6; i++) {
              if (defaultReels[i]) {
                padded.push(defaultReels[i]);
              }
            }
            setReels(padded);
          }
        }
      })
      .catch((e) => console.error("Failed to load CMS reels:", e))
      .finally(() => setLoading(false));
  }, []);

  // Manage playing states based on active index, mute state, and pause state
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;

      if (idx === activePlayingIndex && !isPaused) {
        video.play().catch((e) => console.log("Play interrupted or blocked:", e));
      } else {
        video.pause();
      }
      video.muted = isMuted;
    });
  }, [activePlayingIndex, isMuted, isPaused, reels]);

  const handleVideoEnded = (endedIdx: number) => {
    // Advance to next video in sequence
    const nextIdx = (endedIdx + 1) % reels.length;
    setActivePlayingIndex(nextIdx);
    setIsPaused(false);
  };

  const handleCardClick = (idx: number) => {
    if (idx === activePlayingIndex) {
      // Toggle play/pause of active video
      setIsPaused(!isPaused);
    } else {
      // Switch active video
      setActivePlayingIndex(idx);
      setIsPaused(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card click
    setIsMuted(!isMuted);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono">
          Loading Portfolio Showcase...
        </span>
      </div>
    );
  }

  return (
    <section className="relative py-24 bg-black overflow-hidden border-t border-neutral-900">
      {/* Background Glow */}
      <div className="absolute right-1/4 top-1/4 w-[350px] h-[350px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-brand-orange font-semibold mb-3"
          >
            {subheading}
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            {heading}
          </motion.h3>
          <p className="text-xs text-neutral-500 uppercase tracking-widest mt-4 font-mono">
            * Videos play sequentially one-by-one. Click any reel to control.
          </p>
        </div>

        {/* Reels 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto justify-center">
          {reels.slice(0, 6).map((reel, idx) => {
            const isCurrent = idx === activePlayingIndex;
            const isInstagram = reel.url.includes("instagram.com");
            const instagramLink = reel.instagramUrl || (isInstagram ? reel.url : "");

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 3) * 0.15, duration: 0.6 }}
                onClick={() => handleCardClick(idx)}
                className={`relative aspect-[9/16] rounded-3xl overflow-hidden border bg-neutral-950 shadow-2xl transition-all duration-500 group select-none ${
                  isCurrent
                    ? "border-brand-orange ring-1 ring-brand-orange/45 scale-[1.02] shadow-[0_0_30px_rgba(255,122,0,0.15)] animate-pulse-slow"
                    : "border-neutral-900 opacity-70 hover:opacity-100 hover:border-brand-orange/30 hover:shadow-[0_0_30px_rgba(255,122,0,0.1)]"
                }`}
              >
                {/* Visual rendering - Standard HTML5 Video Player */}
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={reel.url}
                  autoPlay={idx === activePlayingIndex}
                  muted={idx === activePlayingIndex ? isMuted : true}
                  playsInline
                  webkit-playsinline="true"
                  preload="metadata"
                  onEnded={() => handleVideoEnded(idx)}
                  className="w-full h-full object-cover"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40 p-6 flex flex-col justify-between opacity-100 transition-opacity duration-300 pointer-events-none">
                  {/* Top Status & Controls */}
                  <div className="flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/5 rounded-full px-2.5 py-1">
                      {isCurrent && !isPaused ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
                          <span className="text-[8px] font-black uppercase tracking-wider text-brand-orange font-mono">Playing</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                          <span className="text-[8px] font-black uppercase tracking-wider text-neutral-400 font-mono font-bold">Up Next</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Unified Floating Controller Pill (Middle) */}
                  <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 pointer-events-none ${isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    <div className="flex items-center gap-3 bg-black/75 backdrop-blur-md border border-white/10 rounded-full p-2.5 pointer-events-auto shadow-2xl scale-110">
                      {/* Play/Pause Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrent) {
                            setIsPaused(!isPaused);
                          } else {
                            setActivePlayingIndex(idx);
                            setIsPaused(false);
                          }
                        }}
                        className="w-10 h-10 rounded-full bg-brand-orange text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-brand-orange/20"
                        title={isCurrent && !isPaused ? "Pause Reel" : "Play Reel"}
                      >
                        {isCurrent && !isPaused ? (
                          <Pause className="w-4.5 h-4.5 fill-current" />
                        ) : (
                          <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Mute/Unmute Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                        }}
                        className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:scale-105 active:scale-95 hover:text-brand-orange transition-all shadow-lg"
                        title={isMuted ? "Unmute sound" : "Mute sound"}
                      >
                        {isMuted ? (
                          <VolumeX className="w-4.5 h-4.5" />
                        ) : (
                          <Volume2 className="w-4.5 h-4.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Metadata */}
                  <div className="space-y-1.5 pointer-events-auto flex flex-col items-start">
                    <span className="text-[9px] uppercase tracking-widest text-brand-orange font-black font-mono">
                      Reel #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white tracking-wide uppercase line-clamp-1">{reel.title}</h4>
                    {instagramLink && (
                      <a
                        href={instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-brand-orange hover:text-white transition-colors pt-1"
                      >
                        View on Instagram ↗
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
