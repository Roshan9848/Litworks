"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Send, Calendar, Phone, Mail, User, BookOpen, X } from "lucide-react";

interface BookingFormValues {
  name: string;
  phone: string;
  email: string;
  service: string;
  preferredDate?: string;
  eventType: string;
  customEventType?: string;
  notes: string;
  acceptTerms: boolean;
}

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service: "",
      preferredDate: "",
      eventType: "",
      customEventType: "",
      notes: "",
      acceptTerms: false,
    },
  });

  const eventTypeVal = watch("eventType");

  // Listen for custom pricing select events
  useEffect(() => {
    const handleSelectPlan = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { service, notes } = customEvent.detail;
      if (service) {
        setValue("service", service);
      }
      if (notes) {
        setValue("notes", notes);
      }
    };

    window.addEventListener("select-pricing-plan", handleSelectPlan);
    return () => {
      window.removeEventListener("select-pricing-plan", handleSelectPlan);
    };
  }, [setValue]);

  // Helper to get today's date formatted as YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setErrorMessage("");

    const finalEventType = data.eventType === "Other" ? data.customEventType : data.eventType;

    const payload = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      service: data.service,
      notes: `Event Type: ${finalEventType}\nAdditional Notes: ${data.notes}`,
      dynamicFields: {
        preferredDate: data.preferredDate || "Not Specified",
        eventType: finalEventType,
      },
    };

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
      {/* Background glow overlay */}
      <div className="absolute right-1/4 top-1/4 w-[350px] h-[350px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-brand-orange font-bold mb-3"
          >
            Get Started
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            QUICK BOOKING PORTAL
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-neutral-400 font-light mt-3 max-w-md mx-auto text-sm"
          >
            No long questionnaires. Fill out the 4 key fields below, and our editors will lock in your slot immediately!
          </motion.p>
        </div>

        {/* Form Card (Glossy Glassmorphism) */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl relative border border-neutral-900 shadow-2xl">
          
          <AnimatePresence mode="wait">
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 text-center space-y-6 max-w-md mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,122,0,0.2)] animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black text-white">Booking Confirmed!</h4>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                  We have received your request. Our team will review the details and contact you via WhatsApp / Phone in a few minutes to confirm timing and shoots!
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-2.5 rounded-full border border-neutral-850 bg-neutral-950 text-neutral-300 hover:text-white hover:border-brand-orange text-xs font-bold tracking-widest uppercase transition-all cursor-pointer"
                >
                  Book Another Shoot
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-orange" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sneha Reddy"
                      {...register("name", { required: "Full name is required" })}
                      className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950 border text-white text-xs focus:outline-none transition-colors ${
                        errors.name ? "border-red-500/50 focus:border-red-500" : "border-neutral-850 focus:border-brand-orange"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-[10px] mt-1.5 font-light">{errors.name.message}</p>
                    )}
                  </div>

                  {/* WhatsApp/Phone */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand-orange" />
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 98665XXXXX"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9+() -]{10,15}$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                      className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950 border text-white text-xs focus:outline-none transition-colors ${
                        errors.phone ? "border-red-500/50 focus:border-red-500" : "border-neutral-850 focus:border-brand-orange"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-[10px] mt-1.5 font-light">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Service Option Selector */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
                      Service Required *
                    </label>
                    <select
                      {...register("service", { required: "Please select a service" })}
                      className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950 border text-white text-xs focus:outline-none transition-colors ${
                        errors.service ? "border-red-500/50 focus:border-red-500" : "border-neutral-850 focus:border-brand-orange"
                      }`}
                    >
                      <option value="" disabled>Select Service Option</option>
                      <option value="Instant Reel">Instant Reel (Hourly Plan)</option>
                      <option value="Half Day Instant Reel">Instant Reel (Half Day Plan)</option>
                      <option value="Wedding Instant Reel">Wedding Instant Reel</option>
                      <option value="Birthday Instant Reel">Birthday Instant Reel</option>
                      <option value="Car Delivery Instant Reel">Car Delivery Instant Reel</option>
                      <option value="Event Highlights Reel">Event Highlights Reel</option>
                      <option value="Social Media Handling">Social Media Handling</option>
                      <option value="Performance Marketing">Performance Marketing (Meta Ads)</option>
                      <option value="Video Editing">Professional Video Editing</option>
                      <option value="Poster Designing">Poster / Banner Design</option>
                      <option value="YouTube Thumbnail Designing">YouTube Thumbnail Designing</option>
                      <option value="Other">Other / Custom Requirement</option>
                    </select>
                    {errors.service && (
                      <p className="text-red-500 text-[10px] mt-1.5 font-light">{errors.service.message}</p>
                    )}
                  </div>

                  {/* Event/Shoot Date (Same day allowed) */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                      Preferred Date (Same day ok)
                    </label>
                    <input
                      type="date"
                      min={getTodayDateString()}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch (err) {}
                      }}
                      {...register("preferredDate")}
                      className="w-full px-5 py-3.5 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange [color-scheme:dark] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email (Required) */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-orange" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      {...register("email", {
                        required: "Email address is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950 border text-white text-xs focus:outline-none transition-colors ${
                        errors.email ? "border-red-500/50 focus:border-red-500" : "border-neutral-850 focus:border-brand-orange"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-[10px] mt-1.5 font-light">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Type of Event Selector */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
                      Type of Event / Occasion *
                    </label>
                    <select
                      {...register("eventType", { required: "Please select an event type" })}
                      className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950 border text-white text-xs focus:outline-none transition-colors ${
                        errors.eventType ? "border-red-500/50 focus:border-red-500" : "border-neutral-850 focus:border-brand-orange"
                      }`}
                    >
                      <option value="" disabled>Select Event Type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Car Delivery">Car Delivery</option>
                      <option value="Birthday">Birthday</option>
                      <option value="House Warming">House Warming</option>
                      <option value="Shop Opening">Shop Opening</option>
                      <option value="Other">Other (Specify below)</option>
                    </select>
                    {errors.eventType && (
                      <p className="text-red-500 text-[10px] mt-1.5 font-light">{errors.eventType.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Custom Event Type Input */}
                  {eventTypeVal === "Other" && (
                    <div className="animate-fadeIn">
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
                        Specify Event Type *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Corporate Event, Anniversary, Baby Shower"
                        {...register("customEventType", { required: "Event type specification is required when 'Other' is selected" })}
                        className={`w-full px-5 py-3.5 rounded-xl bg-neutral-950 border text-white text-xs focus:outline-none transition-colors ${
                          errors.customEventType ? "border-red-500/50 focus:border-red-500" : "border-neutral-850 focus:border-brand-orange"
                        }`}
                      />
                      {errors.customEventType && (
                        <p className="text-red-500 text-[10px] mt-1.5 font-light">{errors.customEventType.message}</p>
                      )}
                    </div>
                  )}

                  {/* Requirements Textbox */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">
                      Brief description of your requirements / Location details
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us what you are planning (e.g. Location: Madhapur, Occasion: Wedding Reception, Special requests: Drone shots, 3 reels needed)..."
                      {...register("notes")}
                      className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange resize-none"
                    />
                  </div>
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="booking-accept-terms"
                    {...register("acceptTerms", { required: "You must accept the Terms & Conditions to proceed" })}
                    className="w-4 h-4 rounded border-neutral-850 bg-neutral-950 text-brand-orange focus:ring-brand-orange accent-brand-orange mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="booking-accept-terms" className="text-neutral-450 text-[11px] font-light leading-relaxed select-none">
                    I accept the{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="underline text-brand-orange hover:text-white transition-colors cursor-pointer font-medium"
                    >
                      Terms & Conditions
                    </button>{" "}
                    *
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-[10px] mt-1 font-light">{errors.acceptTerms.message}</p>
                )}

                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/50 text-red-500 text-xs font-light text-center">
                    {errorMessage}
                  </div>
                )}

                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 rounded-full bg-brand-orange hover:bg-white text-black font-extrabold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,122,0,0.2)] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Book Now
                      </>
                    )}
                  </button>
                </div>

                {/* Sub-text pulsing response guarantee */}
                <div className="text-[10px] text-neutral-400 tracking-wider font-light flex items-center justify-center gap-2 mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                  Guarantee: Responding and booking confirmation within minutes!
                </div>

              </form>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* TERMS & CONDITIONS MODAL OVERLAY */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTermsModal(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-neutral-900 shadow-2xl relative z-10 bg-neutral-950/95 text-left max-h-[80vh] overflow-y-auto no-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowTermsModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full border border-neutral-900 text-neutral-400 hover:text-white hover:border-brand-orange transition-colors cursor-pointer"
                aria-label="Close Terms modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <span className="text-[9px] uppercase tracking-widest text-brand-orange font-bold block">LITWORKS Legal</span>
                <h4 className="text-lg font-black text-white uppercase tracking-wider">Terms & Conditions</h4>
                
                <div className="h-[1px] bg-neutral-900 w-full" />

                <div className="space-y-4 text-xs text-neutral-350 leading-relaxed font-light font-sans max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
                  <div>
                    <h5 className="font-bold text-white mb-1">1. Service Scope</h5>
                    <p>"LITWORKS" refers to LITWORKS Creative Media & Marketing Agency. "Client" refers to any individual or business booking or inquiring about services.</p>
                  </div>

                  <div>
                    <h5 className="font-bold text-white mb-1">2. Booking & Cancellation Policy</h5>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>No Deposits:</strong> LITWORKS does not collect booking deposits. All transaction amounts paid represent booking payments for the packages selected.</li>
                      <li><strong>Cancellation Within 24 Hours of Booking:</strong> If the Client cancels a booked service package within 24 hours of booking, a 30% cancellation fee will be deducted from the payment, and the remaining 70% will be refunded.</li>
                      <li><strong>No Refunds After 24 Hours:</strong> Cancellations made more than 24 hours after the booking timestamp are strictly non-refundable.</li>
                      <li><strong>Late Cancellations (Within 12 Hours of Event):</strong> If a shoot or event is cancelled or rescheduled less than 12 hours before the scheduled start time, the booking is strictly non-refundable, and additional late cancellation/displacement fees may apply.</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-white mb-1">3. Onsite Access & Client Cooperation</h5>
                    <p>The Client is responsible for securing all venue permissions, permissions for photography/videography, and gate passes. LITWORKS is not liable for delayed shoots resulting from venue access delays.</p>
                  </div>

                  <div>
                    <h5 className="font-bold text-white mb-1">4. Media Rights & Portfolio Usage</h5>
                    <p>LITWORKS retains copyright ownership of all captured media. Upon full payment, the Client receives non-exclusive rights to use the final delivered edits for personal or promotional purposes. LITWORKS reserves the right to showcase final delivered media in its agency portfolio, website showcase, and social media channels.</p>
                  </div>

                  <div>
                    <h5 className="font-bold text-white mb-1">5. Limitation of Liability</h5>
                    <p>In the case of severe weather, equipment malfunction, or force majeure, LITWORKS' liability is limited strictly to a refund of the amount paid by the Client (minus any non-refundable cancellation fees if applicable).</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setValue("acceptTerms", true);
                      setShowTermsModal(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-white text-black font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Accept and Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
