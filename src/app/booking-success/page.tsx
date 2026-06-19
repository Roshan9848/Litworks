"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight, Phone, MessageSquare, Calendar } from "lucide-react";
import { Suspense } from "react";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "N/A";
  const status = searchParams.get("status");
  const isFailed = status === "failed";

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute left-1/4 top-1/4 w-[350px] h-[350px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-1/4 bottom-1/4 w-[350px] h-[350px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-neutral-900 shadow-2xl text-center space-y-6">
          {isFailed ? (
            <>
              {/* Failure Icon */}
              <div className="w-16 h-16 rounded-full bg-red-950/20 border border-red-950/50 text-red-500 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <XCircle className="w-9 h-9" />
              </div>

              {/* Heading */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold block">
                  Payment Verification Failed
                </span>
                <h1 className="text-2xl font-black text-white">Booking Interrupted</h1>
              </div>

              {/* Message */}
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                We couldn't verify your booking deposit payment. If the amount was debited, please contact our support team immediately with your transaction reference.
              </p>

              {/* Metadata */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-850 text-left text-[11px] font-mono space-y-1.5 text-neutral-400">
                <div>
                  <span className="text-neutral-600">Booking ID:</span> {orderId}
                </div>
                <div>
                  <span className="text-neutral-600">Payment Status:</span>{" "}
                  <span className="text-red-500 font-bold">Unverified</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Success Icon */}
              <div className="w-16 h-16 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,122,0,0.2)] animate-bounce">
                <CheckCircle className="w-9 h-9" />
              </div>

              {/* Heading */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-brand-orange font-bold block animate-pulse">
                  Booking confirmed & paid
                </span>
                <h1 className="text-2xl font-black text-white">Shoot Slot Secured!</h1>
              </div>

              {/* Message */}
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Thank you for choosing **LITWORKS**! Your shoot slot deposit of **₹999** has been successfully verified. Our scheduling editors will reach out to you via WhatsApp or Email within 15 minutes.
              </p>

              {/* Metadata */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-850 text-left text-[11px] font-mono space-y-1.5 text-neutral-400">
                <div>
                  <span className="text-neutral-600">Booking ID:</span> {orderId}
                </div>
                <div>
                  <span className="text-neutral-600">Deposit Paid:</span>{" "}
                  <span className="text-brand-orange font-bold">₹999 (Verified)</span>
                </div>
              </div>
            </>
          )}

          {/* Quick Contact buttons */}
          <div className="pt-2 flex flex-col gap-3">
            <a
              href="https://wa.me/919110797354"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-neutral-950 border border-neutral-850 hover:border-brand-orange/30 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand-orange" />
              <span>Contact via WhatsApp</span>
            </a>

            <Link
              href="/"
              className="w-full py-3.5 px-4 rounded-xl bg-brand-orange hover:bg-white text-black font-extrabold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
            >
              <span>Back to Portal Home</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-xs font-mono tracking-widest text-neutral-500 uppercase animate-pulse">
        Loading success confirmation...
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
