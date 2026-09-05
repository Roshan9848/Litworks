"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, ArrowUpRight, X, Loader2, CheckCircle2, Phone, User, Calendar, MapPin, Clock, FileText, Search, CreditCard, ChevronLeft, Info, Mail, BookOpen, Sparkles } from "lucide-react";

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

  // Coupon Code States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: "percentage" | "fixed"; value: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

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
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError("");
    setCouponSuccess("");
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    setCouponSuccess("");
    try {
      const res = await fetch(`/api/coupons?code=${couponCode.trim()}`);
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon);
        setCouponSuccess(`Coupon code "${data.coupon.code.toUpperCase()}" applied successfully!`);
      } else {
        setCouponError(data.error || "Invalid or expired coupon code.");
        setAppliedCoupon(null);
      }
    } catch (e) {
      setCouponError("Failed to validate coupon code. Please try again.");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
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

  const getCouponDiscount = () => {
    if (!selectedPlan || !appliedCoupon) return 0;
    const basePrice = getCalculatedPrice();
    if (appliedCoupon.type === "percentage") {
      return Math.round(basePrice * (appliedCoupon.value / 100));
    } else {
      return Math.min(appliedCoupon.value, basePrice);
    }
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
    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit WhatsApp/Phone number.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);
    setModalStep(2); // Go to Payment step

    const finalState = state || "Maharashtra";
    const finalCity = city || area || "Pune";
    const finalArea = area || city || "Client Location";
    const finalEmail = email.trim() || `${phone.replace(/\D/g, "")}@customer.litworks.media`;
    const finalEventOccasion = eventType === "Other" ? (customEventType || "Custom Occasion") : (eventType || "Event Shoot");
    const basePrice = getCalculatedPrice();
    const discount = getCouponDiscount();
    const finalPrice = Math.max(0, basePrice - discount);
    const platformFee = Math.round(finalPrice * 0.025);
    const totalAmount = finalPrice + platformFee;

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: finalEmail,
      state: finalState,
      city: finalCity,
      service: selectedPlan?.serviceType || "Instant Reel",
      notes: `Selected Plan: ${activeTab === "basic" ? "Basic" : "Wedding"} - ${selectedPlan?.title} (${selectedPlan?.price})\nLocation: ${finalCity} - ${finalArea}\nEvent Occasion: ${finalEventOccasion}${appliedCoupon ? `\nCoupon Applied: ${appliedCoupon.code} (₹${discount} off)` : ""}`,
      finalPrice: finalPrice,
      dynamicFields: {
        preferredDate: date || getTodayDateString(),
        timeSlot: timeSlot || "Flexible",
        shootArea: finalArea,
        eventType: finalEventOccasion,
        extraHourRequested: selectedPlan?.title === "Custom Plan" ? "Not Applicable" : (addExtraHour ? "Yes (+₹899)" : "No"),
        calculatedTotalPrice: selectedPlan?.title === "Custom Plan" ? "Custom Quote" : `₹${finalPrice.toLocaleString("en-IN")}`,
        planTitle: selectedPlan?.title,
        couponApplied: appliedCoupon ? appliedCoupon.code : "None",
        couponDiscount: appliedCoupon ? `₹${discount}` : "₹0",
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-1 gap-8 items-stretch justify-center mx-auto ${
              activeTab === "basic" 
                ? "md:grid-cols-3 max-w-5xl" 
                : "md:grid-cols-2 lg:grid-cols-4 max-w-7xl"
            }`}
          >
            {plans.map((plan, index) => (
              <div
                key={plan.title}
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
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

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
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-md rounded-3xl p-5 sm:p-7 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-10 bg-neutral-950/90 backdrop-blur-2xl text-left max-h-[88vh] overflow-y-auto overflow-x-hidden no-scrollbar"
            >
              {/* Subtle Ambient Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:border-brand-orange transition-colors cursor-pointer z-20"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-black text-white">Booking Registered</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light max-w-xs mx-auto">
                    We have received your shoot request. Our production team will connect on WhatsApp shortly.
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="w-full py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer mt-4"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="relative z-10">
                  {/* STEP 1: Details Entry */}
                  {modalStep === 1 && (
                    <form onSubmit={handleProceedToPayment} className="space-y-4">
                      {/* Plan & Pricing Header */}
                      <div className="flex items-start justify-between pr-8">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-brand-orange font-bold block">
                            Direct Booking
                          </span>
                          <h4 className="text-lg font-black text-white mt-0.5 font-sans">
                            {selectedPlan.title}
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-white font-mono">
                            ₹{Math.round(Math.max(0, getCalculatedPrice() - getCouponDiscount()) * 1.025).toLocaleString("en-IN")}
                          </p>
                          <span className="text-[9px] text-neutral-400 font-mono block">All taxes incl.</span>
                        </div>
                      </div>

                      <div className="h-[1px] bg-white/10 w-full" />

                      {/* Streamlined Form Fields */}
                      <div className="space-y-3">
                        {/* Full Name */}
                        <div>
                          <label htmlFor="pricing-name" className="block text-[10px] uppercase font-bold text-neutral-400 mb-1 flex items-center gap-1 font-sans">
                            <User className="w-3 h-3 text-brand-orange" />
                            Full Name *
                          </label>
                          <input
                            id="pricing-name"
                            type="text"
                            placeholder="e.g. Rahul Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors"
                          />
                        </div>

                        {/* WhatsApp Number */}
                        <div>
                          <label htmlFor="pricing-phone" className="block text-[10px] uppercase font-bold text-neutral-400 mb-1 flex items-center gap-1 font-sans">
                            <Phone className="w-3 h-3 text-brand-orange" />
                            WhatsApp / Mobile Number *
                          </label>
                          <input
                            id="pricing-phone"
                            type="tel"
                            placeholder="10-digit number"
                            value={phone}
                            onChange={(e) => phone.length <= 15 && setPhone(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors font-mono"
                          />
                        </div>

                        {/* Shoot Date & Location (Responsive 2-col with mobile safety) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                          <div className="w-full min-w-0">
                            <label htmlFor="pricing-date" className="block text-[10px] uppercase font-bold text-neutral-400 mb-1 flex items-center gap-1 font-sans">
                              <Calendar className="w-3 h-3 text-brand-orange" />
                              Shoot Date *
                            </label>
                            <input
                              id="pricing-date"
                              type="date"
                              min={getTodayDateString()}
                              value={date || getTodayDateString()}
                              onChange={(e) => setDate(e.target.value)}
                              onClick={(e) => {
                                try { e.currentTarget.showPicker(); } catch (err) {}
                              }}
                              className="w-full max-w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-orange [color-scheme:dark] cursor-pointer box-border"
                            />
                          </div>

                          <div className="w-full min-w-0">
                            <label htmlFor="pricing-city" className="block text-[10px] uppercase font-bold text-neutral-400 mb-1 flex items-center gap-1 font-sans">
                              <MapPin className="w-3 h-3 text-brand-orange" />
                              City / Location
                            </label>
                            <input
                              id="pricing-city"
                              type="text"
                              placeholder="e.g. Pune, Hyderabad"
                              value={city}
                              onChange={(e) => {
                                setCity(e.target.value);
                                setArea(e.target.value);
                              }}
                              className="w-full max-w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-orange transition-colors box-border"
                            />
                          </div>
                        </div>

                        {/* Occasion / Shoot Category Pills (Clean text-only without emojis) */}
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1.5 font-sans">
                            Shoot Category
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              "Car Delivery",
                              "Birthday Event",
                              "Wedding",
                              "Brand Launch",
                              "Personal Reel",
                              "Other"
                            ].map((opt) => {
                              const isSelected = eventType === opt || (eventType === "" && opt === "Car Delivery");
                              return (
                                <button
                                  type="button"
                                  key={opt}
                                  onClick={() => setEventType(opt)}
                                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-brand-orange text-black font-bold shadow-[0_0_12px_rgba(255,122,0,0.3)]"
                                      : "bg-neutral-900/80 border border-white/5 text-neutral-300 hover:border-white/20 hover:text-white"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Integrated Coupon Input Box */}
                        {selectedPlan.title !== "Custom Plan" && (
                          <div className="pt-1">
                            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1 font-sans">
                              Promo Code
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                disabled={!!appliedCoupon || isValidatingCoupon}
                                className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-900/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-orange uppercase font-mono tracking-wider disabled:opacity-50"
                              />
                              {appliedCoupon ? (
                                <button
                                  type="button"
                                  onClick={handleRemoveCoupon}
                                  className="px-3 py-2 rounded-xl bg-red-950/40 border border-red-900/40 text-red-400 font-bold text-xs uppercase tracking-wider hover:bg-red-900/40 transition-colors cursor-pointer"
                                >
                                  Remove
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleApplyCoupon}
                                  disabled={isValidatingCoupon || !couponCode.trim()}
                                  className="px-4 py-2 rounded-xl bg-brand-orange text-black font-extrabold text-xs uppercase tracking-wider hover:bg-white transition-all disabled:opacity-40 cursor-pointer"
                                >
                                  {isValidatingCoupon ? "Checking..." : "Apply"}
                                </button>
                              )}
                            </div>

                            {/* Subtle autofill helper chip */}
                            {!appliedCoupon ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setCouponCode("BAPPA20");
                                  setTimeout(() => {
                                    handleApplyCoupon();
                                  }, 50);
                                }}
                                className="text-[10px] text-brand-orange/80 hover:text-brand-orange mt-1.5 flex items-center gap-1 font-mono transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Use code <strong>BAPPA20</strong> for 20% discount</span>
                              </button>
                            ) : (
                              <p className="text-emerald-400 text-[10px] mt-1 font-mono">
                                Code {appliedCoupon.code} applied (-₹{getCouponDiscount().toLocaleString("en-IN")})
                              </p>
                            )}
                            {couponError && (
                              <p className="text-red-400 text-[10px] mt-1 font-mono">{couponError}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {errorMessage && (
                        <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 text-xs text-center font-medium">
                          {errorMessage}
                        </div>
                      )}

                      {/* Primary Checkout Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-3.5 px-4 rounded-xl bg-brand-orange hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,122,0,0.3)] active:scale-98"
                        >
                          <span>
                            {selectedPlan.title === "Custom Plan"
                              ? "Request Custom Proposal →"
                              : `Pay ₹${Math.round(Math.max(0, getCalculatedPrice() - getCouponDiscount()) * 1.025).toLocaleString("en-IN")} & Confirm Slot →`}
                          </span>
                        </button>

                        <p className="text-[9px] text-neutral-400 text-center font-mono pt-2">
                          Encrypted Checkout • Instant Confirmation
                        </p>
                      </div>
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
