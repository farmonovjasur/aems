import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ChamferedButton from '../components/ui/ChamferedButton';
import ConsultationModal from '../components/modals/ConsultationModal';

export default function Cytotron() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cytotron-element',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-black text-white flex flex-col items-center gap-[40px] md:gap-[60px] px-4 md:px-[40px] py-[40px] md:py-[60px] pb-[80px] overflow-hidden"
    >
      {/* ── Header Row ── */}
      <div className="cytotron-element w-full flex flex-col gap-4 items-center justify-between">
        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black font-sans tracking-[2px] text-center text-white"
          style={{ lineHeight: 1.1 }}
        >
          Cytotron
        </h1>
        <p
          className="text-base text-center sm:text-xl md:text-[24px] font-bold font-sans tracking-[2px] text-white max-w-[300px] md:max-w-none mx-auto"
          style={{ lineHeight: 1.3 }}
        >
          Advanced Rotational Radio-Therapy
        </p>
      </div>

      {/* ── Hero Image ── */}
      <div className="cytotron-element w-full flex justify-center">
        <svg
          viewBox="0 0 1280 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full lg:w-[1100px] shrink-0 h-[180px] sm:h-[300px] md:h-[500px] overflow-visible"
        >
          <defs>
            <clipPath id="clip-hero">
              <path d="M60 0l1220 0 0 540-60 60-1220 0 0-540 60-60z"></path>
            </clipPath>
          </defs>
          <image
            x="0"
            y="0"
            width="1280"
            height="600"
            href="https://images.unsplash.com/photo-1711409664431-4e7914ac2370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3ODUwODg3NDB8&ixlib=rb-4.1.0&q=80&w=1080"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clip-hero)"
          />
          <path
            d="M1280-6l-1220 0-4.24264 1.75736-60 60-1.75736 4.24264 0 540 6 6 1220 0 4.2427-1.75739 60-60 1.7573-4.24261 0-540-6-6z m-1280 66l60-60 1220 0 0 540-60 60-1220 0 0-540z"
            fill="#FFFFFF"
            fillRule="evenodd"
          ></path>
        </svg>
      </div>

      {/* ── Technology Row ── */}
      <div className="cytotron-element w-full flex flex-col md:flex-row gap-4 md:gap-[60px] justify-between items-center max-w-[1100px]">
        <div className="text-lg sm:text-xl md:text-[20px] font-bold font-sans tracking-[2px] text-white text-left w-full md:w-[300px] shrink-0">
          THE TECHNOLOGY
        </div>
        <div className="text-sm md:text-[16px] font-mono font-normal text-white flex-1 leading-relaxed text-left">
          Cytotron is a breakthrough device for cancer management. It employs an advanced rotational
          radio-therapy technology that precisely targets cancerous tumors and enables treatment at the
          cellular level without harming healthy tissues. We implement this modern and effective
          procedure for our patients.
        </div>
      </div>

      {/* ── Benefits Container ── */}
      <div className="cytotron-element w-full flex flex-col gap-[30px] md:gap-[40px] pt-[20px] max-w-[1100px]">
        <div className="text-lg sm:text-xl md:text-[20px] font-bold font-sans tracking-[2px] text-white text-center w-full">
          KEY ADVANTAGES
        </div>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-[24px] justify-between w-full">
          {/* Benefit 1 */}
          <div className="relative flex flex-col gap-3 md:gap-4 p-5 sm:p-6 lg:p-8 w-full flex-1 h-auto lg:h-[240px]">
            <svg
              viewBox="0 0 380 280"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full z-0"
            >
              <path
                d="M23.75 0l356.25 0 0 224-23.75 56-356.25 0 0-224 23.75-56z"
                fill="#FFFFFF"
                fillOpacity="0.05"
              ></path>
              <path
                d="M379 0l-355.25 0-23.75 56 0 224 356.25 0 23.75-56 0-224-1 0z m0 1l-354.58789 0-23.41211 55.20329 0 222.79671 354.58789 0 23.41211-55.20328 0-222.79672z"
                fill="#FFFFFF"
                fillOpacity="0.1"
                fillRule="evenodd"
              ></path>
            </svg>
            <div className="relative z-10 text-lg font-bold font-sans text-white">
              Non-Invasive
            </div>
            <div className="relative z-10 text-sm font-mono text-white leading-relaxed">
              Safe, pain-free procedure that operates externally, significantly improving patient
              comfort.
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="relative flex flex-col gap-3 md:gap-4 p-5 sm:p-6 lg:p-8 w-full flex-1 h-auto lg:h-[240px]">
            <svg
              viewBox="0 0 380 280"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full z-0"
            >
              <path
                d="M23.75 0l356.25 0 0 224-23.75 56-356.25 0 0-224 23.75-56z"
                fill="#FFFFFF"
                fillOpacity="0.05"
              ></path>
              <path
                d="M379 0l-355.25 0-23.75 56 0 224 356.25 0 23.75-56 0-224-1 0z m0 1l-354.58789 0-23.41211 55.20329 0 222.79671 354.58789 0 23.41211-55.20328 0-222.79672z"
                fill="#FFFFFF"
                fillOpacity="0.1"
                fillRule="evenodd"
              ></path>
            </svg>
            <div className="relative z-10 text-lg font-bold font-sans text-white">
              Cellular Precision
            </div>
            <div className="relative z-10 text-sm font-mono text-white leading-relaxed">
              Targeted action at the cellular level ensures tumors are directly affected without
              collateral impact.
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="relative flex flex-col gap-3 md:gap-4 p-5 sm:p-6 lg:p-8 w-full flex-1 h-auto lg:h-[240px]">
            <svg
              viewBox="0 0 380 280"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full z-0"
            >
              <path
                d="M23.75 0l356.25 0 0 224-23.75 56-356.25 0 0-224 23.75-56z"
                fill="#FFFFFF"
                fillOpacity="0.05"
              ></path>
              <path
                d="M379 0l-355.25 0-23.75 56 0 224 356.25 0 23.75-56 0-224-1 0z m0 1l-354.58789 0-23.41211 55.20329 0 222.79671 354.58789 0 23.41211-55.20328 0-222.79672z"
                fill="#FFFFFF"
                fillOpacity="0.1"
                fillRule="evenodd"
              ></path>
            </svg>
            <div className="relative z-10 text-lg font-bold font-sans text-white">
              Zero Harm
            </div>
            <div className="relative z-10 text-sm font-mono text-white leading-relaxed">
              Completely harmless to surrounding healthy cells, tissues, and major organs.
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA Row ── */}
      <div className="cytotron-element w-full flex flex-col gap-4 md:gap-6 items-center pt-[20px] md:pt-[40px]">
        <div className="text-base sm:text-xl md:text-[20px] font-bold font-sans text-white text-center max-w-[280px] md:max-w-none mx-auto">
          Get started with your treatment journey
        </div>
        <div className="w-full max-w-[320px] sm:flex justify-center flex items-center ">
          <ChamferedButton variant="white" onClick={() => setIsModalOpen(true)}>
            BOOK CONSULTATION
          </ChamferedButton>
        </div>
      </div>

      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
