"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Zap,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Flame
} from "lucide-react";

export default function MobileLaunchExperiencePage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Web Audio API for cinematic audio synthesis without external files
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

  const startChargingSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(70, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 3.0);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch {
      // Fallback silently
    }
  }, [soundEnabled, initAudio]);

  const stopChargingSound = useCallback(() => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      if (gainRef.current) {
        gainRef.current.disconnect();
        gainRef.current = null;
      }
    } catch {
      // Ignore audio teardown errors
    }
  }, []);

  const playLaunchBoomSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;

      // Deep bass boom synth
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 1.4);

      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);

      // Noise sparkle blast
      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      whiteNoise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start();
    } catch {
      // Ignore
    }
  }, [soundEnabled, initAudio]);

  // Particle fireworks canvas when launch completes
  useEffect(() => {
    if (!isLaunched || !canvasRef.current) return;
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
    const colors = ["#FF7A00", "#FFA133", "#FFD700", "#FF4500", "#FFFFFF", "#FF5500"];

    // Spawn 200 explosion particles
    for (let i = 0; i < 220; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 3;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.48,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.018 + 0.01
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        if (p.alpha > 0) {
          aliveCount++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18; // Gravity
          p.vx *= 0.98;
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 14;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isLaunched]);

  // Press & Hold Logic (Smooth 3.0s duration)
  const handleHoldStart = () => {
    if (isLaunched) return;
    setIsHolding(true);
    startChargingSound();

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(60);
    }

    const startTime = Date.now();
    const duration = 3000; // 3.0 seconds smooth charging time for reel filming

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      // Periodic haptic feedback as energy charges
      if (pct % 20 === 0 && typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(40);
      }

      if (pct >= 100) {
        clearInterval(holdIntervalRef.current!);
        holdIntervalRef.current = null;
        stopChargingSound();
        playLaunchBoomSound();
        setIsLaunched(true);
        setIsHolding(false);

        // Climax haptic pattern
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([100, 50, 150, 50, 400]);
        }

        // Direct smooth redirect to live website home page after dramatic explosion
        setTimeout(() => {
          router.push("/?launched=true");
        }, 1400);
      }
    }, 25);
  };

  const handleHoldEnd = () => {
    if (isLaunched) return;
    setIsHolding(false);
    stopChargingSound();
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    // Drain progress if released early
    setProgress(0);
  };

  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative h-screen w-full bg-black text-white flex flex-col justify-between overflow-hidden select-none touch-none">
      {/* Dynamic Canvas for Launch Particle Shockwave */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-40" />

      {/* Background Ambient Glows & Saffron Sparks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-[#FF7A00]/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-[#FF7A00]/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-[#FF4500]/20 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,122,0,0.08)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />
      </div>

      {/* Flash Shockwave Overlay on Launch */}
      {isLaunched && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF7A00]/30 via-white/20 to-black z-30 pointer-events-none animate-fadeIn" />
      )}

      {/* Top Header Bar */}
      <header className="relative z-20 px-6 pt-6 pb-3 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-black border border-white/15 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(255,122,0,0.3)]">
            <Image
              src="/logo.png"
              alt="LitWorks Logo"
              width={24}
              height={24}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-sm font-black tracking-wider text-white uppercase font-sans">
            LitWorks<span className="text-[#FF7A00]">.</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1 rounded-full bg-neutral-950/90 border border-[#FF7A00]/40 text-[10px] font-mono text-[#FF7A00] font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,122,0,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
            <span>PUNE GANESH UTSAV</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-neutral-950 border border-white/10 text-neutral-400 hover:text-white transition-colors"
            title={soundEnabled ? "Mute sound FX" : "Enable sound FX"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#FF7A00]" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-sm mx-auto w-full">
        {/* Title Headline (Clean, Bold, Zero Instructions) */}
        <div className="mb-8 animate-fadeIn">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-3 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-[#FF7A00]" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-300 uppercase">
              {isLaunched ? "DEPLOYMENT SUCCESSFUL" : "SYSTEM ONLINE // STANDBY"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">
            {isLaunched ? (
              <span className="text-[#FF7A00] animate-pulse">LITWORKS IS LIVE!</span>
            ) : (
              <>
                LAUNCHING <span className="text-[#FF7A00]">LITWORKS</span>
              </>
            )}
          </h1>
          <p className="text-xs text-neutral-400 mt-2 font-mono uppercase tracking-wider">
            Pune Ganesh Utsav | Media Revolution
          </p>
        </div>

        {/* THE CIRCULAR LIGHTNING IGNITION BUTTON */}
        <div className="relative flex items-center justify-center my-2">
          {/* Outer Orbit Glowing Tech Rings */}
          <div
            className={`absolute w-64 h-64 rounded-full border border-[#FF7A00]/20 transition-all duration-700 ${
              isHolding
                ? "scale-110 border-[#FF7A00]/60 animate-spin"
                : "scale-100"
            }`}
          />
          <div className="absolute w-56 h-56 rounded-full border border-dashed border-white/15 animate-[spin_20s_linear_infinite]" />

          {/* SVG Circular Progress Meter */}
          <svg className="w-52 h-52 -rotate-90 drop-shadow-[0_0_25px_rgba(255,122,0,0.3)]">
            <circle
              cx="104"
              cy="104"
              r={radius}
              stroke="#171717"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="104"
              cy="104"
              r={radius}
              stroke="#FF7A00"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-75"
            />
          </svg>

          {/* Inner Interactive Trigger Circle */}
          <div
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onMouseLeave={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            className={`absolute w-36 h-36 rounded-full cursor-pointer flex flex-col items-center justify-center transition-all duration-300 select-none shadow-[0_0_40px_rgba(255,122,0,0.35)] active:scale-95 ${
              isLaunched
                ? "bg-gradient-to-b from-[#FF7A00] to-[#E05300] scale-105 shadow-[0_0_70px_rgba(255,122,0,0.9)]"
                : isHolding
                ? "bg-gradient-to-b from-[#FF7A00] to-[#E05300] scale-95 shadow-[0_0_60px_rgba(255,122,0,0.8)]"
                : "bg-neutral-950 border-2 border-[#FF7A00]/70 hover:border-[#FF7A00]"
            }`}
          >
            {isLaunched ? (
              <>
                <Flame className="w-10 h-10 text-black mb-1 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-wider font-mono text-black">
                  REDIRECTING...
                </span>
              </>
            ) : (
              <>
                <Zap
                  className={`w-9 h-9 mb-1 transition-transform ${
                    isHolding ? "text-black scale-110 animate-pulse" : "text-[#FF7A00]"
                  }`}
                />
                <span
                  className={`text-xs font-black uppercase tracking-wider font-mono ${
                    isHolding ? "text-black text-sm" : "text-white"
                  }`}
                >
                  {isHolding ? `${progress}%` : "HOLD TO"}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    isHolding ? "text-black/80 font-mono" : "text-[#FF7A00]"
                  }`}
                >
                  {isHolding ? "CHARGING" : "LAUNCH"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Live Status Pulse */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-mono text-neutral-400">
          <Radio className={`w-3.5 h-3.5 ${isHolding ? "text-white animate-spin" : "text-[#FF7A00] animate-pulse"}`} />
          <span>{isLaunched ? "INITIALIZING PRODUCTION PIPELINE..." : isHolding ? "CHARGING SATELLITE BROADCAST..." : "READY FOR DIRECT DEPLOYMENT"}</span>
        </div>
      </main>

      {/* Bottom Telemetry HUD Grid */}
      <footer className="relative z-20 px-6 py-4 border-t border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-400">
          <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-white/5 flex items-center justify-between">
            <span className="text-neutral-500">GATEWAY:</span>
            <span className="text-white font-bold">PUNE 5G</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-white/5 flex items-center justify-between">
            <span className="text-neutral-500">SERVERS:</span>
            <span className="text-emerald-400 font-bold">ARMED</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-white/5 flex items-center justify-between">
            <span className="text-neutral-500">PROMO:</span>
            <span className="text-[#FF7A00] font-bold">BAPPA20</span>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-white/5 flex items-center justify-between">
            <span className="text-neutral-500">BROADCAST:</span>
            <span className="text-white font-bold">4K CLOUD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
