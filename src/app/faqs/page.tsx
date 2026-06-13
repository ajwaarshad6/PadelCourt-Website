"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "900"] });

const faqDatabase = [
  {
    id: 1,
    category: "BOOKING",
    question: "HOW FAR IN ADVANCE CAN I RESERVE A COURT?",
    answer: "PLAYERS CAN SECURE TIME SLOTS UP TO FOURTEEN DAYS IN ADVANCE VIA THE ONLINE TERMINAL. ELITE MEMBERS GAIN SEVEN ADDITIONAL DAYS OF EARLY ACCESS."
  },
  {
    id: 2,
    category: "BOOKING",
    question: "WHAT IS THE CANCELLATION PROTOCOL?",
    answer: "WE REQUIRE A MINIMUM OF TWENTY FOUR HOURS NOTICE FOR A FULL REFUND. LATE CANCELLATIONS WILL RESULT IN A FULL CHARGE TO MAINTAIN ARENA EFFICIENCY."
  },
  {
    id: 3,
    category: "FACILITIES",
    question: "ARE SHOWERS AND LOCKERS AVAILABLE?",
    answer: "AFFIRMATIVE. PREMIUM LOCKER ROOMS EQUIPPED WITH SECURE STORAGE AND HIGH END RECOVERY SHOWERS ARE ACCESSIBLE TO ALL ACTIVE PLAYERS."
  },
  {
    id: 4,
    category: "FACILITIES",
    question: "IS THERE A PARKING SECTOR?",
    answer: "WE PROVIDE A DEDICATED SECURE PARKING GRID FOR ALL VISITORS LOCATED DIRECTLY ADJACENT TO THE MAIN ENTRANCE BAYS."
  },
  {
    id: 5,
    category: "GEAR",
    question: "DO I NEED TO BRING MY OWN RACKET?",
    answer: "YOU MAY DEPLOY YOUR OWN EQUIPMENT OR UTILIZE OUR ARMORY. WE OFFER CHAMPIONSHIP GRADE CARBON FIBER RACKETS FOR RENTAL AT THE FRONT DESK."
  },
  {
    id: 6,
    category: "GEAR",
    question: "WHAT IS THE DRESS CODE?",
    answer: "PROPER ATHLETIC ATTIRE AND NON MARKING TENNIS SHOES ARE STRICTLY ENFORCED TO PRESERVE THE INTEGRITY OF OUR FIP STANDARD TURF."
  }
];

const categories = ["ALL", "BOOKING", "FACILITIES", "GEAR"];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredFaqs = activeCategory === "ALL" 
    ? faqDatabase 
    : faqDatabase.filter(faq => faq.category === activeCategory);

  return (
    <main className={`relative w-full min-h-screen bg-white pb-32 overflow-hidden ${inter.className}`}>
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0"></div>
      
      <div className="relative w-full flex flex-col items-center text-center pt-48 pb-32 px-6 mb-20 overflow-hidden">
        
        <img 
          src="/faqs/hero.webp" 
          alt="FAQ Hero Background" 
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        <div className="absolute inset-0 bg-black/70 z-10 backdrop-blur-[1px] pointer-events-none"></div>

        <div className="relative z-20 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-white"></span>
            <span className="text-white font-mono text-xs tracking-[0.5em] uppercase font-bold">Knowledge Base</span>
            <span className="w-12 h-[1px] bg-white"></span>
          </div>
          
          <h1 className={`${spaceGrotesk.className} text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6`}>
            System <span className="text-transparent [-webkit-text-stroke:2px_#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.8)]">Intel</span>
          </h1>
          
          <p className="text-gray-200 max-w-2xl text-lg font-light leading-relaxed">
            Access critical data regarding arena protocols equipment standards and reservation parameters.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
              className={`px-8 py-3 rounded-sm font-mono text-xs tracking-widest uppercase transition-all duration-300 ${
                activeCategory === cat 
                  ? "bg-[#CCFF00] text-[#121212] font-black shadow-lg" 
                  : "bg-transparent border border-gray-200 text-[#121212] hover:border-[#121212] hover:bg-gray-50 active:border-[#121212] active:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;

              return (
                <motion.div
                  key={faq.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className={`border-l-4 transition-all duration-300 ${isExpanded ? "border-[#CCFF00] bg-gray-50 shadow-md" : "border-gray-200 hover:border-[#CCFF00] hover:bg-gray-50 hover:shadow-sm active:border-[#CCFF00] active:bg-gray-50 active:shadow-sm"}`}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full flex justify-between items-center p-6 md:p-8 text-left group"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-[#121212] font-mono text-[10px] tracking-[0.2em] uppercase opacity-60 font-bold">
                        TAG: {faq.category}
                      </span>
                      <span className={`${spaceGrotesk.className} text-xl md:text-3xl font-black text-[#121212] uppercase tracking-tight transition-colors`}>
                        {faq.question}
                      </span>
                    </div>
                    
                    <div className="relative w-8 h-8 flex items-center justify-center shrink-0 ml-6">
                      <span className={`absolute w-full h-[2px] bg-[#121212] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}></span>
                      <span className={`absolute w-[2px] h-full bg-[#121212] transition-transform duration-300 ${isExpanded ? "rotate-90 opacity-0" : ""}`}></span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 md:p-8 pt-0 border-t border-gray-200 mt-2">
                          <div className="flex items-center gap-3 mb-6 mt-4">
                            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
                            <span className="text-gray-500 font-mono text-[10px] tracking-[0.3em] uppercase">Data Decrypted</span>
                          </div>
                          <p className="text-[#121212] text-lg md:text-xl leading-relaxed font-mono uppercase font-semibold">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}