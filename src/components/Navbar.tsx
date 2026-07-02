"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Portfolio", href: "/videos" },
    { name: "Book Now", href: "/pricing#book-service" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    setIsOpen(false);
    
    // Smooth scroll if target is on current page
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (pathname === path) {
        e.preventDefault();
        const target = document.querySelector(`#${hash}`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else if (href === "/") {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const [announcement, setAnnouncement] = useState<{ text: string; active: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/website-content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cms && data.cms.announcement) {
          setAnnouncement(data.cms.announcement);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <>
      {announcement?.active && (
        <div className="fixed top-0 left-0 right-0 h-9 bg-brand-orange text-black flex items-center overflow-hidden z-50 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest select-none shadow-lg">
          <div className="animate-marquee py-2 whitespace-nowrap">
            <span className="mx-6">{announcement.text}</span>
            <span className="mx-6">{announcement.text}</span>
            <span className="mx-6">{announcement.text}</span>
            <span className="mx-6">{announcement.text}</span>
            <span className="mx-6">{announcement.text}</span>
            <span className="mx-6">{announcement.text}</span>
            <span className="mx-6">{announcement.text}</span>
            <span className="mx-6">{announcement.text}</span>
          </div>
        </div>
      )}
      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          announcement?.active ? "top-9" : "top-0"
        } ${
          isScrolled
            ? "bg-black/75 backdrop-blur-md border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo on Left - Extra minimal size (30% smaller, perfectly aligned) */}
          <Link
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="flex items-center transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/logo.png"
              alt="LITWORKS Logo"
              className="h-6 sm:h-7 md:h-8 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(255,122,0,0.3)]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href.startsWith("/pricing") && pathname === "/pricing");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-xs tracking-widest uppercase font-semibold transition-colors hover:text-brand-orange relative group ${
                    link.name === "Book Now"
                      ? "px-5 py-2.5 rounded-full border border-brand-orange/60 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-black hover:border-brand-orange shadow-[0_0_15px_rgba(255,122,0,0.2)] hover:shadow-[0_0_20px_rgba(255,122,0,0.4)] transition-all duration-300"
                      : isActive 
                        ? "text-brand-orange" 
                        : "text-neutral-300"
                  }`}
                >
                  {link.name}
                  {link.name !== "Book Now" && (
                    <span className={`absolute left-0 bottom-[-4px] h-[2px] bg-brand-orange transition-all duration-300 group-hover:w-full ${
                      isActive ? "w-full" : "w-0"
                    }`} />
                  )}
                </Link>
              );
            })}

            {/* Instagram Header Link */}
            <a
              href="https://www.instagram.com/litworks.media/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-brand-orange transition-colors flex items-center justify-center p-2 rounded-full border border-neutral-900 bg-neutral-950/50 hover:border-brand-orange/30 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              aria-label="Instagram Link"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-brand-orange p-2 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[70px] z-30 md:hidden bg-black/95 backdrop-blur-lg border-b border-neutral-900 py-8 px-6 shadow-2xl flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-sm tracking-widest uppercase font-semibold text-center py-2 transition-colors hover:text-brand-orange ${
                  link.name === "Book Now"
                    ? "mt-4 mx-auto w-full max-w-[260px] rounded-full border border-brand-orange/60 bg-brand-orange/10 py-3.5 text-brand-orange text-center hover:bg-brand-orange hover:text-black transition-all shadow-[0_0_15px_rgba(255,122,0,0.15)]"
                    : pathname === link.href 
                      ? "text-brand-orange" 
                      : "text-neutral-300"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Instagram Link */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-6 border-t border-neutral-900/60">
              <a
                href="https://www.instagram.com/litworks.media/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-brand-orange transition-colors flex items-center justify-center p-3 rounded-full border border-neutral-900 bg-neutral-950/50 hover:border-brand-orange/30 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                aria-label="Instagram Link"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
