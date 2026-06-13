"use client";

import React, { useEffect, useRef } from "react";
import { Space_Grotesk, Inter } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

const offerings = [
  {
    id: "01",
    title: "Single Padel",
    highlight: "Court",
    subtitle: "The Ultimate 1v1 Experience",
    desc: "Master your technique in our premium dedicated spaces. Engineered for precision, focus, and intensive training sessions.",
    img: "/single.webp",
  },
  {
    id: "02",
    title: "Double Padel",
    highlight: "Court",
    subtitle: "Championship Standards",
    desc: "Experience the ultimate 2v2 arena. Panoramic crystal walls and elite turf designed for competitive play and tournaments.",
    img: "/double.webp",
  },
  {
    id: "03",
    title: "Inhouse",
    highlight: "Café",
    subtitle: "Refuel & Recover",
    desc: "Curated selection of high performance nutrition, artisanal coffee, and premium hydration to keep you at your peak.",
    img: "/inhouse-cafe.webp",
  },
  {
    id: "04",
    title: "Club",
    highlight: "Social",
    subtitle: "The Padel Community",
    desc: "Join the elite network. Connect, compete, and celebrate the padel lifestyle in our exclusive members lounges.",
    img: "/social.webp",
  },
];

export default function OfferingsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];

      if (panels.length === 0) return;

      panels.forEach((panel, i) => {
        if (i !== 0) {
          gsap.set(panel, { yPercent: 100 });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: wrapperRef.current,
          pinSpacing: false,
          start: "top top",
          end: () => "+=" + window.innerHeight * (offerings.length - 1),
          scrub: 1,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;

        const prevPanel = panels[i - 1];

        tl.to(
          prevPanel,
          {
            yPercent: -15,
            scale: 0.95,
            opacity: 0,
            duration: 1,
            ease: "none",
          },
          `transition-${i}`
        );

        tl.to(
          panel,
          {
            yPercent: 0,
            duration: 1,
            ease: "none",
          },
          `transition-${i}`
        );

        const textElements = panel.querySelectorAll(".anim-text");
        if (textElements.length > 0) {
          tl.from(
            textElements,
            {
              y: 50,
              opacity: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out",
            },
            `transition-${i}+=0.3`
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`what-we-offer relative w-full bg-[#121212] h-[var(--section-height)] ${inter.className}`}
      style={{ "--section-height": `${offerings.length * 100}vh` } as React.CSSProperties}
    >
      <div
        ref={wrapperRef}
        className="sticky-wrapper w-full block sticky top-0 h-[100dvh] overflow-hidden"
      >
        {offerings.map((offer, i) => (
          <div
            key={offer.id}
            ref={(el) => {
              panelsRef.current[i] = el;
            }}
            className="offering-panel absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#121212]"
            style={{ zIndex: i }}
          >
            <div className="absolute inset-0 w-full h-full origin-center scale-105">
              <img
                src={offer.img}
                alt={offer.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent"></div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto flex flex-col items-center">
              <div className="anim-text mb-6 md:mb-8 inline-flex items-center gap-3 px-5 py-2 border border-[#CCFF00] bg-[#121212]/80 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
                <span className="text-[#CCFF00] text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
                  {offer.subtitle}
                </span>
              </div>

              <h2
                className={`anim-text ${spaceGrotesk.className} text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-4 md:mb-6 leading-[0.9] drop-shadow-2xl`}
              >
                {offer.title} <br />
                <span className="text-transparent [-webkit-text-stroke:1px_#CCFF00] md:[-webkit-text-stroke:2px_#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                  {offer.highlight}
                </span>
              </h2>

              <p className="anim-text text-gray-300 text-base md:text-xl lg:text-2xl font-light leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
                {offer.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}