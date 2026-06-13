"use client";

import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsHovered(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const isExpanded = !isScrolled || isHovered;

  return (
    <div className="fixed top-6 md:top-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-2 md:px-4">
      <motion.nav
        ref={navRef}
        layout
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered(true)}
        initial={false}
        animate={{
          width: isExpanded ? "100%" : "130px", 
          maxWidth: isExpanded ? "896px" : "130px", 
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.8,
        }}
        className={`pointer-events-auto flex items-center rounded-full border bg-[#2A2A2A]/80 backdrop-blur-xl py-2 md:py-3 px-4 md:px-6 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-500 ${
          isExpanded 
            ? "border-[#0055FF]/40 justify-between" 
            : "border-[#CCFF00]/50 shadow-[0_0_20px_rgba(204,255,0,0.15)] justify-center cursor-pointer"
        }`}
      >
        <motion.div 
          layout 
          className={`flex items-center z-10 ${isExpanded ? "flex-none md:flex-1 justify-start" : "w-full justify-center"}`}
        >
          <Link 
            href="/" 
            onClick={(e) => {
              if (!isExpanded) {
                e.preventDefault();
                setIsHovered(true);
              }
            }}
            className="text-base md:text-xl font-black tracking-widest text-[#CCFF00] hover:scale-105 active:scale-95 transition-transform origin-left whitespace-nowrap"
          >
            PADELX
          </Link>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {isExpanded && (
            <>
              <motion.ul
                layout
                initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95, y: -10 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center gap-3 md:gap-8 text-[10px] md:text-sm font-semibold tracking-wide text-[#FFFFFF] whitespace-nowrap shrink-0 mx-2 md:mx-auto"
              >
                <li><Link href="/about" className="hover:text-[#CCFF00] active:text-[#CCFF00] transition-colors duration-300">ABOUT</Link></li>
                <li><Link href="/booking" className="hover:text-[#CCFF00] active:text-[#CCFF00] transition-colors duration-300">BOOK</Link></li>
                <li><Link href="/contact" className="hover:text-[#CCFF00] active:text-[#CCFF00] transition-colors duration-300">CONTACT</Link></li>
              </motion.ul>
              
              <motion.div
                layout
                initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95, x: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1, x: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-none md:flex-1 flex justify-end shrink-0"
              >
                <Link href="/membership">
                  <button className="px-3 md:px-6 py-1.5 md:py-2 bg-[#CCFF00] text-[#121212] font-black rounded-full text-[10px] md:text-sm hover:shadow-[0_0_20px_rgba(204,255,0,0.5)] active:shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
                    Join Club
                  </button>
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </motion.nav>
    </div>
  );
}