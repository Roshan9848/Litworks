"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Phone, Mail, MapPin } from "lucide-react";

interface Message {
  sender: "bot" | "user";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hey there! I'm LITBOT ⚡, your creative assistant from LITWORKS. We have successfully completed over 100+ projects! Ask me about our starting prices, contact info, or locations!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text } as Message];
    setMessages(newMessages);
    setInputValue("");

    // Simulate bot thinking
    setTimeout(() => {
      const botReply = getBotResponse(text);
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 600);
  };

  const getBotResponse = (input: string): string => {
    const clean = input.toLowerCase();

    // 1. Pricing queries
    if (
      clean.includes("price") ||
      clean.includes("cost") ||
      clean.includes("how much") ||
      clean.includes("rate") ||
      clean.includes("pricing") ||
      clean.includes("starting") ||
      clean.includes("charge")
    ) {
      if (clean.includes("reel") || clean.includes("instant")) {
        return "Our Instant Reels start at just ₹1,500 and are delivered in minutes! Please note that pricing varies depending on the shoot location, date/time, and special editing requirements. Tap the 'Book Service' link on our site to lock in your slot!";
      }
      return "Here is a quick overview of our starting prices:\n\n⚡ Instant Reels: Starting at ₹1,500 (delivered in minutes! Pricing varies based on location & shoot hours)\n✂️ Video Editing: Starting at ₹500 per video\n🎨 Graphics/Posters/Thumbnails: Starting at ₹300 per asset\n📈 Social Media / Ads Management: Custom-tailored based on campaign scale.\n\nPrices adjust depending on event duration and location!";
    }

    // 2. Contact details
    if (
      clean.includes("contact") ||
      clean.includes("phone") ||
      clean.includes("number") ||
      clean.includes("whatsapp") ||
      clean.includes("call") ||
      clean.includes("mail") ||
      clean.includes("email") ||
      clean.includes("reach") ||
      clean.includes("support")
    ) {
      return "Here is how you can get in touch with the LITWORKS team immediately:\n\n📞 Direct Call: +91 9110797354\n💬 WhatsApp Support: +91 9866571801\n✉️ Official Email: litworks.media@gmail.com\n📸 Instagram: @litworks.media (https://www.instagram.com/litworks.media/)\n\nDrop us a message, and we will get back to you instantly!";
    }

    // 3. Location queries
    if (
      clean.includes("location") ||
      clean.includes("city") ||
      clean.includes("cities") ||
      clean.includes("place") ||
      clean.includes("telangana") ||
      clean.includes("andhra") ||
      clean.includes("serve") ||
      clean.includes("where")
    ) {
      return "We deploy our production crews to the following locations:\n\n📍 Telangana: Hyderabad, Karimnagar, Nizamabad, Armoor\n📍 Andhra Pradesh: Vijayawada, Visakhapatnam (Vizag)\n\nWe cover shoots directly at your venue within these regions.";
    }

    // 4. Booking queries
    if (
      clean.includes("book") ||
      clean.includes("hire") ||
      clean.includes("inquiry") ||
      clean.includes("register") ||
      clean.includes("form")
    ) {
      return "Booking is super easy! Simply scroll up to the 'Book Service' section on this page, choose your service and location, fill out the required details, and click submit. Our team will automatically receive an email and connect with you.";
    }

    // 5. Greeting queries
    if (clean.includes("hi") || clean.includes("hello") || clean.includes("hey") || clean.includes("greetings")) {
      return "Hello! I am ready to assist you. LITWORKS has successfully completed 100+ projects! Ask me about our services, starting prices (Reels start at ₹1,500!), contact info, or locations. Feel free to use the quick suggestions below!";
    }

    // 6. Generic/Fallback response
    return "I'm LITBOT ⚡, your virtual guide for LITWORKS. Having completed over 100+ creative projects, we can help you with anything! Ask me about our starting prices (Instant Reels start at ₹1,500!), contact numbers, or shoot locations. You can also type 'contact' or 'booking' to learn more!";
  };

  return (
    <>
      {/* Floating Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.8, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-black shadow-[0_0_20px_rgba(255,122,0,0.4)] hover:shadow-[0_0_30px_rgba(255,122,0,0.7)] transition-shadow duration-300 cursor-pointer"
        aria-label="Open LITBOT chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed bottom-24 right-6 z-40 w-[350px] sm:w-[400px] h-[500px] rounded-3xl bg-neutral-950/90 border border-neutral-900 shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-neutral-900/60 px-6 py-4 border-b border-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20 shadow-[0_0_15px_rgba(255,122,0,0.15)]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wider uppercase">LITBOT</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-neutral-450 tracking-wider font-light">Online &bull; Media Assistant</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-brand-orange transition-colors p-1"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-light leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-brand-orange text-black font-semibold rounded-tr-none shadow-[0_0_15px_rgba(255,122,0,0.1)]"
                        : "bg-neutral-900/80 text-neutral-300 border border-neutral-850 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-6 pb-2 pt-1 flex gap-2 overflow-x-auto scrollbar-none flex-nowrap mask-gradient">
              <button
                onClick={() => handleSend("Tell me starting prices")}
                className="flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full border border-neutral-900 bg-neutral-950 text-neutral-300 hover:border-brand-orange/30 hover:text-brand-orange transition-colors cursor-pointer"
              >
                Prices 💰
              </button>
              <button
                onClick={() => handleSend("What are your contact details?")}
                className="flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full border border-neutral-900 bg-neutral-950 text-neutral-300 hover:border-brand-orange/30 hover:text-brand-orange transition-colors cursor-pointer"
              >
                Contact 📞
              </button>
              <button
                onClick={() => handleSend("Instant Reel starting price")}
                className="flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full border border-neutral-900 bg-neutral-950 text-neutral-300 hover:border-brand-orange/30 hover:text-brand-orange transition-colors cursor-pointer"
              >
                Reel Pricing ⚡
              </button>
              <button
                onClick={() => handleSend("Which cities do you serve?")}
                className="flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full border border-neutral-900 bg-neutral-950 text-neutral-300 hover:border-brand-orange/30 hover:text-brand-orange transition-colors cursor-pointer"
              >
                Locations 📍
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-neutral-950 border-t border-neutral-900 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                placeholder="Ask me anything..."
                className="flex-grow px-4 py-3 text-sm text-white bg-neutral-900 rounded-xl border border-neutral-850 focus:outline-none focus:border-brand-orange/50 transition-colors"
              />
              <button
                onClick={() => handleSend(inputValue)}
                className="w-11 h-11 bg-brand-orange hover:bg-white text-black font-bold rounded-xl flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(255,122,0,0.15)] cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
