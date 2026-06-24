"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Loader2, CheckCircle2, User, Phone, Mail, MapPin, 
  Calendar, FileText, BookOpen, ArrowUpRight, Zap, Users, 
  Target, Scissors, Palette
} from "lucide-react";

interface ServiceItem {
  icon: any;
  title: string;
  items: string[];
  description: string;
  tempPrice: number;
}

export default function Services() {
  const services: ServiceItem[] = [
    {
      icon: Zap,
      title: "Instant Reels",
      tempPrice: 1999,
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
      tempPrice: 9999,
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
      tempPrice: 14999,
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
      tempPrice: 2999,
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
      tempPrice: 1499,
      items: [
        "Creative Poster Designing",
        "Social Media Ad Creatives",
        "High-CTR YouTube Thumbnails",
      ],
      description: "Stunning visual assets designed to capture attention and elevate your brand identity.",
    },
  ];

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form input states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [requirements, setRequirements] = useState("");

  const citiesByState: Record<string, string[]> = {
    Telangana: ["Hyderabad", "Karimnagar", "Nizamabad", "Armoor"],
    "Andhra Pradesh": ["Vijayawada", "Visakhapatnam (Vizag)"],
  };

  const handleOpenModal = (service: ServiceItem) => {
    setSelectedService(service);
    setModalStep(1);
    setSubmitSuccess(false);
    setErrorMessage("");
    setName("");
    setPhone("");
    setEmail("");
    setDate("");
    setState("");
    setCity("");
    setArea("");
    setRequirements("");
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !state ||
      !city ||
      !area.trim() ||
      !requirements.trim()
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);
    setModalStep(2);

    const finalPrice = selectedService?.tempPrice || 0;
    const platformFee = Math.round(finalPrice * 0.025);
    const totalAmount = finalPrice + platformFee;

    const payload = {
      name,
      phone,
      email,
      state,
      city,
      service: selectedService?.title || "Custom Service",
      notes: `Area/Locality: ${area}\nRequirements:\n${requirements}`,
      finalPrice: finalPrice,
      dynamicFields: {
        preferredStartDate: date || "Not Specified",
        shootArea: area,
        serviceRequirements: requirements,
        calculatedTotalPrice: `₹${finalPrice.toLocaleString("en-IN")}`,
        planTitle: selectedService?.title,
        bookingDepositPaid: `₹${totalAmount.toLocaleString("en-IN")}`,
      },
    };

    try {
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setErrorMessage(resData.error || "Failed to initiate payment. Please try again.");
        setModalStep(1);
        setIsSubmitting(false);
        return;
      }

      if (resData.mock) {
        setTimeout(() => {
          window.location.href = `/api/payment/verify?order_id=${resData.order_id}`;
        }, 1500);
        return;
      }

      if (typeof window !== "undefined" && (window as any).Cashfree) {
        const cashfree = (window as any).Cashfree({
          mode: resData.environment || "sandbox",
        });
        cashfree.checkout({
          paymentSessionId: resData.payment_session_id,
          redirectTarget: "_self",
        });
      } else {
        throw new Error("Cashfree SDK not loaded in browser.");
      }
    } catch (err: any) {
      console.error("Checkout initiation error:", err);
      setErrorMessage(err.message || "Network error. Please try again.");
      setModalStep(1);
      setIsSubmitting(false);
    }
  };

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const showSummaryPreview = name.trim() && phone.trim() && state && city && area.trim() && requirements.trim();

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
            viewport={{ once: true, margin: "-15px" }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-brand-orange font-semibold mb-3"
          >
            Our Expertise
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15px" }}
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
                viewport={{ once: true, margin: "-15px" }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                className="glass-panel group relative rounded-2xl p-8 flex flex-col justify-between overflow-hidden border border-neutral-900 transition-all duration-300 hover:border-brand-orange/30 hover:shadow-[0_0_40px_-10px_rgba(255,122,0,0.15)] hover:-translate-y-1"
              >
                {/* Decorative border highlight */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div>
                  {/* Icon and Title Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-orange/5 group-hover:bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/10 group-hover:border-brand-orange/30 transition-colors shadow-[0_0_10px_rgba(255,122,0,0.05)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-white tracking-wide">{service.title}</h4>
                  </div>

                  {/* Temporary Price Tag */}
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="text-2xl font-extrabold text-brand-orange tracking-tight">
                      ₹{service.tempPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                      (Starting Price)
                    </span>
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
                  onClick={() => handleOpenModal(service)}
                  className="w-full py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm font-semibold tracking-wider hover:bg-brand-orange hover:text-black hover:border-brand-orange transition-all duration-300 cursor-pointer"
                >
                  Book Service
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* OVERLAY MODAL FORM */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-neutral-900 shadow-2xl relative z-10 bg-neutral-950/95 text-left max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 rounded-full border border-neutral-900 text-neutral-400 hover:text-white hover:border-brand-orange transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-black text-white">Booking Confirmed!</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    We have successfully registered your booking request. Our team will contact you on WhatsApp / Phone shortly!
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer mt-4"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <div>
                  {modalStep === 1 && (
                    <form onSubmit={handleProceedToPayment} className="space-y-5">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-brand-orange font-bold">
                          Book Service
                        </span>
                        <h4 className="text-lg font-black text-white mt-1">
                          {selectedService.title}
                        </h4>
                        <p className="text-xl font-extrabold text-brand-orange mt-0.5">
                          ₹{selectedService.tempPrice.toLocaleString("en-IN")} <span className="text-[9px] text-neutral-500 uppercase font-bold">(Est. Starting Price)</span>
                        </p>
                      </div>

                      <div className="h-[1px] bg-neutral-900 w-full" />

                      <div className="space-y-4">
                        {/* Name */}
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-brand-orange" />
                            Full Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Rahul Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-brand-orange" />
                            WhatsApp / Phone *
                          </label>
                          <input
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={phone}
                            onChange={(e) => phone.length <= 15 && setPhone(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-brand-orange" />
                            Email Address *
                          </label>
                          <input
                            type="email"
                            placeholder="e.g. name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                          />
                        </div>

                        {/* State & City */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                              State *
                            </label>
                            <select
                              value={state}
                              onChange={(e) => {
                                setState(e.target.value);
                                setCity("");
                              }}
                              required
                              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                            >
                              <option value="" disabled>Select State</option>
                              <option value="Telangana">Telangana</option>
                              <option value="Andhra Pradesh">Andhra Pradesh</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                              City *
                            </label>
                            <select
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              required
                              disabled={!state}
                              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors disabled:opacity-30"
                            >
                              <option value="" disabled>Select City</option>
                              {state &&
                                citiesByState[state]?.map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        {/* Area / Locality */}
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                            Area / Locality *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Madhapur, Benz Circle, Armoor Town"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                          />
                        </div>

                        {/* Start Date */}
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                            Preferred Start Date (Optional)
                          </label>
                          <input
                            type="date"
                            min={getTodayDateString()}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            onClick={(e) => {
                              try { e.currentTarget.showPicker(); } catch (err) {}
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange [color-scheme:dark] cursor-pointer"
                          />
                        </div>

                        {/* Requirements / Custom Details */}
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
                            Project / Service Requirements *
                          </label>
                          <textarea
                            placeholder="Provide details about your project goals, social handles, or guidelines..."
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            required
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors resize-none"
                          />
                        </div>
                      </div>

                      {/* Summary Preview */}
                      <AnimatePresence>
                        {showSummaryPreview && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 rounded-2xl bg-brand-orange/5 border border-brand-orange/20 space-y-2.5 text-xs overflow-hidden"
                          >
                            <h5 className="text-[9px] uppercase tracking-widest text-brand-orange font-bold flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              Order Summary
                            </h5>
                            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-neutral-300 text-[11px] font-light">
                              <div>
                                <span className="text-neutral-500 font-bold uppercase text-[9px] block">Location</span>
                                {area}, {city}, {state}
                              </div>
                              <div>
                                <span className="text-neutral-500 font-bold uppercase text-[9px] block">Target Date</span>
                                {date ? date.split("-").reverse().join("/") : "Not Selected"}
                              </div>
                              <div className="col-span-2">
                                <span className="text-neutral-500 font-bold uppercase text-[9px] block">Service</span>
                                {selectedService.title}
                              </div>
                            </div>
                            
                            <div className="h-[1px] bg-brand-orange/15 w-full my-1" />
                            
                            <div className="space-y-1.5 text-[11px] text-neutral-300 font-light">
                              <div className="flex justify-between">
                                <span>Starting Cost:</span>
                                <span className="text-white font-medium">₹{selectedService.tempPrice.toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="flex items-center gap-1">
                                  Platform Fee (2.5%):
                                  <span className="text-[9px] text-neutral-500 font-bold uppercase">(incl. gateway costs)</span>
                                </span>
                                <span className="text-white font-medium">₹{Math.round(selectedService.tempPrice * 0.025).toLocaleString("en-IN")}</span>
                              </div>
                              <div className="h-[1px] bg-neutral-900/50 w-full my-1" />
                              <div className="flex justify-between items-center text-xs font-bold text-white">
                                <span>Total Booking Amount:</span>
                                <span className="text-brand-orange text-glow">
                                  ₹{Math.round(selectedService.tempPrice * 1.025).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {errorMessage && (
                        <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/50 text-red-500 text-[11px] font-light text-center">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3.5 px-4 rounded-xl bg-brand-orange hover:bg-white text-black font-extrabold text-xs uppercase tracking-widest duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                      >
                        <span>Pay ₹{Math.round(selectedService.tempPrice * 1.025).toLocaleString("en-IN")} & Book</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}

                  {modalStep === 2 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                        <Loader2 className="w-8 h-8 animate-spin" />
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-widest text-brand-orange font-bold animate-pulse block">
                          Step 2: Payment Gateway
                        </span>
                        <h4 className="text-lg font-black text-white">Connecting to Cashfree</h4>
                        <p className="text-xs text-neutral-450 font-light leading-relaxed max-w-xs mx-auto">
                          Please wait while we secure your slot and launch the checkout gateway. Do not close this window.
                        </p>
                      </div>

                      {!process.env.NEXT_PUBLIC_CASHFREE_ENV && (
                        <span className="inline-block px-3 py-1 rounded bg-neutral-900 border border-neutral-850 text-[10px] font-mono text-brand-amber animate-pulse">
                          Simulating secure payment gateway redirection...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
