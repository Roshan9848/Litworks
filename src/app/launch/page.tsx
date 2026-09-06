"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Rocket,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  Maximize,
  Minimize
} from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
}

export default function MobileLaunchExperiencePage() {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Cross-Browser Fullscreen Handler (Supports Android, Safari iOS, Mac, Windows)
  const toggleFullscreen = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const doc = window.document as any;
      const docEl = doc.documentElement as any;

      const isFs =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;

      if (!isFs) {
        const req =
          docEl.requestFullscreen ||
          docEl.webkitRequestFullscreen ||
          docEl.mozRequestFullScreen ||
          docEl.msRequestFullscreen;

        if (req) {
          req.call(docEl);
          setIsFullscreen(true);
        }
      } else {
        const exit =
          doc.exitFullscreen ||
          doc.webkitExitFullscreen ||
          doc.mozCancelFullScreen ||
          doc.msExitFullscreen;

        if (exit) {
          exit.call(doc);
          setIsFullscreen(false);
        }
      }
    } catch {
      // Ignore if blocked by browser security
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      const doc = window.document as any;
      setIsFullscreen(
        !!(
          doc.fullscreenElement ||
          doc.webkitFullscreenElement ||
          doc.mozFullScreenElement ||
          doc.msFullscreenElement
        )
      );
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  // Lightweight Audio FX (Synthesized locally, 0 bytes network used)
  const playLaunchSound = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current) {
        const AudioClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Punchy Bass Pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);

      // Sparkle Shimmer
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = "triangle";
      chime.frequency.setValueAtTime(880, now + 0.05);
      chime.frequency.setValueAtTime(1318.51, now + 0.15);
      chimeGain.gain.setValueAtTime(0.25, now + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.start(now + 0.05);
      chime.stop(now + 0.65);
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  // Fast 60FPS Canvas Confetti Explosion
  const triggerBlastExplosion = (originX: number, originY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = ["#FF7A00", "#FFD700", "#FFFFFF", "#FFA500", "#00E5FF"];
    const count = 140; // High impact, ultra-lightweight for mobile CPU
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 14;
      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 5 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.015,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    particlesRef.current = newParticles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const active: Particle[] = [];

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // Natural gravity
        p.vx *= 0.98;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
          active.push(p);
        }
      }

      particlesRef.current = active;
      if (particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animate();
  };

  // Launch Trigger
  const handleLaunch = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLaunching) return;
    setIsLaunching(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    playLaunchSound();
    triggerBlastExplosion(originX, originY);

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([80, 40, 120]);
    }

    setIsLaunched(true);

    // 2-second celebration window for recording before smooth local redirect
    setTimeout(() => {
      router.push("/?launched=true");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#000000] text-white flex flex-col justify-between overflow-hidden select-none font-sans z-50">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* CREATIVE LIGHTWEIGHT STATIC BACKGROUND (Zero CPU/Network Overhead) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle Ambient Studio Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-brand-orange/10 blur-[120px]" />

        {/* Viewfinder Rule-of-Thirds Grid */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-15">
          <div className="border-r border-b border-neutral-800" />
          <div className="border-r border-b border-neutral-800" />
          <div className="border-b border-neutral-800" />
          <div className="border-r border-b border-neutral-800" />
          <div className="border-r border-b border-neutral-800" />
          <div className="border-b border-neutral-800" />
          <div className="border-r border-neutral-800" />
          <div className="border-r border-neutral-800" />
          <div />
        </div>

        {/* Camera Viewfinder Bracket Corners */}
        <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-neutral-700" />
        <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-neutral-700" />
        <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-neutral-700" />
        <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-neutral-700" />

        {/* Static Camera Viewfinder HUD Readouts */}
        <div className="absolute top-14 left-6 right-6 flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-500 opacity-60">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 font-bold">REC ● LIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span>4K PRORES</span>
            <span>•</span>
            <span>60FPS</span>
          </div>
        </div>

        {/* Static Video Editing Track Overlay */}
        <div className="absolute bottom-16 left-6 right-6 opacity-30 flex flex-col gap-1 font-mono text-[8px] text-neutral-500">
          <div className="flex items-center justify-between text-neutral-600 px-1">
            <span>TRACK V1 • INSTANT REELS EDIT</span>
            <span>9:16 VERTICAL</span>
          </div>
          <div className="h-3 rounded bg-neutral-900 border border-neutral-800 flex overflow-hidden p-0.5 gap-1">
            <div className="w-1/3 h-full rounded-sm bg-neutral-800 border-r border-brand-orange/50 flex items-center px-1 text-[7px] text-neutral-400">HOOK</div>
            <div className="w-1/2 h-full rounded-sm bg-neutral-800 border-r border-brand-orange/50 flex items-center px-1 text-[7px] text-neutral-400">DROP</div>
            <div className="w-1/4 h-full rounded-sm bg-neutral-800 flex items-center px-1 text-[7px] text-neutral-400">OUTRO</div>
          </div>
        </div>
      </div>

      {/* Top Header Controls */}
      <header className="relative z-20 px-6 pt-6 flex items-center justify-between max-w-lg mx-auto w-full">
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

        {/* Fullscreen & Audio Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono active:scale-95"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3.5 h-3.5 text-brand-orange" />
                <span className="text-[10px]">Exit Full</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5 text-brand-orange" />
                <span className="text-[10px]">Full Screen</span>
              </>
            )}
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer active:scale-95"
            aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-neutral-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Launch Center Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto w-full py-4">
        {/* Dynamic Status Badge */}
        {!isLaunched ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-300 uppercase">
              OFFICIAL LAUNCH • 2026
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500 mb-6 text-emerald-400 animate-bounce">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase">
              LITWORKS IS NOW LIVE!
            </span>
          </div>
        )}

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

        {/* BOLD LAUNCH BUTTON WITH POP BLAST EFFECT */}
        <div className="w-full max-w-[260px] relative">
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className={`w-full py-4.5 px-8 rounded-full font-extrabold text-sm uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 shadow-2xl relative z-10 active:scale-95 ${
              isLaunching
                ? "bg-brand-orange text-black shadow-[0_0_50px_rgba(255,122,0,0.8)] scale-105"
                : "bg-white hover:bg-neutral-100 text-black shadow-lg"
            }`}
          >
            {isLaunching ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-black" />
                <span>LAUNCHING...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 text-black stroke-[2.5]" />
                <span>LAUNCH</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[10px] text-neutral-500 font-mono mt-4 tracking-wider">
          Tap Full Screen &bull; Tap LAUNCH to record
        </p>
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="relative z-20 px-6 py-4 text-center max-w-md mx-auto w-full border-t border-neutral-900/60">
        <p className="text-[10px] text-neutral-500 font-mono tracking-wider">
          Chennai • Hyderabad • Nizamabad • Mancherial • Adilabad
        </p>
      </footer>
    </div>
  );
}



