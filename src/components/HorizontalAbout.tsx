"use client";

import React, { useEffect, useRef } from "react";
import { Space_Grotesk, Inter } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

const panelsData = [
  {
    id: "mission",
    title: "Our Mission",
    subtitle: "Elevating the Game",
    description: "We are dedicated to providing an unmatched athletic experience through superior court technology and a vibrant competitive atmosphere.",
    image: "/about/mission.webp"
  },
  {
    id: "values",
    title: "Our Values",
    subtitle: "Precision and Integrity",
    description: "Transparent booking systems honest communication and world class FIP standard turf ensure every bounce is consistent and professional.",
    image: "/about/values.webp"
  },
  {
    id: "history",
    title: "Our History",
    subtitle: "The Genesis",
    description: "Emerging from a passion for high speed racquet sports we observed the global rise of the sport and brought international standards directly to Lahore.",
    image: "/about/history.webp"
  }
];

export default function HorizontalAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const sections = panelsRef.current.filter(Boolean) as HTMLDivElement[];
      
      if (sections.length === 0) return;

      const scrollTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + window.innerHeight * sections.length,
        }
      });

      sections.forEach((section) => {
        const bg = section.querySelector(".parallax-bg");
        const textContent = section.querySelector(".text-content");

        if (bg) {
          gsap.to(bg, {
            xPercent: 30,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              containerAnimation: scrollTween,
              start: "left right",
              end: "right left",
              scrub: true,
            }
          });
        }

        if (textContent) {
          gsap.from(textContent, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              containerAnimation: scrollTween,
              start: "left center",
              toggleActions: "play none none reverse"
            }
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`about-horizontal relative w-full bg-[#121212] overflow-hidden ${inter.className}`}
    >
      <div 
        ref={trackRef} 
        className="horizontal-track flex flex-row w-[300vw] h-screen"
      >
        {panelsData.map((panel, index) => (
          <div
            key={panel.id}
            ref={(el) => {
              panelsRef.current[index] = el;
            }}
            className="panel relative w-[100vw] h-[100vh] flex items-center justify-center overflow-hidden shrink-0 border-r border-white/10 last:border-r-0"
          >
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
              <div 
                className="parallax-bg absolute inset-0 w-[130%] h-full bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url(${panel.image})`, left: "-15%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent" />
            </div>

            <div className="text-content relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-start">
              <div className="mb-6 px-5 py-2 rounded-full border border-[#CCFF00] bg-[#121212]/80 backdrop-blur-sm shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                <p className="text-[#CCFF00] text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
                  {panel.subtitle}
                </p>
              </div>

              <h2 className={`${spaceGrotesk.className} text-6xl md:text-8xl lg:text-[9rem] font-black text-white uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl`}>
                {panel.title}
              </h2>

              <p className="text-gray-300 text-lg md:text-2xl font-light leading-relaxed max-w-2xl drop-shadow-lg">
                {panel.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}