"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const ServiceCard = ({ service, index, onOpenModal }: { service: ServiceItem, index: number, onOpenModal: (s: ServiceItem) => void }) => {
  const Icon = service.icon;
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotateX((yc - y) / 16);
    setRotateY((x - xc) / 16);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const isTilting = rotateX !== 0 || rotateY !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isTilting ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : "none",
        transition: "transform 0.1s ease-out, border-color 0.3s ease, shadow 0.3s ease",
      }}
      className="glass-panel group relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden border border-neutral-900 shadow-lg hover:border-brand-orange/30 hover:shadow-[0_0_40px_-10px_rgba(255,122,0,0.18)]"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-orange/5 group-hover:bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/10 group-hover:border-brand-orange/30 transition-colors shadow-[0_0_10px_rgba(255,122,0,0.05)]">
            <Icon className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold text-white tracking-wide">{service.title}</h4>
        </div>

        <p className="text-neutral-400 font-light text-sm mb-6 leading-relaxed">
          {service.description}
        </p>

        <ul className="space-y-3 mb-8">
          {service.items.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-neutral-300 font-light">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onOpenModal(service)}
        style={{ transform: "translateZ(20px)" }}
        className="w-full py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm font-semibold tracking-wider hover:bg-brand-orange hover:text-black hover:border-brand-orange transition-all duration-300 cursor-pointer shadow-md"
      >
        {service.title === "Instant Reels" ? "Book Service" : "Enquire Now"}
      </button>
    </motion.div>
  );
};

export default function Services() {
  const router = useRouter();
  
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
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Form input states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [requirements, setRequirements] = useState("");

  const handleOpenModal = (service: ServiceItem) => {
    if (service.title === "Instant Reels") {
      router.push("/pricing");
      return;
    }
    setSelectedService(service);
    setModalStep(1);
    setSubmitSuccess(false);
    setAcceptTerms(false);
    setErrorMessage("");
    setName("");
    setPhone("");
    setEmail("");
    setDate("");
    setRequirements("");
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setErrorMessage("Please accept the Terms & Conditions to proceed.");
      return;
    }
    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !requirements.trim()
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const payload = {
      name,
      phone,
      email,
      service: selectedService?.title || "Custom Service",
      notes: `Requirements:\n${requirements}`,
      status: "enquiry",
      dynamicFields: {
        preferredStartDate: date || "Not Specified",
        serviceRequirements: requirements,
        planTitle: selectedService?.title,
      },
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setErrorMessage(resData.error || "Failed to submit enquiry. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
      setIsSubmitting(false);
    } catch (err: any) {
      console.error("Enquiry submission error:", err);
      setErrorMessage(err.message || "Network error. Please try again.");
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

  const showSummaryPreview = name.trim() && phone.trim() && requirements.trim();

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
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              onOpenModal={handleOpenModal}
            />
          ))}
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
                  <h4 className="text-xl font-black text-white">Enquiry Submitted!</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    Thank you! Our team will reach out to you as soon as possible. A confirmation email has been sent to your inbox.
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
                    <form onSubmit={handleSubmitEnquiry} className="space-y-5">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-brand-orange font-bold">
                          Book Service
                        </span>
                        <h4 className="text-lg font-black text-white mt-1">
                          {selectedService.title}
                        </h4>
                        <p className="text-xs text-brand-orange uppercase font-bold tracking-widest mt-1">
                          Custom Quote / Enquiry
                        </p>
                      </div>

                      <div className="h-[1px] bg-neutral-900 w-full" />

                      <div className="space-y-4">
                        {/* Name */}
                        <div>
                          <label htmlFor="service-name" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-brand-orange" />
                            Full Name *
                          </label>
                          <input
                            id="service-name"
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
                          <label htmlFor="service-phone" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-brand-orange" />
                            WhatsApp / Phone *
                          </label>
                          <input
                            id="service-phone"
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
                          <label htmlFor="service-email" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-brand-orange" />
                            Email Address *
                          </label>
                          <input
                            id="service-email"
                            type="email"
                            placeholder="e.g. name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                          />
                        </div>

                        {/* Start Date */}
                        <div>
                          <label htmlFor="service-date" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                            Preferred Start Date (Optional)
                          </label>
                          <input
                            id="service-date"
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
                          <label htmlFor="service-requirements" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
                            Project / Service Requirements *
                          </label>
                          <textarea
                            id="service-requirements"
                            placeholder="Provide details about your project goals, social handles, or guidelines..."
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            required
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors resize-none"
                          />
                        </div>
                      </div>



                      {/* Terms & Conditions Checkbox */}
                      <div className="flex items-start gap-2.5 pt-1">
                        <input
                          type="checkbox"
                          id="services-accept-terms"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          required
                          className="w-4 h-4 rounded border-neutral-850 bg-neutral-950 text-brand-orange focus:ring-brand-orange accent-brand-orange mt-0.5 cursor-pointer"
                        />
                        <label htmlFor="services-accept-terms" className="text-neutral-450 text-[11px] font-light leading-relaxed select-none">
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

                      {errorMessage && (
                        <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/50 text-red-500 text-[11px] font-light text-center">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 rounded-xl bg-brand-orange hover:bg-white text-black font-extrabold text-xs uppercase tracking-widest duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Submitting Enquiry...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Enquiry</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </>
                        )}
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
                      setAcceptTerms(true);
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
