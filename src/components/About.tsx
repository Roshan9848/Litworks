"use client";

import { motion } from "framer-motion";
import { Film, TrendingUp, Sparkles } from "lucide-react";

export default function About() {
  const cards = [
    {
      icon: Film,
      title: "Cinematic Vision",
      description: "We bring high-end production quality to short-form content. Every instant reel is shot and edited to feel like a mini-movie.",
    },
    {
      icon: TrendingUp,
      title: "Impact & Growth",
      description: "We don't just create content; we build assets. Our marketing campaigns and social media management drive direct business growth.",
    },
    {
      icon: Sparkles,
      title: "Instant Impact",
      description: "In today's fast-paced digital landscape, speed is key. We deliver premium creative services quickly so you can capitalise on trends.",
    },
  ];

  return (
    <section id="about" className="relative py-24 bg-black overflow-hidden border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-brand-orange font-semibold mb-3"
          >
            Who We Are
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Pioneering the Future of Digital Expression
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-neutral-400 font-light leading-relaxed text-base sm:text-lg"
          >
            With over 100+ successful projects completed, LITWORKS is a premier creative media and marketing agency specializing in Instant Reels, social media management, performance marketing, video editing, and design services for businesses and individuals. We turn raw moments and brands into instant digital impact.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6 border border-brand-orange/20 shadow-[0_0_15px_rgba(255,122,0,0.1)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3 tracking-wide">{card.title}</h4>
                <p className="text-neutral-400 font-light text-sm leading-relaxed">{card.description}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
