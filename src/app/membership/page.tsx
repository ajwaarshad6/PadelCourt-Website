"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate, useInView } from "framer-motion";
import { Space_Grotesk, Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "900"] });

const TacticalFaq = ({ faqs }: { faqs: { question: string, answer: string }[] }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="w-full flex flex-col gap-4">
      {faqs.map((faq, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={i} className={`flex flex-col overflow-hidden group rounded-sm transition-all duration-300 bg-white ${isOpen ? "border-2 border-[#121212] shadow-[4px_4px_0px_#CCFF00]" : "border border-gray-200 hover:border-[#121212] active:border-[#121212]"}`}>
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className={`flex justify-between items-center w-full px-6 py-5 md:py-6 text-left transition-all duration-300 ${isOpen ? "bg-[#121212] text-[#CCFF00]" : "bg-white text-[#121212]"}`}
            >
              <span className={`${spaceGrotesk.className} text-base md:text-xl font-bold tracking-tight`}>
                {faq.question}
              </span>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0 ml-4">
                <svg className={`w-5 h-5 ${isOpen ? "text-[#CCFF00]" : "text-gray-400 group-hover:text-[#121212] group-active:text-[#121212]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden bg-white"
                >
                  <div className="px-6 pb-6 pt-5 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
};

export default function MembershipPage() {
  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: false, amount: 0.2 });

  const featuresList = [
    "Rs 1000 discount on every booking of double court in peak hours",
    "Rs 500 discount on every booking of single court in peak hours",
    "Rs 500 discount on every booking of double court in off peak hours",
    "Rs 250 discount on every booking of single court in off peak hours",
    "1 hour free on any court On completion of every 50 hours booking"
  ];

  return (
    <main className={`relative w-full min-h-screen bg-white pb-0 overflow-hidden ${inter.className}`}>
      
      <title>Elite Status | PadelX</title>
      <meta name="slug" content="/membership" />
      <meta name="description" content="Secure your PadelX elite status. Join the fastest growing padel tennis club for exclusive court discounts." />
      <meta name="focus-key-phrase" content="padel membership plans" />
      <meta name="seo-key-phrase" content="join padelx club membership" />
      <meta name="img-alt-text" content="PadelX Holographic Membership Card" />
      <meta name="seo-keywords" content="padel membership, padelx club, tennis club pricing, padel lahore discounts" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <section className="relative w-full min-h-[80vh] md:min-h-screen flex items-center justify-center pt-32 pb-16 md:pt-48 md:pb-24 z-10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/membership/m-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
          <div className="flex flex-col items-center text-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-full flex flex-col items-center"
            >
              <div className="flex items-center gap-3 mb-6 px-4 py-2 border border-[#CCFF00] rounded-full bg-[#CCFF00]/10">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
                <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase">Protocol Initiated</span>
              </div>
              
              <h1 className={`${spaceGrotesk.className} text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6`}>
                Secure Your <br/> 
                <span className="text-transparent [-webkit-text-stroke:2px_#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.8)]">Status</span>
              </h1>
              
              <p className="text-gray-200 font-medium text-lg md:text-xl leading-relaxed max-w-2xl">
                Become a part of our highly classified padel network. Secure priority access, elite pricing, and dominate the court. Let us play and grow together.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      <div className="relative w-[105vw] -ml-[2.5vw] bg-[#CCFF00] py-3 overflow-hidden z-20 shadow-[0_0_30px_rgba(204,255,0,0.3)] transform -rotate-1 origin-center border-y-2 border-[#121212]">
         <motion.div 
           animate={{ x: ["0%", "-50%"] }} 
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="flex whitespace-nowrap w-max"
         >
            <h3 className={`${spaceGrotesk.className} text-[#121212] font-black text-sm md:text-base tracking-[0.2em] uppercase flex items-center gap-8 px-4`}>
               <span>SYSTEM NOTE: MEMBER MUST PRESENT ACCESS CARD FOR DISCOUNT VERIFICATION</span>
               <span>SYSTEM NOTE: MEMBER MUST PRESENT ACCESS CARD FOR DISCOUNT VERIFICATION</span>
               <span>SYSTEM NOTE: MEMBER MUST PRESENT ACCESS CARD FOR DISCOUNT VERIFICATION</span>
               <span>SYSTEM NOTE: MEMBER MUST PRESENT ACCESS CARD FOR DISCOUNT VERIFICATION</span>
            </h3>
         </motion.div>
      </div>

      <section ref={featuresRef} className="relative w-full py-24 md:py-32 bg-white z-10 border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="w-full lg:w-5/12 sticky top-32"
          >
            <h2 className={`${spaceGrotesk.className} text-5xl md:text-7xl font-black text-[#121212] uppercase tracking-tighter mb-4 leading-none`}>
              The <span className="text-[#121212] [-webkit-text-stroke:2px_#CCFF00] drop-shadow-[0_4px_0_#CCFF00]">1 Year</span> <br/> Override
            </h2>
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm mt-8 inline-block shadow-sm">
               <p className="text-gray-500 font-mono text-xs tracking-widest uppercase mb-2">Annual Investment</p>
               <p className={`${spaceGrotesk.className} text-5xl font-black text-[#121212] tracking-tighter`}>PKR 50,000<span className="text-xl text-[#121212]">/-</span></p>
            </div>
            
            <div className="mt-10">
              <Link href="/membership-booking" className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-[#CCFF00] px-12 py-5 font-black text-[#121212] tracking-widest uppercase text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(204,255,0,0.6)] hover:scale-105 active:scale-105 active:shadow-[0_0_30px_rgba(204,255,0,0.6)] w-full md:w-auto shadow-xl">
                <span className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500 ease-out"></span>
                <span className="relative z-10">Initialize Membership</span>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.2 }}
            className="w-full lg:w-7/12 flex flex-col gap-4"
          >
             <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
               <span className="w-2 h-2 rounded-full bg-[#121212]"></span>
               <h3 className="text-[#121212] font-mono uppercase tracking-[0.3em] text-sm font-bold">Decrypted Privileges</h3>
             </div>

             <div className="flex flex-col gap-4">
                {featuresList.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 50 }}
                    animate={isFeaturesInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                    transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                    className="flex items-start gap-4 bg-[#121212] p-6 border border-transparent hover:border-[#CCFF00] active:border-[#CCFF00] transition-colors duration-300 rounded-sm group shadow-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-[#CCFF00] group-hover:border-[#CCFF00] group-active:bg-[#CCFF00] group-active:border-[#CCFF00] transition-colors">
                       <span className="text-xs font-mono text-gray-400 group-hover:text-[#121212] group-active:text-[#121212]">0{idx + 1}</span>
                    </div>
                    <p className="text-gray-300 font-medium text-lg leading-relaxed pt-1 group-hover:text-white group-active:text-white transition-colors">
                       {feature}
                    </p>
                  </motion.div>
                ))}
             </div>
          </motion.div>

        </div>
      </section>

      <section className="relative w-full py-24 md:py-32 bg-[#FAFAFA] border-t border-gray-200 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-5xl mx-auto mb-20 relative z-10">
             <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 border border-gray-200 rounded-full bg-white shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#121212] animate-pulse"></span>
                <span className="text-[#121212] text-[10px] font-black tracking-[0.3em] uppercase">Knowledge Base</span>
             </div>
            
            <h2 className={`${spaceGrotesk.className} text-5xl md:text-7xl lg:text-8xl font-black text-[#121212] uppercase tracking-tighter mb-8 leading-[0.85]`}>
              <span className="block">INTELLIGENCE</span>
              <motion.span
                 initial={{ y: 20, opacity: 0, skewX: 0 }}
                 whileInView={{ y: 0, opacity: 1, skewX: -6 }}
                 transition={{ duration: 0.8, ease: "backOut" }}
                 viewport={{ once: true }}
                 className="relative inline-block text-transparent [-webkit-text-stroke:2px_#121212] md:[-webkit-text-stroke:3px_#121212] mt-2"
              >
                 BRIEFING
                 <motion.span
                    initial={{ width: "0%" }}
                    whileInView={{ width: "105%" }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                    className="absolute bottom-[10%] left-[-2.5%] h-[35%] bg-[#CCFF00] -z-10 opacity-80 shadow-[0_0_20px_#CCFF00]"
                 ></motion.span>
              </motion.span>
            </h2>

            <p className="text-gray-600 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
              Access the data logs below to understand the full scope of your clearance level. We operate with complete transparency.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1, ease: "easeOut" }} 
              viewport={{ once: true }}
              className="w-full lg:w-5/12 relative aspect-[4/5] bg-gray-100 p-4 md:p-6 flex items-center justify-center rounded-sm shadow-xl group border border-gray-200"
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#121212] z-20 transition-all duration-500 group-hover:border-[#CCFF00] group-hover:shadow-[0_0_10px_#CCFF00] group-active:border-[#CCFF00] group-active:shadow-[0_0_10px_#CCFF00]"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#121212] z-20 transition-all duration-500 group-hover:border-[#CCFF00] group-hover:shadow-[0_0_10px_#CCFF00] group-active:border-[#CCFF00] group-active:shadow-[0_0_10px_#CCFF00]"></div>
              
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <img 
                  src="/membership/knowledge-base.webp" 
                  alt="Padel Racket on Turf" 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 group-active:scale-110 grayscale group-hover:grayscale-0 group-active:grayscale-0"
                />
                <div className="absolute inset-0 bg-[#CCFF00]/20 mix-blend-multiply opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 z-10"></div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} 
              viewport={{ once: true }}
              className="w-full lg:w-7/12"
            >
              <TacticalFaq faqs={[
                {
                  question: "WHAT ARE THE BENEFITS OF BECOMING A MEMBER?",
                  answer: "Membership gives you access to premium facilities, expert coaching, exclusive events, and a supportive padel community to improve your game."
                },
                {
                  question: "CAN I CANCEL MY MEMBERSHIP ANYTIME?",
                  answer: "Yes, we offer flexible membership options to fit your needs. You can cancel or adjust your plan with prior notice."
                },
                {
                  question: "DO I NEED PRIOR EXPERIENCE TO JOIN?",
                  answer: "Not at all! Our programs cater to all skill levels, whether you are a beginner or advanced player, we have something for everyone."
                }
              ]} />
            </motion.div>

          </div>
        </div>
      </section>

    </main>
  );
}