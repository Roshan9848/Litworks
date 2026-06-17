"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";

export default function Contact() {
  const phone = "+91 9110797354";
  const email = "litworks.media@gmail.com";
  const location = "Serving Telangana & Andhra Pradesh";
  const whatsappNumber = "+91 9866571801";

  // Clean numbers for links
  const rawPhone = phone.replace(/[^0-9+]/g, "");
  const rawWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=Hi%20LITWORKS%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services.`;

  return (
    <section id="contact" className="relative py-24 bg-black overflow-hidden border-t border-neutral-900">
      
      {/* Background ambient lighting */}
      <div className="absolute left-1/4 top-1/3 w-[300px] h-[300px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-brand-orange font-semibold mb-3"
          >
            Get In Touch
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6"
          >
            Let's Create Something Epic
          </motion.h3>
          <p className="text-neutral-400 font-light max-w-2xl mx-auto text-base">
            Ready to scale your brand or cover your next big moment? Reach out to us directly or fill in the service form above. Our team is ready to deploy.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1: Phone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center group hover:border-brand-orange/20 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-orange/5 flex items-center justify-center text-brand-orange mb-6 border border-brand-orange/10 group-hover:border-brand-orange/30 transition-colors shadow-[0_0_10px_rgba(255,122,0,0.05)]">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 tracking-wide">Call Us</h4>
            <p className="text-neutral-400 font-light text-sm mb-6">{phone}</p>
            <a
              href={`tel:${rawPhone}`}
              className="px-6 py-2.5 rounded-full border border-neutral-800 bg-neutral-950 text-xs font-semibold tracking-widest text-neutral-300 uppercase hover:bg-brand-orange hover:text-black hover:border-brand-orange transition-all duration-300"
            >
              Call Now
            </a>
          </motion.div>

          {/* Card 2: Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center group hover:border-brand-orange/20 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-orange/5 flex items-center justify-center text-brand-orange mb-6 border border-brand-orange/10 group-hover:border-brand-orange/30 transition-colors shadow-[0_0_10px_rgba(255,122,0,0.05)]">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 tracking-wide">Email Us</h4>
            <p className="text-neutral-400 font-light text-sm mb-6">{email}</p>
            <a
              href={`mailto:${email}`}
              className="px-6 py-2.5 rounded-full border border-neutral-800 bg-neutral-950 text-xs font-semibold tracking-widest text-neutral-300 uppercase hover:bg-brand-orange hover:text-black hover:border-brand-orange transition-all duration-300"
            >
              Email Us
            </a>
          </motion.div>

          {/* Card 3: WhatsApp/Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center group hover:border-brand-orange/20 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-orange/5 flex items-center justify-center text-brand-orange mb-6 border border-brand-orange/10 group-hover:border-brand-orange/30 transition-colors shadow-[0_0_10px_rgba(255,122,0,0.05)]">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 tracking-wide">Location</h4>
            <p className="text-neutral-400 font-light text-sm mb-6">{location}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full border border-neutral-800 bg-neutral-950 text-xs font-semibold tracking-widest text-neutral-300 uppercase hover:bg-[#25D366] hover:text-white hover:border-[#25D366] hover:shadow-[0_0_15px_rgba(37,211,102,0.2)] transition-all duration-300 flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Us
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
