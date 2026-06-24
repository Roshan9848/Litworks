"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    badgeText: "100+ Projects Completed • Creative Media Agency",
    heading: "Create Impact Instantly with LITWORKS",
    subheading: "We create cinematic Instant Reels, manage social media, run performance marketing campaigns, edit videos, design posters, and help businesses grow online.",
    primaryBtnText: "Book Instant Reel",
    secondaryBtnText: "Explore Services"
  });

  const [statsData, setStatsData] = useState({
    opacity: 0.8, // placeholder fallback
    projectsCount: "100+",
    deliveryTime: "Mins",
    satisfactionRate: "99%"
  });

  useEffect(() => {
    fetch("/api/website-content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cms) {
          if (data.cms.hero) setHeroData(data.cms.hero);
          if (data.cms.stats) setStatsData(data.cms.stats);
        }
      })
      .catch((e) => console.error("Failed to load hero CMS data:", e));
  }, []);

  const handleScroll = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20"
    >
      {/* Background Animated Glows */}
      <div className="absolute inset-0 z-0">
        {/* Glow 1 */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-brand-orange/10 blur-[120px]"
        />

        {/* Glow 2 */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-orange/5 blur-[150px]"
        />

        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Small badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/5 text-xs text-brand-orange uppercase tracking-widest font-semibold mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
          {heroData.badgeText}
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]"
        >
          {heroData.heading.includes("LITWORKS") ? (
            <>
              {heroData.heading.split("LITWORKS")[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-orange to-brand-orange drop-shadow-[0_0_30px_rgba(255,122,0,0.3)]">LITWORKS</span>
              {heroData.heading.split("LITWORKS")[1]}
            </>
          ) : (
            heroData.heading
          )}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
        >
          {heroData.subheading}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-orange text-black font-bold tracking-wider hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center"
          >
            {heroData.primaryBtnText}
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-neutral-850 bg-neutral-950 text-white font-bold tracking-wider hover:bg-neutral-900 hover:border-neutral-700 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center"
          >
            {heroData.secondaryBtnText}
          </Link>
        </motion.div>

        {/* Sub-text under buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-[11px] sm:text-xs text-neutral-400 tracking-wider font-light mt-6 flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
          Inquiry response & reel delivery in minutes!
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto mt-12 px-6 py-4 rounded-2xl bg-neutral-950/60 border border-neutral-900 backdrop-blur-md shadow-2xl"
        >
          <div className="text-center">
            <h4 className="text-xl sm:text-2xl font-black text-brand-orange text-glow">{statsData.projectsCount}</h4>
            <p className="text-[9px] sm:text-[10px] tracking-widest text-neutral-400 uppercase font-light mt-1">Completed Projects</p>
          </div>
          <div className="text-center border-x border-neutral-900">
            <h4 className="text-xl sm:text-2xl font-black text-white">{statsData.deliveryTime}</h4>
            <p className="text-[9px] sm:text-[10px] tracking-widest text-neutral-400 uppercase font-light mt-1">Reel Delivery</p>
          </div>
          <div className="text-center">
            <h4 className="text-xl sm:text-2xl font-black text-white">{statsData.satisfactionRate}</h4>
            <p className="text-[9px] sm:text-[10px] tracking-widest text-neutral-400 uppercase font-light mt-1">Happy Clients</p>
          </div>
        </motion.div>
      </div>

      {/* Mouse scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => handleScroll("#about")}
      >
        <span className="text-[10px] tracking-widest text-neutral-500 uppercase">Scroll Down</span>
        <div className="w-6 h-10 rounded-full border border-neutral-700 flex justify-center p-1.5">
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 rounded-full bg-brand-orange"
          />
        </div>
      </motion.div>
    </section>
  );
}
