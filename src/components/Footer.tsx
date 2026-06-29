"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [phone, setPhone] = useState("+91 9110797354");
  const [email, setEmail] = useState("litworks.media@gmail.com");
  const [location, setLocation] = useState("Serving Telangana & Andhra Pradesh");

  useEffect(() => {
    fetch("/api/website-content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cms && data.cms.contact) {
          const c = data.cms.contact;
          if (c.phone) setPhone(c.phone);
          if (c.email) setEmail(c.email);
          if (c.address) setLocation(c.address);
        }
      })
      .catch((e) => console.error("Failed to load footer CMS data:", e));
  }, []);
  const handleScroll = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-black pt-20 pb-10 border-t border-neutral-900 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute right-[-100px] bottom-[-100px] w-[300px] h-[300px] rounded-full bg-brand-orange/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col - Image Logo Only */}
          <div className="flex flex-col items-start">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleScroll("#home");
              }}
              className="flex items-center mb-6 transition-transform duration-300 hover:scale-105"
            >
              <img
                src="/logo.png"
                alt="LITWORKS Logo"
                className="h-6 sm:h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,122,0,0.5)]"
              />
            </a>
            <p className="text-neutral-400 font-light text-sm leading-relaxed mb-6 max-w-xs">
              "Turning Moments & Brands Into Instant Impact"
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/litworks.media/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-900 flex items-center justify-center text-neutral-400 hover:text-brand-orange hover:border-brand-orange/30 transition-colors shadow-inner"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-900 flex items-center justify-center text-neutral-400 hover:text-brand-orange hover:border-brand-orange/30 transition-colors shadow-inner"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-900 flex items-center justify-center text-neutral-400 hover:text-brand-orange hover:border-brand-orange/30 transition-colors shadow-inner"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 15 15 12 10 9"/></svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-900 flex items-center justify-center text-neutral-400 hover:text-brand-orange hover:border-brand-orange/30 transition-colors shadow-inner"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6 border-l-2 border-brand-orange pl-3">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "#home" },
                { name: "Services", href: "#services" },
                { name: "Why Us", href: "#why-us" },
                { name: "Book Service", href: "#book-service" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScroll(link.href);
                    }}
                    className="text-neutral-400 hover:text-brand-orange text-sm font-light transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Col */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6 border-l-2 border-brand-orange pl-3">
              Our Services
            </h4>
            <ul className="space-y-3">
              {[
                "Instant Reels",
                "Social Media Handling",
                "Performance Marketing",
                "Video Editing",
                "Poster Designing",
                "YouTube Thumbnail Designing",
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScroll("#services");
                    }}
                    className="text-neutral-400 hover:text-brand-orange text-sm font-light transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6 border-l-2 border-brand-orange pl-3">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-neutral-400 text-sm font-light">
                <Phone className="w-4 h-4 mt-0.5 text-brand-orange flex-shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-400 text-sm font-light">
                <Mail className="w-4 h-4 mt-0.5 text-brand-orange flex-shrink-0" />
                <span className="break-all">{email}</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-400 text-sm font-light">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-orange flex-shrink-0" />
                <span>{location}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright info */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500 font-light">
            All rights reserved litworks @2026
          </p>
          <p className="text-xs text-neutral-600 font-light">
            Designed for Instant Digital Impact.
          </p>
        </div>
      </div>
    </footer>
  );
}
