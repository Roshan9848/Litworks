"use client";

import { motion } from "framer-motion";
import { Zap, Users, Target, Scissors, Palette } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Zap,
      title: "Instant Reels",
      items: [
        "Wedding Instant Reels",
        "Birthday Instant Reels",
        "Car Delivery Instant Reels",
        "Event Instant Reels",
        "Business Promotion Reels",
      ],
      description: "Cinematic, high-energy reels shot and edited on the spot, ready for immediate publication.",
    },
    {
      icon: Users,
      title: "Social Media Handling",
      items: [
        "Instagram Management",
        "Facebook Management",
        "Content Planning & Grid Design",
        "Scheduling & Automated Posting",
      ],
      description: "End-to-end management of your social media profiles to grow engagement and page aesthetic.",
    },
    {
      icon: Target,
      title: "Performance Marketing",
      items: [
        "Meta Ads (Insta & FB)",
        "Hyper-targeted Lead Generation",
        "Website Traffic Campaigns",
        "Brand Awareness Expansion",
      ],
      description: "Data-driven advertising campaigns focused on maximizing ROI and generating qualified leads.",
    },
    {
      icon: Scissors,
      title: "Editing Services",
      items: [
        "Dynamic Reels Editing",
        "Long-form Video Editing",
        "Professional Color Grading & SFX",
      ],
      description: "Transform your raw footage into cinematic masterpieces with our high-end editing suite.",
    },
    {
      icon: Palette,
      title: "Design Services",
      items: [
        "Creative Poster Designing",
        "Social Media Ad Creatives",
        "High-CTR YouTube Thumbnails",
      ],
      description: "Stunning visual assets designed to capture attention and elevate your brand identity.",
    },
  ];

  const handleScrollToForm = () => {
    const target = document.querySelector("#book-service");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="relative py-24 bg-black overflow-hidden border-t border-neutral-900">
      
      {/* Background glow overlay */}
      <div className="absolute right-0 top-1/3 w-[300px] h-[300px] rounded-full bg-brand-orange/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-brand-orange font-semibold mb-3"
          >
            Our Expertise
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Digital Services Built for Instant Impact
          </motion.h3>
          <p className="text-neutral-400 font-light leading-relaxed max-w-2xl mx-auto text-base">
            From short-form cinematic reels to scalable paid advertising campaigns, we build and manage everything your brand needs to capture attention and scale.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                className="glass-panel group relative rounded-2xl p-8 flex flex-col justify-between overflow-hidden border border-neutral-900 transition-all duration-300 hover:border-brand-orange/30 hover:shadow-[0_0_40px_-10px_rgba(255,122,0,0.15)] hover:-translate-y-1"
              >
                {/* Decorative border highlight */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div>
                  {/* Icon and Title Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-orange/5 group-hover:bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/10 group-hover:border-brand-orange/30 transition-colors shadow-[0_0_10px_rgba(255,122,0,0.05)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-white tracking-wide">{service.title}</h4>
                  </div>

                  <p className="text-neutral-400 font-light text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Service Items List */}
                  <ul className="space-y-3 mb-8">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-neutral-300 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA */}
                <button
                  onClick={handleScrollToForm}
                  className="w-full py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm font-semibold tracking-wider hover:bg-brand-orange hover:text-black hover:border-brand-orange transition-all duration-300 cursor-pointer"
                >
                  Book Service
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
