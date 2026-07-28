import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ChamferedButton from '../components/ui/ChamferedButton';

export default function Home() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative flex flex-col bg-black text-white overflow-hidden min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]">

      {/* Grid Background — absolute positioned lines matching design */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Horizontal lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-aemc-dark-gray" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-aemc-dark-gray" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-aemc-dark-gray" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-aemc-dark-gray" />
        {/* Vertical lines */}
        <div className="absolute top-0 left-0 h-full w-px bg-aemc-dark-gray" />
        <div className="absolute top-0 left-1/3 h-full w-px bg-aemc-dark-gray" />
        <div className="absolute top-0 left-2/3 h-full w-px bg-aemc-dark-gray" />
        <div className="absolute top-0 right-0 h-full w-px bg-aemc-dark-gray" />
      </div>

      {/* Main Center Content */}
      <div ref={titleRef} className="relative z-10 flex-1 flex flex-col items-center justify-center text-center gap-8 px-10 py-12">
        {/* Available Badge */}
        <div className="inline-flex items-center gap-2.5">
          <span
            className="h-1.5 w-1.5 rounded-full bg-aemc-neon-cyan"
            style={{
              boxShadow: '0 0 8px 2px #00FFFF, 0 0 4px 1px #00FFFF',
            }}
          />
          <span className="text-xs font-mono text-aemc-neon-cyan tracking-[2px] uppercase">
            Available Worldwide
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[120px] font-black font-sans tracking-tight uppercase text-white leading-none w-full">
          AMIGOS EN MUNDOS
        </h1>

        {/* Boost Button */}
        <div className="pt-4">
          <ChamferedButton
            variant="boost"
            onClick={() => navigate('/about')}
          >
            BOOST BUSINESS
          </ChamferedButton>
        </div>
      </div>

      {/* Bottom Marquee Bar */}
      <div className="relative z-10 flex items-center justify-between h-10 px-4 md:px-10 border-t border-aemc-border">
        <p className="text-[10px] md:text-[11px] font-mono text-aemc-gray tracking-[1px] whitespace-nowrap">
          BASED IN BUKHARA, UZ
        </p>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-xs font-mono text-aemc-gray tracking-[1px]">*&nbsp;&nbsp;MBBS IN UZBEKISTAN&nbsp;&nbsp;*</span>
          <span className="text-xs font-mono text-aemc-gray tracking-[1px]">*&nbsp;&nbsp;CYTOTRON IN INDIA&nbsp;&nbsp;*</span>
          <span className="text-xs font-mono text-aemc-gray tracking-[1px]">*&nbsp;&nbsp;$200 REFERRAL BONUS&nbsp;&nbsp;*</span>
        </div>
        <p className="text-[10px] md:text-[11px] font-mono text-aemc-gray tracking-[1px] whitespace-nowrap">
          EST. 2026
        </p>
      </div>
    </div>
  );
}
