"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export default function ComingSoon() {
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [memberCount, setMemberCount] = useState(1432);

  useEffect(() => {
    setIsClient(true);
    const target = new Date();
    target.setDate(target.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setMemberCount(prev => prev + 1);
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 flex flex-col items-center max-w-4xl w-full"
      >
        <div className="mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <span className={`text-[#ccff00] text-[10px] tracking-[0.2em] uppercase font-bold ${jetbrainsMono.className}`}>
            Lahore Node Initializing
          </span>
        </div>

        <h1 className={`text-7xl md:text-9xl font-light tracking-tighter text-center mb-6 ${spaceGrotesk.className}`}>
          PADEL <span className="font-bold">COURT</span>
        </h1>

        <p className="text-white/50 text-center max-w-md mb-16 text-sm md:text-base leading-relaxed">
          We are constructing a premium athletic experience. Join the waitlist to secure early access and founding member privileges.
        </p>

        <div className="grid grid-cols-4 gap-6 md:gap-12 w-full max-w-2xl mb-20">
          {[
            { v: timeLeft.days, l: "Days" }, 
            { v: timeLeft.hours, l: "Hours" }, 
            { v: timeLeft.minutes, l: "Mins" }, 
            { v: timeLeft.seconds, l: "Secs" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className={`text-4xl md:text-6xl font-light tabular-nums ${spaceGrotesk.className}`}>
                {!isClient ? "00" : (item.v < 10 ? `0${item.v}` : item.v)}
              </span>
              <span className={`text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 mt-3 font-bold ${jetbrainsMono.className}`}>
                {item.l}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full max-w-md flex flex-col gap-3">
          <form onSubmit={handleSubscribe} className="relative flex items-center w-full">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={status === "success" ? "ACCESS GRANTED" : "ENTER YOUR EMAIL"}
              disabled={status !== "idle"}
              className={`w-full bg-white/5 border border-white/10 rounded-none px-6 py-4 text-sm focus:outline-none focus:border-[#ccff00] transition-colors placeholder:text-white/30 ${jetbrainsMono.className}`}
            />
            <button
              type="submit"
              disabled={status !== "idle"}
              className={`absolute right-2 px-6 py-2 bg-white text-black text-[10px] tracking-[0.1em] font-bold uppercase hover:bg-[#ccff00] transition-colors disabled:opacity-50 ${jetbrainsMono.className}`}
            >
              {status === "idle" ? "Join" : status === "loading" ? "..." : "Done"}
            </button>
          </form>

          {/* Member Count Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00]"></span>
            </span>
            <span className={`text-white/50 text-[10px] uppercase tracking-widest ${jetbrainsMono.className}`}>
              {memberCount.toLocaleString()} Members on waitlist
            </span>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}