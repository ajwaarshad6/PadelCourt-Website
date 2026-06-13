"use client";

import { motion, Variants, useMotionValue, useSpring, useTransform, useScroll, useInView, useAnimate } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Space_Grotesk, Inter } from "next/font/google";
import OfferingsSection from "../components/OfferingsSection";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "900"] });

const MagneticElement = ({ children }: { children: React.ReactElement }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (clientX: number, clientY: number) => {
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => handleMove(e.clientX, e.clientY);
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => handleMove(e.touches[0].clientX, e.touches[0].clientY);

  const reset = () => setPosition({ x: 0, y: 0 });

  const { x, y } = position;
  return (
    <motion.div
      style={{ position: "relative" }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onTouchMove={handleTouchMove}
      onTouchEnd={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const TacticalCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMove = (clientX: number, clientY: number, target: EventTarget) => {
    const rect = (target as HTMLElement).getBoundingClientRect();
    x.set((clientX - rect.left) / rect.width - 0.5);
    y.set((clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => handleMove(e.clientX, e.clientY, e.currentTarget);
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => handleMove(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div onMouseMove={handleMouseMove} onMouseLeave={handleLeave} onTouchMove={handleTouchMove} onTouchEnd={handleLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className={`relative group ${className || ""}`}>
      <div style={{ transform: "translateZ(50px)" }} className="h-full w-full">{children}</div>
    </motion.div>
  );
};

const fadeInUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const overlayReveal: Variants = { hidden: { height: "100%" }, visible: { height: "0%", transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.2 } } };
const cardFloat: Variants = { hidden: { opacity: 0, x: -50, y: 20 }, visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.6 } }, float: { y: [0, -12, 0], transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } } };

const HudStat = ({ number, label, suffix = "", isGauge = false, delayIdx = 0 }: { number: number, label: string, suffix?: string, isGauge?: boolean, delayIdx?: number }) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      animate(scope.current, { opacity: [0, 1, 0.5, 1], filter: ["blur(10px)", "blur(0px)"], scale: [0.8, 1] }, { duration: 0.6, delay: delayIdx * 0.15, ease: "circOut" });
      
      let start = 0;
      const end = number;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, number, animate, scope, delayIdx]);

  return (
    <motion.div ref={scope} className="relative p-8 flex flex-col items-center justify-center border-r border-white/10 last:border-r-0 overflow-hidden bg-[#121212]/80 backdrop-blur-md opacity-0">
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#CCFF00]/50"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#CCFF00]/50"></div>
      
      {isGauge ? (
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
           <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" stroke="#FFFFFF" strokeWidth="1" fill="transparent" opacity="0.1" strokeDasharray="4 2"/>
              <motion.circle 
                cx="60" cy="60" r="54" stroke="#CCFF00" strokeWidth="3" fill="transparent" 
                strokeDasharray="339"
                strokeLinecap="butt"
                initial={{ strokeDashoffset: 339 }}
                animate={isInView ? { strokeDashoffset: 339 - (339 * (displayValue / number)) } : {}}
                transition={{ duration: 2.5, ease: "easeOut", delay: delayIdx * 0.2 }}
                className="drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]"
              />
              <motion.circle animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} cx="60" cy="60" r="40" stroke="#00FFFF" strokeWidth="1" fill="transparent" opacity="0.2" strokeDasharray="10 10" className="origin-center"/>
           </svg>
           <h3 className={`${spaceGrotesk.className} text-4xl font-black text-white tabular-nums z-10 relative`}>
             {displayValue}<span className="text-[#CCFF00] text-xl">{suffix}</span>
           </h3>
        </div>
      ) : (
        <h3 className={`${spaceGrotesk.className} text-7xl md:text-8xl font-black text-white mb-4 tabular-nums tracking-tighter relative z-10`}>
          {displayValue}<span className="text-[#CCFF00] text-4xl">{suffix}</span>
        </h3>
      )}
      
      <div className="relative overflow-hidden px-6 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-sm z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#CCFF00]/20 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
        <p className={`${spaceGrotesk.className} text-white font-bold uppercase tracking-[0.4em] text-[10px]`}>
          {label}
        </p>
      </div>
      
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
    </motion.div>
  );
};

const FaqAccordion = ({ faqs }: { faqs: { question: string, answer: string }[] }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="w-full flex flex-col gap-4">
      {faqs.map((faq, i) => {
        const isOpen = openIdx === i;
        return (
           <div key={i} className="flex flex-col bg-white border border-gray-200 shadow-[0_5px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden group rounded-sm">
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className={`flex justify-between items-center w-full px-6 py-5 md:py-6 text-left transition-colors duration-300 ${isOpen ? "bg-[#CCFF00]" : "bg-transparent hover:bg-gray-50 active:bg-gray-100"}`}
              >
                <span className={`${spaceGrotesk.className} text-xl md:text-2xl font-bold text-[#121212] tracking-tight`}>
                  {faq.question}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className={`flex-shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full border-2 ${isOpen ? "border-[#121212] text-[#121212]" : "border-gray-300 text-gray-400 group-hover:border-[#CCFF00] group-hover:text-[#CCFF00]"}`}>
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                   </svg>
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden bg-white"
              >
                <div className="px-6 pb-6 pt-2 text-gray-600 font-medium leading-relaxed text-base md:text-lg">
                   {faq.answer}
                </div>
              </motion.div>
           </div>
        )
      })}
    </div>
  )
};

const reviewData = [
  { name: "Tariq A.", text: "The courts are simply world class. The bounce, the lighting, everything is engineered for perfection." },
  { name: "Sarah K.", text: "Finally, a proper facility in Lahore. The 24/7 access is a game changer for my schedule." },
  { name: "Omer R.", text: "Pure, unadulterated competition. The best club I have joined." },
  { name: "Ahmed F.", text: "The panoramic glass makes you feel like you are playing in a professional tournament." },
  { name: "Zainab M.", text: "Incredible turf quality. My knees feel great even after a two hour intense session." },
  { name: "Hassan Q.", text: "The automated booking and premium vibe make this the elite spot for Padel." },
  { name: "Bilal S.", text: "Unmatched energy. The community here is as competitive as the facilities are premium." },
  { name: "Fatima J.", text: "Every detail, from the acoustics to the lighting, screams high end." }
];

const ReviewCard = ({ review }: { review: { name: string, text: string } }) => (
  <div className="relative w-[320px] md:w-[450px] p-8 md:p-10 rounded-xl bg-[#121212] border border-white/5 shadow-2xl group hover:border-[#CCFF00]/50 hover:bg-[#1a1a1a] transition-all duration-500 flex-shrink-0 opacity-80 hover:opacity-100 hover:scale-105 z-10 hover:z-50">
     <svg className="absolute top-6 right-8 w-16 h-16 text-white/5 group-hover:text-[#CCFF00]/10 transition-colors duration-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
     </svg>
     <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed mb-8 relative z-10 group-hover:text-white transition-colors duration-300">
       {review.text}
     </p>
     <div className="flex items-center gap-4 relative z-10">
       <div className="w-10 h-10 rounded-full bg-[#CCFF00]/20 flex items-center justify-center border border-[#CCFF00]/30 group-hover:bg-[#CCFF00] group-hover:border-[#CCFF00] transition-colors duration-500">
         <span className="text-[#121212] font-black text-sm">{review.name.charAt(0)}</span>
       </div>
       <span className="text-white font-bold tracking-widest uppercase text-sm group-hover:text-[#CCFF00] transition-colors duration-300">{review.name}</span>
     </div>
  </div>
);

const ReviewsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const tiltX = useSpring(15, { damping: 20, stiffness: 100 });
  const tiltY = useSpring(-5, { damping: 20, stiffness: 100 });
  const tiltZ = useSpring(2, { damping: 20, stiffness: 100 });
  const scale = useSpring(0.95, { damping: 20, stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    tiltX.set(0); tiltY.set(0); tiltZ.set(0); scale.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    tiltX.set(15); tiltY.set(-5); tiltZ.set(2); scale.set(0.95);
  };

  const row1 = [...reviewData.slice(0,4), ...reviewData.slice(0,4)];
  const row2 = [...reviewData.slice(4,8), ...reviewData.slice(4,8)];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-32 bg-white overflow-hidden cursor-crosshair border-t border-gray-100"
    >
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(204,255,0,0.15), transparent 40%)`,
          opacity: isHovered ? 1 : 0
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-40 mb-24 text-center">
         <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-3 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]"></span>
            <span className="text-[#121212] font-black uppercase tracking-[0.3em] text-xs">Unfiltered Feedback</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]"></span>
         </motion.div>
         <h2 className={`${spaceGrotesk.className} text-6xl md:text-8xl font-black text-[#121212] uppercase tracking-tighter`}>
            The <span className="text-transparent [-webkit-text-stroke:2px_#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.4)]">Verdict</span>
         </h2>
      </div>

      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY, rotateZ: tiltZ, scale, transformStyle: "preserve-3d" }}
        className="w-full flex flex-col gap-8 md:gap-12 perspective-[2000px] relative z-20"
      >
         <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="flex w-max gap-8 md:gap-12 px-4">
            {row1.map((rev, i) => ( <ReviewCard key={`r1-${i}`} review={rev} /> ))}
         </motion.div>

         <motion.div animate={{ x: ["-50%", "0%"] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} className="flex w-max gap-8 md:gap-12 px-4 ml-[-15vw]">
            {row2.map((rev, i) => ( <ReviewCard key={`r2-${i}`} review={rev} /> ))}
         </motion.div>
      </motion.div>
      
      <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-white to-transparent z-30 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-white to-transparent z-30 pointer-events-none"></div>
    </section>
  )
}

export default function Home() {
  const statsRef = useRef(null);
  const aboutRef = useRef(null);
  
  const { scrollYProgress: statsScroll } = useScroll({ target: statsRef, offset: ["start end", "end start"] });
  const { scrollYProgress: aboutScroll } = useScroll({ target: aboutRef, offset: ["0 1", "0.6 1"] });
  
  const backgroundYStats = useTransform(statsScroll, [0, 1], ["-20%", "20%"]);
  
  const aboutImageClip = useTransform(aboutScroll, [0, 1], ["inset(0% 0% 0% 0% round 32px)", "inset(0% 0% 0% 0% round 16px)"]);
  const aboutImageScale = useTransform(aboutScroll, [0, 1], [1.2, 1]);

  return (
    <main className={`relative w-full overflow-clip bg-white ${inter.className}`}>
      <title>PadelX Lahore Arena</title>
      <meta name="seo-title" content="PadelX Lahore Arena" />
      <meta name="slug" content="/" />
      <meta name="description" content="Premium Padel Tennis Facility in Lahore" />
      <meta name="focus-key-phrase" content="padel tennis facility" />
      <meta name="seo-key-phrase" content="padelx arena booking" />
      <meta name="img-alt-text" content="PadelX Premium Court View" />
      <meta name="seo-keywords" content="padelx, padel tennis, premium courts, sports club" />

      <section className="relative w-full min-h-screen flex items-center pt-32 pb-20 bg-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/9.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-pulse"></span>
            <p className="text-white text-xs font-bold tracking-[0.3em] uppercase">The Pulse Of Lahore Just Got Faster</p>
          </div>
          <h1 className="flex flex-col text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.85] uppercase">
            <span className="text-white drop-shadow-md">Master</span>
            <span className="text-transparent [-webkit-text-stroke:2px_white] lg:[-webkit-text-stroke:3px_white] drop-shadow-md">The</span>
            <span className="text-[#CCFF00] drop-shadow-[0_0_30px_rgba(204,255,0,0.8)]">Rebound</span>
          </h1>
          <Link href="/booking">
            <button className="mt-12 px-10 py-5 bg-[#CCFF00] text-[#121212] font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(204,255,0,0.4)]">Book Your Court</button>
          </Link>
        </div>
      </section>

      <section ref={aboutRef} className="relative w-full py-24 md:py-32 bg-white z-10 overflow-hidden perspective-[1000px]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="w-full lg:w-[55%] relative">
            <motion.div style={{ clipPath: aboutImageClip }} className="relative w-full aspect-[4/5] md:aspect-[3/4] bg-gray-200 overflow-hidden shadow-2xl">
              <motion.div style={{ scale: aboutImageScale }} className="absolute inset-0 bg-[url('/world.webp')] bg-cover bg-center z-10" />
              <motion.div variants={overlayReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="absolute inset-0 bg-white z-20" />
            </motion.div>
            <motion.div variants={cardFloat} initial="hidden" whileInView={["visible", "float"]} viewport={{ once: false }} className="absolute bottom-[-1.5rem] left-[-1rem] md:bottom-[-2.5rem] md:left-[-2.5rem] w-64 md:w-80 bg-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border-b-4 border-[#CCFF00] z-30">
              <h3 className="text-[#121212] font-black text-xl md:text-2xl uppercase leading-tight">Premium FIP <br /> Standard Turf</h3>
            </motion.div>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} className="w-full lg:w-[40%] flex flex-col items-start pt-12 lg:pt-0">
            <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } } }} className="flex items-center gap-4 mb-6 relative">
              <div className="w-2 h-2 rounded-full bg-[#121212] animate-ping absolute"></div>
              <div className="w-2 h-2 rounded-full bg-[#121212] relative"></div>
              <span className="text-[#121212] font-bold tracking-[0.2em] uppercase text-sm">About Us</span>
            </motion.div>
            <div className="flex flex-col gap-1 mb-8 [perspective:1000px]">
              {["World Class", "European", "Standards"].map((word, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.h2 variants={{ hidden: { opacity: 0, y: 100, rotateX: -60, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }} className="text-4xl md:text-5xl lg:text-6xl font-black text-[#121212] uppercase leading-[0.9] tracking-tighter origin-bottom">
                    {word}
                  </motion.h2>
                </div>
              ))}
            </div>
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } } }} className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 font-light">
               We are revolutionizing racquet sports in the region with premium imported red and green turf paired with a breathtaking European structural design.
            </motion.p>
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: "easeOut" } } }} className="text-gray-600 text-base md:text-lg leading-relaxed mb-10 font-light">
               Whether you are a seasoned professional or picking up a racket our courts offer the absolute perfect space to compete and train.
            </motion.p>
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.5, ease: "backOut" } } }}>
              <MagneticElement>
                <button className="px-10 py-4 bg-[#CCFF00] text-[#121212] font-black uppercase tracking-widest text-sm shadow-xl hover:bg-[#121212] hover:text-white active:bg-[#121212] active:text-white transition-all duration-300 rounded-sm">Game On</button>
              </MagneticElement>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative w-full py-24 md:py-32 bg-white z-10 overflow-hidden border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} className="text-center max-w-4xl mx-auto mb-16 md:mb-24 relative">
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }} className="inline-block mb-4 relative">
               <span className="text-[#121212] font-black tracking-[0.2em] uppercase text-sm relative z-10">Services</span>
               <div className="absolute -inset-2 bg-[#CCFF00]/20 blur-xl rounded-full -z-10"></div>
            </motion.div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9] [perspective:1000px]">
              <motion.span variants={{ hidden: { opacity: 0, y: 40, rotateX: -90 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: "easeOut" } } }} className="block text-[#121212] origin-bottom">Premium Padel</motion.span>
              <motion.span variants={{ hidden: { opacity: 0, y: 40, rotateX: -90 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.1 } } }} className="block text-[#CCFF00] [-webkit-text-stroke:1px_#121212] md:[-webkit-text-stroke:2px_#121212] drop-shadow-[0_10px_20px_rgba(204,255,0,0.4)] mt-1 origin-bottom">Tennis Facility</motion.span>
            </h2>
            <motion.p variants={{ hidden: { opacity: 0, filter: "blur(10px)", y: 20 }, visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.8, delay: 0.3 } } }} className="text-gray-600 text-base md:text-lg leading-relaxed font-light mx-auto max-w-3xl">
              Elevate your game at PadelX, featuring state-of-the-art courts and premium amenities. Perfect for players of all levels to compete, train, and experience the ultimate padel environment independently.
            </motion.p>
          </motion.div>
          <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut" }} viewport={{ once: false, amount: 0.3 }} className="w-full lg:w-1/2 relative group perspective-[1000px]">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#CCFF00]/40 to-transparent blur-3xl opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-700"></div>
              <div className="bg-[#BAC3CE] p-6 md:p-8 w-full rounded-sm shadow-2xl relative z-10">
                <motion.div initial={{ clipPath: "inset(100% 0 0 0)" }} whileInView={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.2 }} className="relative w-full aspect-video bg-gray-900 overflow-hidden rounded-sm">
                   <motion.img whileHover={{ scale: 1.05 }} whileTap={{ scale: 1.05 }} transition={{ duration: 0.8, ease: "easeOut" }} src="/services-section.webp" alt="PadelX Courts" className="w-full h-full object-cover opacity-90" />
                </motion.div>
              </div>
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} className="w-full lg:w-1/2 relative">
              <motion.h3 variants={{ hidden: { opacity: 0, x: 30, filter: "blur(10px)" }, visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.8 } } }} className="text-[#121212] font-black text-2xl md:text-3xl mb-10 tracking-tight">What makes PadelX different from other Padel Clubs.</motion.h3>
              <ul className="flex flex-col w-full relative">
                <motion.div initial={{ height: "0%" }} whileInView={{ height: "100%" }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }} className="absolute left-[11px] top-6 bottom-4 w-[2px] bg-gradient-to-b from-[#CCFF00] via-gray-300 to-transparent opacity-60 z-0"></motion.div>
                {["Single Padel Court", "Double Padel Court", "24/7 Available", "Fibrillated Grass Turf", "Membership Plan"].map((item, i) => (
                  <motion.li key={i} variants={{ hidden: { opacity: 0, x: 40, filter: "blur(10px)" }, visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.6, delay: i * 0.15, type: "spring", stiffness: 100 } } }} whileHover="hover" whileTap="hover" className="flex items-center gap-6 py-4 group cursor-default relative z-10">
                    <div className="relative flex items-center justify-center w-6 h-6 bg-white rounded-full">
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.5 + (i * 0.1), type: "spring" }} variants={{ hover: { scale: 1.6, boxShadow: "0px 0px 15px #CCFF00" } }} className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] transition-all duration-300" />
                    </div>
                    <motion.span variants={{ hover: { x: 10, color: "#99cc00" } }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="text-[#121212] font-medium text-lg md:text-xl tracking-tight transition-colors duration-300">{item}</motion.span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <OfferingsSection />

      <section className={`relative w-full bg-white overflow-hidden py-24 md:py-32 ${inter.className}`}>
        <motion.div initial={{ x: "100%", skewX: "-12deg" }} whileInView={{ x: "30%", skewX: "-12deg" }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} className="absolute top-0 right-0 w-full md:w-[80%] h-full bg-[#CCFF00]/10 z-0 origin-right" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} className="lg:col-span-7">
              <div className="inline-flex items-center gap-4 mb-6">
                <motion.span initial={{ width: 0 }} whileInView={{ width: "2rem" }} transition={{ duration: 1, delay: 0.2 }} className="h-[2px] bg-[#CCFF00] block"></motion.span>
                <motion.span variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="text-xs font-bold uppercase tracking-widest text-black/40">Elite Competition</motion.span>
              </div>
              <h2 className={`${spaceGrotesk.className} text-6xl md:text-8xl font-bold text-black leading-[0.85] uppercase tracking-tighter mb-8 [perspective:1000px]`}>
                <div className="overflow-hidden py-2">
                  <motion.span variants={{ hidden: { opacity: 0, y: 100, rotateX: -90 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }} className="block origin-bottom">Book a</motion.span>
                </div>
                <div className="overflow-hidden py-2 -mt-2">
                  <motion.span variants={{ hidden: { opacity: 0, y: 100, rotateX: -90 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] } } }} className="block text-transparent [-webkit-text-stroke:1.5px_#000] origin-bottom hover:text-[#CCFF00] active:text-[#CCFF00] hover:[-webkit-text-stroke:0px] hover:drop-shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all duration-500 cursor-default">Tournament</motion.span>
                </div>
              </h2>
              <motion.p variants={{ hidden: { opacity: 0, y: 20, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, delay: 0.2 } } }} className="text-lg md:text-xl text-black/60 max-w-xl leading-relaxed">
                Experience pure, self-driven competition. We are a dedicated play facility built for raw, independent matches. Secure your slot in our upcoming tournaments and let your skills do the talking.
              </motion.p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50, scale: 0.9, filter: "blur(15px)" }} whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} viewport={{ once: false, amount: 0.3 }} className="lg:col-span-5 relative perspective-[1000px]">
              <TacticalCard>
                <div className="relative group h-full">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#CCFF00] to-[#b3e600] rounded-2xl blur-lg opacity-30 group-hover:opacity-60 group-hover:blur-xl transition-all duration-700"></div>
                  <div className="relative bg-[#121212] rounded-2xl p-8 md:p-10 text-white shadow-2xl h-full flex flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                    <div className="flex justify-between items-start mb-12 relative z-10">
                      <div>
                        <p className="text-[#CCFF00] text-xs font-bold uppercase tracking-widest mb-2">Next Season</p>
                        <p className="text-3xl font-bold">Open Registration</p>
                      </div>
                      <div className="bg-white/10 p-3 rounded-full border border-white/5">
                        <svg className="w-6 h-6 text-[#CCFF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    </div>
                    <div className="space-y-6 mb-12 relative z-10">
                      {["Select your category", "Invite your partner", "Enter the battleground"].map((step, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-white/10 pb-4 group/step">
                          <span className="text-white/40 text-sm font-mono group-hover/step:text-[#CCFF00] transition-colors duration-300">0{i+1}</span>
                          <span className="font-medium group-hover/step:translate-x-2 transition-transform duration-300">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="relative z-10">
                      <Link href="/booking" className="group/btn relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-[#CCFF00] px-8 py-5 font-bold text-black transition-all duration-500 hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] hover:scale-[1.02] active:scale-95">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></div>
                        <span className="relative z-10 flex items-center gap-2 text-lg uppercase tracking-tight">Secure Your Spot
                          <svg className="w-5 h-5 transition-transform duration-500 group-hover/btn:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </Link>
                    </div>
                    <p className="text-center mt-6 text-xs text-white/30 uppercase tracking-[0.2em] relative z-10">Limited entries available per season</p>
                  </div>
                </div>
              </TacticalCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="relative w-full bg-[#0A0A0A] py-24 border-t border-[#CCFF00]/20 overflow-hidden">
         <motion.div style={{ y: backgroundYStats }} className="absolute inset-0 h-[150%] -top-[25%] z-0">
            <img src="/cc1.webp" alt="Arena Background" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-[#0A0A0A]/50"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(204,255,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(204,255,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         </motion.div>
         <motion.div initial={{ left: "-10%" }} whileInView={{ left: "110%" }} transition={{ duration: 1.5, ease: "linear" }} viewport={{ once: true }} className="absolute top-0 bottom-0 w-[2px] bg-[#CCFF00] z-20 shadow-[0_0_20px_#CCFF00] hidden md:block">
             <div className="absolute top-0 bottom-0 w-[100px] bg-gradient-to-r from-transparent to-[#CCFF00]/20 -translate-x-full"></div>
         </motion.div>

         <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center mb-16 text-center">
               <div className="inline-flex items-center gap-2 mb-4 px-4 py-1 border border-[#CCFF00]/30 rounded-full bg-[#CCFF00]/5">
                  <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_10px_#CCFF00]"></span>
                  <span className={`${spaceGrotesk.className} text-[#CCFF00] font-bold text-xs tracking-[0.3em] uppercase`}>System Status: Online</span>
               </div>
               <h2 className={`${spaceGrotesk.className} text-5xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(204,255,0,0.3)]`}>Current Capacity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#CCFF00]/20 shadow-[0_0_30px_rgba(204,255,0,0.1)] relative overflow-hidden rounded-sm">
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#CCFF00] z-30"></div>
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#CCFF00] z-30"></div>
               <HudStat number={2} label="Tactical Courts" delayIdx={0} />
               <HudStat number={100} label="Elite Members" suffix="+" delayIdx={1} />
               <HudStat number={24} label="System Uptime" suffix="/7" isGauge={true} delayIdx={2} />
               <HudStat number={100} label="Combat Efficiency" suffix="%" isGauge={true} delayIdx={3} />
            </div>
         </div>
      </section>

      <ReviewsSection />

      <section className="relative w-full py-24 md:py-32 bg-white z-10 overflow-hidden border-t border-gray-100">
        
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[200vw] overflow-hidden -z-10 opacity-[0.03] pointer-events-none select-none flex">
           <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap">
              <h2 className={`${spaceGrotesk.className} text-[20vw] font-black uppercase tracking-tighter text-black`}>
                 PADELX REVOLUTION &nbsp; PADELX REVOLUTION &nbsp; PADELX REVOLUTION &nbsp;
              </h2>
           </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
          
          <div className="text-center max-w-5xl mx-auto mb-16 md:mb-24 relative z-10 w-full flex flex-col items-center">
            <motion.div initial={{ letterSpacing: "0em", opacity: 0 }} whileInView={{ letterSpacing: "0.3em", opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="inline-flex items-center gap-3 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]"></span>
              <span className="text-[#121212] font-black uppercase text-xs md:text-sm">The Padel Experience</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]"></span>
            </motion.div>

            <MagneticElement>
              <div className="relative inline-block text-center mb-8 px-4 cursor-default">
                 <h2 className={`${spaceGrotesk.className} text-4xl md:text-6xl lg:text-[5.5rem] font-black text-transparent [-webkit-text-stroke:1px_#121212] md:[-webkit-text-stroke:2px_#121212] uppercase tracking-tighter leading-[0.9] m-0 p-0`}>
                    The Fastest Growing <br className="hidden md:block" /> Padel Tennis Club
                 </h2>
                 <motion.h2 initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }} whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }} transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1], delay: 0.3 }} className={`${spaceGrotesk.className} absolute top-0 left-0 w-full h-full text-4xl md:text-6xl lg:text-[5.5rem] font-black text-[#121212] uppercase tracking-tighter leading-[0.9] m-0 p-0 drop-shadow-[0_10px_30px_rgba(204,255,0,0.3)]`}>
                    The Fastest Growing <br className="hidden md:block" /> Padel Tennis Club
                 </motion.h2>
                 <motion.div initial={{ left: "0%", opacity: 0 }} whileInView={{ left: "100%", opacity: [0, 1, 1, 0] }} transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1], delay: 0.3 }} className="absolute top-[-5%] bottom-[-5%] w-[3px] md:w-[6px] bg-[#CCFF00] shadow-[0_0_30px_5px_rgba(204,255,0,0.8)] z-20 rounded-full" />
              </div>
            </MagneticElement>

            <motion.p initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1, delay: 0.8, ease: "easeOut" }} className="text-gray-600 text-base md:text-xl leading-relaxed font-light mx-auto max-w-3xl relative z-10">
              Experience the energy at PadelX, where a vibrant community, top-notch facilities, and exciting programs make us the go-to destination for tennis and padel enthusiasts. Join the movement today!
            </motion.p>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut" }} viewport={{ once: true, amount: 0.3 }} className="w-full lg:w-5/12 relative group">
              <div className="bg-[#BAC3CE] p-6 md:p-8 w-full rounded-sm shadow-xl transition-transform duration-700 group-hover:-translate-y-2 group-active:-translate-y-2">
                <div className="relative w-full aspect-[4/3] bg-gray-900 overflow-hidden rounded-sm">
                   <img src="/padel-equipment.webp" alt="Padel Equipment" className="w-full h-full object-cover opacity-90 group-hover:scale-110 group-active:scale-110 transition-transform duration-1000 ease-out" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#CCFF00]/20 rounded-full blur-2xl z-0 pointer-events-none"></div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} viewport={{ once: true, amount: 0.3 }} className="w-full lg:w-7/12 relative z-10">
              <FaqAccordion faqs={[
                {
                  question: "What is Mexican 1969?",
                  answer: "Inspired by the vibrant energy of the golden era of sports in Mexico. A Mexican 1969 padel court refers to the very first padel court ever built, which was created in Acapulco, Mexico in 1969 by Enrique Corcuera, a Mexican businessman, on his property, essentially a small enclosed court with walls where the game of padel originated."
                },
                {
                  question: "What does PadelX offer?",
                  answer: "We offer premium single and double padel courts, elite tournaments, a 24/7 fully automated booking system, and an exclusive in-house cafe for post-match recovery."
                },
                {
                  question: "What is the difference between a single and a double court?",
                  answer: "A single court is designed for 1v1 play and is narrower (typically 6x20 meters), allowing for intense technical rallies. A double court is the standard 10x20 meters built for the traditional 2v2 dynamic padel experience."
                }
              ]} />
            </motion.div>
          </div>

        </div>
      </section>

    </main>
  );
}