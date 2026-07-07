"use client";

import { useState, useEffect } from "react";
import { Home, Briefcase, Tag, Video, Calendar, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlassyDock() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    // Initial check
    setIsVisible(window.scrollY > 100);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dockLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services", icon: Briefcase },
    { name: "Pricing", href: "/pricing", icon: Tag },
    { name: "Portfolio", href: "/videos", icon: Video },
    { name: "Book Now", href: "/pricing#book-service", icon: Calendar },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    } else if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (pathname === path) {
        e.preventDefault();
        const target = document.querySelector(`#${hash}`);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          exit={{ y: 100, x: "-50%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className="fixed bottom-6 left-1/2 z-40 hidden md:flex items-center gap-4 bg-black/55 backdrop-blur-lg border border-white/10 rounded-full px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] filter drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        >
          {dockLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/pricing" && pathname === "/pricing");
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="relative group p-2.5 rounded-full text-neutral-400 hover:text-brand-orange hover:bg-white/5 transition-all duration-300"
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-brand-orange" : ""}`} />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 origin-bottom bg-neutral-950 text-white font-mono text-[9px] px-2 py-1 rounded border border-neutral-850 tracking-widest uppercase shadow-xl whitespace-nowrap pointer-events-none z-50">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
