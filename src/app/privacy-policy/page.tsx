"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView } from "framer-motion";
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

const SpotlightCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0 mix-blend-multiply opacity-50 hidden md:block"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.2),rgba(0,0,0,0.02),transparent_60%)]"></div>
    </motion.div>
  );
};

const policyData = [
  {
    id: "SEC-01",
    title: "DATA COLLECTION",
    content: "We collect information you provide when interacting with the PadelX booking system. This includes your full name, email address, phone number, and payment coordination details required to secure your court.",
    color: "from-[#CCFF00] to-gray-400"
  },
  {
    id: "SEC-02",
    title: "USAGE PROTOCOLS",
    content: "Your personal data is strictly utilized to process reservations, manage your club access, and communicate essential system updates or tournament schedules. We do not engage in unauthorized distribution of your details.",
    color: "from-gray-400 to-[#121212]"
  },
  {
    id: "SEC-03",
    title: "SECURITY MEASURES",
    content: "Our digital infrastructure employs advanced encryption protocols. All payment transactions and personal records are secured to prevent unauthorized access and maintain strict confidentiality.",
    color: "from-[#121212] to-[#CCFF00]"
  },
  {
    id: "SEC-04",
    title: "THIRD PARTY SHARING",
    content: "We strictly limit data sharing to verified partners essential for our operations, such as secure financial processors. PadelX will never sell your personal information to external marketing agencies.",
    color: "from-[#CCFF00] to-gray-500"
  },
  {
    id: "SEC-05",
    title: "YOUR CLEARANCE RIGHTS",
    content: "You maintain full authority over your personal data. You may request access to view, modify, or permanently erase your records from our system by contacting our support channel.",
    color: "from-gray-500 to-[#121212]"
  }
];

const PolicyCard = ({ data, index }: { data: any, index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.touches[0].clientX - (rect.left + rect.width / 2));
    y.set(e.touches[0].clientY - (rect.top + rect.height / 2));
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
      className={`relative w-full md:w-[85%] ${index % 2 === 0 ? "mr-auto" : "ml-auto"}`}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          x.set(0); y.set(0);
        }}
        onTouchMove={handleTouchMove}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => {
          setIsHovered(false);
          x.set(0); y.set(0);
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative perspective-[1000px] group cursor-crosshair z-10"
      >
        <div className={`absolute -inset-[3px] bg-gradient-to-r ${data.color} rounded-xl opacity-30 group-hover:opacity-80 group-active:opacity-80 blur-md transition-opacity duration-500`}></div>
        
        <div className="relative bg-[#121212]/95 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden h-full">
          
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
          
          <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <span className={`text-xs font-mono font-bold tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r ${data.color}`}>
                NODE: {data.id}
              </span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#121212] animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              </div>
            </div>

            <h2 className={`${spaceGrotesk.className} text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-none`}>
              {data.title}
            </h2>
            
            <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed">
              {data.content}
            </p>
          </div>

          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 group-hover:border-[#CCFF00] group-active:border-[#CCFF00] transition-colors duration-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 group-hover:border-[#CCFF00] group-active:border-[#CCFF00] transition-colors duration-500"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function PrivacyPolicyPage() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <main ref={containerRef} className={`relative w-full min-h-screen bg-[#FAFAFA] pb-32 overflow-clip ${inter.className}`}>
      <SpotlightCursor />

      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"></div>

      <div className="relative w-full flex flex-col items-center text-center pt-36 pb-32 px-6 mb-32 overflow-hidden">
        
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/privacy-policy/p-hero.mp4"
        />

        <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none"></div>

        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/20 rounded-full border-dashed z-10"
        />

        <div className="relative z-20 flex flex-col items-center">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="flex items-center gap-4 mb-6 px-6 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
            <span className="text-white font-mono text-xs tracking-[0.5em] uppercase font-bold">
              Secure Terminal Access
            </span>
          </motion.div>
          
          <h1 className={`${spaceGrotesk.className} text-6xl md:text-8xl lg:text-[10rem] font-black text-white uppercase tracking-tighter leading-none mb-6`}>
            Privacy <br /> 
            <span className="text-transparent [-webkit-text-stroke:2px_#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.8)]">
              Vault
            </span>
          </h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-gray-200 text-lg md:text-2xl font-light max-w-3xl">
            Protecting your digital footprint is a core priority at PadelX. This encrypted document outlines how we secure and manage your telemetry within our arena systems.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="relative w-full flex flex-col gap-24 py-10">
          
          <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-200 -translate-x-1/2 hidden md:block z-0">
            <motion.div 
              style={{ scaleY, transformOrigin: "top" }}
              className="w-full h-full bg-gradient-to-b from-[#CCFF00] via-[#121212] to-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.5)]"
            />
          </div>

          {policyData.map((data, index) => (
            <PolicyCard key={data.id} data={data} index={index} />
          ))}

        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mt-32 w-full bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center shadow-sm"
        >
          <motion.div 
            animate={{ top: ["-10%", "110%"] }} 
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#CCFF00]/50 to-transparent z-0"
          />

          <h3 className={`${spaceGrotesk.className} text-[#121212] text-2xl md:text-4xl font-black tracking-widest uppercase mb-6 relative z-10`}>
            Require Extraction?
          </h3>
          <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl relative z-10">
            If you require further clarification regarding our data security protocols or wish to wipe your personal footprint please initialize a transmission to our command center.
          </p>
          
          <a 
            href="/contact" 
            className="relative z-10 group inline-flex items-center justify-center gap-4 bg-transparent border-2 border-[#121212] text-[#121212] px-10 py-5 font-black uppercase tracking-[0.3em] text-sm overflow-hidden rounded-sm transition-all duration-300 hover:shadow-[0_10px_30px_rgba(204,255,0,0.3)] active:shadow-[0_10px_30px_rgba(204,255,0,0.3)]"
          >
            <span className="absolute inset-0 bg-[#121212] translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-out -z-10"></span>
            <span className="group-hover:text-[#CCFF00] group-active:text-[#CCFF00] transition-colors duration-500">Initialize Contact</span>
            <svg className="w-5 h-5 group-hover:text-[#CCFF00] group-active:text-[#CCFF00] transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>

      </div>
    </main>
  );
}