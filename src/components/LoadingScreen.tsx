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
          
          <div className="relative flex flex-col items-center justify-center">
            {/* Custom SVG path outline drawing box loader */}
            <svg
              width="180"
              height="180"
              viewBox="0 0 100 100"
              className="overflow-visible"
            >
              {/* Outer drawing path box */}
              <motion.rect
                x="5"
                y="5"
                width="90"
                height="90"
                rx="20"
                fill="none"
                stroke="url(#orangeGradient)"
                strokeWidth="2.5"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 2.0,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
              <defs>
                <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7A00" />
                  <stop offset="100%" stopColor="#FFC700" />
                </linearGradient>
              </defs>
            </svg>

            {/* Centered Litworks logo appearing after delay */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
              className="absolute w-24 h-24"
            >
              <Image
                src="/logo.png"
                alt="LITWORKS Logo"
                fill
                priority
                className="object-contain filter drop-shadow-[0_0_20px_rgba(255,122,0,0.6)]"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
