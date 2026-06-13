"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup, Variants } from "framer-motion";
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const COURTS = [
  { id: "single", name: "Single Court", oldPrice: 7000, newPrice: 5950 },
  { id: "double", name: "Double Court", oldPrice: 7000, newPrice: 5950 },
];

const TIME_SLOTS = [
  "12:00 AM - 1:00 AM", "1:00 AM - 2:00 AM", "2:00 AM - 3:00 AM",
  "3:00 AM - 4:00 AM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM",
  "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM", "8:00 PM - 9:00 PM",
  "9:00 PM - 10:00 PM", "10:00 PM - 11:00 PM", "11:00 PM - 12:00 AM"
];

const DURATIONS = [
  { label: "1 hour", value: 1 },
  { label: "1.5 hours", value: 1.5 },
  { label: "2 hours", value: 2 },
  { label: "2.5 hours", value: 2.5 },
  { label: "3 hours", value: 3 },
  { label: "4 hours", value: 4 },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const COUNTRIES = [
  { name: "Pakistan", code: "PK", dial: "+92" }, { name: "United States", code: "US", dial: "+1" }, { name: "United Kingdom", code: "GB", dial: "+44" },
  { name: "United Arab Emirates", code: "AE", dial: "+971" }, { name: "Saudi Arabia", code: "SA", dial: "+966" }, { name: "India", code: "IN", dial: "+91" },
  { name: "Canada", code: "CA", dial: "+1" }, { name: "Australia", code: "AU", dial: "+61" }, { name: "Germany", code: "DE", dial: "+49" },
  { name: "France", code: "FR", dial: "+33" }, { name: "Italy", code: "IT", dial: "+39" }, { name: "Spain", code: "ES", dial: "+34" },
  { name: "China", code: "CN", dial: "+86" }, { name: "Japan", code: "JP", dial: "+81" }, { name: "Brazil", code: "BR", dial: "+55" }
];

const fadeBlur: Variants = {
  hidden: { opacity: 0, y: 15, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as any },
  exit: { opacity: 0, y: -15, filter: "blur(8px)", transition: { duration: 0.3, ease: "easeInOut" } as any }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const CheckIcon = () => (
  <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-4 h-4 text-[#121212]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
  </motion.svg>
);

const CircleIcon = ({ active }: { active?: boolean }) => (
  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-500 ${active ? "border-[#CCFF00]" : "border-white/20"}`}>
    {active && <motion.div layoutId="activeStepIndicator" className="w-2 h-2 rounded-full bg-[#CCFF00]" transition={{ type: "spring", stiffness: 300, damping: 20 }} />}
  </div>
);

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCountryDrop, setShowCountryDrop] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [duration, setDuration] = useState(1);
  const [showDurationDrop, setShowDurationDrop] = useState(false);
  const durationRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    court: "", courtName: "", basePrice: 0, date: "", time: "", firstName: "", lastName: "", email: "", phone: "",
  });

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const updateForm = (key: string, value: any) => setFormData((prev) => ({ ...prev, [key]: value }));
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const totalPrice = formData.basePrice * duration;

  const calculateEndTime = (startTime12h: string, durationInHours: number) => {
    if (!startTime12h) return "";
    const [time, period] = startTime12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (hours === 12) hours = 0; 
    if (period === "PM") hours += 12;

    const totalMinutes = (hours * 60) + minutes + (durationInHours * 60);
    const newHours24 = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;

    const newPeriod = newHours24 >= 12 ? "PM" : "AM";
    let newHours12 = newHours24 % 12;
    if (newHours12 === 0) newHours12 = 12;

    const newMinutesStr = newMinutes.toString().padStart(2, "0");
    return `${newHours12}:${newMinutesStr} ${newPeriod}`;
  };

  const getDisplayTime = () => {
    if (!formData.time) return "";
    const startStr = formData.time.split(" - ")[0];
    return `${startStr} - ${calculateEndTime(startStr, duration)}`;
  };

  const displayTimeRange = getDisplayTime();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowCountryDrop(false);
      if (durationRef.current && !durationRef.current.contains(event.target as Node)) setShowDurationDrop(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatCalendarDateTime = (dateStr: string, timeStr: string, addHours: number = 0) => {
    if(!dateStr || !timeStr) return "";
    const dateObj = new Date(dateStr);
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    let hrs = parseInt(hours, 10);
    if (hrs === 12) hrs = 0;
    if (modifier === "PM") hrs += 12;
    dateObj.setHours(hrs + Math.floor(addHours), parseInt(minutes, 10) + (addHours % 1) * 60, 0);
    return dateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const getCalendarContent = () => {
    const startStr = formData.time.split(" - ")[0];
    const startTime = formatCalendarDateTime(formData.date, startStr);
    const endTime = formatCalendarDateTime(formData.date, startStr, duration);
    const eventTitle = `${formData.courtName} Booking`;
    const eventDetails = `Total Price PKRs ${totalPrice}`;
    return { startTime, endTime, eventTitle, eventDetails };
  };

  const handleGoogleCalendar = () => {
    const { startTime, endTime, eventTitle, eventDetails } = getCalendarContent();
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(eventDetails)}`, "_blank");
  };

  const handleYahooCalendar = () => {
    const { startTime, endTime, eventTitle, eventDetails } = getCalendarContent();
    window.open(`https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(eventTitle)}&st=${startTime}&et=${endTime}&desc=${encodeURIComponent(eventDetails)}`, "_blank");
  };

  const downloadICS = () => {
    const { startTime, endTime, eventTitle, eventDetails } = getCalendarContent();
    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${startTime}\nDTEND:${endTime}\nSUMMARY:${eventTitle}\nDESCRIPTION:${eventDetails}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsData], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "PadelX_Booking.ics"; a.click(); URL.revokeObjectURL(url);
  };

  const shareViaWhatsApp = () => {
    const rawPhone = formData.phone.replace(/^0+/, ""); 
    const cleanCustomerPhone = (selectedCountry.dial + rawPhone).replace(/\D/g, "");
    
    const text = `PadelX Booking Confirmation\n\nAppointment ID: PDLX-42-SYS\nDate: ${formData.date}\nTime: ${displayTimeRange} (${duration} hrs)\nCourt: ${formData.courtName}\nPayment: PKRs ${totalPrice}.00\n\nPlayer: ${formData.firstName} ${formData.lastName}`;
    
    window.open(`https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = `PadelX Booking Confirmation - ${formData.firstName} ${formData.lastName}`;
    const body = `Appointment ID: PDLX-42-SYS\nDate: ${formData.date}\nTime: ${displayTimeRange} (${duration} hrs)\nCourt: ${formData.courtName}\nPayment: PKRs ${totalPrice}.00\n\nPlayer: ${formData.firstName} ${formData.lastName}\nPhone: ${selectedCountry.dial} ${formData.phone}\nEmail: ${formData.email}`;
    window.open(`mailto:${formData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  const renderCalendar = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const dates = [];
    
    for (let i = 0; i < startingDay; i++) dates.push({ day: daysInPrevMonth - startingDay + i + 1, disabled: true });
    for (let i = 1; i <= daysInMonth; i++) dates.push({ day: i, disabled: false });
    const totalCells = Math.ceil(dates.length / 7) * 7;
    for (let i = 1; i <= (totalCells - dates.length); i++) dates.push({ day: i, disabled: true });

    return (
      <div className="w-full max-w-md mx-auto mt-2">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <select value={month} onChange={(e) => setCalendarDate(new Date(year, parseInt(e.target.value), 1))} className="bg-transparent text-[#121212] font-black text-xl outline-none cursor-pointer hover:text-[#CCFF00] active:text-[#CCFF00] transition-colors">
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select value={year} onChange={(e) => setCalendarDate(new Date(parseInt(e.target.value), month, 1))} className="bg-transparent text-[#121212] font-black text-xl outline-none cursor-pointer hover:text-[#CCFF00] active:text-[#CCFF00] transition-colors">
              {[2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#121212] hover:text-white active:bg-[#121212] active:text-white transition-all text-[#121212]">&lt;</button>
            <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#121212] hover:text-white active:bg-[#121212] active:text-white transition-all text-[#121212]">&gt;</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold tracking-widest text-gray-400 mb-4 uppercase">
          {days.map((d) => <div key={d}>{d}</div>)}
        </div>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-7 gap-2 text-center text-sm">
          {dates.map((d, i) => {
            const dateStr = `${MONTHS[month]} ${d.day}, ${year}`;
            const isSelected = formData.date === dateStr && !d.disabled;
            return (
              <motion.button
                variants={fadeBlur}
                key={i} disabled={d.disabled} onClick={() => updateForm("date", dateStr)}
                className={`relative h-10 w-full rounded-lg flex items-center justify-center font-medium transition-all duration-300 ${
                  d.disabled ? "text-gray-300 cursor-not-allowed opacity-50" :
                  isSelected ? "text-[#121212] font-black scale-110 z-10 shadow-[0_10px_20px_rgba(204,255,0,0.3)]" :
                  "text-gray-600 hover:bg-gray-100 hover:text-[#121212] active:bg-gray-200 active:text-[#121212]"
                }`}
              >
                {isSelected && <motion.div layoutId="dateSelector" className="absolute inset-0 bg-[#CCFF00] rounded-lg -z-10" transition={{ type: "spring", stiffness: 300, damping: 20 }} />}
                {d.day}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    );
  };

  const SidebarItem = ({ title, num, isCompleted, isActive }: { title: string, num: number, isCompleted: boolean, isActive: boolean }) => (
    <motion.div layout className={`flex items-center py-5 border-b border-white/5 last:border-0 cursor-default ${isCollapsed ? "justify-center" : "justify-between"} ${isActive ? "bg-white/[0.03] -mx-6 px-6" : "hover:bg-white/[0.01] -mx-6 px-6 transition-colors"}`}>
      <div className="flex flex-col overflow-hidden">
        <span className={`text-sm tracking-wide flex items-center gap-3 ${isActive ? "text-white font-bold" : "text-gray-500 font-medium"}`}>
          <svg className={`w-5 h-5 shrink-0 transition-colors duration-500 ${isActive ? "text-[#CCFF00]" : "text-gray-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {!isCollapsed && <span className="whitespace-nowrap">{title}</span>}
        </span>
        {!isCollapsed && (
          <AnimatePresence>
            {isCompleted && num === 1 && formData.courtName && <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-[#CCFF00]/80 mt-1 pl-8 truncate">{formData.courtName}</motion.span>}
            {isCompleted && num === 2 && formData.date && <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs text-[#CCFF00]/80 mt-1 pl-8 truncate">{formData.date} ({duration}h)</motion.span>}
          </AnimatePresence>
        )}
      </div>
      {!isCollapsed && (
        isCompleted ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-[#CCFF00] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(204,255,0,0.4)]">
            <CheckIcon />
          </motion.div>
        ) : <CircleIcon active={isActive} />
      )}
    </motion.div>
  );

  return (
    <main className={`min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-4 flex justify-center items-start ${inter.className} relative overflow-hidden`}>
      <title>Book Padel Court</title>
      <meta name="seo-title" content="Book Your Padel Court | PadelX" />
      <meta name="slug" content="/booking" />
      <meta name="description" content="Reserve your premium single or double padel court at PadelX Lahore." />
      <meta name="focus-key-phrase" content="book padel court" />
      <meta name="seo-key-phrase" content="padel court booking lahore" />
      <meta name="img-alt-text" content="PadelX Court Booking Interface" />
      <meta name="seo-keywords" content="book padel, padel tennis, court reservation, lahore padel" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0"></div>

      {step < 6 && (
        <LayoutGroup>
          <motion.div layout className="w-full max-w-5xl bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col md:flex-row overflow-hidden min-h-[550px] border border-gray-100 z-10">
            
            <motion.div layout animate={{ width: isCollapsed ? 90 : 340 }} className="hidden md:flex flex-col justify-between bg-[#121212] text-white p-6 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(204,255,0,0.05)_0%,transparent_50%)]"></div>
              <div className="relative z-10">
                {step < 5 ? (
                  <div className="mt-4">
                    <SidebarItem title="Select Court" num={1} isCompleted={step > 1} isActive={step === 1} />
                    <SidebarItem title="Date & Time" num={2} isCompleted={step > 2} isActive={step === 2} />
                    <SidebarItem title="Your Information" num={3} isCompleted={step > 3} isActive={step === 3} />
                    <SidebarItem title="Payments" num={4} isCompleted={step > 4} isActive={step === 4} />
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-8 ${isCollapsed ? "hidden" : "block"}`}>
                     <div className="text-xs tracking-widest text-[#CCFF00] font-bold uppercase mb-6">Add to Calendar</div>
                     <div className="grid grid-cols-2 gap-4">
                       <motion.button whileHover={{ scale: 1.05, backgroundColor: "#1f1f1f" }} whileTap={{ scale: 0.95 }} onClick={handleGoogleCalendar} className="bg-[#1a1a1a] p-4 rounded-xl flex flex-col items-center gap-3 border border-white/5 hover:border-white/20 active:border-white/30 transition-colors">
                         <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                         <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Google</span>
                       </motion.button>
                       <motion.button whileHover={{ scale: 1.05, backgroundColor: "#1f1f1f" }} whileTap={{ scale: 0.95 }} onClick={downloadICS} className="bg-[#1a1a1a] p-4 rounded-xl flex flex-col items-center gap-3 border border-white/5 hover:border-white/20 active:border-white/30 transition-colors">
                         <svg className="w-8 h-8 text-[#0078D4]" fill="currentColor" viewBox="0 0 24 24"><path d="M22 2v20h-8v-20h8zm-10 2v16h-10v-16h10zm-3 4.5c0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5 1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5zm-5.5 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"/></svg>
                         <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Outlook</span>
                       </motion.button>
                       <motion.button whileHover={{ scale: 1.05, backgroundColor: "#1f1f1f" }} whileTap={{ scale: 0.95 }} onClick={handleYahooCalendar} className="bg-[#1a1a1a] p-4 rounded-xl flex flex-col items-center gap-3 border border-white/5 hover:border-white/20 active:border-white/30 transition-colors">
                         <svg className="w-8 h-8 text-[#6001D2]" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 2.05L13.1 14.59V22h-2.18v-7.41L1.54 2.05h2.64l7.85 10.51 7.82-10.51z"/></svg>
                         <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Yahoo</span>
                       </motion.button>
                       <motion.button whileHover={{ scale: 1.05, backgroundColor: "#1f1f1f" }} whileTap={{ scale: 0.95 }} onClick={downloadICS} className="bg-[#1a1a1a] p-4 rounded-xl flex flex-col items-center gap-3 border border-white/5 hover:border-white/20 active:border-white/30 transition-colors">
                         <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M16.32 10.45c-.03-2.52 2.06-3.76 2.15-3.81-1.18-1.72-3.02-1.95-3.68-1.98-1.56-.16-3.05.92-3.85.92-.8 0-2.02-.91-3.32-.88-1.7.03-3.27.99-4.14 2.51-1.78 3.09-.45 7.64 1.28 10.15.85 1.23 1.85 2.61 3.16 2.56 1.25-.05 1.74-.81 3.25-.81 1.5 0 1.95.81 3.26.78 1.34-.02 2.21-1.26 3.04-2.48 1.05-1.53 1.48-3.02 1.5-3.09-.03-.02-2.61-1.01-2.65-3.87zm-2.09-5.46c.68-.83 1.15-1.98 1.03-3.13-1 .04-2.2.66-2.9 1.5-.63.75-1.19 1.93-1.04 3.05 1.11.09 2.23-.59 2.91-1.42z"/></svg>
                         <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Apple</span>
                       </motion.button>
                     </div>
                  </motion.div>
                )}
              </div>

              <div className={`mt-12 pt-6 border-t border-white/10 flex flex-col relative z-10 ${isCollapsed ? "items-center" : "items-start"}`}>
                {!isCollapsed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-[#CCFF00] text-[10px] tracking-[0.2em] uppercase mb-2">Support Protocol</p>
                    <p className="font-medium text-sm text-white">+92 304 4355 096</p>
                    <p className="text-sm text-gray-400">hello@letspadel.pk</p>
                  </motion.div>
                )}
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="flex items-center justify-center gap-3 text-xs font-semibold mt-8 text-gray-500 hover:text-[#CCFF00] active:text-[#CCFF00] transition w-full group">
                  {!isCollapsed && <span className="tracking-widest uppercase">Collapse View</span>}
                  <span className="w-8 h-8 rounded-full border border-gray-700 group-hover:border-[#CCFF00] group-active:border-[#CCFF00] flex items-center justify-center text-[10px] leading-none shrink-0 transition-all">
                     {isCollapsed ? "→" : "←"}
                  </span>
                </button>
              </div>
            </motion.div>

            <motion.div layout className="flex-1 p-8 md:p-12 flex flex-col bg-white overflow-y-auto relative z-10">
              {step < 5 && (
                <div className="flex items-center gap-4 mb-10">
                  {step > 1 && (
                    <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.9 }} onClick={prevStep} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition text-[#121212] shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </motion.button>
                  )}
                  <h2 className={`${spaceGrotesk.className} text-3xl font-black text-[#121212] tracking-tighter uppercase`}>
                    {step === 1 && "Select Arena"}
                    {step === 2 && "Time Coordinate"}
                    {step === 3 && "Player Dossier"}
                    {step === 4 && "Finalization"}
                  </h2>
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" variants={fadeBlur} initial="hidden" animate="visible" exit="exit" className="flex-1 flex flex-col gap-4">
                    {COURTS.map((c) => {
                      const isSelected = formData.court === c.id;
                      return (
                        <motion.div 
                          key={c.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                          onClick={() => { updateForm("court", c.id); updateForm("courtName", c.name); updateForm("basePrice", c.newPrice); }}
                          className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden border-2 ${isSelected ? "border-[#121212] bg-[#FAFAFA]" : "border-gray-100 hover:border-gray-300 active:border-gray-300 active:bg-gray-50 bg-white"}`}
                        >
                          {isSelected && <motion.div layoutId="courtHighlight" className="absolute top-0 right-0 w-16 h-16 bg-[#CCFF00] rounded-bl-full -mr-8 -mt-8 -z-0" />}
                          <div className="relative z-10 flex justify-between items-center">
                            <div>
                              <h3 className={`${spaceGrotesk.className} text-2xl font-bold text-[#121212] mb-1`}>{c.name}</h3>
                              <p className="text-sm text-gray-500 font-medium">Regular PKR {c.oldPrice} → <span className="text-[#121212] font-bold">Now PKR {c.newPrice}</span></p>
                            </div>
                            <div className="text-right">
                              <p className={`${spaceGrotesk.className} text-2xl font-black text-[#121212]`}>PKRs {c.newPrice}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 w-6 h-6 bg-[#121212] rounded-full flex items-center justify-center">
                              <CheckIcon />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" variants={fadeBlur} initial="hidden" animate="visible" exit="exit" className="flex-1">
                    
                    <div className="relative mb-6" ref={durationRef}>
                      <label className="block text-[10px] tracking-widest font-bold text-gray-400 uppercase mb-2">Select Duration</label>
                      <div 
                        onClick={() => setShowDurationDrop(!showDurationDrop)} 
                        className="w-full md:w-1/2 flex items-center justify-between border-2 border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-[#121212] active:border-[#121212] transition-colors bg-white"
                      >
                         <span className="font-bold text-[#121212]">{DURATIONS.find(d => d.value === duration)?.label}</span>
                         <svg className={`w-4 h-4 text-[#121212] transition-transform ${showDurationDrop ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      <AnimatePresence>
                        {showDurationDrop && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 w-full md:w-1/2 mt-2 bg-[#121212] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] z-50 overflow-hidden py-2">
                            {DURATIONS.map((dur) => (
                              <div 
                                key={dur.value} 
                                onClick={() => { setDuration(dur.value); setShowDurationDrop(false); }} 
                                className="px-6 py-3 text-white hover:bg-white/10 active:bg-white/20 cursor-pointer transition-colors font-medium text-sm"
                              >
                                {dur.label}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {renderCalendar()}
                    
                    <AnimatePresence>
                      {formData.date && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-8 border-t border-gray-100 pt-8 overflow-hidden">
                          <p className={`${spaceGrotesk.className} text-lg font-bold text-[#121212] mb-4 uppercase tracking-tighter`}>Select Slot for <span className="text-[#CCFF00] bg-[#121212] px-2 py-1 rounded-md">{formData.date}</span></p>
                          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {TIME_SLOTS.map((time, i) => {
                              const startStr = time.split(" - ")[0];
                              const isSelected = formData.time === time;
                              const isBooked = bookedSlots.includes(time);
                              return (
                                <motion.button 
                                  variants={fadeBlur} key={i} whileHover={!isBooked ? { y: -2 } : {}} whileTap={!isBooked ? { scale: 0.95 } : {}}
                                  onClick={() => { if(!isBooked) updateForm("time", time); }}
                                  disabled={isBooked}
                                  className={`relative py-3 px-2 rounded-lg text-xs font-bold transition-all duration-300 overflow-hidden ${
                                    isBooked ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60" : 
                                    isSelected ? "text-[#CCFF00] shadow-[0_10px_20px_rgba(0,0,0,0.1)]" : "bg-gray-50 text-gray-600 hover:bg-gray-200 hover:text-[#121212] active:bg-gray-300 active:text-[#121212]"
                                  }`}
                                >
                                  {isSelected && <motion.div layoutId="timeHighlight" className="absolute inset-0 bg-[#121212] -z-10" />}
                                  {isBooked ? "BOOKED" : startStr}
                                </motion.button>
                              );
                            })}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" variants={fadeBlur} initial="hidden" animate="visible" exit="exit" className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {["firstName", "lastName", "email"].map((field) => (
                        <div key={field} className="relative group">
                          <label className="block text-[10px] tracking-widest font-bold text-gray-400 uppercase mb-2">
                            {field === "firstName" ? "First Name" : field === "lastName" ? "Last Name" : "Email Address"}
                          </label>
                          <input 
                            type={field === "email" ? "email" : "text"} 
                            value={(formData as any)[field]} 
                            onChange={(e) => updateForm(field, e.target.value)} 
                            className="w-full bg-transparent border-b-2 border-gray-200 py-2 text-lg text-[#121212] font-medium outline-none transition-colors focus:border-[#CCFF00]" 
                            placeholder={`Enter ${field.replace("N", " n")}`}
                          />
                        </div>
                      ))}
                      
                      <div className="relative group">
                        <label className="block text-[10px] tracking-widest font-bold text-gray-400 uppercase mb-2">Phone Number</label>
                        <div className="flex border-b-2 border-gray-200 focus-within:border-[#CCFF00] transition-colors relative" ref={dropdownRef}>
                          <div className="px-2 py-2 flex items-center cursor-pointer hover:bg-gray-50 active:bg-gray-100 rounded-t-md" onClick={() => setShowCountryDrop(!showCountryDrop)}>
                             <img src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`} alt={selectedCountry.code} className="w-5 h-auto mr-2 shadow-sm rounded-sm" />
                             <span className="text-sm text-[#121212] font-bold mr-1">{selectedCountry.dial}</span>
                             <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                          
                          <AnimatePresence>
                            {showCountryDrop && (
                              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full left-0 mt-2 w-72 max-h-60 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-50 p-2">
                                {COUNTRIES.map((country) => (
                                  <div key={country.code} onClick={() => { setSelectedCountry(country); setShowCountryDrop(false); }} className="flex items-center px-3 py-3 rounded-lg hover:bg-[#FAFAFA] active:bg-gray-100 cursor-pointer transition">
                                    <img src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`} alt={country.name} className="w-6 h-auto mr-3 shadow-sm rounded-sm" />
                                    <span className="text-sm text-[#121212] font-medium flex-1">{country.name}</span>
                                    <span className="text-xs font-bold text-gray-400">{country.dial}</span>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <input type="tel" value={formData.phone} onChange={(e) => updateForm("phone", e.target.value)} className="w-full bg-transparent py-2 px-3 text-lg text-[#121212] font-medium outline-none" placeholder="Enter phone" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" variants={fadeBlur} initial="hidden" animate="visible" exit="exit" className="flex-1">
                    <div className="bg-[#FAFAFA] border border-dashed border-gray-300 rounded-2xl p-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-[#CCFF00]"></div>
                      <h3 className={`${spaceGrotesk.className} text-sm tracking-[0.2em] font-bold text-gray-400 uppercase mb-6`}>Transaction Receipt</h3>
                      
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-2xl font-black text-[#121212] mb-1">{formData.courtName}</p>
                          <p className="text-sm text-gray-500">Regular PKR 7000 → Now PKR {formData.basePrice}</p>
                          <p className="text-xs text-gray-400 mt-2 font-mono">Rate applied: PKRs {formData.basePrice} x {duration} hrs</p>
                        </div>
                        <p className={`${spaceGrotesk.className} text-xl font-bold text-[#121212]`}>PKRs {formData.basePrice}.00</p>
                      </div>

                      <div className="flex justify-between text-sm text-gray-500 mb-8 font-medium">
                        <p>{formData.date}</p>
                        <p>{displayTimeRange}</p>
                      </div>

                      <div className="border-t-2 border-dashed border-gray-200 pt-6 flex justify-between items-end">
                        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Total Amount</p>
                        <p className={`${spaceGrotesk.className} text-4xl font-black text-[#CCFF00] drop-shadow-md [-webkit-text-stroke:1px_#121212]`}>PKRs {totalPrice}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p className="text-sm font-medium text-blue-800">
                        Pay 50% Advance to Confirm your Booking in the Next 15 Min.
                      </p>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div key="step5" variants={fadeBlur} initial="hidden" animate="visible" exit="exit" className="flex-1 flex flex-col items-center justify-center text-center py-4">
                    <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="w-20 h-20 bg-[#CCFF00] rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(204,255,0,0.4)]">
                      <svg className="w-10 h-10 text-[#121212]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </motion.div>
                    <h2 className={`${spaceGrotesk.className} text-3xl font-black text-[#121212] uppercase tracking-tighter mb-1`}>Secured</h2>
                    <p className="text-gray-400 text-xs font-mono tracking-widest uppercase mb-6">ID: PDLX-42-SYS</p>

                    <div className="w-full max-w-md bg-[#FAFAFA] rounded-xl p-5 text-sm text-left border border-gray-100 shadow-sm font-medium mb-6">
                      {[
                        { l: "Date", v: formData.date },
                        { l: "Time", v: `${displayTimeRange} (${duration}h)` },
                        { l: "Service", v: formData.courtName },
                        { l: "Payment", v: `PKRs ${totalPrice}.00 - On-site` },
                        { l: "Player", v: `${formData.firstName} ${formData.lastName}` },
                        { l: "Comms", v: `${selectedCountry.dial} ${formData.phone}` }
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-gray-200 border-dashed last:border-0">
                          <span className="text-gray-400">{row.l}</span>
                          <span className="text-[#121212] font-bold text-right w-2/3 truncate">{row.v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="w-full max-w-md border-t border-gray-200 pt-6">
                       <p className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase mb-4">Transmission Hub</p>
                       <div className="grid grid-cols-2 gap-4">
                          <button onClick={shareViaWhatsApp} className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] active:bg-[#25D366] active:text-white hover:text-white font-bold py-3 rounded-xl transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                            WhatsApp
                          </button>
                          <button onClick={shareViaEmail} className="flex items-center justify-center gap-2 bg-[#121212]/5 text-[#121212] hover:bg-[#121212] active:bg-[#121212] active:text-white hover:text-white font-bold py-3 rounded-xl transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Email
                          </button>
                       </div>
                    </div>
                    
                    <div className="w-full max-w-md border-t border-gray-200 pt-6 mt-6 md:hidden">
                       <p className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase mb-4">Add to Calendar</p>
                       <div className="grid grid-cols-2 gap-4">
                         <motion.button whileTap={{ scale: 0.95 }} onClick={handleGoogleCalendar} className="bg-[#1a1a1a] p-4 rounded-xl flex flex-col items-center gap-3 border border-gray-800">
                           <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                           <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Google</span>
                         </motion.button>
                         <motion.button whileTap={{ scale: 0.95 }} onClick={downloadICS} className="bg-[#1a1a1a] p-4 rounded-xl flex flex-col items-center gap-3 border border-gray-800">
                           <svg className="w-6 h-6 text-[#0078D4]" fill="currentColor" viewBox="0 0 24 24"><path d="M22 2v20h-8v-20h8zm-10 2v16h-10v-16h10zm-3 4.5c0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5 1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5zm-5.5 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"/></svg>
                           <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Outlook</span>
                         </motion.button>
                         <motion.button whileTap={{ scale: 0.95 }} onClick={handleYahooCalendar} className="bg-[#1a1a1a] p-4 rounded-xl flex flex-col items-center gap-3 border border-gray-800">
                           <svg className="w-6 h-6 text-[#6001D2]" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 2.05L13.1 14.59V22h-2.18v-7.41L1.54 2.05h2.64l7.85 10.51 7.82-10.51z"/></svg>
                           <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Yahoo</span>
                         </motion.button>
                         <motion.button whileTap={{ scale: 0.95 }} onClick={downloadICS} className="bg-[#1a1a1a] p-4 rounded-xl flex flex-col items-center gap-3 border border-gray-800">
                           <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M16.32 10.45c-.03-2.52 2.06-3.76 2.15-3.81-1.18-1.72-3.02-1.95-3.68-1.98-1.56-.16-3.05.92-3.85.92-.8 0-2.02-.91-3.32-.88-1.7.03-3.27.99-4.14 2.51-1.78 3.09-.45 7.64 1.28 10.15.85 1.23 1.85 2.61 3.16 2.56 1.25-.05 1.74-.81 3.25-.81 1.5 0 1.95.81 3.26.78 1.34-.02 2.21-1.26 3.04-2.48 1.05-1.53 1.48-3.02 1.5-3.09-.03-.02-2.61-1.01-2.65-3.87zm-2.09-5.46c.68-.83 1.15-1.98 1.03-3.13-1 .04-2.2.66-2.9 1.5-.63.75-1.19 1.93-1.04 3.05 1.11.09 2.23-.59 2.91-1.42z"/></svg>
                           <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold">Apple</span>
                         </motion.button>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`mt-auto pt-8 flex items-center ${step === 5 ? "justify-between" : "justify-end"}`}>
                {step === 5 && (
                   <button onClick={() => setStep(1)} className="text-xs tracking-widest uppercase font-bold text-gray-400 hover:text-[#121212] active:text-[#121212] transition-colors border-b-2 border-transparent hover:border-[#121212] active:border-[#121212] pb-1">
                      Edit / Restart
                   </button>
                )}
                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={nextStep}
                  disabled={(step === 1 && !formData.court) || (step === 2 && (!formData.date || !formData.time)) || (step === 3 && (!formData.firstName || !formData.lastName))}
                  className="relative overflow-hidden bg-[#121212] disabled:bg-gray-200 disabled:text-gray-400 text-[#CCFF00] font-black uppercase tracking-widest text-sm py-4 px-10 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all group"
                >
                  <span className="relative z-10">{step === 4 ? "Initialize Payment" : step === 5 ? "Close Terminal" : "Proceed"}</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </LayoutGroup>
      )}

      <AnimatePresence>
        {step === 6 && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", damping: 25, stiffness: 120 }} className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-10 md:p-16 text-center border border-gray-100 z-20 relative overflow-hidden">
             
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00] -mr-16 -mt-16 rotate-45 z-0"></div>

             <div className="relative z-10 w-24 h-24 bg-[#121212] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
               <svg className="w-10 h-10 text-[#CCFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
             </div>
             
             <h1 className={`${spaceGrotesk.className} text-4xl md:text-6xl font-black text-[#121212] uppercase tracking-tighter mb-4 leading-none`}>
               Final Step
             </h1>
             
             <p className="text-gray-500 text-lg mb-8 font-medium">Your request is queued. Secure it now.</p>
             
             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 text-left shadow-sm">
               <p className="text-yellow-800 text-sm leading-relaxed font-medium flex items-start gap-3">
                 <span className="text-xl">⚠️</span>
                 <span>To confirm your booking, complete the <strong>50% advance payment within 15 minutes</strong>. Unpaid reservations are automatically wiped from the grid.</span>
               </p>
             </div>

             <div className="bg-[#FAFAFA] border-2 border-gray-100 rounded-2xl p-8 max-w-lg mx-auto mb-10 text-left relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#121212]"></div>
               <h3 className={`${spaceGrotesk.className} font-black text-xl text-[#121212] mb-6 tracking-tight uppercase`}>Transfer Protocol</h3>
               <ul className="space-y-4 text-[#121212] text-sm font-medium">
                 <li className="flex flex-col md:flex-row md:items-center"><span className="text-gray-400 w-32 uppercase tracking-widest text-[10px] font-bold">Bank Name</span> <span className="text-lg font-bold">Bank Alfalah</span></li>
                 <li className="flex flex-col md:flex-row md:items-center"><span className="text-gray-400 w-32 uppercase tracking-widest text-[10px] font-bold">Account Title</span> <span className="font-bold">USAMA HUSNAIN</span></li>
                 <li className="flex flex-col md:flex-row md:items-center"><span className="text-gray-400 w-32 uppercase tracking-widest text-[10px] font-bold">Account No.</span> <span className="font-mono text-base bg-gray-100 px-2 py-1 rounded">00761009811708</span></li>
                 <li className="flex flex-col md:flex-row md:items-center"><span className="text-gray-400 w-32 uppercase tracking-widest text-[10px] font-bold">IBAN</span> <span className="font-mono text-base bg-gray-100 px-2 py-1 rounded">PK60ALFH0076001009811708</span></li>
               </ul>
             </div>

             <div className="flex flex-col items-center">
               <p className="text-gray-500 text-sm mb-4">Post-transfer, transmit the receipt to our secure line:</p>
               <motion.a 
                 whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(204,255,0,0.3)" }}
                 whileTap={{ scale: 0.95 }}
                 href="https://wa.me/923044355096" 
                 target="_blank"
                 className="bg-[#121212] text-[#CCFF00] font-black text-lg px-8 py-4 rounded-xl flex items-center gap-3 transition-all"
               >
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                 Transmit via WhatsApp
               </motion.a>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}