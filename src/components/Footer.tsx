"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence, Variants } from "framer-motion";
import { Space_Grotesk, Inter } from "next/font/google";
import Link from "next/link";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

// --- MAGNETIC BUTTON COMPONENT ---
const MagneticSocial = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.4, y: middleY * 0.4 });
  };

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e.touches[0];
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.4, y: middleY * 0.4 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const { x, y } = position;
  return (
    <motion.div
      style={{ position: "relative" }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onTouchMove={handleTouch}
      onTouchEnd={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="z-10"
    >
      {children}
    </motion.div>
  );
};

// --- ANIMATED LINK COMPONENT ---
const AnimatedLink = ({ title, href }: { title: string, href: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={href} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)} 
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onTouchCancel={() => setIsHovered(false)}
      className="relative flex items-center group py-1 w-max"
    >
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: isHovered ? 16 : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-hidden flex items-center h-full mr-1"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]" />
      </motion.div>
      <motion.span 
        animate={{ x: isHovered ? 4 : 0, color: isHovered ? "#CCFF00" : "#9CA3AF" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-sm font-medium transition-colors"
      >
        {title}
      </motion.span>
    </Link>
  );
};

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  
  // Spotlight Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 10 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 10 });
  const spotlightMask = useMotionTemplate`radial-gradient(400px circle at ${springX}px ${springY}px, rgba(204, 255, 0, 0.08), transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Parallax Big Text
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "end end"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);

  // Entrance Animation 
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } as any }
  };

  return (
    <footer 
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full bg-[#0a0a0a] text-white pt-24 pb-8 overflow-hidden border-t border-white/5 ${inter.className}`}
    >
      {/* Dynamic Spotlight Follows Cursor */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ background: spotlightMask }} />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 mix-blend-overlay"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-6 md:px-12 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">
          
          {/* 1. Brand Column */}
          <motion.div variants={itemVariants} className="md:col-span-4 flex flex-col gap-6">
            <h2 className={`${spaceGrotesk.className} text-4xl font-black tracking-tighter text-[#CCFF00] uppercase`}>
              PADELX
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Experience the absolute pinnacle of racquet sports in Lahore. Engineered for champions, designed for the community. Master the rebound.
            </p>
            <div className="mt-2 inline-flex items-center gap-3 px-4 py-2 border border-white/10 rounded-full bg-white/5 w-max backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_10px_#CCFF00]"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300">System Online</span>
            </div>
          </motion.div>

          {/* 2. Quick Links */}
          <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col gap-6">
            <h3 className={`${spaceGrotesk.className} text-white font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-4`}>
              Quick Links
            </h3>
            <div className="flex flex-col gap-3">
              <AnimatedLink title="Book a Court" href="/booking" />
              <AnimatedLink title="About" href="/about" />
              <AnimatedLink title="Membership Plans" href="/membership" />
              <AnimatedLink title="Contact" href="/contact" />
            </div>
          </motion.div>

          {/* 3. Customer Care */}
          <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col gap-6">
            <h3 className={`${spaceGrotesk.className} text-white font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-4`}>
              Customer Care
            </h3>
            <div className="flex flex-col gap-3">
              <AnimatedLink title="Privacy Policy" href="/privacy-policy" />
              <AnimatedLink title="FAQs" href="/faqs" />
              <AnimatedLink title="Terms and Conditions" href="/terms" />
            </div>
          </motion.div>

          {/* 4. Headquarter */}
          <motion.div variants={itemVariants} className="md:col-span-4 flex flex-col gap-6">
            <h3 className={`${spaceGrotesk.className} text-[#CCFF00] font-bold uppercase tracking-widest text-xs border-b border-[#CCFF00]/20 pb-4`}>
              Headquarter
            </h3>
            <ul className="flex flex-col gap-4 text-gray-400 text-sm font-medium">
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="mt-0.5 text-gray-500 group-hover:text-[#CCFF00] group-active:text-[#CCFF00] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <span className="group-hover:text-white group-active:text-white transition-colors">Hotel MayFair 4th floor, <br/>
                50-52, E - III, Commercial Zone, <br/>
                Gulberg III, 54660, Lahore, Punjab.</span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="text-gray-500 group-hover:text-[#CCFF00] group-active:text-[#CCFF00] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <a href="mailto:hello@letspadel.pk" className="group-hover:text-white group-active:text-white transition-colors">hello@letspadel.pk</a>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="text-gray-500 group-hover:text-[#CCFF00] group-active:text-[#CCFF00] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <a href="tel:+923044355096" className="group-hover:text-white group-active:text-white transition-colors">+92 304 4355 096</a>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* 5. Bottom Bar & Socials */}
        <motion.div variants={itemVariants} className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="text-gray-500 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium flex flex-col md:flex-row gap-2 md:gap-8 items-center">
            <p>2026 PADELX LAHORE. ALL RIGHTS RESERVED.</p>
          </div>

          <div className="flex gap-4">
            <MagneticSocial>
              <a href="#" className="w-12 h-12 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center hover:border-[#CCFF00] active:border-[#CCFF00] hover:bg-[#CCFF00] active:bg-[#CCFF00] hover:text-[#121212] active:text-[#121212] transition-all duration-300 text-white shadow-xl group">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
              </a>
            </MagneticSocial>
            <MagneticSocial>
              <a href="#" className="w-12 h-12 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center hover:border-[#CCFF00] active:border-[#CCFF00] hover:bg-[#CCFF00] active:bg-[#CCFF00] hover:text-[#121212] active:text-[#121212] transition-all duration-300 text-white shadow-xl group">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </MagneticSocial>
          </div>
        </motion.div>
      </motion.div>

      {/* Massive Parallax Watermark behind the content but inside the footer */}
      <motion.div 
        style={{ y: textY, opacity }} 
        className="absolute bottom-[-10%] left-0 w-full flex justify-center pointer-events-none select-none z-0 overflow-hidden"
      >
        <h1 className={`${spaceGrotesk.className} text-[20vw] font-black leading-none uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.05)] whitespace-nowrap`}>
          PADELX
        </h1>
      </motion.div>
    </footer>
  );
}