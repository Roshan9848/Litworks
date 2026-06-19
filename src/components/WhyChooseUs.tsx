"use client";

import { motion } from "framer-motion";
import { Users, Lightbulb, Clock, Tag, Film, TrendingUp } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Users,
      title: "100+ Completed Projects",
      description: "With over 100+ successful projects completed across Telangana and AP, our team brings proven creative expertise to every single shoot.",
    },
    {
      icon: Lightbulb,
      title: "Creative Concepts",
      description: "We don't copy templates. We design custom concepts that distinguish your brand in a crowded market.",
    },
    {
      icon: Clock,
      title: "Delivery in Minutes",
      description: "Our streamlined shoot-and-edit workflows ensure your reels and creative assets are delivered in minutes.",
    },
    {
      icon: Tag,
      title: "Affordable Pricing",
      description: "Premium visual assets and high-ROI marketing campaigns priced fairly for businesses of all sizes.",
    },
    {
      icon: Film,
      title: "Cinematic Quality",
      description: "We utilize pro-grade cameras, lighting equipment, and grading techniques to deliver a cinematic finish.",
    },
    {
      icon: TrendingUp,
      title: "Business Growth Focus",
      description: "Every frame we shoot and every ad we run is engineered to capture leads, boost conversions, and build revenue.",
    },
  ];

  return (
    <section id="why-us" className="relative py-24 bg-black overflow-hidden border-t border-neutral-900">
      
      {/* Background radial glow */}
      <div className="absolute left-10 bottom-10 w-[350px] h-[350px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15px" }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-brand-orange font-semibold mb-3"
          >
            Why Choose Us
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15px" }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Setting New Standards for Creative Execution
          </motion.h3>
          <p className="text-neutral-400 font-light max-w-2xl mx-auto text-base">
            We merge stunning cinematic artistry with targeted data strategies to deliver results that grow your brand authority and bottom line.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15px" }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                className="glass-panel group relative p-8 rounded-2xl border border-neutral-900 transition-all duration-300 hover:border-brand-orange/20 hover:shadow-[0_0_30px_rgba(255,122,0,0.1)] hover:-translate-y-1"
              >
                {/* Subtle card glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative z-10 flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-orange/5 group-hover:bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/10 group-hover:border-brand-orange/30 transition-colors shadow-[0_0_10px_rgba(255,122,0,0.05)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2 tracking-wide group-hover:text-brand-orange transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-neutral-400 font-light text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
