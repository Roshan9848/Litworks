"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Send } from "lucide-react";

interface BookingFormValues {
  name: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  service: string;
  notes: string;
  // Instant Reel Fields
  occasion?: string;
  shootArea?: string;
  landmark?: string;
  preferredDate?: string;
  numberOfReels?: string;
  specialRequirements?: string;
  // Social Media Handling
  businessName?: string;
  industry?: string;
  platforms?: string;
  monthlyRequirement?: string;
  // Performance Marketing
  monthlyBudget?: string;
  marketingGoal?: string;
  // Video Editing
  typeOfEditing?: string;
  numberOfVideos?: string;
  deliveryTimeline?: string;
  // Poster Designing
  posterPurpose?: string;
  quantityRequired?: string;
  designNotes?: string;
  // YouTube Thumbnails
  channelName?: string;
  numberOfThumbnails?: string;
  channelCategory?: string;
}

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    defaultValues: {
      state: "",
      city: "",
      service: "",
    },
  });

  const selectedState = watch("state");
  const selectedService = watch("service");

  // Dynamic City options mapping
  const citiesByState: Record<string, string[]> = {
    Telangana: ["Hyderabad", "Karimnagar", "Nizamabad", "Armoor"],
    "Andhra Pradesh": ["Vijayawada", "Visakhapatnam (Vizag)"],
  };

  // Helper check for Instant Reel services
  const isInstantReelSelected = [
    "Instant Reel",
    "Wedding Instant Reel",
    "Birthday Instant Reel",
    "Car Delivery Instant Reel",
    "Event Instant Reel",
  ].includes(selectedService);

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setErrorMessage("");

    // Package dynamic fields according to the selected service to keep payload clean
    const payload: Record<string, any> = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      state: data.state,
      city: data.city,
      service: data.service,
      notes: data.notes,
      dynamicFields: {},
    };

    if (isInstantReelSelected) {
      payload.dynamicFields = {
        occasion: data.occasion,
        shootArea: data.shootArea,
        landmark: data.landmark,
        preferredDate: data.preferredDate,
        numberOfReels: data.numberOfReels,
        specialRequirements: data.specialRequirements,
      };
    } else if (selectedService === "Social Media Handling") {
      payload.dynamicFields = {
        businessName: data.businessName,
        industry: data.industry,
        platformsRequired: data.platforms,
        monthlyRequirement: data.monthlyRequirement,
      };
    } else if (selectedService === "Performance Marketing") {
      payload.dynamicFields = {
        businessName: data.businessName,
        industry: data.industry,
        monthlyBudget: data.monthlyBudget,
        goal: data.marketingGoal,
      };
    } else if (selectedService === "Video Editing") {
      payload.dynamicFields = {
        typeOfEditing: data.typeOfEditing,
        numberOfVideos: data.numberOfVideos,
        deliveryTimeline: data.deliveryTimeline,
      };
    } else if (selectedService === "Poster Designing") {
      payload.dynamicFields = {
        posterPurpose: data.posterPurpose,
        quantityRequired: data.quantityRequired,
        designNotes: data.designNotes,
      };
    } else if (selectedService === "YouTube Thumbnail Designing") {
      payload.dynamicFields = {
        channelName: data.channelName,
        numberOfThumbnails: data.numberOfThumbnails,
        channelCategory: data.channelCategory,
      };
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setSubmitSuccess(true);
        reset();
      } else {
        setErrorMessage(resData.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Booking submit error:", err);
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book-service" className="relative py-24 bg-black overflow-hidden border-t border-neutral-900">
      
      {/* Background ambient lighting */}
      <div className="absolute right-1/4 top-1/4 w-[350px] h-[350px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

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
            Get Started
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            Book Your Service
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-neutral-400 font-light mt-3 max-w-lg mx-auto text-sm sm:text-base"
          >
            Join 100+ brands who trust LITWORKS. Inquiry response and reel delivery in minutes!
          </motion.p>
        </div>

        {/* Booking Form Card */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl relative border border-neutral-900 shadow-2xl">
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Primary Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  {...register("name", { required: "Full Name is required" })}
                  className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border text-white text-sm focus:outline-none transition-colors ${
                    errors.name ? "border-red-500/50 focus:border-red-500" : "border-neutral-800 focus:border-brand-orange/50"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1.5 font-light">{errors.name.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9+() -]{10,15}$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border text-white text-sm focus:outline-none transition-colors ${
                    errors.phone ? "border-red-500/50 focus:border-red-500" : "border-neutral-800 focus:border-brand-orange/50"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1.5 font-light">{errors.phone.message}</p>
                )}
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border text-white text-sm focus:outline-none transition-colors ${
                    errors.email ? "border-red-500/50 focus:border-red-500" : "border-neutral-800 focus:border-brand-orange/50"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 font-light">{errors.email.message}</p>
                )}
              </div>

              {/* State Selector */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                  State *
                </label>
                <select
                  {...register("state", { required: "Please select a state" })}
                  onChange={(e) => {
                    register("state").onChange(e);
                    setValue("city", ""); // Reset city on state change
                  }}
                  className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border text-white text-sm focus:outline-none transition-colors ${
                    errors.state ? "border-red-500/50 focus:border-red-500" : "border-neutral-800 focus:border-brand-orange/50"
                  }`}
                >
                  <option value="" disabled>Select State</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                </select>
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1.5 font-light">{errors.state.message}</p>
                )}
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* City Dropdown (Dynamic) */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                  City *
                </label>
                <select
                  {...register("city", { required: "Please select a city" })}
                  disabled={!selectedState}
                  className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border text-white text-sm focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    errors.city ? "border-red-500/50 focus:border-red-500" : "border-neutral-800 focus:border-brand-orange/50"
                  }`}
                >
                  <option value="" disabled>Select City</option>
                  {selectedState &&
                    citiesByState[selectedState]?.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1.5 font-light">{errors.city.message}</p>
                )}
              </div>

              {/* Service Required */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                  Service Required *
                </label>
                <select
                  {...register("service", { required: "Please select a service" })}
                  className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border text-white text-sm focus:outline-none transition-colors ${
                    errors.service ? "border-red-500/50 focus:border-red-500" : "border-neutral-800 focus:border-brand-orange/50"
                  }`}
                >
                  <option value="" disabled>Select Service</option>
                  <option value="Instant Reel">Instant Reel</option>
                  <option value="Wedding Instant Reel">Wedding Instant Reel</option>
                  <option value="Birthday Instant Reel">Birthday Instant Reel</option>
                  <option value="Car Delivery Instant Reel">Car Delivery Instant Reel</option>
                  <option value="Event Instant Reel">Event Instant Reel</option>
                  <option value="Social Media Handling">Social Media Handling</option>
                  <option value="Performance Marketing">Performance Marketing</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Poster Designing">Poster Designing</option>
                  <option value="YouTube Thumbnail Designing">YouTube Thumbnail Designing</option>
                  <option value="Other">Other</option>
                </select>
                {errors.service && (
                  <p className="text-red-500 text-xs mt-1.5 font-light">{errors.service.message}</p>
                )}
              </div>

            </div>

            {/* DYNAMIC FIELD SECTIONS */}
            <AnimatePresence mode="wait">
              
              {/* Case 1: Instant Reels */}
              {isInstantReelSelected && (
                <motion.div
                  key="instant-reel-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-900/60"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Occasion</label>
                    <input type="text" placeholder="e.g. Wedding, Birthday, Launch" {...register("occasion")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Shoot Area / Locality</label>
                    <input type="text" placeholder="e.g. Madhapur, Gachibowli" {...register("shootArea")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Landmark</label>
                    <input type="text" placeholder="e.g. Near Cyber Towers" {...register("landmark")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Preferred Date</label>
                    <input type="date" {...register("preferredDate")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Number of Reels Required</label>
                    <input type="number" min="1" placeholder="e.g. 3" {...register("numberOfReels")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Special Shoot Requirements</label>
                    <input type="text" placeholder="e.g. Slow motion, drone" {...register("specialRequirements")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                </motion.div>
              )}

              {/* Case 2: Social Media Handling */}
              {selectedService === "Social Media Handling" && (
                <motion.div
                  key="sm-handling-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-900/60"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Business Name</label>
                    <input type="text" placeholder="Enter Business Name" {...register("businessName")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Industry Type</label>
                    <input type="text" placeholder="e.g. Retail, Real Estate, Food" {...register("industry")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Platforms Required</label>
                    <input type="text" placeholder="e.g. Instagram & Facebook" {...register("platforms")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Monthly Reel/Post Requirement</label>
                    <input type="text" placeholder="e.g. 15 Reels + 10 Posts" {...register("monthlyRequirement")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                </motion.div>
              )}

              {/* Case 3: Performance Marketing */}
              {selectedService === "Performance Marketing" && (
                <motion.div
                  key="perf-marketing-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-900/60"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Business Name</label>
                    <input type="text" placeholder="Enter Business Name" {...register("businessName")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Industry Type</label>
                    <input type="text" placeholder="e.g. E-Commerce, Hospitality" {...register("industry")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Monthly Budget (INR)</label>
                    <input type="text" placeholder="e.g. ₹20,000 / month" {...register("monthlyBudget")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Campaign Goal</label>
                    <select {...register("marketingGoal")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50">
                      <option value="Leads">Leads / Inquiry Generation</option>
                      <option value="Sales">Direct Sales / Conversions</option>
                      <option value="Website Traffic">Website Traffic Increase</option>
                      <option value="Brand Awareness">Brand Awareness Expansion</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Case 4: Video Editing */}
              {selectedService === "Video Editing" && (
                <motion.div
                  key="editing-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-900/60"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Type of Video Editing</label>
                    <input type="text" placeholder="e.g. Youtube Video, Reel Cut, Vlog" {...register("typeOfEditing")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Number of Videos</label>
                    <input type="number" min="1" placeholder="e.g. 5" {...register("numberOfVideos")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Required Delivery Timeline</label>
                    <input type="text" placeholder="e.g. Within 24 hours, 3 days" {...register("deliveryTimeline")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                </motion.div>
              )}

              {/* Case 5: Poster Designing */}
              {selectedService === "Poster Designing" && (
                <motion.div
                  key="poster-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-900/60"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Poster Purpose</label>
                    <input type="text" placeholder="e.g. Instagram ad, print, event" {...register("posterPurpose")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Quantity Required</label>
                    <input type="number" min="1" placeholder="e.g. 2" {...register("quantityRequired")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Design Notes / Concept</label>
                    <input type="text" placeholder="e.g. Cyberpunk theme, minimal styling" {...register("designNotes")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                </motion.div>
              )}

              {/* Case 6: YouTube Thumbnail Designing */}
              {selectedService === "YouTube Thumbnail Designing" && (
                <motion.div
                  key="thumbnail-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-900/60"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Channel Name</label>
                    <input type="text" placeholder="e.g. Tech Reviewer" {...register("channelName")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Number of Thumbnails</label>
                    <input type="number" min="1" placeholder="e.g. 10" {...register("numberOfThumbnails")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">Channel Category / Niche</label>
                    <input type="text" placeholder="e.g. Gaming, Finance, Vlog" {...register("channelCategory")} className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-850 text-white text-sm focus:outline-none focus:border-brand-orange/50" />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                Additional Notes
              </label>
              <textarea
                rows={4}
                placeholder="Share any other details here..."
                {...register("notes")}
                className="w-full px-5 py-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white text-sm focus:outline-none focus:border-brand-orange/50 resize-y"
              />
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="text-red-500 text-sm font-medium bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-brand-orange text-black font-bold tracking-wider hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,122,0,0.2)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Submission...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Inquiry
                </>
              )}
            </button>

            {/* Response Time Indicator */}
            <div className="text-center text-[11px] tracking-wider text-neutral-400 font-light flex items-center justify-center gap-2 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              Typically responds to inquiries within minutes!
            </div>

          </form>

          {/* Success Overlay Popup Dialog */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 rounded-3xl bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center text-brand-orange mb-6 shadow-[0_0_20px_rgba(255,122,0,0.15)]">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white tracking-wide mb-3">Inquiry Submitted!</h3>
                  
                  <p className="text-neutral-450 text-sm max-w-sm leading-relaxed mb-8">
                    Thank you for choosing **LITWORKS**. Our team has received your details and will contact you shortly.
                  </p>

                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-8 py-3 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-bold tracking-widest uppercase hover:bg-brand-orange hover:text-black hover:border-brand-orange transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
