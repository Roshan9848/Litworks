"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "What is an Instant Reel?",
      answer: "An Instant Reel is short-form video content shot, compiled, and edited on-site during your event (weddings, birthdays, car deliveries, or business launches). Our team works live to deliver cinematic, post-ready reels within hours, allowing you to publish and share the moments while the buzz is still active.",
    },
    {
      question: "Which cities do you serve?",
      answer: "We currently serve key cities in Telangana (Hyderabad, Karimnagar, Nizamabad, Armoor) and Andhra Pradesh (Vijayawada, Visakhapatnam/Vizag). If you are looking for services in these regions, we deploy our teams directly to your location.",
    },
    {
      question: "Do you handle Instagram pages?",
      answer: "Yes, we handle complete social media page management for Instagram and Facebook. This includes custom content planning, post grid layout designs, graphic asset creation, copy writing, and systematic posting to grow organic engagement.",
    },
    {
      question: "Do you run Meta Ads?",
      answer: "Absolutely. We run highly targeted performance marketing campaigns across Meta (Facebook & Instagram Ads). We specialize in lead generation, sales conversion, website traffic growth, and localized brand awareness campaigns customized to your monthly budget.",
    },
    {
      question: "How fast is delivery?",
      answer: "For our 'Instant' services (like Instant Reels), delivery happens on the same day—often within 2 to 4 hours of the shoot. For larger video editing projects, posters, or monthly management accounts, delivery ranges from 24 to 72 hours based on mutual alignment.",
    },
    {
      question: "How do I book a service?",
      answer: "Simply scroll to our 'Book Service' form, select your state and city, choose the service you need, fill in any additional dynamic details (such as event dates or budget), and submit. Our support team will connect with you via call/WhatsApp shortly to finalize details.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="relative py-24 bg-black overflow-hidden border-t border-neutral-900">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-brand-orange font-semibold mb-3"
          >
            Got Questions?
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            Frequently Asked Queries
          </motion.h3>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="glass-panel rounded-2xl overflow-hidden border border-neutral-900 hover:border-neutral-800 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 text-white focus:outline-none cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-semibold tracking-wide">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 group hover:border-brand-orange hover:text-brand-orange transition-colors ${isOpen ? "border-brand-orange text-brand-orange" : ""}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-sm sm:text-base text-neutral-400 font-light leading-relaxed border-t border-neutral-900/50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
