"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    agreed: false,
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [mapActive, setMapActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert("Please agree to the data collection policy to proceed.");
      return;
    }
    alert("Transmission Successful. Our team will reach out shortly.");
  };

  return (
    <main className={`relative w-full min-h-screen bg-[#FAFAFA] flex flex-col pt-24 pb-20 overflow-hidden ${inter.className}`}>
      
      <title>Contact Command | PadelX</title>
      <meta name="seo-title" content="Contact Us | PadelX Lahore" />
      <meta name="slug" content="/contact" />
      <meta name="description" content="Get in touch with PadelX for inquiries, support, and corporate bookings." />
      <meta name="focus-key-phrase" content="contact padelx" />
      <meta name="seo-key-phrase" content="padelx lahore contact number" />
      <meta name="img-alt-text" content="PadelX Contact Center" />
      <meta name="seo-keywords" content="contact padelx, padel lahore number, padel court location" />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

      <section 
        className="relative w-full h-[40vh] md:h-[50vh] bg-gray-200 z-10 group overflow-hidden border-b border-gray-200 shadow-sm"
        onMouseLeave={() => setMapActive(false)}
      >
        <div className="absolute bottom-16 right-4 md:bottom-auto md:top-4 z-20 px-4 py-2 bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-sm flex items-center gap-3 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
          <span className="text-[#121212] font-mono text-[10px] font-bold tracking-[0.2em] uppercase">Satellite Link Active</span>
        </div>
        
        <iframe 
          src="https://maps.google.com/maps?q=Hotel%20MayFair%20Lahore&t=&z=14&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className={`transition-all duration-1000 ease-in-out ${mapActive ? "grayscale-0 scale-100" : "grayscale scale-105 group-hover:grayscale-0 group-hover:scale-100"}`}
        ></iframe>
        
        <div 
          onClick={() => setMapActive(true)}
          onTouchStart={() => setMapActive(true)}
          className={`absolute inset-0 bg-[#CCFF00]/5 mix-blend-multiply transition-opacity duration-1000 cursor-pointer ${mapActive ? "opacity-0 pointer-events-none" : "opacity-100 group-hover:opacity-0"}`}
        ></div>
      </section>

      <section className="relative w-full z-20 -mt-10 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-sm p-8 md:p-16 flex flex-col lg:flex-row gap-16 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#121212]"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#CCFF00]"></div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-7/12"
          >
            <div className="mb-10">
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 border border-gray-200 rounded-sm bg-gray-50">
                <span className="text-[#121212] font-black text-[10px] tracking-[0.3em] uppercase">Contact Us</span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-5xl md:text-6xl font-black text-[#121212] uppercase tracking-tighter leading-[0.9] mb-4`}>
                Have Questions? <br />
                <span className="text-transparent [-webkit-text-stroke:2px_#121212]">Get In Touch!</span>
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-12">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                <div className="relative group/input flex items-end border-b-2 border-gray-200 focus-within:border-[#121212] transition-colors duration-300 pb-3">
                  <svg className="w-5 h-5 text-gray-400 mb-1 mr-3 group-focus-within/input:text-[#121212] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={formData.name}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="peer w-full bg-transparent text-[#121212] text-lg font-medium outline-none placeholder-transparent pt-2"
                      placeholder="Name"
                    />
                    <label 
                      htmlFor="name" 
                      className={`absolute left-0 transition-all duration-300 font-mono tracking-widest uppercase ${focusedField === "name" || formData.name ? "-top-6 text-[10px] text-[#121212] font-bold" : "top-2 text-sm text-gray-400 cursor-text"}`}
                    >
                      Name
                    </label>
                  </div>
                </div>

                <div className="relative group/input flex items-end border-b-2 border-gray-200 focus-within:border-[#121212] transition-colors duration-300 pb-3">
                  <svg className="w-5 h-5 text-gray-400 mb-1 mr-3 group-focus-within/input:text-[#121212] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="relative w-full">
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={formData.email}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="peer w-full bg-transparent text-[#121212] text-lg font-medium outline-none placeholder-transparent pt-2"
                      placeholder="Email Address"
                    />
                    <label 
                      htmlFor="email" 
                      className={`absolute left-0 transition-all duration-300 font-mono tracking-widest uppercase ${focusedField === "email" || formData.email ? "-top-6 text-[10px] text-[#121212] font-bold" : "top-2 text-sm text-gray-400 cursor-text"}`}
                    >
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="relative group/input flex items-end border-b-2 border-gray-200 focus-within:border-[#121212] transition-colors duration-300 pb-3">
                  <svg className="w-5 h-5 text-gray-400 mb-1 mr-3 group-focus-within/input:text-[#121212] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="relative w-full">
                    <input 
                      type="tel" 
                      id="phone"
                      required
                      value={formData.phone}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="peer w-full bg-transparent text-[#121212] text-lg font-medium outline-none placeholder-transparent pt-2"
                      placeholder="Phone"
                    />
                    <label 
                      htmlFor="phone" 
                      className={`absolute left-0 transition-all duration-300 font-mono tracking-widest uppercase ${focusedField === "phone" || formData.phone ? "-top-6 text-[10px] text-[#121212] font-bold" : "top-2 text-sm text-gray-400 cursor-text"}`}
                    >
                      Phone
                    </label>
                  </div>
                </div>

                <div className="relative group/input flex items-end border-b-2 border-gray-200 focus-within:border-[#121212] transition-colors duration-300 pb-3">
                  <svg className="w-5 h-5 text-gray-400 mb-1 mr-3 group-focus-within/input:text-[#121212] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      id="subject"
                      required
                      value={formData.subject}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="peer w-full bg-transparent text-[#121212] text-lg font-medium outline-none placeholder-transparent pt-2"
                      placeholder="Subject"
                    />
                    <label 
                      htmlFor="subject" 
                      className={`absolute left-0 transition-all duration-300 font-mono tracking-widest uppercase ${focusedField === "subject" || formData.subject ? "-top-6 text-[10px] text-[#121212] font-bold" : "top-2 text-sm text-gray-400 cursor-text"}`}
                    >
                      Subject
                    </label>
                  </div>
                </div>

              </div>

              <div className="relative group/input flex items-start border-b-2 border-gray-200 focus-within:border-[#121212] transition-colors duration-300 pb-4 mt-2">
                <svg className="w-5 h-5 text-gray-400 mt-2 mr-3 group-focus-within/input:text-[#121212] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <div className="relative w-full h-28 pt-2">
                  <textarea 
                    id="message"
                    required
                    value={formData.message}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="peer w-full h-full resize-none bg-transparent text-[#121212] text-lg font-medium outline-none placeholder-transparent pt-1"
                    placeholder="How can we help you? Feel free to get in touch!"
                  ></textarea>
                  <label 
                    htmlFor="message" 
                    className={`absolute left-0 transition-all duration-300 font-mono tracking-widest uppercase ${focusedField === "message" || formData.message ? "-top-6 text-[10px] text-[#121212] font-bold" : "top-2 text-sm text-gray-400 cursor-text"}`}
                  >
                    How can we help you? Feel free to get in touch!
                  </label>
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 mt-2">
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full md:w-auto bg-[#CCFF00] text-[#121212] font-black uppercase tracking-[0.2em] px-10 py-5 flex items-center justify-center gap-3 rounded-sm shadow-[0_10px_30px_rgba(204,255,0,0.3)] hover:shadow-[0_10px_40px_rgba(204,255,0,0.5)] hover:bg-[#121212] hover:text-[#CCFF00] active:bg-[#121212] active:text-[#CCFF00] transition-all duration-300"
                >
                  <svg className="w-5 h-5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Get In Touch
                </motion.button>

                <label className="flex items-center gap-4 cursor-pointer group w-full md:w-auto justify-start md:justify-end">
                  <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={formData.agreed}
                      onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-sm peer-checked:bg-[#121212] peer-checked:border-[#121212] transition-all duration-300 group-hover:border-[#121212] group-active:border-[#121212]"></div>
                    <svg className={`absolute w-3 h-3 text-white pointer-events-none transition-transform duration-300 ${formData.agreed ? "scale-100" : "scale-0"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-sm select-none group-hover:text-[#121212] group-active:text-[#121212] transition-colors">
                    I agree that my data is collected and stored.
                  </span>
                </label>
              </div>

            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-5/12 flex flex-col items-start lg:pl-12 lg:border-l border-gray-100 pt-10 lg:pt-0"
          >
            <div className="flex flex-col gap-8 md:gap-10 w-full mt-auto mb-auto">
              
              <div className="flex items-start gap-5 md:gap-6 group cursor-default bg-[#121212] p-5 md:p-6 rounded-sm border border-white/10 hover:border-[#CCFF00] active:border-[#CCFF00] transition-colors duration-300 shadow-xl overflow-hidden w-full">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#CCFF00] group-active:bg-[#CCFF00] transition-colors duration-300">
                  <svg className="w-5 h-5 text-white group-hover:text-[#121212] group-active:text-[#121212] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="pt-1 flex-1 overflow-hidden w-full">
                  <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase mb-2">Headquarters</p>
                  <p className={`${spaceGrotesk.className} text-lg md:text-xl font-bold text-white leading-relaxed break-words`}>
                    Hotel MayFair 4th floor, <br />
                    <span className="text-sm md:text-base text-gray-400 font-medium tracking-tight mt-1 inline-block break-words w-full">50-52, E - III, Commercial Zone, <br /> Gulberg III, 54660, Lahore, Punjab.</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 md:gap-6 group cursor-default bg-[#121212] p-5 md:p-6 rounded-sm border border-white/10 hover:border-[#CCFF00] active:border-[#CCFF00] transition-colors duration-300 shadow-xl overflow-hidden w-full">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#CCFF00] group-active:bg-[#CCFF00] transition-colors duration-300">
                  <svg className="w-5 h-5 text-white group-hover:text-[#121212] group-active:text-[#121212] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="pt-1 flex-1 overflow-hidden w-full">
                  <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase mb-1">Direct Line</p>
                  <p className={`${spaceGrotesk.className} text-lg md:text-xl font-bold text-white break-words`}>+92 336 4008178</p>
                </div>
              </div>

              <div className="flex items-start gap-5 md:gap-6 group cursor-default bg-[#121212] p-5 md:p-6 rounded-sm border border-white/10 hover:border-[#CCFF00] active:border-[#CCFF00] transition-colors duration-300 shadow-xl overflow-hidden w-full">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#CCFF00] group-active:bg-[#CCFF00] transition-colors duration-300">
                  <svg className="w-5 h-5 text-white group-hover:text-[#121212] group-active:text-[#121212] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="pt-1 flex-1 overflow-hidden w-full">
                  <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase mb-1">Electronic Mail</p>
                  <p className={`${spaceGrotesk.className} text-lg md:text-xl font-bold text-white break-words w-full`}>hello@letspadel.pk</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

    </main>
  );
}