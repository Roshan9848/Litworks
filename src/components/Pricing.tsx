"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, ArrowUpRight, X, Loader2, CheckCircle2, Phone, User, Calendar, MapPin, Clock, FileText, Search, CreditCard, ChevronLeft, Info, Mail, BookOpen } from "lucide-react";

interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features: string[];
  serviceType: string;
  isBestseller?: boolean;
}

const LOCATION_DATABASE = [
  // Hyderabad
  "Madhapur, Hyderabad, Telangana",
  "Gachibowli, Hyderabad, Telangana",
  "Banjara Hills, Hyderabad, Telangana",
  "Jubilee Hills, Hyderabad, Telangana",
  "Kondapur, Hyderabad, Telangana",
  "Kukatpally, Hyderabad, Telangana",
  "Begumpet, Hyderabad, Telangana",
  "Secunderabad, Hyderabad, Telangana",
  "Hitec City, Hyderabad, Telangana",
  "Ameerpet, Hyderabad, Telangana",
  "Dilsukhnagar, Hyderabad, Telangana",
  // Karimnagar
  "Karimnagar Town, Telangana",
  "Kothirampur, Karimnagar, Telangana",
  "Mukarampura, Karimnagar, Telangana",
  // Nizamabad & Armoor
  "Nizamabad Town, Telangana",
  "Armoor Town, Nizamabad, Telangana",
  "Armoor Road, Nizamabad, Telangana",
  "Perkit, Armoor, Telangana",
  // Vijayawada
  "Vijayawada Central, Andhra Pradesh",
  "Benz Circle, Vijayawada, Andhra Pradesh",
  "One Town, Vijayawada, Andhra Pradesh",
  "Gannavaram, Vijayawada, Andhra Pradesh",
  // Visakhapatnam
  "Vizag Beach Road, Visakhapatnam, Andhra Pradesh",
  "Gajuwaka, Visakhapatnam, Andhra Pradesh",
  "MVP Colony, Visakhapatnam, Andhra Pradesh",
  "Muralinagar, Visakhapatnam, Andhra Pradesh",
];

const basicPlans: PricingPlan[] = [
  {
    title: "Hourly Plan",
    price: "₹1,999",
    description: "Perfect for people who want a single, fast, high quality reel.",
    serviceType: "Instant Reel",
    features: [
      "Upto 1 Hour Shoot time",
      "1 Edited Reel Delivered (upto 60 seconds)",
      "5 Complementary Pictures",
      "Trained and Certified Reel Maker",
      "Shot on Latest iPhones",
      "LITWORKS Branding Included",
    ],
  },
  {
    title: "Half Day Plan",
    price: "₹4,999",
    description: "Quick, high quality coverage for events & socials delivered fast.",
    serviceType: "Instant Reel",
    isBestseller: true,
    features: [
      "Upto 3 hours Shoot time",
      "2 Edited Reels Delivered (each upto 60 seconds)",
      "Trained and Certified Reel Maker",
      "Raw footage access",
      "Shot on latest iPhones",
      "LITWORKS Branding Included",
    ],
  },
  {
    title: "Custom Plan",
    price: "Custom",
    description: "Need a tailor-made shoot or multi-day coverage? Request details.",
    serviceType: "Custom Plan",
    features: [
      "Flexible shoot hours",
      "Tailored reels & editing style",
      "No upfront payment required",
      "Custom quote shared via link later",
    ],
  },
];

const weddingPlans: PricingPlan[] = [
  {
    title: "Single Event",
    price: "₹12,499",
    description: "Perfect for small functions & highlights.",
    serviceType: "Wedding Instant Reel",
    features: [
      "1 event covered",
      "3 Edited Reels delivered (each upto 60 seconds)",
      "Up to 2 Reel-Makers onsite",
      "Shot on latest iPhones",
      "Complementary pictures",
      "Raw footage included",
      "LITWORKS Branding included",
      "Please provide an SD card to receive raw content",
    ],
  },
  {
    title: "Three Events",
    price: "₹34,999",
    description: "Perfect for small functions & highlights.",
    serviceType: "Wedding Instant Reel",
    features: [
      "3 events covered",
      "10 Edited Reels delivered (each upto 60 seconds)",
      "Up to 2 Reel-Makers onsite",
      "Shot on latest iPhones",
      "Complementary pictures",
      "Raw footage included",
      "LITWORKS Branding included",
      "Please provide an SD card to receive raw content",
    ],
  },
  {
    title: "Four Events",
    price: "₹44,999",
    description: "Perfect for small functions & highlights.",
    serviceType: "Wedding Instant Reel",
    isBestseller: true,
    features: [
      "4 events covered",
      "15 Edited Reels delivered (each upto 60 seconds)",
      "Up to 2 Reel-Makers onsite",
      "Shot on latest iPhones",
      "Complementary pictures",
      "Raw footage included",
      "LITWORKS Branding included",
      "Please provide an SD card to receive raw content",
    ],
  },
  {
    title: "Six Events",
    price: "₹69,999",
    description: "Perfect for small functions & highlights.",
    serviceType: "Wedding Instant Reel",
    features: [
      "6 events covered",
      "25 Edited Reels delivered (each upto 60 seconds)",
      "Up to 2 Reel-Makers onsite",
      "Dedicated Content Curator",
      "Shot on latest iPhones",
      "Complementary pictures",
      "Raw footage included",
      "LITWORKS Branding included",
      "Please provide an SD card to receive raw content",
    ],
  },
];

export default function Pricing() {
  const [activeTab, setActiveTab] = useState<"basic" | "wedding">("basic");
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [dynamicBasicPlans, setDynamicBasicPlans] = useState<PricingPlan[]>(basicPlans);
  const [dynamicWeddingPlans, setDynamicWeddingPlans] = useState<PricingPlan[]>(weddingPlans);
  const [citiesByState, setCitiesByState] = useState<Record<string, string[]>>({
    Telangana: ["Hyderabad", "Karimnagar", "Nizamabad", "Armoor"],
    "Andhra Pradesh": ["Vijayawada", "Visakhapatnam (Vizag)"],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const packageId = params.get("packageId");
      if (packageId) {
        fetch(`/api/website-content?packageId=${packageId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.package) {
              const p = data.package;
              const formattedPlan = {
                title: p.title,
                price: `₹${p.price.toLocaleString("en-IN")}`,
                description: p.description,
                serviceType: p.serviceType,
                features: p.features,
              };
              setSelectedPlan(formattedPlan);
              setModalStep(1);
            }
          })
          .catch((err) => console.error("Error loading custom proposal package:", err));
      }
    }
  }, []);

  useEffect(() => {
    fetch("/api/website-content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.packages) {
            const basicMapped = data.packages.basic
              .filter((p: any) => !p.title.toLowerCase().includes("add on"))
              .map((p: any) => ({
                title: p.title,
                price: `₹${p.price.toLocaleString("en-IN")}`,
                description: p.description,
                serviceType: p.serviceType,
                isBestseller: p.isBestseller,
                features: p.features
              }));

            basicMapped.push({
              title: "Custom Plan",
              price: "Custom",
              description: "Need a tailor-made shoot or multi-day coverage? Request details.",
              serviceType: "Custom Plan",
              features: [
                "Flexible shoot hours",
                "Tailored reels & editing style",
                "No upfront payment required",
                "Custom quote shared via link later"
              ]
            });

            const weddingMapped = data.packages.wedding.map((p: any) => ({
              title: p.title,
              price: `₹${p.price.toLocaleString("en-IN")}`,
              description: p.description,
              serviceType: p.serviceType,
              isBestseller: p.isBestseller,
              features: p.features
            }));
            if (basicMapped.length > 0) setDynamicBasicPlans(basicMapped);
            if (weddingMapped.length > 0) setDynamicWeddingPlans(weddingMapped);
          }
          if (data.cms && data.cms.locations && data.cms.locations.states) {
            const newMapping: Record<string, string[]> = {};
            data.cms.locations.states.forEach((s: any) => {
              if (s.name) {
                newMapping[s.name] = s.cities || [];
              }
            });
            if (Object.keys(newMapping).length > 0) {
              setCitiesByState(newMapping);
            }
          }
        }
      })
      .catch((e) => console.error("Failed to load dynamic pricing packages:", e));
  }, []);
  
  // Modal booking workflow steps
  const [modalStep, setModalStep] = useState<1 | 2>(1); // 1 = Details, 2 = Payment QR
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Form input states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  
  // Location states
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  
  // New input states for email and event type
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("");
  const [customEventType, setCustomEventType] = useState("");
  
  // Timing slot, add-ons and payment
  const [timeSlot, setTimeSlot] = useState("");
  const [addExtraHour, setAddExtraHour] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenModal = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setModalStep(1);
    setSubmitSuccess(false);
    setAcceptTerms(false);
    setErrorMessage("");
    setName("");
    setPhone("");
    setEmail("");
    setEventType("");
    setCustomEventType("");
    setDate("");
    setState("");
    setCity("");
    setArea("");
    setSearchLocation("");
    setLocationSuggestions([]);
    setShowSuggestions(false);
    setIsLocationVerified(false);
    setTimeSlot("");
    setAddExtraHour(false);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  const getNumericPrice = (priceStr: string) => {
    const val = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
    return isNaN(val) ? 0 : val;
  };

  const getCalculatedPrice = () => {
    if (!selectedPlan) return 0;
    const base = getNumericPrice(selectedPlan.price);
    return addExtraHour ? base + 899 : base;
  };

  const handleLocationChange = (val: string) => {
    setSearchLocation(val);
    setIsLocationVerified(false);

    if (val.trim().length >= 1) {
      const filtered = LOCATION_DATABASE.filter((item) =>
        item.toLowerCase().includes(val.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchLocation(suggestion);
    setShowSuggestions(false);
    setIsLocationVerified(true);
  };

  const getTimeSlotsForPlan = () => {
    if (!selectedPlan) return [];
    
    const isHourly = selectedPlan.title.toLowerCase().includes("hourly") || selectedPlan.title.toLowerCase().includes("add on");
    
    if (isHourly) {
      return [
        "9:00 AM - 10:00 AM",
        "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM",
        "12:00 PM - 1:00 PM",
        "2:00 PM - 3:00 PM",
        "3:00 PM - 4:00 PM",
        "4:00 PM - 5:00 PM",
        "5:00 PM - 6:00 PM",
        "6:00 PM - 7:00 PM",
        "7:00 PM - 8:00 PM",
        "8:00 PM - 9:00 PM",
        "9:00 PM - 10:00 PM",
        "10:00 PM - 11:00 PM",
        "11:00 PM - 11:59 PM",
      ];
    } else {
      return [
        "Morning Slot (9 AM - 12 PM)",
        "Afternoon Slot (12 PM - 3 PM)",
        "Evening Slot (3 PM - 6 PM)",
        "Night Slot (6 PM - 9 PM)",
        "Late Night Slot (9 PM - 11:59 PM)",
        "Full Day Shoot (10 AM - 11:59 PM)",
      ];
    }
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setErrorMessage("Please accept the Terms & Conditions to proceed.");
      return;
    }
    const isCustomEventValid = eventType !== "Other" || customEventType.trim() !== "";
    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !state ||
      !city ||
      !area.trim() ||
      !eventType ||
      !isCustomEventValid ||
      !timeSlot
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);
    setModalStep(2); // Go to Payment step

    const finalEventOccasion = eventType === "Other" ? customEventType : eventType;
    const finalPrice = getCalculatedPrice();
    const platformFee = Math.round(finalPrice * 0.025);
    const totalAmount = finalPrice + platformFee;

    const payload = {
      name,
      phone,
      email,
      state,
      city,
      service: selectedPlan?.serviceType || "Instant Reel",
      notes: `Selected Plan: ${activeTab === "basic" ? "Basic" : "Wedding"} - ${selectedPlan?.title} (${selectedPlan?.price})\nArea/Locality: ${area}\nEvent Type/Occasion: ${finalEventOccasion}`,
      finalPrice: finalPrice,
      dynamicFields: {
        preferredDate: date || "Not Specified",
        timeSlot: timeSlot,
        shootArea: area,
        eventType: finalEventOccasion,
        extraHourRequested: addExtraHour ? "Yes (+₹899)" : "No",
        calculatedTotalPrice: `₹${finalPrice.toLocaleString("en-IN")}`,
        planTitle: selectedPlan?.title,
      },
    };
    if (selectedPlan?.title === "Custom Plan") {
      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            amount: 0,
            paymentStatus: "custom_pending",
          }),
        });

        const resData = await response.json();

        if (!response.ok || !resData.success) {
          setErrorMessage(resData.error || "Failed to submit booking request. Please try again.");
          setModalStep(1);
          setIsSubmitting(false);
          return;
        }

        setSubmitSuccess(true);
        setIsSubmitting(false);
        return;
      } catch (err: any) {
        console.error("Custom booking save error:", err);
        setErrorMessage(err.message || "Network error. Please try again.");
        setModalStep(1);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setErrorMessage(resData.error || "Failed to initiate payment. Please try again.");
        setModalStep(1); // Go back to details
        setIsSubmitting(false);
        return;
      }

      // If mock mode is active, simulate a short delay and redirect to verify endpoint
      if (resData.mock) {
        setTimeout(() => {
          window.location.href = `/api/payment/verify?order_id=${resData.order_id}`;
        }, 1500);
        return;
      }

      // Live/Sandbox Checkout initialization
      if (typeof window !== "undefined" && (window as any).Cashfree) {
        const cashfree = (window as any).Cashfree({
          mode: resData.environment || "sandbox",
        });
        cashfree.checkout({
          paymentSessionId: resData.payment_session_id,
          redirectTarget: "_self", // Redirects current tab
        });
      } else {
        throw new Error("Cashfree SDK not loaded in browser.");
      }
    } catch (err: any) {
      console.error("Checkout initiation error:", err);
      setErrorMessage(err.message || "Network error. Please try again.");
      setModalStep(1); // Go back to details
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

  const plans = activeTab === "basic" ? dynamicBasicPlans : dynamicWeddingPlans;
  const showSummaryPreview = name.trim() && phone.trim() && state && city && area.trim() && timeSlot;

  return (
    <section id="pricing" className="py-24 bg-black text-white border-t border-neutral-900 overflow-hidden relative">
      {/* Glow background accent */}
      <div className="absolute right-1/4 top-1/4 w-[350px] h-[350px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Header Labels */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-orange font-bold mb-3 inline-block">
            PRICING
          </span>
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            Pick Your Plan. Book Instantly.
          </h3>
          <p className="text-neutral-450 font-light text-sm sm:text-base">
            From a quick hour shoot to a full wedding package - we've got you covered.
          </p>
        </div>

        {/* Tab Toggle Switch (Dark carbon glossy theme) */}
        <div className="flex justify-center mb-16">
          <div className="flex p-1 rounded-full bg-neutral-950 border border-neutral-900 shadow-2xl">
            <button
              onClick={() => setActiveTab("basic")}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "basic"
                  ? "bg-brand-orange text-black font-extrabold shadow-[0_0_15px_rgba(255,122,0,0.3)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Basic Packages
            </button>
            <button
              onClick={() => setActiveTab("wedding")}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "wedding"
                  ? "bg-brand-orange text-black font-extrabold shadow-[0_0_15px_rgba(255,122,0,0.3)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Wedding Packages
            </button>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div 
          className={`grid grid-cols-1 gap-8 items-stretch justify-center mx-auto ${
            activeTab === "basic" 
              ? "md:grid-cols-3 max-w-5xl" 
              : "md:grid-cols-2 lg:grid-cols-4 max-w-7xl"
          }`}
        >
          <AnimatePresence mode="wait">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="glass-panel group relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-neutral-900 hover:border-brand-orange/30 hover:shadow-[0_0_30px_rgba(255,122,0,0.1)] transition-all duration-300 h-full min-h-[520px]"
              >
                {/* Accent glow line on top of card */}
                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div>
                  {/* Bestseller Badge */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-brand-orange font-bold">
                      {plan.title}
                    </span>
                    {plan.isBestseller && (
                      <span className="text-[9px] uppercase tracking-widest bg-brand-orange/15 border border-brand-orange/35 text-brand-orange font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 fill-current" /> Bestseller
                      </span>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-bold uppercase">
                      (Incl. GST)
                    </span>
                  </div>

                  {/* Plan Description */}
                  <p className="text-xs text-neutral-450 font-light mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Plan Select Button with Glossy Arrow */}
                  <button
                    onClick={() => handleOpenModal(plan)}
                    className="group/btn w-full py-3.5 px-4 rounded-xl bg-neutral-950 border border-neutral-850 hover:bg-brand-orange hover:text-black hover:border-brand-orange text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    Select this plan
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>

                  {/* Divider line */}
                  <div className="h-[1px] bg-neutral-900 w-full mb-6 mt-6" />

                  {/* Checklist */}
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-4">
                    What's included
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-xs text-neutral-300 font-light leading-tight">
                        <div className="w-4.5 h-4.5 rounded-full bg-brand-orange/5 border border-brand-orange/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-brand-orange" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* OVERLAY GLASSMORPHIC MODAL FORM WITH INTEGRATED UPI QR FLOW */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
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
                  <h4 className="text-xl font-black text-white">Slot Booking Confirmed!</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    We have successfully registered your booking request. Our creators will connect with you on WhatsApp / Phone shortly!
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
                  {/* STEP 1: Details Entry */}
                  {modalStep === 1 && (
                    <form onSubmit={handleProceedToPayment} className="space-y-5">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-brand-orange font-bold">
                          Book Instantly
                        </span>
                        <h4 className="text-lg font-black text-white mt-1">
                          {selectedPlan.title}
                        </h4>
                        <p className="text-xl font-extrabold text-brand-orange mt-0.5">
                          ₹{getCalculatedPrice().toLocaleString("en-IN")} <span className="text-[9px] text-neutral-500 uppercase font-bold">(Incl. GST)</span>
                        </p>
                      </div>

                      <div className="h-[1px] bg-neutral-900 w-full" />

                      {/* Form fields */}
                      <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                          <label htmlFor="pricing-name" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-brand-orange" />
                            Full Name *
                          </label>
                          <input
                            id="pricing-name"
                            type="text"
                            placeholder="e.g. Rahul Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                          />
                        </div>

                        {/* WhatsApp/Phone */}
                        <div>
                          <label htmlFor="pricing-phone" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-brand-orange" />
                            WhatsApp / Phone *
                          </label>
                          <input
                            id="pricing-phone"
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={phone}
                            onChange={(e) => phone.length <= 15 && setPhone(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                          />
                        </div>

                        {/* Email Address */}
                        <div>
                          <label htmlFor="pricing-email" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-brand-orange" />
                            Email Address *
                          </label>
                          <input
                            id="pricing-email"
                            type="email"
                            placeholder="e.g. name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                          />
                        </div>

                        {/* Type of Event */}
                        <div>
                          <label htmlFor="pricing-event-type" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
                            Type of Event / Occasion *
                          </label>
                          <select
                            id="pricing-event-type"
                            value={eventType}
                            onChange={(e) => {
                              setEventType(e.target.value);
                              if (e.target.value !== "Other") {
                                setCustomEventType("");
                              }
                            }}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                          >
                            <option value="" disabled>Select Event Type</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Car Delivery">Car Delivery</option>
                            <option value="Birthday">Birthday</option>
                            <option value="House Warming">House Warming</option>
                            <option value="Shop Opening">Shop Opening</option>
                            <option value="Other">Other (Specify below)</option>
                          </select>
                        </div>

                        {/* Custom Event Type Input */}
                        {eventType === "Other" && (
                          <div className="animate-fadeIn">
                            <label htmlFor="pricing-custom-event-type" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
                              Specify Event Type *
                            </label>
                            <input
                              id="pricing-custom-event-type"
                              type="text"
                              placeholder="e.g. Corporate Event, Anniversary"
                              value={customEventType}
                              onChange={(e) => setCustomEventType(e.target.value)}
                              required
                              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                            />
                          </div>
                        )}

                        {/* State & City (Location info at top of location section) */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="pricing-state" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                              State *
                            </label>
                            <select
                              id="pricing-state"
                              value={state}
                              onChange={(e) => {
                                setState(e.target.value);
                                setCity(""); // reset city
                              }}
                              required
                              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                            >
                              <option value="" disabled>Select State</option>
                               {Object.keys(citiesByState).map((st) => (
                                 <option key={st} value={st}>
                                   {st}
                                 </option>
                               ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="pricing-city" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                              City *
                            </label>
                            <select
                              id="pricing-city"
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

                        {/* Manual Area / Locality */}
                        <div>
                          <label htmlFor="pricing-area" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                            Area / Locality *
                          </label>
                          <input
                            id="pricing-area"
                            type="text"
                            placeholder="e.g. Madhapur, Gachibowli, Armoor Town"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                          />
                        </div>

                        {/* Date and Timing Slot */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="pricing-date" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                              Event Date (Optional)
                            </label>
                            <input
                              id="pricing-date"
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
                          <div>
                            <label htmlFor="pricing-time-slot" className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-brand-orange" />
                              Preferred Slot *
                            </label>
                            <select
                              id="pricing-time-slot"
                              value={timeSlot}
                              onChange={(e) => setTimeSlot(e.target.value)}
                              required
                              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-850 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                            >
                              <option value="" disabled>Select Time Slot</option>
                              {getTimeSlotsForPlan().map((slotOption) => (
                                <option key={slotOption} value={slotOption}>
                                  {slotOption}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Add Extra Hour Checkbox (+899) */}
                        {selectedPlan.title !== "Add On's" && (
                          <div className="pt-2">
                            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 cursor-pointer hover:border-brand-orange/30 transition-colors">
                              <input 
                                type="checkbox" 
                                checked={addExtraHour}
                                onChange={(e) => setAddExtraHour(e.target.checked)}
                                className="accent-brand-orange w-4 h-4 cursor-pointer" 
                              />
                              <div>
                                <p className="text-xs font-bold text-white">Add Extra Shoot Hour (+₹899)</p>
                                <p className="text-[9px] text-neutral-500 font-light mt-0.5">Extend your shoot on-site easily</p>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>

                      {/* SUMMARY PREVIEW BLOCK */}
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
                              Shoot Details Summary
                            </h5>
                            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-neutral-300 text-[11px] font-light">
                              <div>
                                <span className="text-neutral-500 font-bold uppercase text-[9px] block">Location</span>
                                {area}, {city}, {state}
                              </div>
                              <div>
                                <span className="text-neutral-500 font-bold uppercase text-[9px] block">Date / Schedule</span>
                                {date ? date.split("-").reverse().join("/") : "Not Selected"} @ {timeSlot.split(" ")[0]}
                              </div>
                              <div>
                                <span className="text-neutral-500 font-bold uppercase text-[9px] block">Plan Selection</span>
                                {selectedPlan.title}
                              </div>
                              <div>
                                <span className="text-neutral-500 font-bold uppercase text-[9px] block">Extra Hour Add-on</span>
                                {addExtraHour ? "Yes (+₹899)" : "No"}
                              </div>

                            </div>
                            <div className="h-[1px] bg-brand-orange/15 w-full my-1" />
                            <div className="space-y-1.5 text-[11px] text-neutral-300 font-light">
                              <div className="flex justify-between">
                                <span>Base Shoot Cost:</span>
                                <span className="text-white font-medium">₹{getCalculatedPrice().toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="flex items-center gap-1">
                                  Platform Fee (2.5%):
                                  <span className="text-[9px] text-neutral-500 font-bold uppercase">(incl. gateway costs)</span>
                                </span>
                                <span className="text-white font-medium">₹{Math.round(getCalculatedPrice() * 0.025).toLocaleString("en-IN")}</span>
                              </div>
                              <div className="h-[1px] bg-neutral-900/50 w-full my-1" />
                              <div className="flex justify-between items-center text-xs font-bold text-white">
                                <span>Total Amount to Pay:</span>
                                <span className="text-brand-orange text-glow">
                                  ₹{Math.round(getCalculatedPrice() * 1.025).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Terms & Conditions Checkbox */}
                      <div className="flex items-start gap-2.5 pt-1 mb-2">
                        <input
                          type="checkbox"
                          id="pricing-accept-terms"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          required
                          className="w-4 h-4 rounded border-neutral-850 bg-neutral-950 text-brand-orange focus:ring-brand-orange accent-brand-orange mt-0.5 cursor-pointer"
                        />
                        <label htmlFor="pricing-accept-terms" className="text-neutral-450 text-[11px] font-light leading-relaxed select-none">
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
                        className="w-full py-3.5 px-4 rounded-xl bg-brand-orange hover:bg-white text-black font-extrabold text-xs uppercase tracking-widest duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                      >
                        <span>Pay ₹{Math.round(getCalculatedPrice() * 1.025).toLocaleString("en-IN")} & Confirm Slot</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}

                  {/* STEP 2: Cashfree Checkout Redirecting */}
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

                      {/* Mock Notification Badge */}
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
