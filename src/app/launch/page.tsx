"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Rocket, Sparkles, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rot: number;
  rotSpeed: number;
}

export default function MobileLaunchExperiencePage() {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [showIosTip, setShowIosTip] = useState(false);

  // Cross-Browser Fullscreen Handler
  const toggleFullscreen = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const doc = window.document as any;
      const docEl = (document.getElementById("launch-container") || document.documentElement) as any;
      const isFs =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;

      // Check if iOS (iPhone/iPad) which blocks standard HTML5 Fullscreen API
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

      if (!isFs) {
        const req =
          docEl.requestFullscreen ||
          docEl.webkitRequestFullscreen ||
          docEl.mozRequestFullScreen ||
          docEl.msRequestFullscreen;

        if (req) {
          req.call(docEl).then(() => {
            setIsFullscreen(true);
          }).catch(() => {
            if (isIOS) setShowIosTip(true);
          });
        } else if (isIOS) {
          setShowIosTip((prev) => !prev);
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
      setShowIosTip(true);
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

  // Simple Synthesized Launch Sound (0 Network Required)
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
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.3);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  // Clean, Simple Pop Blast
  const triggerBlast = (originX: number, originY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = ["#FF7A00", "#FFD700", "#FFFFFF", "#FFA500"];
    const pieces: ConfettiPiece[] = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 12;
      pieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.015 + Math.random() * 0.015,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    let activePieces = pieces;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nextPieces: ConfettiPiece[] = [];

      for (let i = 0; i < activePieces.length; i++) {
        const p = activePieces[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // Gravity
        p.alpha -= p.decay;
        p.rot += p.rotSpeed;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
          nextPieces.push(p);
        }
      }

      activePieces = nextPieces;
      if (activePieces.length > 0) {
        requestAnimationFrame(render);
      }
    };
    render();
  };

  const handleLaunch = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLaunching) return;
    setIsLaunching(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    playLaunchSound();
    triggerBlast(originX, originY);

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([60, 40, 100]);
    }

    // Direct transition after brief celebratory pop
    setTimeout(() => {
      router.push("/?launched=true");
    }, 1200);
  };

  return (
    <div id="launch-container" className="fixed inset-0 w-full h-[100dvh] bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans z-50">
      {/* Lightweight Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* iOS Fullscreen Tip Modal/Banner */}
      {showIosTip && (
        <div className="fixed top-20 left-4 right-4 z-50 max-w-sm mx-auto p-4 rounded-xl bg-neutral-900 border border-brand-orange/40 text-left shadow-2xl animate-fade-in">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-brand-orange uppercase font-mono tracking-wider">
              iPhone Full Screen Tip
            </span>
            <button
              onClick={() => setShowIosTip(false)}
              className="text-neutral-400 hover:text-white text-xs font-mono px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed font-light mb-2">
            Apple blocks JavaScript fullscreen on iPhones. To record with <strong>zero browser bars</strong>:
          </p>
          <ol className="text-[11px] text-neutral-400 space-y-1 list-decimal list-inside font-mono">
            <li>Tap Safari <strong>Share</strong> (box with up arrow)</li>
            <li>Tap <strong>&ldquo;Add to Home Screen&rdquo;</strong></li>
            <li>Open the LitWorks icon for 100% full screen</li>
          </ol>
        </div>
      )}

      {/* Top Header */}
      <header className="relative z-20 px-6 pt-6 flex items-center justify-between max-w-md mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="LitWorks"
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

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            aria-label="Fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="w-3.5 h-3.5 text-brand-orange" />
            ) : (
              <Maximize className="w-3.5 h-3.5 text-brand-orange" />
            )}
            <span className="text-[10px]">{isFullscreen ? "Exit" : "Full Screen"}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Sound toggle"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-neutral-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>
        </div>
      </header>

      {/* Center Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-300 uppercase">
            {isLaunching ? "LITWORKS IS LIVE" : "OFFICIAL LAUNCH • 2026"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
          Cinematic Media. <br />
          <span className="text-neutral-400 font-normal">Delivered Instantly.</span>
        </h1>

        <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto mb-10 leading-relaxed">
          High-impact Instant Reels, social media management, and performance marketing.
        </p>

        <div className="w-full max-w-[240px]">
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className={`w-full py-4 px-8 rounded-full font-extrabold text-sm uppercase tracking-widest transition-all duration-150 cursor-pointer flex items-center justify-center gap-2.5 shadow-xl active:scale-95 ${
              isLaunching
                ? "bg-brand-orange text-black shadow-[0_0_40px_rgba(255,122,0,0.8)] scale-105"
                : "bg-white hover:bg-neutral-100 text-black"
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

        <p className="text-[10px] text-neutral-600 font-mono mt-4 tracking-wider">
          Tap Full Screen &bull; Tap LAUNCH to record
        </p>
      </main>

      {/* Footer */}
      <footer className="relative z-20 px-6 py-4 text-center max-w-md mx-auto w-full border-t border-neutral-900/60">
        <p className="text-[10px] text-neutral-500 font-mono tracking-wider">
          Chennai • Hyderabad • Nizamabad • Mancherial • Adilabad
        </p>
      </footer>
    </div>
  );
}




