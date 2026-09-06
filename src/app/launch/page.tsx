"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Film,
  Camera,
  Sliders,
  Layers,
  Activity
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
  shape: "rect" | "circle" | "star";
}

export default function MobileLaunchExperiencePage() {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recTime, setRecTime] = useState("00:00:26:08");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Fullscreen Toggle Handler
  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request error:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Timecode generator for camera viewfinder
  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      const s = String(d.getSeconds()).padStart(2, "0");
      const ms = String(Math.floor(d.getMilliseconds() / 10)).padStart(2, "0");
      setRecTime(`00:00:${s}:${ms}`);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Initialize Web Audio API for celebratory launch sound
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

  // High-energy celebratory pop sound FX
  const playLaunchPopSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // 1. Initial Punch / Pop Impact
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = "sine";
      popOsc.frequency.setValueAtTime(320, now);
      popOsc.frequency.exponentialRampToValueAtTime(45, now + 0.3);
      popGain.gain.setValueAtTime(0.7, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.4);

      // 2. High Shimmer / Sparkle Tone
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = "triangle";
      chimeOsc.frequency.setValueAtTime(587.33, now + 0.05); // D5
      chimeOsc.frequency.setValueAtTime(880, now + 0.15); // A5
      chimeOsc.frequency.setValueAtTime(1174.66, now + 0.25); // D6
      chimeGain.gain.setValueAtTime(0.3, now + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.05);
      chimeOsc.stop(now + 0.85);
    } catch {
      // Ignore
    }
  }, [soundEnabled, initAudio]);

  // Canvas Resize Handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Particle Animation Loop
  const runParticleAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const activeParticles: Particle[] = [];

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // Gravity
        p.vx *= 0.98; // Air resistance
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;

          if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else {
            // Spark / Star
            ctx.fillRect(-p.size, -1, p.size * 2, 2);
            ctx.fillRect(-1, -p.size, 2, p.size * 2);
          }

          ctx.restore();
          activeParticles.push(p);
        }
      }

      particlesRef.current = activeParticles;

      if (particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();
  };

  // Trigger Pop Blast Particle Explosion
  const triggerBlastExplosion = (originX: number, originY: number) => {
    const colors = [
      "#FF7A00", // LitWorks Brand Orange
      "#FFA500", // Vibrant Orange
      "#FFD700", // Radiant Gold
      "#FFFFFF", // Pure White
      "#FF3E00", // Deep Flare
      "#FFEAA7", // Soft Gold
      "#00E5FF", // Electric Cyan Accent
    ];

    const shapes: ("rect" | "circle" | "star")[] = ["rect", "circle", "star"];
    const newParticles: Particle[] = [];
    const count = 220; // Massive celebration blast

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 16;
      newParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3, // Initial upward lift
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.007 + Math.random() * 0.012,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    particlesRef.current = newParticles;
    runParticleAnimation();
  };

  // Handle 1-Tap Launch Sequence
  const handleLaunch = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLaunching) return;
    setIsLaunching(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    // 1. Play explosive pop blast sound
    playLaunchPopSound();

    // 2. Trigger high-energy particle explosion
    triggerBlastExplosion(originX, originY);

    // 3. Device haptics
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([100, 50, 150]);
    }

    // 4. Update state to show launched banner
    setTimeout(() => {
      setIsLaunched(true);
    }, 200);

    // 5. Cinematic 2.2s transition for recorded video perfection before routing
    setTimeout(() => {
      router.push("/?launched=true");
    }, 2200);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Particle Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* CREATIVE BACKGROUND: CINEMATOGRAPHY & IPHONE SHOOTING / EDITING HUD */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Ambient Dark Orange & Studio Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-orange/10 blur-[130px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-orange/10 blur-[130px]" />

        {/* Viewfinder Rule-of-Thirds Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-10 border border-neutral-700/30">
          <div className="border-r border-b border-neutral-700/40" />
          <div className="border-r border-b border-neutral-700/40" />
          <div className="border-b border-neutral-700/40" />
          <div className="border-r border-b border-neutral-700/40" />
          <div className="border-r border-b border-neutral-700/40" />
          <div className="border-b border-neutral-700/40" />
          <div className="border-r border-neutral-700/40" />
          <div className="border-r border-neutral-700/40" />
          <div />
        </div>

        {/* Camera Viewfinder Bracket Corners */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-neutral-700/60" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-neutral-700/60" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-neutral-700/60" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-neutral-700/60" />

        {/* Center Viewfinder Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-neutral-400" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-neutral-400" />
          <div className="absolute inset-2 rounded-full border border-neutral-400" />
        </div>

        {/* Top Camera Readouts (Shooting Overlay) */}
        <div className="absolute top-16 left-8 right-8 flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-500 opacity-60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 font-bold">REC {recTime}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>4K PRORES LOG</span>
            <span>•</span>
            <span>60 FPS</span>
            <span>•</span>
            <span>9:16 VERTICAL</span>
          </div>
        </div>

        {/* Bottom Video Editing Timeline Track Strips (Editing Overlay) */}
        <div className="absolute bottom-16 left-6 right-6 opacity-30 flex flex-col gap-1 font-mono text-[9px] text-neutral-500">
          <div className="flex items-center justify-between text-[8px] text-neutral-600 mb-1 px-1">
            <span>TRACK V1 • INSTANT REELS EDIT</span>
            <span>TIMELINE 00:00:26</span>
          </div>
          {/* Track 1: Video cuts */}
          <div className="h-4 rounded bg-neutral-900/90 border border-neutral-800 flex overflow-hidden p-0.5 gap-1">
            <div className="w-[30%] h-full rounded-sm bg-neutral-800/80 border-r border-brand-orange/40 flex items-center px-1 text-[7px] text-neutral-400 truncate">CLIP 01 [HOOK]</div>
            <div className="w-[40%] h-full rounded-sm bg-neutral-800/80 border-r border-brand-orange/40 flex items-center px-1 text-[7px] text-neutral-400 truncate">CLIP 02 [DROP]</div>
            <div className="w-[30%] h-full rounded-sm bg-neutral-800/80 flex items-center px-1 text-[7px] text-neutral-400 truncate">CLIP 03 [OUTRO]</div>
          </div>
          {/* Track 2: Audio waveform */}
          <div className="h-3 rounded bg-neutral-950 border border-neutral-900 flex items-center justify-between px-2 text-[7px] text-neutral-600">
            <span>AUDIO A1 (BEAT SYNCED)</span>
            <span className="text-brand-orange/70">|||||l||||||||||l||||</span>
          </div>
        </div>
      </div>

      {/* Clean Top Navbar */}
      <header className="relative z-20 px-6 pt-6 sm:pt-8 flex items-center justify-between max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center shadow-md">
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

        {/* Action Controls: Fullscreen & Sound FX */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            aria-label="Toggle Fullscreen"
            title="Toggle Fullscreen for Screen Recording"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-brand-orange" />
                <span className="hidden sm:inline text-[10px]">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-brand-orange" />
                <span className="hidden sm:inline text-[10px]">Full Screen</span>
              </>
            )}
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label={soundEnabled ? "Mute sound FX" : "Enable sound FX"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-neutral-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto w-full py-8">
        {/* Dynamic Status Badge */}
        <AnimatePresence mode="wait">
          {!isLaunched ? (
            <motion.div
              key="badge-ready"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 mb-6 shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-300 uppercase">
                OFFICIAL LAUNCH • 2026
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="badge-live"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/60 mb-6 text-emerald-400 shadow-xl"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">
                LITWORKS IS NOW LIVE!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

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
          {/* Shockwave Glow Ring when tapped */}
          {isLaunching && (
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-brand-orange pointer-events-none"
            />
          )}

          <motion.button
            onClick={handleLaunch}
            disabled={isLaunching}
            whileHover={!isLaunching ? { scale: 1.04 } : {}}
            whileTap={!isLaunching ? { scale: 0.94 } : {}}
            className={`w-full py-4.5 px-8 rounded-full font-extrabold text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 shadow-2xl relative z-10 ${
              isLaunching
                ? "bg-brand-orange text-black shadow-[0_0_50px_rgba(255,122,0,0.8)]"
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
          </motion.button>
        </div>

        <p className="text-[10px] text-neutral-500 font-mono mt-4 tracking-wider">
          Tap to initiate live launch
        </p>
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="relative z-20 px-6 py-5 text-center max-w-md mx-auto w-full border-t border-neutral-900/60">
        <p className="text-[10px] text-neutral-500 font-mono tracking-wider">
          Chennai • Hyderabad • Nizamabad • Mancherial • Adilabad
        </p>
      </footer>
    </div>
  );
}


