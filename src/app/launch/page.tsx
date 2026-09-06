"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Volume2, VolumeX, Sparkles, ArrowRight } from "lucide-react";

export default function MobileLaunchExperiencePage() {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Web Audio API for synthetic boom & futuristic laser blast without external assets
  const initAudio = useCallback(() => {
    if (typeof window === "undefined" || !soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
    } catch {
      // Audio context might fail silently if blocked by browser policy
    }
  }, [soundEnabled]);

  const playLaunchSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;

      // 1. Deep Sub-Bass Impact Boom
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = "sine";
      bassOsc.frequency.setValueAtTime(160, ctx.currentTime);
      bassOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.9);

      bassGain.gain.setValueAtTime(0.8, ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start();
      bassOsc.stop(ctx.currentTime + 1.0);

      // 2. High-Energy Laser Sweep Rise
      const laserOsc = ctx.createOscillator();
      const laserGain = ctx.createGain();
      laserOsc.type = "sawtooth";
      laserOsc.frequency.setValueAtTime(120, ctx.currentTime);
      laserOsc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);

      laserGain.gain.setValueAtTime(0.2, ctx.currentTime);
      laserGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      laserOsc.connect(laserGain);
      laserGain.connect(ctx.destination);
      laserOsc.start();
      laserOsc.stop(ctx.currentTime + 0.45);
    } catch {
      // Ignore
    }
  }, [soundEnabled, initAudio]);

  // Particle Shockwave Burst Canvas on Tap
  useEffect(() => {
    if (!isLaunching || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const particles: Particle[] = [];
    const colors = ["#FF7A00", "#FFA133", "#FFFFFF", "#FF5500", "#FFC837"];

    for (let i = 0; i < 160; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.54,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      particles.forEach((p) => {
        if (p.alpha > 0) {
          alive++;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isLaunching]);

  // Handle 1-Tap Instant Launch
  const handleTapLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    playLaunchSound();

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([80, 40, 150]);
    }

    // Smooth quick transition into live site
    setTimeout(() => {
      router.push("/?launched=true");
    }, 750);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Dynamic Shockwave Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-30" />

      {/* Atmospheric Background Ambient Radiance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#FF7A00]/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#FF5500]/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
      </div>

      {/* Flash Whiteout Overlay on Launch */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-b from-[#FF7A00]/40 via-white/30 to-black z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Clean Modern Top Navbar */}
      <header className="relative z-20 px-6 pt-6 sm:pt-8 flex items-center justify-between max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl bg-neutral-900/90 border border-white/10 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(255,122,0,0.25)]">
            <Image
              src="/logo.png"
              alt="LitWorks Logo"
              width={22}
              height={22}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-sm font-black tracking-wider text-white uppercase font-sans">
            LITWORKS<span className="text-[#FF7A00]">.</span>
          </span>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="px-3 py-1.5 rounded-full bg-neutral-900/80 border border-white/10 text-neutral-400 hover:text-white flex items-center gap-1.5 transition-all text-xs font-mono backdrop-blur-md cursor-pointer"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span className="text-[10px] text-neutral-300">SFX ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[10px] text-neutral-500">MUTED</span>
            </>
          )}
        </button>
      </header>

      {/* Main Center Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-sm mx-auto w-full py-6">
        {/* Top Tag Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-white/10 mb-6 backdrop-blur-md shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-300 uppercase">
            {isLaunching ? "ACCESS GRANTED" : "OFFICIAL LAUNCH • 2026"}
          </span>
        </motion.div>

        {/* Hero Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="space-y-2 mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
            {isLaunching ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-amber-300">
                LITWORKS IS LIVE
              </span>
            ) : (
              <>
                Enter The New Era of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-amber-400">Media</span>
              </>
            )}
          </h1>
          <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-xs mx-auto">
            Fast, cinematic Instant Reels & creative marketing built for instant digital impact.
          </p>
        </motion.div>

        {/* CLEAN 1-TAP LAUNCH BUTTON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative w-full max-w-[280px]"
        >
          {/* Ambient Outer Halo Pulse */}
          <div className="absolute inset-0 bg-[#FF7A00]/30 rounded-full blur-2xl animate-pulse pointer-events-none" />

          {/* Primary Tap Button */}
          <button
            onClick={handleTapLaunch}
            disabled={isLaunching}
            className={`relative w-full py-5 px-8 rounded-full font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-[0_0_40px_rgba(255,122,0,0.5)] active:scale-95 ${
              isLaunching
                ? "bg-white text-black scale-105 shadow-[0_0_60px_rgba(255,255,255,0.8)]"
                : "bg-gradient-to-r from-[#FF7A00] via-[#FFA133] to-[#FF7A00] hover:brightness-110 text-black hover:shadow-[0_0_50px_rgba(255,122,0,0.7)]"
            }`}
          >
            {isLaunching ? (
              <>
                <Zap className="w-5 h-5 text-black animate-bounce" />
                <span>Launching...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-black" />
                <span>Tap to Launch</span>
                <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
              </>
            )}
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-[11px] text-neutral-500 font-mono mt-5 uppercase tracking-widest"
        >
          1-Tap Instant Entry
        </motion.p>
      </main>

      {/* Sleek Minimalist Footer */}
      <footer className="relative z-20 px-6 py-6 text-center max-w-sm mx-auto w-full">
        <p className="text-[10px] text-neutral-500 font-mono tracking-wider">
          Serving Chennai • Hyderabad • Nizamabad • Mancherial • Adilabad
        </p>
      </footer>
    </div>
  );
}
