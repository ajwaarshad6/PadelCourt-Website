"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorDot() {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    
    if (!isTouchDevice) {
      setIsVisible(true);
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX - 6);
        mouseY.set(e.clientY - 6);
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{ translateX: cursorX, translateY: cursorY }}
      className="fixed top-0 left-0 w-3 h-3 bg-[#00FFFF] rounded-full z-[100] pointer-events-none shadow-[0_0_15px_#00FFFF] mix-blend-difference hidden md:block"
    />
  );
}