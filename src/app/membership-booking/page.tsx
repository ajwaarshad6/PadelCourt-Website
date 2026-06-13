"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence } from "framer-motion";
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

const LiveIDCard = ({ formData }: { formData: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const glareX = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(204, 255, 0, 0.4) 0%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.touches[0].clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.touches[0].clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isNameFilled = formData.name.length > 0;
  const isPackageSelected = formData.packageType !== "Select Package";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full aspect-[1.58/1] rounded-2xl perspective-[1500px] z-20"
    >
      <div 
        style={{ transform: "translateZ(40px)" }}
        className="absolute inset-0 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between p-8"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>
        <motion.div style={{ background: glareBackground }} className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay opacity-80" />

        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-[#CCFF00] font-mono text-[10px] tracking-[0.3em] uppercase mb-1 opacity-80">PadelX Network</p>
            <h3 className={`${spaceGrotesk.className} text-2xl md:text-3xl font-black ${isPackageSelected ? "text-white" : "text-white/30"} uppercase tracking-widest transition-colors duration-500`}>
              {isPackageSelected ? formData.packageType : "AWAITING TIER"}
            </h3>
          </div>
          <div className={`w-12 h-10 rounded-md bg-gradient-to-br transition-all duration-500 flex items-center justify-center border shadow-inner ${isPackageSelected ? "from-yellow-200 via-yellow-400 to-yellow-600 border-yellow-300/50 opacity-100" : "from-gray-700 via-gray-800 to-gray-900 border-gray-600 opacity-50"}`}>
             <div className="w-8 h-6 border border-black/20 rounded-sm"></div>
          </div>
        </div>

        <div className="flex justify-between items-end relative z-10">
           <div className="overflow-hidden">
              <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase mb-1">Operative Identity</p>
              <AnimatePresence mode="popLayout">
                <motion.p 
                  key={formData.name || "empty"}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className={`${spaceGrotesk.className} text-2xl md:text-3xl font-bold ${isNameFilled ? "text-white" : "text-white/20"} tracking-[0.1em] uppercase`}
                >
                  {isNameFilled ? formData.name : "UNKNOWN_USER"}
                </motion.p>
              </AnimatePresence>
           </div>
           <div className="text-right">
              <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isNameFilled && isPackageSelected ? "bg-[#CCFF00] animate-pulse shadow-[0_0_10px_#CCFF00]" : "bg-red-500"}`}></span>
                <p className={`font-mono text-xs font-bold uppercase tracking-widest ${isNameFilled && isPackageSelected ? "text-[#CCFF00]" : "text-red-500"}`}>
                  {isNameFilled && isPackageSelected ? "VERIFIED" : "PENDING"}
                </p>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const TacticalSelect = ({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-transparent border-b-2 px-0 py-3 text-lg font-medium outline-none transition-all duration-300 cursor-pointer flex justify-between items-center ${isOpen ? "border-[#121212] text-[#121212]" : "border-gray-300 text-[#121212] hover:border-gray-400 active:border-gray-400"}`}
      >
        <span className={value === "Select Package" ? "text-gray-400" : ""}>{value}</span>
        <motion.svg animate={{ rotate: isOpen ? 180 : 0 }} className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-sm shadow-xl z-50 overflow-hidden"
          >
            {options.map((opt) => (
              <div 
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className="px-6 py-4 text-[#121212] hover:bg-gray-100 active:bg-gray-100 font-bold cursor-pointer transition-colors duration-200 uppercase tracking-wide text-sm"
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function MembershipBookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    packageType: "Select Package"
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Credentials Accepted. Welcome to the Elite Roster.");
  };

  const pageMouseX = useMotionValue(0);
  const pageMouseY = useMotionValue(0);
  const pageSpringX = useSpring(pageMouseX, { damping: 40, stiffness: 100 });
  const pageSpringY = useSpring(pageMouseY, { damping: 40, stiffness: 100 });
  const spotlightMask = useMotionTemplate`radial-gradient(800px circle at ${pageSpringX}px ${pageSpringY}px, rgba(204, 255, 0, 0.08), transparent 60%)`;

  useEffect(() => {
    const handleGlobalMouse = (e: MouseEvent) => {
      pageMouseX.set(e.clientX);
      pageMouseY.set(e.clientY);
    };
    const handleGlobalTouch = (e: TouchEvent) => {
      pageMouseX.set(e.touches[0].clientX);
      pageMouseY.set(e.touches[0].clientY);
    };
    window.addEventListener("mousemove", handleGlobalMouse);
    window.addEventListener("touchmove", handleGlobalTouch);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouse);
      window.removeEventListener("touchmove", handleGlobalTouch);
    };
  }, [pageMouseX, pageMouseY]);

  return (
    <main className={`relative w-full min-h-screen bg-white flex flex-col pt-32 pb-20 overflow-hidden ${inter.className}`}>
      
      <title>Initialize Protocol | PadelX</title>
      <meta name="seo-title" content="Initialize Membership Protocol | PadelX" />
      <meta name="slug" content="/membership-booking" />
      <meta name="description" content="Initialize your PadelX membership clearance." />
      <meta name="focus-key-phrase" content="initialize padel membership" />
      <meta name="seo-key-phrase" content="padelx membership booking" />
      <meta name="img-alt-text" content="PadelX Holographic Membership Verification" />
      <meta name="seo-keywords" content="padel membership form, elite padel club, padelx network" />
      
      <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ background: spotlightMask }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 flex-1 flex flex-col lg:flex-row items-center gap-16">
        
        <div className="w-full lg:w-1/2 flex flex-col items-start pt-10 lg:pt-0">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12 w-full"
          >
            <div className="flex items-center gap-3 mb-6 px-4 py-2 border border-[#CCFF00] rounded-full bg-[#CCFF00]/10 w-max">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
              <span className="text-[#121212] font-black text-[10px] tracking-[0.3em] uppercase">Secure Terminal</span>
            </div>
            <h1 className={`${spaceGrotesk.className} text-5xl md:text-7xl font-black text-[#121212] uppercase tracking-tighter leading-none mb-4`}>
              Initialize <br /> <span className="text-transparent [-webkit-text-stroke:2px_#121212] drop-shadow-[0_4px_0_#CCFF00]">Clearance</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg font-medium max-w-md">
              Establish your identity within the PadelX network. Data input dictates your physical access credentials.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full relative"
          >
            <div className="absolute inset-0 overflow-hidden rounded-2xl z-30 pointer-events-none">
               <motion.div 
                 animate={{ top: ["-10%", "110%"] }} 
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute left-0 right-0 h-2 bg-[#CCFF00]/40 blur-sm shadow-[0_0_20px_#CCFF00]"
               />
            </div>
            <LiveIDCard formData={formData} />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="w-full lg:w-1/2"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12 relative overflow-hidden group">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white via-[#CCFF00] to-white opacity-80"></div>
            
            <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6">
               <h2 className={`${spaceGrotesk.className} text-2xl font-black text-[#121212] uppercase tracking-widest`}>Data Entry</h2>
               <div className="flex gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-500"></span>
                 <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                 <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
              
              <div className="relative group/input">
                <input 
                  type="text" 
                  id="name"
                  required
                  value={formData.name}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="peer w-full bg-transparent border-b-2 border-gray-300 px-0 py-3 text-[#121212] text-lg font-medium outline-none transition-colors duration-300 focus:border-[#121212] placeholder-transparent"
                  placeholder="Operative Name"
                />
                <label 
                  htmlFor="name" 
                  className={`absolute left-0 transition-all duration-300 font-mono tracking-widest uppercase ${focusedField === "name" || formData.name ? "-top-4 text-[10px] text-[#121212] font-bold" : "top-3 text-sm text-gray-500 cursor-text"}`}
                >
                  Operative Name
                </label>
              </div>

              <div className="relative group/input">
                <input 
                  type="email" 
                  id="email"
                  required
                  value={formData.email}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="peer w-full bg-transparent border-b-2 border-gray-300 px-0 py-3 text-[#121212] text-lg font-medium outline-none transition-colors duration-300 focus:border-[#121212] placeholder-transparent"
                  placeholder="Transmission Comms (Email)"
                />
                <label 
                  htmlFor="email" 
                  className={`absolute left-0 transition-all duration-300 font-mono tracking-widest uppercase ${focusedField === "email" || formData.email ? "-top-4 text-[10px] text-[#121212] font-bold" : "top-3 text-sm text-gray-500 cursor-text"}`}
                >
                  Transmission Comms (Email)
                </label>
              </div>

              <div className="relative group/input">
                <input 
                  type="tel" 
                  id="phone"
                  required
                  value={formData.phone}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="peer w-full bg-transparent border-b-2 border-gray-300 px-0 py-3 text-[#121212] text-lg font-medium outline-none transition-colors duration-300 focus:border-[#121212] placeholder-transparent"
                  placeholder="Direct Line (Phone)"
                />
                <label 
                  htmlFor="phone" 
                  className={`absolute left-0 transition-all duration-300 font-mono tracking-widest uppercase ${focusedField === "phone" || formData.phone ? "-top-4 text-[10px] text-[#121212] font-bold" : "top-3 text-sm text-gray-500 cursor-text"}`}
                >
                  Direct Line (Phone)
                </label>
              </div>

              <div className="relative mt-2">
                <label className="block absolute -top-4 left-0 text-[10px] text-[#121212] font-bold font-mono tracking-widest uppercase">
                  Clearance Level
                </label>
                <TacticalSelect 
                  value={formData.packageType} 
                  onChange={(val) => setFormData({...formData, packageType: val})} 
                  options={["1-Year Elite Override"]}
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-6 bg-[#CCFF00] text-[#121212] font-black uppercase tracking-[0.3em] py-5 rounded-sm shadow-[0_10px_30px_rgba(204,255,0,0.2)] hover:shadow-[0_15px_40px_rgba(204,255,0,0.4)] active:shadow-[0_15px_40px_rgba(204,255,0,0.4)] hover:bg-[#121212] active:bg-[#121212] hover:text-[#CCFF00] active:text-[#CCFF00] transition-all duration-300 relative overflow-hidden group/btn"
              >
                <span className="absolute inset-0 w-full h-full bg-[#121212] translate-y-full group-hover/btn:translate-y-0 group-active/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Transmit Credentials
                  <svg className="w-5 h-5 group-hover/btn:translate-x-2 group-active/btn:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </motion.button>

            </form>

            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gray-300 pointer-events-none transition-colors duration-500 group-hover:border-[#121212]"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gray-300 pointer-events-none transition-colors duration-500 group-hover:border-[#121212]"></div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}