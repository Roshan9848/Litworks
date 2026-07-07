"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { RotateCw } from "lucide-react";

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

  const { scrollY } = useScroll();
  // Map scroll distance (0px to 250px) to one full rotation (0 to 360 deg) for fast completion
  const rawScrollRotateY = useTransform(scrollY, [0, 250], [0, 360]);
  const scrollRotateY = useSpring(rawScrollRotateY, { stiffness: 90, damping: 20 });

  // Combine scroll rotation and mouse movement offset
  const rotateY = useTransform([scrollRotateY, mouseXSpring], ([rY, mX]) => (rY as number) + (mX as number));
  const rotateX = useTransform(mouseYSpring, (mY) => mY as number);
  const rotateZ = useTransform(mouseXSpring, (mX) => mX * 0.14);

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
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-28 pb-16"
    >
      {/* Background Animated Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-brand-orange/10 blur-[120px] anim-float"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-orange/5 blur-[150px] anim-float"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      {/* Content Container (Centered vertical column layout) */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full flex flex-col items-center justify-center text-center">
        
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
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white mb-6 leading-[0.95] max-w-4xl flex flex-col items-center select-none">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            {heroData.heading.includes("with") ? heroData.heading.split("with")[0] : "Create Impact"}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.25)] hover:[-webkit-text-stroke:1.5px_var(--color-brand-orange)] transition-colors duration-300 uppercase mt-2.5"
          >
            {heroData.heading.includes("with") 
              ? `with ${heroData.heading.split("with")[1] || "LITWORKS"}` 
              : "Instantly with LITWORKS"}
          </motion.span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-3xl mb-10 leading-relaxed font-light"
        >
          {heroData.subheading}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12"
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

        {/* Middle Animation Section (Flipping iPhone Mockup) */}
        <div className="relative w-full h-[400px] sm:h-[480px] md:h-[500px] flex flex-col items-center justify-center overflow-visible mb-12 z-20">
          
          {/* Action to replay the 3D flip animation */}
          {isEntryComplete && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              whileHover={{ opacity: 0.9, scale: 1.05 }}
              onClick={triggerReplaySpin}
              className="absolute top-0 right-4 sm:right-16 z-30 p-2 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 rounded-full text-white flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-mono transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Replay Spin
            </motion.button>
          )}

          {/* Interactive Mouse Hover Parallax Shield */}
          <div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative flex items-center justify-center w-full h-full overflow-visible"
            style={{ perspective: 1200 }}
          >
            
            {/* Ambient Back Glow behind the iPhone */}
            <div className="absolute w-[220px] sm:w-[245px] aspect-[9/16] pointer-events-none z-0">
              <motion.div
                animate={{
                  scale: isHovered ? 1.15 : 1.0,
                  opacity: [0.35, 0.45, 0.35]
                }}
                transition={{
                  scale: { duration: 0.3 },
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -inset-10 bg-brand-orange/20 rounded-[3rem] blur-3xl z-0"
              />
            </div>

            {/* The 3D Flipping & Rising iPhone container */}
            <motion.div
              key={isEntryComplete ? "active-interactive" : "entry-spinning"}
              style={{
                transformStyle: "preserve-3d",
                ...(isEntryComplete ? { rotateX, rotateY, rotateZ } : {})
              }}
              animate={
                isEntryComplete
                  ? {
                      y: [0, -6, 0]
                    }
                  : {
                      y: [350, 0],
                      rotateY: [180, 0],
                      rotateX: [20, 0],
                      scale: [0.85, 1],
                      opacity: [0, 1]
                    }
              }
              transition={
                isEntryComplete
                  ? {
                      y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                    }
                  : {
                      duration: 1.8,
                      ease: [0.16, 1, 0.3, 1]
                    }
              }
              onAnimationComplete={() => {
                if (!isEntryComplete) setIsEntryComplete(true);
              }}
              className="relative w-[210px] sm:w-[235px] aspect-[9/16] overflow-visible"
            >
              
              {/* ================= FRONT SIDE (The Screen with Quote & Animated Mesh) ================= */}
              <div
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(0deg)",
                }}
                className="absolute inset-0 w-full h-full p-[6px] bg-neutral-950 border-2 border-brand-orange/40 rounded-[2.3rem] shadow-[0_0_30px_rgba(255,122,0,0.25)] z-20 flex flex-col justify-between"
              >
                {/* Screen Bezel */}
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-neutral-950 relative flex flex-col justify-between">
                  
                  {/* Dynamic Island Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-black rounded-full z-45 flex items-center justify-center border border-white/5 pointer-events-none">
                    <div className="w-1 h-1 bg-neutral-900 rounded-full absolute left-1.5" />
                    <div className="w-0.5 h-0.5 bg-brand-orange/40 rounded-full absolute right-1.5 animate-pulse" />
                  </div>

                  {/* Shifting Mesh Gradient in Background */}
                  <div className="absolute inset-0 z-10 overflow-hidden bg-neutral-950 pointer-events-none">
                    {/* Orange Sphere */}
                    <motion.div
                      animate={{
                        x: [-15, 15, -15],
                        y: [-25, 25, -25],
                      }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-brand-orange/15 blur-xl"
                    />
                    {/* Gold Sphere */}
                    <motion.div
                      animate={{
                        x: [15, -15, 15],
                        y: [20, -20, 20],
                      }}
                      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-orange-400/10 blur-2xl"
                    />
                    {/* Violet/Magenta Sphere */}
                    <motion.div
                      animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.08, 0.15, 0.08],
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-1/3 left-1/4 w-28 h-28 rounded-full bg-violet-600/10 blur-2xl"
                    />
                  </div>

                  {/* Contrast Vignette */}
                  <div className="absolute inset-0 z-15 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

                  {/* Real-looking Status Bar */}
                  <div className="relative z-30 px-5 pt-3 pb-1 flex items-center justify-between text-white/90 font-sans text-[10px] font-semibold tracking-tight pointer-events-none select-none">
                    {/* Time */}
                    <span>9:41</span>
                    
                    {/* Status Icons */}
                    <div className="flex items-center gap-1.5 text-white/90">
                      {/* Signal Strength (Cellular) */}
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M2 22h20V2z" className="opacity-30" />
                        <path d="M2 22h16V6z" />
                      </svg>
                      {/* Wifi Icon */}
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21l-12-12c4-4 10-6 12-6s8 2 12 6l-12 12zm0-18c-3.5 0-6.8 1.5-9.2 4l9.2 9.2 9.2-9.2c-2.4-2.5-5.7-4-9.2-4z" className="opacity-35" />
                        <path d="M12 21l-8-8c2.5-2.5 6.5-3.5 8-3.5s5.5 1 8 3.5l-8 8zm0-12c-1.5 0-3.5.5-4.7 1.7l4.7 4.7 4.7-4.7c-1.2-1.2-3.2-1.7-4.7-1.7z" />
                      </svg>
                      {/* Battery Icon */}
                      <div className="flex items-center">
                        <div className="w-[18px] h-[9px] border border-white/80 rounded-[3px] p-[0.5px] flex items-center">
                          <div className="h-full w-[80%] bg-white rounded-[1.5px]" />
                        </div>
                        <div className="w-[1px] h-[3px] bg-white/80 rounded-r-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Center CTA (Typography & Link Button) */}
                  <div className="relative z-30 flex-grow flex flex-col items-center justify-center px-5 text-center select-none">
                    <p className="text-xs sm:text-sm font-semibold tracking-wider text-white/90 leading-relaxed font-sans mb-4">
                      Want to view our work?
                    </p>
                    <Link
                      href="/videos"
                      className="px-5 py-2.5 rounded-full bg-brand-orange text-black font-extrabold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,122,0,0.5)] active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center"
                    >
                      View Portfolio
                    </Link>
                  </div>

                  {/* Screen Footer branding */}
                  <div className="relative z-30 p-4 pb-5 text-center pointer-events-none">
                    <p className="text-[7px] uppercase tracking-[0.2em] text-white/30 font-bold font-mono">
                      LITWORKS MEDIA
                    </p>
                  </div>

                  {/* Home Indicator Slider */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/70 rounded-full z-30 pointer-events-none" />

                </div>
              </div>

              {/* ================= BACK SIDE (The iPhone Hardware Shell) ================= */}
              <div
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-neutral-950 to-neutral-900 border-2 border-brand-orange/40 rounded-[2.3rem] shadow-[0_0_30px_rgba(255,122,0,0.25)] z-10 flex flex-col items-center justify-between p-7 pointer-events-none"
              >
                {/* Camera Module */}
                <div className="self-start w-22 h-22 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-2.5 grid grid-cols-2 gap-2.5 relative shadow-inner">
                  <div className="w-7 h-7 rounded-full bg-black border-2 border-neutral-800 flex items-center justify-center relative">
                    <div className="w-3 h-3 rounded-full bg-neutral-950 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-blue-900/35 absolute top-1 left-1.5" />
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-black border-2 border-neutral-800 flex items-center justify-center relative">
                    <div className="w-3 h-3 rounded-full bg-neutral-950 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-blue-900/35 absolute top-1 left-1.5" />
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-black border-2 border-neutral-800 flex items-center justify-center relative">
                    <div className="w-3 h-3 rounded-full bg-neutral-950 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-blue-900/35 absolute top-1 left-1.5" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-between py-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-350 border border-neutral-400" />
                    <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 border border-neutral-850" />
                  </div>
                </div>

                {/* LitWorks logo backplate */}
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-10 h-10 rounded-full border border-brand-orange/30 bg-brand-orange/5 flex items-center justify-center shadow-[0_0_15px_rgba(255,122,0,0.1)]">
                    <span className="text-[8px] font-black text-brand-orange font-mono">LIT</span>
                  </div>
                  <span className="text-[6px] text-neutral-600 font-mono uppercase tracking-widest">Designed by LitWorks</span>
                </div>

                <div className="w-10 h-0.5 bg-neutral-850 rounded-full" />

              </div>

            </motion.div>

          </div>

          {/* Swipe indicator text under phone */}
          <div className="flex flex-col items-center gap-1.5 mt-6 z-20 relative pointer-events-none">
            <span className="text-[9px] text-neutral-500 uppercase tracking-[0.2em] font-mono animate-pulse">
              Hover to Rotate in 3D
            </span>
          </div>

        </div>

        {/* Sub-text under buttons / Scroll Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-[11px] sm:text-xs text-neutral-400 tracking-wider font-light mb-8 flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
          Inquiry response & reel delivery in minutes!
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md px-6 py-4 rounded-2xl bg-neutral-950/60 border border-neutral-900 backdrop-blur-md shadow-2xl"
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
        transition={{ delay: 0.8, duration: 0.8 }}
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
  );
}
