"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to finish before notifying parent
      setTimeout(onComplete, 800);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
        >
          {/* Background Ambient Glow */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-brand-orange/5 blur-3xl animate-pulse" />
          
          <div className="relative flex flex-col items-center max-w-xs px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-48 h-48 mb-6"
            >
              <Image
                src="/logo.png"
                alt="LITWORKS Logo"
                fill
                priority
                className="object-contain filter drop-shadow-[0_0_20px_rgba(255,122,0,0.6)]"
              />
            </motion.div>

            {/* Glowing Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-xl font-bold tracking-widest text-white uppercase mb-2">
                LIT<span className="text-brand-orange">WORKS</span>
              </h2>
              <p className="text-xs tracking-wider text-neutral-400 font-light max-w-[220px] mx-auto leading-relaxed">
                Turning Moments & Brands Into Instant Impact
              </p>
            </motion.div>

            {/* Cinematic loading line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
              className="w-24 h-[2px] bg-gradient-to-r from-transparent via-brand-orange to-transparent mt-8 origin-center"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
