"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  Sparkles,
  ShieldCheck,
  Radio,
  Share2,
  RotateCcw,
  CheckCircle2,
  Flame,
  ArrowRight,
  Volume2,
  VolumeX
} from "lucide-react";

export default function MobileLaunchExperiencePage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Web Audio API for cinematic sound FX without external assets
  const initAudio = useCallback(() => {
    if (typeof window === "undefined" || !soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 3);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 3);

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

      // Bass boom synth
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.3);

      // Noise sparkle blast
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

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
    const colors = ["#FF7A00", "#FFA133", "#FFD700", "#FF4500", "#FFFFFF", "#FF3B00"];

    // Spawn 160 explosion particles
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 2;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008
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
          p.vy += 0.15; // Gravity
          p.vx *= 0.98;
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

      if (aliveCount > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isLaunched]);

  // Press & Hold Logic
  const handleHoldStart = () => {
    if (isLaunched) return;
    setIsHolding(true);
    startChargingSound();

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(60);
    }

    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds to charge to 100%

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      // Light haptic pulse as charge builds up
      if (pct % 25 === 0 && typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(40);
      }

      if (pct >= 100) {
        clearInterval(holdIntervalRef.current!);
        holdIntervalRef.current = null;
        stopChargingSound();
        playLaunchBoomSound();
        setIsLaunched(true);
        setIsHolding(false);

        // Big celebration haptic pattern
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([100, 50, 150, 50, 300]);
        }
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
    // Quickly drain progress if released early
    setProgress(0);
  };

  const handleResetForRetake = () => {
    setIsLaunched(false);
    setProgress(0);
    setIsHolding(false);
    stopChargingSound();
  };

  const handleShare = async () => {
    const shareData = {
      title: "LitWorks Media is Live!",
      text: "🚀 LitWorks Media is officially LIVE! Launched at Pune Ganesh Utsav 2026. Use code BAPPA20 for 20% off Instant Reels packages.",
      url: "https://litworks.media"
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between overflow-hidden select-none touch-none">
      {/* Dynamic Canvas for Launch Fireworks */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-40" />

      {/* Background Ambient Glows & Saffron Sparks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF7A00]/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF4500]/20 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,122,0,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      </div>

      {/* Top HUD Status Bar */}
      <header className="relative z-20 px-6 pt-6 pb-2 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLaunched ? "bg-emerald-400" : "bg-[#FF7A00]"} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLaunched ? "bg-emerald-500" : "bg-[#FF7A00]"}`} />
          </div>
          <span className="text-[11px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
            {isLaunched ? "BROADCAST LIVE" : "TELEMETRY ARMED"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title={soundEnabled ? "Mute sound FX" : "Enable sound FX"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#FF7A00]" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <div className="px-3 py-1 rounded-full bg-neutral-900/90 border border-[#FF7A00]/30 text-[10px] font-mono text-[#FF7A00] font-bold">
            PUNE // GANESH UTSAV
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto w-full py-4">
        {!isLaunched ? (
          /* STATE 1: PRE-LAUNCH / ARMED SCREEN */
          <div className="w-full flex flex-col items-center animate-fadeIn">
            {/* Logo and Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span className="text-xs font-semibold tracking-wider text-neutral-300 uppercase">
                Official Production Deployment
              </span>
            </div>

            <div className="relative w-20 h-20 mb-4 rounded-2xl bg-black border border-white/15 p-3 flex items-center justify-center shadow-[0_0_40px_rgba(255,122,0,0.25)]">
              <Image
                src="/logo.png"
                alt="LitWorks Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2 leading-none">
              LitWorks <span className="text-[#FF7A00]">Media</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-xs mb-8 leading-relaxed font-sans">
              With the auspicious blessings of <span className="text-white font-bold">Lord Ganesha</span>, tap & hold the ignition beacon to deploy the live platform.
            </p>

            {/* THE CIRCULAR HOLD-TO-LAUNCH TRIGGER */}
            <div className="relative flex items-center justify-center mb-8">
              {/* Outer Radar Rings */}
              <div className={`absolute w-56 h-56 rounded-full border border-[#FF7A00]/20 transition-all duration-700 ${isHolding ? "scale-110 border-[#FF7A00]/50 animate-spin" : "scale-100"}`} />
              <div className="absolute w-48 h-48 rounded-full border border-dashed border-neutral-800 animate-[spin_16s_linear_infinite]" />

              {/* SVG Progress Circle */}
              <svg className="w-44 h-44 -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke="#1a1a1a"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke="#FF7A00"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-75"
                />
              </svg>

              {/* Center Trigger Button */}
              <div
                onMouseDown={handleHoldStart}
                onMouseUp={handleHoldEnd}
                onMouseLeave={handleHoldEnd}
                onTouchStart={handleHoldStart}
                onTouchEnd={handleHoldEnd}
                className={`absolute w-32 h-32 rounded-full cursor-pointer flex flex-col items-center justify-center transition-all duration-300 select-none shadow-[0_0_35px_rgba(255,122,0,0.3)] active:scale-95 ${
                  isHolding
                    ? "bg-gradient-to-b from-[#FF7A00] to-[#E05300] scale-95 shadow-[0_0_55px_rgba(255,122,0,0.7)]"
                    : "bg-neutral-950 border-2 border-[#FF7A00]/60 hover:border-[#FF7A00]"
                }`}
              >
                <Zap className={`w-8 h-8 mb-1 transition-colors ${isHolding ? "text-black animate-pulse" : "text-[#FF7A00]"}`} />
                <span className={`text-[11px] font-black uppercase tracking-wider font-mono ${isHolding ? "text-black" : "text-white"}`}>
                  {isHolding ? `${progress}%` : "HOLD TO"}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isHolding ? "text-black/80" : "text-[#FF7A00]"}`}>
                  {isHolding ? "CHARGING" : "LAUNCH"}
                </span>
              </div>
            </div>

            {/* Instructions Bar */}
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
              <Radio className="w-3.5 h-3.5 text-[#FF7A00] animate-pulse" />
              <span>Press & hold for 2.4s to broadcast live</span>
            </div>
          </div>
        ) : (
          /* STATE 2: POST-LAUNCH SUCCESS CELEBRATION */
          <div className="w-full flex flex-col items-center animate-scaleIn">
            <div className="w-20 h-20 rounded-full bg-[#FF7A00]/20 border-2 border-[#FF7A00] flex items-center justify-center mb-5 shadow-[0_0_50px_rgba(255,122,0,0.6)]">
              <Flame className="w-10 h-10 text-[#FF7A00] animate-bounce" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold font-mono uppercase mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Broadcast Confirmed: We Are Live</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2 leading-tight">
              LITWORKS IS <span className="text-[#FF7A00]">LIVE!</span>
            </h1>

            <p className="text-sm font-semibold text-[#FFA133] mb-3">
              ॐ गं गणपतये नमः | GANPATI BAPPA MORYA! 🌺
            </p>

            <p className="text-xs text-neutral-400 max-w-xs mb-6 leading-relaxed">
              India’s fastest Instant Reels production agency is now accepting booking orders across all categories.
            </p>

            {/* Launch Offer Promo Banner */}
            <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#FF7A00]/20 via-black to-[#FF7A00]/20 border border-[#FF7A00]/40 mb-6 shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF7A00] font-bold block mb-1">
                Ganesh Utsav Launch Special
              </span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black font-mono text-white tracking-wider">
                  CODE: BAPPA20
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#FF7A00] text-black uppercase">
                  Flat 20% OFF
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3">
              <Link
                href="/"
                className="w-full py-4 px-6 rounded-2xl bg-[#FF7A00] hover:bg-white text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(255,122,0,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Live Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleShare}
                className="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#FF7A00]" />
                <span>{copied ? "Link Copied to Clipboard!" : "Share Launch Reel Link"}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Footer Info & Retake Reset */}
      <footer className="relative z-20 px-6 py-4 border-t border-white/5 bg-black/60 backdrop-blur-md flex items-center justify-between text-[11px] font-mono text-neutral-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
          <span>LITWORKS MEDIA © 2026</span>
        </div>

        {isLaunched && (
          <button
            onClick={handleResetForRetake}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
            title="Reset to record another reel take"
          >
            <RotateCcw className="w-3 h-3 text-[#FF7A00]" />
            <span>Retake</span>
          </button>
        )}
      </footer>
    </div>
  );
}
