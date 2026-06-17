"use client";

import { motion } from "framer-motion";

export default function Workflow() {
  const steps = [
    {
      step: "01",
      title: "Submit Inquiry",
      description: "Fill out our booking form. We typically review and respond to all inquiries within minutes to lock in details!",
    },
    {
      step: "02",
      title: "Requirement Discussion",
      description: "Our creative directors will connect with you to align on content goals, shoot locations, and brand identity.",
    },
    {
      step: "03",
      title: "Planning & Scripting",
      description: "We outline custom scripts, draw up shot lists, schedule delivery times, and organize logistics for the shoot day.",
    },
    {
      step: "04",
      title: "Execution",
      description: "Our professional crew deploys to shoot cinematic footage and edit instantly, or launches ads according to setup parameters.",
    },
    {
      step: "05",
      title: "Delivery & Launch",
      description: "We review the visual assets, perform final color correction, and hand over the assets or publish content directly.",
    },
  ];

  return (
    <section id="workflow" className="relative py-24 bg-black overflow-hidden border-t border-neutral-900">
      
      {/* Background ambient lighting */}
      <div className="absolute right-10 top-1/4 w-[300px] h-[300px] rounded-full bg-brand-orange/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-brand-orange font-semibold mb-3"
          >
            How We Work
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Our Production Pipeline
          </motion.h3>
          <p className="text-neutral-400 font-light max-w-2xl mx-auto text-base">
            From the initial creative brainstorm to the final deliverable, our process is fast, transparent, and optimized for execution.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central bar */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-neutral-900 via-brand-orange/40 to-neutral-900 md:-translate-x-1/2" />

          {/* Steps */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={step.step}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* central node marker */}
                  <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-black border-2 border-brand-orange md:-translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(255,122,0,0.5)]">
                    <div className="w-2 h-2 rounded-full bg-brand-orange" />
                  </div>

                  {/* Spacer for layout */}
                  <div className="hidden md:block w-1/2 px-8" />

                  {/* Content card */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                    className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8"
                  >
                    <div className="glass-panel p-6 rounded-2xl relative border border-neutral-900 group hover:border-brand-orange/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,122,0,0.05)]">
                      {/* Step number badge */}
                      <span className="absolute top-4 right-4 text-3xl font-extrabold text-neutral-800 tracking-tight group-hover:text-brand-orange/10 transition-colors">
                        {step.step}
                      </span>
                      <h4 className="text-xl font-bold text-white mb-3 tracking-wide group-hover:text-brand-orange transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-neutral-400 font-light text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
