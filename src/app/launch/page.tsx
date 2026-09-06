"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

export default function MobileLaunchExperiencePage() {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API for clean, subtle acoustic feedback
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
      // Ignore
    }
  }, [soundEnabled]);

  const playLaunchSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;

      // Clean, low-frequency subtle acoustic tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Ignore
    }
  }, [soundEnabled, initAudio]);

  // Handle 1-Tap Instant Launch
  const handleTapLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    playLaunchSound();

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Direct clean transition
    setTimeout(() => {
      router.push("/?launched=true");
    }, 450);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Clean Top Navbar */}
      <header className="relative z-20 px-6 pt-6 sm:pt-8 flex items-center justify-between max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="LitWorks Logo"
              width={20}
              height={20}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-sm font-bold tracking-wider text-white uppercase">
            LITWORKS
          </span>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          aria-label={soundEnabled ? "Mute sound FX" : "Enable sound FX"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-neutral-300" />
          ) : (
            <VolumeX className="w-4 h-4 text-neutral-500" />
          )}
        </button>
      </header>

      {/* Main Center Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto w-full py-8">
        {/* Subtle Release Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
          <span className="text-[10px] font-mono font-medium tracking-widest text-neutral-400 uppercase">
            OFFICIAL RELEASE • 2026
          </span>
        </div>

        {/* Crisp Headline */}
        <div className="space-y-3 mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Cinematic Media. <br />
            <span className="text-neutral-400 font-normal">Delivered Instantly.</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-xs mx-auto">
            High-impact Instant Reels, social media management, and performance marketing.
          </p>
        </div>

        {/* CLEAN PROFESSIONAL TAP BUTTON */}
        <div className="w-full max-w-[240px]">
          <button
            onClick={handleTapLaunch}
            disabled={isLaunching}
            className={`w-full py-4 px-6 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              isLaunching
                ? "bg-neutral-800 text-neutral-400 border border-neutral-700"
                : "bg-white hover:bg-neutral-200 text-black active:scale-95"
            }`}
          >
            <span>{isLaunching ? "Entering..." : "Enter Website"}</span>
            {!isLaunching && <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>
        </div>

        <p className="text-[10px] text-neutral-600 font-mono mt-4 tracking-wider">
          Click to enter web experience
        </p>
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="relative z-20 px-6 py-6 text-center max-w-md mx-auto w-full border-t border-neutral-900">
        <p className="text-[10px] text-neutral-500 font-mono tracking-wider">
          Chennai • Hyderabad • Nizamabad • Mancherial • Adilabad
        </p>
      </footer>
    </div>
  );
}
