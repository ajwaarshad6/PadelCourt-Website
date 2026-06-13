"use client";

import { motion, Variants, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll } from "framer-motion";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Space_Grotesk, Inter } from "next/font/google";
import HorizontalAbout from "../../components/HorizontalAbout";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "900"] });

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const CYPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&*+<>[]{}";

const CypherText = ({ text, isVisible, speed = 20 }: { text: string, isVisible: boolean, speed?: number }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!isVisible) {
      setDisplayText("");
      return;
    }
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            if (letter === " ") return " ";
            return CYPHER_CHARS[Math.floor(Math.random() * CYPHER_CHARS.length)];
          })
          .join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, speed);
    return () => clearInterval(interval);
  }, [text, isVisible, speed]);

  return <span>{displayText}</span>;
};

const SplitTextReveal = ({ text }: { text: string }) => {
  const words = text.split(" ");
  return (
    <motion.div 
      initial="hidden" whileInView="visible" viewport={{ once: true }} 
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="flex flex-wrap gap-x-4 gap-y-2"
    >
      {words.map((word, i) => (
        <span key={i} className="flex overflow-hidden">
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              variants={{
                hidden: { y: "100%", rotateX: -90, opacity: 0 },
                visible: { y: "0%", rotateX: 0, opacity: 1, transition: { type: "spring", damping: 12, stiffness: 200 } }
              }}
              className="inline-block origin-bottom"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

const MagneticStatCard = ({ children, className }: { children: React.ReactNode, className: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [25, -25]);
  const rotateY = useTransform(x, [-100, 100], [-25, 25]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.touches[0].clientX - centerX);
    y.set(e.touches[0].clientY - centerY);
  };

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onTouchMove={handleTouch}
      onTouchEnd={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`flex-1 flex flex-col justify-center perspective-[1000px] ${className}`}
    >
      <motion.div style={{ transform: "translateZ(40px)" }}>
        {children}
      </motion.div>
    </motion.div>
  );
};

const TacticalHUDImage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 10 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 10 });
  const maskImage = useMotionTemplate`radial-gradient(circle 300px at ${springX}px ${springY}px, black 0%, transparent 100%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.touches[0].clientX - left);
    mouseY.set(e.touches[0].clientY - top);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className="absolute inset-0 w-full h-full bg-[#0a0a0a] cursor-crosshair group z-0 overflow-hidden"
    >
      <img 
        src="https://images.unsplash.com/photo-1599407354170-87353f209581?q=80&w=2070&auto=format&fit=crop" 
        alt="Arena Detail Base" 
        className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale blur-[2px]"
      />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <motion.div 
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[300px] h-[300px] rounded-full border border-[#CCFF00]/20 border-dashed"
        />
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-[200px] h-[200px] rounded-full border border-[#CCFF00]/40"
        />
        <div className="absolute w-2 h-2 bg-[#CCFF00] rounded-full animate-ping" />
        <div className="absolute top-12 left-12 text-[#CCFF00] font-mono text-xs opacity-60 tracking-widest">
          <p>STATUS: <span className="animate-pulse">IDLE</span></p>
          <p className="mt-1">AWAITING INTERACTION...</p>
        </div>
      </motion.div>

      <motion.div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <img 
          src="https://images.unsplash.com/photo-1599407354170-87353f209581?q=80&w=2070&auto=format&fit=crop" 
          alt="Arena Detail Color" 
          className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-out"
        />
        <div className="absolute inset-0 bg-[#CCFF00] mix-blend-overlay opacity-20"></div>
      </motion.div>
    </div>
  );
};

const faqData = [
  {
    id: 1,
    question: "HOW CAN I BOOK A COURT?",
    answer: "ACCESS OUR ONLINE TERMINAL OR CONTACT THE FRONT DESK DIRECTLY. ADVANCE BOOKING IS STRONGLY RECOMMENDED TO SECURE PRIME TIME SLOTS. SYSTEM UPDATES AVAILABILITY IN REAL-TIME."
  },
  {
    id: 2,
    question: "CAN I RENT EQUIPMENT AT THE ARENA?",
    answer: "AFFIRMATIVE. OUR ARMORY IS STOCKED WITH HIGH-PERFORMANCE CARBON FIBER RACKETS AND CHAMPIONSHIP-GRADE BALLS AVAILABLE FOR DEPLOYMENT UPON ARRIVAL."
  },
  {
    id: 3,
    question: "ARE THERE TOURNAMENTS OR LEAGUES?",
    answer: "WE HOST ELITE COMBAT LEAGUES AND OPEN TOURNAMENTS REGULARLY. TACTICAL BRIEFINGS AND REGISTRATION DATES ARE BROADCASTED VIA OUR DIGITAL BOARDS AND MEMBER COMMS."
  }
];

export default function AboutPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const ctaRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ctaRef, offset: ["start end", "end start"] });
  const textX1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textX2 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  return (
    <main className={`relative w-full overflow-clip bg-[#121212] pb-0 ${inter.className}`}>
      
      <section className="relative w-full h-[100vh] flex flex-col items-center justify-center overflow-hidden">
       <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/6.mp4" type="video/mp4" />
          </video>
        <div className="absolute inset-0 bg-black/70 z-5 backdrop-blur-[1px]"></div>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center text-center relative z-10 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="mb-6 px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
            <p className="text-[#CCFF00] text-xs font-bold tracking-[0.3em] uppercase">The Genesis of PadelX</p>
          </motion.div>
          <motion.h1 variants={fadeInUp} className={`${spaceGrotesk.className} text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8`}>
            Redefining The <br /> <span className="text-transparent [-webkit-text-stroke:2px_#CCFF00]">Sporting Arena</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-200 text-lg md:text-xl max-w-3xl font-light leading-relaxed">
            We set out with a singular vision to bring world class infrastructure to Lahore. PadelX is not just a facility but a movement dedicated to elevating athletic performance and community engagement.
          </motion.p>
        </motion.div>
      </section>

      <HorizontalAbout />

      <section className="relative w-full bg-white py-24 md:py-32 text-[#121212] overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 mt-20 opacity-5 pointer-events-none select-none">
          <h1 className={`${spaceGrotesk.className} text-[15rem] font-black leading-none uppercase tracking-tighter`}>ELITE</h1>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            <div className="lg:col-span-5 flex flex-col justify-center h-full pt-10">
              <span className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#121212] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
                System Protocols
              </span>
              <h2 className={`${spaceGrotesk.className} text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 leading-[0.9]`}>
                 <SplitTextReveal text="WE ARE PROUD TO BE THE BEST IN CLASS" />
              </h2>
              
              <div className="flex flex-col gap-2 relative">
                {faqData.map((faq) => {
                  const isActive = activeFaq === faq.id;
                  return (
                    <div key={faq.id} className="relative group">
                      <button 
                        onClick={() => setActiveFaq(isActive ? null : faq.id)}
                        className={`w-full text-left py-6 px-4 border-l-4 transition-all duration-300 relative overflow-hidden ${isActive ? "border-[#CCFF00] bg-[#121212] pl-8" : "border-gray-200 hover:border-[#CCFF00] hover:bg-gray-50 active:border-[#CCFF00] active:bg-gray-50"}`}
                      >
                        <span className={`${spaceGrotesk.className} text-sm md:text-lg font-black uppercase tracking-tight relative z-10 ${isActive ? "text-[#CCFF00]" : "text-[#121212] group-hover:text-[#CCFF00]"}`}>
                           {faq.question}
                        </span>
                        
                        {!isActive && (
                          <div className="absolute inset-0 w-0 bg-[#121212] group-hover:w-full transition-all duration-500 ease-out z-0 opacity-5"></div>
                        )}
                      </button>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="lg:hidden overflow-hidden bg-[#121212] px-8 border-l-4 border-[#CCFF00]"
                          >
                            <p className="pb-6 text-gray-400 text-sm leading-relaxed font-mono">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="lg:col-span-7 relative hidden lg:block h-[700px]">
              <div className="w-full h-full relative perspective-[1200px]">
                <AnimatePresence mode="wait">
                  
                  {activeFaq === null ? (
                    <motion.div 
                      key="stats-view"
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 w-full h-full rounded-sm overflow-hidden shadow-2xl"
                    >
                      <TacticalHUDImage />
                      
                      <div className="absolute bottom-8 left-8 right-8 flex gap-6 z-20 h-40">
                        <MagneticStatCard className="bg-[#CCFF00]/90 backdrop-blur-md border border-[#CCFF00] p-6 shadow-[0_20px_40px_rgba(204,255,0,0.2)]">
                          <p className={`${spaceGrotesk.className} text-xs font-black uppercase tracking-widest text-[#121212] mb-1 opacity-70`}>Athletes</p>
                          <h3 className={`${spaceGrotesk.className} text-5xl xl:text-7xl font-black text-[#121212] tracking-tighter`}>100<span className="text-3xl">+</span></h3>
                          <p className="text-[#121212] text-[10px] font-bold uppercase tracking-tight mt-1 opacity-80">Daily Deployments</p>
                        </MagneticStatCard>

                        <MagneticStatCard className="bg-[#121212]/90 backdrop-blur-md border border-white/10 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                          <p className={`${spaceGrotesk.className} text-xs font-black uppercase tracking-widest text-white mb-1 opacity-50`}>Facilities</p>
                          <h3 className={`${spaceGrotesk.className} text-5xl xl:text-7xl font-black text-[#CCFF00] tracking-tighter`}>2</h3>
                          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight mt-1">FIP Standard Courts</p>
                        </MagneticStatCard>
                      </div>
                    </motion.div>
                  ) : 
                  
                  (
                    <motion.div 
                      key="answer-view"
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 w-full h-full bg-[#121212] rounded-sm overflow-hidden shadow-2xl border border-white/10 flex flex-col p-12"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent opacity-50"></div>
                      <div className="absolute top-12 left-12 w-16 h-16 border-t-2 border-l-2 border-[#CCFF00] opacity-30"></div>
                      <div className="absolute bottom-12 right-12 w-16 h-16 border-b-2 border-r-2 border-[#CCFF00] opacity-30"></div>
                      
                      <div className="flex justify-between items-center mb-auto border-b border-white/10 pb-6">
                        <span className="text-[#CCFF00] font-mono text-xs tracking-[0.4em] uppercase flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full animate-pulse"></span>
                           Data Decoded
                        </span>
                        <button 
                          onClick={() => setActiveFaq(null)}
                          className="text-gray-400 hover:text-white font-mono text-xs tracking-widest transition-colors flex items-center gap-2 group"
                        >
                          [ CLOSE ]
                        </button>
                      </div>

                      <div className="my-auto">
                        <h3 className={`${spaceGrotesk.className} text-3xl font-black text-white uppercase tracking-tighter mb-8 leading-tight`}>
                           {faqData.find(f => f.id === activeFaq)?.question}
                        </h3>
                        <p className="text-[#CCFF00] text-xl md:text-2xl leading-relaxed font-mono uppercase">
                          {faqData.find(f => f.id === activeFaq)?.answer}
                        </p>
                      </div>

                      <div className="mt-auto pt-6 border-t border-white/10 flex justify-between">
                         <span className="text-gray-600 font-mono text-[10px] tracking-widest uppercase">ID: PadelX-SYS-{activeFaq}</span>
                         <span className="text-gray-600 font-mono text-[10px] tracking-widest uppercase">Status: Secure</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section ref={ctaRef} className="relative w-full h-[80vh] bg-white overflow-hidden flex flex-col items-center justify-center border-t border-gray-100">
        
        <div className="absolute inset-0 flex flex-col justify-center gap-2 opacity-5 pointer-events-none select-none z-0">
          <motion.h1 
            style={{ x: textX1 }} 
            className={`${spaceGrotesk.className} text-[18vw] font-black text-[#121212] whitespace-nowrap leading-[0.8] uppercase`}
          >
            READY TO ENTER READY TO ENTER
          </motion.h1>
          <motion.h1 
            style={{ x: textX2 }} 
            className={`${spaceGrotesk.className} text-[18vw] font-black text-transparent [-webkit-text-stroke:2px_#121212] whitespace-nowrap leading-[0.8] uppercase`}
          >
            THE ARENA THE ARENA THE ARENA
          </motion.h1>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8 flex items-center gap-6">
            <span className="w-12 h-[1px] bg-[#CCFF00]"></span>
            <span className="text-[#CCFF00] font-mono text-xs tracking-[0.5em] uppercase">Final Step</span>
            <span className="w-12 h-[1px] bg-[#CCFF00]"></span>
          </div>
          
          <h2 className={`${spaceGrotesk.className} text-5xl md:text-7xl lg:text-8xl font-black text-[#121212] uppercase tracking-tighter mb-12 text-center drop-shadow-xl`}>
            Step Into <br/> The <span className="text-[#CCFF00] [-webkit-text-stroke:2px_#121212]">Grid</span>
          </h2>

          <Link href="/booking">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(204,255,0,0.5)" }} 
              whileTap={{ scale: 0.95 }} 
              className="relative group px-14 py-6 bg-[#CCFF00] text-[#121212] font-black uppercase tracking-[0.3em] text-sm overflow-hidden rounded-sm transition-all duration-300 shadow-xl"
            >
              <motion.span 
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 w-1/2 h-full bg-white/40 skew-x-[30deg]"
              ></motion.span>
              <span className="relative z-10">Initiate Booking</span>
            </motion.button>
          </Link>
        </div>
      </section>
    </main>
  );
}