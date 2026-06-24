"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function Testimonials() {
  const defaultTestimonials = [
    {
      name: "Rahul Verma",
      role: "Groom",
      location: "Hyderabad",
      rating: 5,
      comment: "LITWORKS delivered our wedding reel within 2 hours of the event! The cinematic quality and quick sync-to-music was absolute magic.",
    },
    {
      name: "Sowmya Rao",
      role: "Founder, Bloom Fashion",
      location: "Vijayawada",
      rating: 5,
      comment: "Their social media management has transformed our brand online. Elegant, premium posts and systematic posting has doubled our reach.",
    },
    {
      name: "Karan Kalyan",
      role: "Auto Enthusiast",
      location: "Visakhapatnam",
      rating: 5,
      comment: "The reel they shot for my car delivery got over 150k views on Instagram. It looks like a high-budget commercial. Highly recommend!",
    },
    {
      name: "Venkatesh Prasad",
      role: "Managing Director, SV Builders",
      location: "Karimnagar",
      rating: 5,
      comment: "Their Meta Ads campaign brought in 60+ high-quality real estate leads in under two weeks. Exceptional performance marketing skills.",
    },
    {
      name: "Anjali Reddy",
      role: "Event Curator",
      location: "Nizamabad",
      rating: 5,
      comment: "Having them cover our corporate launch was the best decision. The live edit team delivered reels on-the-spot while the event was ongoing.",
    },
    {
      name: "Dr. Srinivas",
      role: "Pediatrician & YouTuber",
      location: "Armoor",
      rating: 5,
      comment: "Their YouTube thumbnail designs and video editing service is elite. My click-through rates increased from 4% to 11% in a month.",
    },
  ];

  const [dynamicTestimonials, setDynamicTestimonials] = useState(defaultTestimonials);
  const [heading, setHeading] = useState("Loved by Brands & Individuals");
  const [subheading, setSubheading] = useState("Testimonials");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/website-content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cms && data.cms.testimonials) {
          if (data.cms.testimonials.heading) setHeading(data.cms.testimonials.heading);
          if (data.cms.testimonials.subheading) setSubheading(data.cms.testimonials.subheading);
          if (data.cms.testimonials.items && data.cms.testimonials.items.length > 0) {
            setDynamicTestimonials(data.cms.testimonials.items);
          }
        }
      })
      .catch((e) => console.error("Failed to load dynamic testimonials:", e));
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? dynamicTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === dynamicTestimonials.length - 1 ? 0 : prev + 1));
  };

  // Auto slide in background
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [dynamicTestimonials]);

  return (
    <section id="testimonials" className="relative py-24 bg-black overflow-hidden border-t border-neutral-900">
      {/* Background orange light */}
      <div className="absolute left-1/3 top-1/2 w-[350px] h-[350px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-widest text-brand-orange font-semibold mb-3"
            >
              {subheading}
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
            >
              {heading}
            </motion.h3>
          </div>
          
          {/* Slide Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center text-white hover:border-brand-orange hover:text-brand-orange hover:shadow-[0_0_15px_rgba(255,122,0,0.15)] transition-all cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center text-white hover:border-brand-orange hover:text-brand-orange hover:shadow-[0_0_15px_rgba(255,122,0,0.15)] transition-all cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((offset) => {
              if (dynamicTestimonials.length === 0) return null;
              const targetIndex = (activeIndex + offset) % dynamicTestimonials.length;
              const testimonial = dynamicTestimonials[targetIndex];
              return (
                <motion.div
                  key={`${testimonial.name}-${offset}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="glass-panel p-8 rounded-2xl flex flex-col justify-between h-[280px] border border-neutral-900 group hover:border-brand-orange/20 transition-all duration-300"
                >
                  <div>
                    {/* Stars & Quote */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-brand-orange text-brand-orange" />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 text-neutral-800 group-hover:text-brand-orange/10 transition-colors" />
                    </div>

                    <p className="text-neutral-300 font-light text-sm italic leading-relaxed mb-6">
                      "{testimonial.comment}"
                    </p>
                  </div>

                  {/* Profile info */}
                  <div className="flex items-center gap-4 border-t border-neutral-900 pt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-orange to-neutral-800 flex items-center justify-center font-bold text-black text-sm shadow-[0_0_10px_rgba(255,122,0,0.15)]">
                      {testimonial.name ? testimonial.name.split(" ").map(n => n[0]).join("") : "U"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{testimonial.name}</h4>
                      <p className="text-xs text-neutral-500 font-light">
                        {testimonial.role} &bull; <span className="text-brand-orange/80">{testimonial.location}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2.5 mt-12">
            {dynamicTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === i ? "w-8 bg-brand-orange" : "w-2 bg-neutral-800"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
