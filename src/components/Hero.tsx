"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { RotateCw, Heart, MessageCircle, Send, Bookmark, Sparkles, Play } from "lucide-react";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    badgeText: "100+ Projects Completed • Creative Media Agency",
    heading: "Create Impact Instantly with LITWORKS",
    subheading: "We create cinematic Instant Reels, manage social media, run performance marketing campaigns, edit videos, design posters, and help businesses grow online.",
    primaryBtnText: "Book Instant Reel",
    secondaryBtnText: "Explore Services"
  });

  const [statsData, setStatsData] = useState({
    opacity: 0.8,
    projectsCount: "100+",
    deliveryTime: "Mins",
    satisfactionRate: "99%"
  });

  const [isEntryComplete, setIsEntryComplete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D parallax and scroll-spin
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Mouse-based 3D responsive parallax tilt (no scroll Y rotation to avoid mobile jitter)
  const rotateY = useTransform(mouseXSpring, (mX) => mX as number);
  const rotateX = useTransform(mouseYSpring, (mY) => mY as number);
  const rotateZ = useTransform(mouseXSpring, (mX) => mX * 0.12);

  const [mockupVideoUrl, setMockupVideoUrl] = useState("https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-42260-large.mp4");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    fetch("/api/website-content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cms) {
          if (data.cms.hero) setHeroData(data.cms.hero);
          if (data.cms.stats) setStatsData(data.cms.stats);
          if (data.cms.videos && data.cms.videos.items && data.cms.videos.items.length > 0) {
            const firstDirect = data.cms.videos.items.find((item: any) => item.url && !item.url.includes("instagram.com"));
            if (firstDirect) {
              setMockupVideoUrl(firstDirect.url);
            }
          }
        }
      })
      .catch((e) => console.error("Failed to load hero CMS data:", e));
  }, []);

  // Explicitly ensure the mockup video autoplays and loops on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch((err) => {
        console.log("Mockup video autoplay failed, retrying on interaction:", err);
      });
    }
  }, [mockupVideoUrl]);

  // Restart 3D entry animation spin
  const triggerReplaySpin = () => {
    setIsEntryComplete(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Mouse move parallax coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEntryComplete) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 14);
    mouseY.set(y * -14);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleScroll = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };  return (
    <>
      {/* Fold 1: Minimalist Hero Section (Pure Black Background) */}
      <section
        id="home"
        className="relative min-h-[100dvh] flex flex-col justify-between items-center overflow-hidden bg-black pt-16 sm:pt-24 pb-6 sm:pb-10"
      >
        {/* Background Grid & Ambient Glow - Pure Black minimalist theme */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#090909_1px,transparent_1px),linear-gradient(to_bottom,#090909_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] bg-brand-orange/10 rounded-full blur-[100px]" />
        </div>

        {/* Content Container (Centered vertical column layout) */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full flex-1 flex flex-col items-center justify-center text-center my-auto pt-2 sm:pt-0 py-4">
          
          {/* Small badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/5 text-xs text-brand-orange uppercase tracking-widest font-semibold mb-4 sm:mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
            {heroData.badgeText}
          </motion.div>

          {/* Main Heading (3-Line Cinematic Layout matching reference design) */}
          <h1 className="text-[38px] xs:text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white mb-4 sm:mb-5 leading-[0.92] max-w-4xl flex flex-col items-center select-none">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              CREATE IMPACT
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block mt-0.5 sm:mt-1 text-white"
            >
              INSTANTLY
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.45)] hover:[-webkit-text-stroke:1.5px_var(--color-brand-orange)] transition-colors duration-300 uppercase mt-1 sm:mt-2 cursor-pointer"
              style={{
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                paintOrder: "stroke fill"
              }}
            >
              WITH LITWORKS
            </motion.span>
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-sm sm:text-base md:text-lg text-neutral-400 max-w-xl sm:max-w-2xl mb-6 sm:mb-8 leading-relaxed font-light font-sans"
          >
            {heroData.subheading}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto mb-7 sm:mb-9"
          >
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-brand-orange text-black font-extrabold tracking-wider hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center text-sm sm:text-base"
            >
              {heroData.primaryBtnText}
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full border border-neutral-800 bg-neutral-950/90 text-white font-extrabold tracking-wider hover:bg-neutral-900 hover:border-neutral-700 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center text-sm sm:text-base"
            >
              {heroData.secondaryBtnText}
            </Link>
          </motion.div>

          {/* Stats Row inside Fold 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md px-6 py-4 rounded-2xl bg-neutral-950/80 border border-neutral-900 backdrop-blur-md shadow-2xl mb-4 sm:mb-6"
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
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => handleScroll("#about")}
        >
          <span className="text-[9px] tracking-widest text-neutral-600 uppercase">Scroll Down</span>
          <div className="w-5 h-9 rounded-full border border-neutral-800 flex justify-center p-1">
            <motion.div
              animate={{
                y: [0, 10, 0],
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

      {/* Marquee Divider Ribbon (Premier League Style Horizontal Strip) */}
      <div className="w-full bg-neutral-950 border-y border-neutral-900/80 py-4 overflow-hidden select-none relative z-20">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 mx-6 text-[10px] sm:text-xs tracking-[0.2em] font-extrabold uppercase text-white font-mono">
              <span className="text-brand-orange">Launch Offer</span>
              <span className="text-neutral-800">•</span>
              <span>Flat ₹500 Off on First Booking</span>
              <span className="text-neutral-800">•</span>
              <span className="text-brand-orange">Cinematic Production</span>
              <span className="text-neutral-800">•</span>
              <span>Delivered in Minutes</span>
              <span className="text-neutral-800">•</span>
              <span className="text-brand-orange">Vetted Creators</span>
              <span className="text-neutral-800">•</span>
              <span>Professional Editing</span>
              <span className="text-neutral-800">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fold 2: Cinematic Showcase Section (Mockup with minimal glow backdrop) */}
      <section className="relative py-24 bg-black overflow-hidden flex flex-col items-center justify-center text-center border-b border-neutral-900/40">
        {/* Minimal ambient glow behind the mockup */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
          <div className="w-[180px] sm:w-[220px] aspect-[9/16] bg-brand-orange/[0.04] rounded-[3rem] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full flex flex-col items-center justify-center">
          <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-extrabold mb-10 block font-mono">
            Experience the Quality ⚡
          </span>

          {/* Interactive Mouse Hover Parallax Shield */}
          <div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative flex items-center justify-center w-full overflow-visible"
            style={{ perspective: 1200 }}
          >
            {/* The Floating iPhone Mockup container */}
            <motion.div
              style={{
                transformStyle: "preserve-3d",
                rotateX,
                rotateY,
                rotateZ
              }}
              initial={{ y: 50, opacity: 0, scale: 0.96 }}
              whileInView={{
                y: [0, -10, 0],
                opacity: 1,
                scale: 1
              }}
              viewport={{ once: true }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 }
              }}
              className="relative w-[215px] sm:w-[245px] aspect-[9/16] overflow-visible z-10"
            >
              <div className="absolute inset-0 w-full h-full p-[6px] bg-neutral-950 border-2 border-brand-orange/40 rounded-[2.3rem] shadow-[0_0_30px_rgba(255,122,0,0.15)] flex flex-col justify-between overflow-hidden">
                {/* Screen Bezel */}
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-neutral-950 relative flex flex-col justify-between">
                  
                  {/* Dynamic Island Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-black rounded-full z-45 flex items-center justify-center border border-white/5 pointer-events-none">
                    <div className="w-1 h-1 bg-neutral-900 rounded-full absolute left-1.5" />
                    <div className="w-0.5 h-0.5 bg-brand-orange/40 rounded-full absolute right-1.5 animate-pulse" />
                  </div>

                  {/* Real-looking Status Bar */}
                  <div className="relative z-40 px-5 pt-3 pb-1 flex items-center justify-between text-white/90 font-sans text-[10px] font-semibold tracking-tight pointer-events-none select-none">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M2 22h20V2z" className="opacity-30" />
                        <path d="M2 22h16V6z" />
                      </svg>
                      <div className="flex items-center">
                        <div className="w-[18px] h-[9px] border border-white/80 rounded-[3px] p-[0.5px] flex items-center">
                          <div className="h-full w-[80%] bg-white rounded-[1.5px]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* HTML5 Video Loop (Reels Simulation) */}
                  <div className="absolute inset-0 w-full h-full z-10 overflow-hidden bg-black pointer-events-none">
                    <video
                      ref={videoRef}
                      src={mockupVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      webkit-playsinline="true"
                      preload="auto"
                      className="w-full h-full object-cover scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
                  </div>

                  {/* Instagram-style Actions Vertical Panel */}
                  <div className="absolute right-3.5 bottom-24 z-30 flex flex-col items-center gap-4 text-white pointer-events-auto">
                    <div className="flex flex-col items-center gap-1 cursor-pointer group/icon">
                      <Heart className="w-5 h-5 text-white fill-white/10 group-hover/icon:text-brand-orange group-hover/icon:fill-brand-orange transition-colors filter drop-shadow" />
                      <span className="text-[8px] font-mono font-bold tracking-tight text-white/90">12.4K</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer group/icon">
                      <MessageCircle className="w-5 h-5 text-white fill-white/10 group-hover/icon:text-brand-orange group-hover/icon:fill-brand-orange transition-colors filter drop-shadow" />
                      <span className="text-[8px] font-mono font-bold tracking-tight text-white/90">482</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer group/icon">
                      <Send className="w-[18px] h-[18px] text-white group-hover/icon:text-brand-orange transition-colors filter drop-shadow" />
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer group/icon">
                      <Bookmark className="w-5 h-5 text-white fill-white/10 group-hover/icon:text-brand-orange group-hover/icon:fill-brand-orange transition-colors filter drop-shadow" />
                    </div>
                  </div>

                  {/* Instagram-style Creator Bottom Card & CTA */}
                  <div className="absolute inset-x-0 bottom-4 z-30 px-4 flex flex-col gap-2.5 text-left pointer-events-auto">
                    {/* Creator info */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-orange border border-brand-orange/30 flex items-center justify-center font-bold text-[8px] text-black">
                        LW
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-extrabold text-white flex items-center gap-1 leading-none font-sans">
                          @litworks.media
                          <Sparkles className="w-2.5 h-2.5 text-brand-orange fill-brand-orange" />
                        </p>
                        <span className="text-[7px] text-white/50 font-medium font-mono uppercase tracking-wider">Cinematic Agency</span>
                      </div>
                    </div>

                    {/* Caption */}
                    <p className="text-[9px] text-white/90 leading-relaxed font-sans font-medium line-clamp-2">
                      Capturing instant reels that convert. Boost your brand today ⚡
                    </p>

                    {/* View Portfolio Link button */}
                    <Link
                      href="/videos"
                      className="mt-1 w-full py-2.5 rounded-xl bg-brand-orange hover:bg-white text-black font-extrabold text-[9px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(255,122,0,0.3)] hover:scale-[1.02]"
                    >
                      <Play className="w-3.5 h-3.5 fill-black text-black" />
                      <span>View Portfolio</span>
                    </Link>
                  </div>

                  {/* Home Indicator Slider */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/50 rounded-full z-35 pointer-events-none" />

                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-1.5 mt-8 z-20 relative pointer-events-none">
            <span className="text-[9px] text-neutral-500 uppercase tracking-[0.2em] font-mono animate-pulse">
              Hover screen to tilt in 3D
            </span>
          </div>

          <div className="text-[11px] sm:text-xs text-neutral-550 tracking-wider font-light mt-6 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            Inquiry response & reel delivery in minutes!
          </div>

        </div>
      </section>
    </>
  );
}
