"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Why Us", href: "#why-us" },
    { name: "Book Service", href: "#book-service" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-black/75 backdrop-blur-md border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo on Left - Extra minimal size (30% smaller, perfectly aligned) */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("#home");
            }}
            className="flex items-center transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/logo.png"
              alt="LITWORKS Logo"
              className="h-6 sm:h-7 md:h-8 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(255,122,0,0.3)]"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={`text-xs tracking-widest uppercase font-semibold transition-colors hover:text-brand-orange relative group ${
                  link.name === "Book Service"
                    ? "px-5 py-2.5 rounded-full border border-brand-orange/60 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-black hover:border-brand-orange shadow-[0_0_15px_rgba(255,122,0,0.2)] hover:shadow-[0_0_20px_rgba(255,122,0,0.4)] transition-all duration-300"
                    : "text-neutral-300"
                }`}
              >
                {link.name}
                {link.name !== "Book Service" && (
                  <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-brand-orange transition-all duration-300 group-hover:w-full" />
                )}
              </a>
            ))}
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
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={`text-sm tracking-widest uppercase font-semibold text-center py-2 transition-colors hover:text-brand-orange ${
                  link.name === "Book Service"
                    ? "mt-4 mx-auto w-full max-w-[260px] rounded-full border border-brand-orange/60 bg-brand-orange/10 py-3.5 text-brand-orange text-center hover:bg-brand-orange hover:text-black transition-all shadow-[0_0_15px_rgba(255,122,0,0.15)]"
                    : "text-neutral-300"
                }`}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
