"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useInView, useMotionValue, useMotionTemplate } from "framer-motion";
import { Space_Grotesk, Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700", "400"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const termsData = [
  {
    id: "TRM-01",
    title: "ARENA ACCESS & BOOKINGS",
    content: "All court reservations require advance confirmation via our digital terminal. Cancellations must be executed twenty four hours prior to the scheduled deployment to avoid penalty charges. Late arrivals will not receive time extensions."
  },
  {
    id: "TRM-02",
    title: "CODE OF CONDUCT",
    content: "Players must maintain professional athletic etiquette at all times. Standard non marking tennis footwear is strictly mandatory to protect the integrity of our premium FIP standard turf. Management reserves the right to deny entry for non compliance."
  },
  {
    id: "TRM-03",
    title: "MEMBERSHIP PROTOCOLS",
    content: "Elite tier memberships are issued to single operatives and cannot be transferred or shared. Discount overrides are only valid when the primary account holder is physically present at the arena during the booked session."
  },
  {
    id: "TRM-04",
    title: "EQUIPMENT & ARMORY",
    content: "Rented gear must be returned to the front desk in its original operational state. Any damage sustained to carbon fiber rackets or arena infrastructure due to negligence will be billed directly to the responsible operative."
  },
  {
    id: "TRM-05",
    title: "LIABILITY WAIVER",
    content: "Engaging in high speed racquet sports carries inherent physical risks. By entering the grid you acknowledge these risks. PadelX assumes no responsibility for personal injuries or misplaced tactical gear within the facility perimeter."
  }
];

const TermCard = ({ data, index }: { data: any, index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const glareX = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(204, 255, 0, 0.15) 0%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.touches[0].clientX - rect.left) / rect.width - 0.5);
    y.set((e.touches[0].clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isEven ? -100 : 100, filter: "blur(15px)", scale: 0.9 }}
      animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)", scale: 1 } : { opacity: 0, x: isEven ? -100 : 100, filter: "blur(15px)", scale: 0.9 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative w-full md:w-[85%] lg:w-[45%] flex ${isEven ? "md:mr-auto md:justify-end" : "md:ml-auto md:justify-start"}`}
    >
      <div className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-gray-200 ${isEven ? "-right-12" : "-left-12"}`}>
         <motion.div 
           initial={{ scaleX: 0 }} 
           animate={isInView ? { scaleX: 1 } : { scaleX: 0 }} 
           transition={{ duration: 0.6, delay: 0.4, ease: "circOut" }}
           className={`w-full h-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00] ${isEven ? "origin-left" : "origin-right"}`}
         />
      </div>

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full perspective-[1500px] group cursor-crosshair z-10"
      >
        <div 
          style={{ transform: "translateZ(30px)" }}
          className="relative bg-[#121212] border border-white/10 p-8 md:p-10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:border-[#CCFF00]/50 group-active:border-[#CCFF00]/50 group-hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] group-active:shadow-[0_0_30px_rgba(204,255,0,0.1)] transition-all duration-500 overflow-hidden h-full"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 pointer-events-none"></div>
          
          <motion.div style={{ background: glareBackground }} className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay opacity-80" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#CCFF00]">
                NODE: {data.id}
              </span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#CCFF00] group-active:bg-[#CCFF00] transition-colors duration-500 delay-75"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#CCFF00] group-active:bg-[#CCFF00] transition-colors duration-500 delay-150"></span>
              </div>
            </div>

            <h2 className={`${spaceGrotesk.className} text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4 leading-none`}>
              {data.title}
            </h2>
            
            <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed group-hover:text-gray-300 group-active:text-gray-300 transition-colors duration-300">
              {data.content}
            </p>
          </div>

          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-transparent group-hover:border-[#CCFF00] group-active:border-[#CCFF00] transition-colors duration-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-transparent group-hover:border-[#CCFF00] group-active:border-[#CCFF00] transition-colors duration-500"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function TermsPage() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <main ref={containerRef} className={`relative w-full min-h-screen bg-[#FAFAFA] pb-32 overflow-hidden ${inter.className}`}>
      
      <title>Terms of Engagement | PadelX</title>
      <meta name="seo-title" content="Terms of Engagement | PadelX" />
      <meta name="slug" content="/terms" />
      <meta name="description" content="Official terms and conditions for PadelX arena access and bookings." />
      <meta name="focus-key-phrase" content="padelx terms and conditions" />
      <meta name="seo-key-phrase" content="padel rules lahore" />
      <meta name="img-alt-text" content="PadelX Terms Protocol" />
      <meta name="seo-keywords" content="padel rules, padelx terms, tennis club conditions, court booking rules" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0"></div>

      <div className="relative w-full flex flex-col items-center text-center pt-48 pb-32 px-6 mb-24 overflow-hidden">
        
        <Image
          src="/termsandcondition/hero.webp"
          alt="PadelX Tactical Background"
          fill
          className="object-cover z-0 pointer-events-none"
          priority
        />
        
        <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>

        <div className="relative z-20 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.8 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            transition={{ duration: 0.8, ease: "backOut" }} 
            className="flex items-center gap-3 mb-6 px-5 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
            <span className="text-white font-mono text-[10px] tracking-[0.4em] uppercase font-bold">
              Legal Framework
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
            className={`${spaceGrotesk.className} text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6`}
          >
            Terms Of <br /> 
            <span className="text-transparent [-webkit-text-stroke:2px_#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.8)] relative inline-block">
              Engagement
              <motion.span 
                animate={{ top: ["0%", "100%", "0%"] }} 
                transition={{ duration: 5, ease: "linear", repeat: Infinity }} 
                className="absolute left-0 right-0 h-[2px] bg-[#CCFF00] z-20 shadow-[0_0_15px_#CCFF00]"
              ></motion.span>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6, duration: 0.8 }} 
            className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl"
          >
            By initializing a booking or entering the PadelX facility you inherently agree to the operational protocols listed below. Read them carefully to ensure smooth deployment on the court.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="relative w-full flex flex-col gap-12 lg:gap-24 py-10">
          
          <div className="absolute left-[20px] lg:left-1/2 top-0 bottom-0 w-[2px] bg-gray-200 lg:-translate-x-1/2 z-0 hidden md:block">
            <motion.div 
              style={{ scaleY, transformOrigin: "top" }}
              className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#CCFF00] via-[#121212] to-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.5)]"
            />
            <motion.div
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-[-2px] w-[6px] h-32 bg-[#CCFF00] rounded-full blur-[1px] shadow-[0_0_20px_#CCFF00]"
            />
          </div>

          <div className="flex flex-col gap-16 lg:gap-0">
            {termsData.map((data, index) => (
              <TermCard key={data.id} data={data} index={index} />
            ))}
          </div>

        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-32 w-full bg-[#121212] rounded-sm p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center shadow-2xl group"
        >
          <motion.div 
            animate={{ top: ["-10%", "110%"] }} 
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#CCFF00]/50 to-transparent z-0"
          />

          <h3 className={`${spaceGrotesk.className} text-white text-3xl md:text-5xl font-black tracking-tighter uppercase mb-6 relative z-10`}>
            Require <span className="text-transparent [-webkit-text-stroke:1px_#CCFF00] md:[-webkit-text-stroke:2px_#CCFF00] drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]">Clarification?</span>
          </h3>
          <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10 max-w-2xl relative z-10">
            If any of the parameters above are unclear please initialize a transmission to our command center before securing your court.
          </p>
          
          <Link href="/contact" className="relative z-10 inline-flex items-center justify-center gap-4 bg-[#CCFF00] text-[#121212] px-12 py-5 font-black uppercase tracking-[0.2em] text-sm overflow-hidden rounded-sm transition-all duration-300 hover:shadow-[0_10px_30px_rgba(204,255,0,0.4)] active:shadow-[0_10px_30px_rgba(204,255,0,0.4)] hover:scale-105 active:scale-105 group/btn">
            <span className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 group-active/btn:translate-y-0 transition-transform duration-500 ease-out z-0"></span>
            <span className="relative z-10">Contact Command</span>
            <svg className="w-5 h-5 relative z-10 -rotate-45 group-hover/btn:rotate-0 group-active/btn:rotate-0 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>

      </div>
    </main>
  );
}