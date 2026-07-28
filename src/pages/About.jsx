import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ChamferedButton from '../components/ui/ChamferedButton';

/* Reusable SVG image component with chamfered parallelogram clip-path */
function ChamferedImage({ src, alt, id, withStroke = false }) {
  return (
    <svg
      viewBox="0 0 620 400"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full lg:w-[620px] shrink-0 h-[220px] sm:h-[300px] md:h-[400px] overflow-visible"
    >
      <defs>
        <clipPath id={`clip-${id}`}>
          <path d="M38.75 0l581.25 0 0 320-38.75 80-581.25 0 0-320z" />
        </clipPath>
      </defs>
      <image
        x="0"
        y="0"
        width="620"
        height="400"
        href={src}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#clip-${id})`}
      />
      {withStroke && (
        <path
          d="M620-6l-581.25 0-5.39989 3.38443-38.75 80-0.60011 2.61557 0 320 6 6 581.25 0 5.3999-3.38443 38.75-80 0.6001-2.61557 0-320-6-6z m-620 86l38.75-80 581.25 0 0 320-38.75 80-581.25 0 0-320z"
          fill="#FFFFFF"
          fillRule="evenodd"
          className="transition-opacity duration-500 group-hover:opacity-0"
        />
      )}
      {!withStroke && (
        <path
          d="M38.75 0l581.25 0 0 320-38.75 80-581.25 0 0-320z"
          fill="none"
          strokeWidth="1"
        />
      )}
    </svg>
  );
}

export default function About() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-section',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-black text-white flex flex-col items-center gap-[40px] md:gap-[60px] px-6 md:px-[80px] py-[60px] md:py-[80px] pb-[80px] md:pb-[120px] overflow-hidden"
    >
      {/* ── Header Row ── */}
      <div className="about-section w-full flex flex-col gap-6 items-center justify-between">
        <h1
          className="text-5xl sm:text-7xl md:text-9xl lg:text-[132px] font-black font-sans tracking-[1px] text-center text-white"
          style={{ lineHeight: 1.1 }}
        >
          About Us
        </h1>
        <p
          className="text-xl sm:text-2xl md:text-[32px] font-bold font-sans tracking-[2px] text-white"
          style={{ lineHeight: 1.2 }}
        >
          Who we Are
        </p>
      </div>

      {/* ── Education Row (hover reveals white bg) ── */}
      <div className="edu-row about-section group w-full flex flex-col lg:flex-row gap-8 lg:gap-[40px] p-6 md:p-[32px] items-start relative">
        {/* White hover background — hidden by default, fades in on hover */}
        <div 
          className="absolute inset-0 w-full h-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white"
          style={{ clipPath: 'polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)' }}
        />

        {/* Education Image */}
        <div className="relative z-[1] w-full lg:w-auto shrink-0">
          <ChamferedImage
            src="/img/hero.JPG"
            alt="Bukhara Innovative Education and Medical University"
            id="edu"
            withStroke
          />
        </div>

        {/* Education Text — white text by default, black on hover */}
        <div className="relative z-[2] flex flex-col gap-4 w-full">
          <span className="text-lg md:text-[24px] font-bold font-sans tracking-[2px] text-[#00FFFF]">
            EDUCATION
          </span>
          <p
            className="text-sm md:text-[18px] font-mono font-normal text-white group-hover:text-black transition-colors duration-500"
            style={{ lineHeight: 1.6 }}
          >
            Amigos en Mundos LLC is one of the best student registration portals for MBBS programs in
            Uzbekistan. We work directly with Bukhara Innovative Education and Medical University
            (BIEMU) to help international students achieve their medical dreams.
          </p>
          <div>
            {/* White button by default, blue visible on hover (stacked approach) */}
            <span className="inline-block group-hover:hidden">
              <ChamferedButton variant="white" onClick={() => navigate('/mbbs')}>
                SEE MORE
              </ChamferedButton>
            </span>
            <span className="hidden group-hover:inline-block">
              <ChamferedButton variant="blue" onClick={() => navigate('/mbbs')}>
                SEE MORE
              </ChamferedButton>
            </span>
          </div>
        </div>
      </div>

      {/* ── Medical Tech Row (hover reveals white bg) ── */}
      <div className="about-section group w-full flex flex-col-reverse lg:flex-row gap-8 lg:gap-[40px] p-6 md:p-[32px] items-start relative">
        {/* White hover background — hidden by default, fades in on hover */}
        <div 
          className="absolute inset-0 w-full h-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white"
          style={{ clipPath: 'polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)' }}
        />

        {/* Medical Tech Text — white text by default, black on hover */}
        <div className="relative z-[2] flex flex-col gap-4 flex-1">
          <span className="text-lg md:text-[24px] font-bold font-sans tracking-[2px] text-[#00FFFF]">
            MEDICAL TECH
          </span>
          <p
            className="text-sm md:text-[18px] font-mono font-normal text-white group-hover:text-black transition-colors duration-500"
            style={{ lineHeight: 1.6 }}
          >
            We focus on human health. We implement modern and effective treatment procedures using the
            Cytotron device for cancer patients in India. Cytotron is an advanced rotational
            radio-therapy technology that precisely targets cancerous tumors and enables treatment at
            the cellular level without harming healthy tissues.
          </p>
          <div>
            {/* White button by default, blue visible on hover (stacked approach) */}
            <span className="inline-block group-hover:hidden">
              <ChamferedButton variant="white" onClick={() => navigate('/cytotron')}>
                SEE MORE
              </ChamferedButton>
            </span>
            <span className="hidden group-hover:inline-block">
              <ChamferedButton variant="blue" onClick={() => navigate('/cytotron')}>
                SEE MORE
              </ChamferedButton>
            </span>
          </div>
        </div>

        {/* Medical Tech Image */}
        <div className="relative z-[1] w-full lg:w-auto shrink-0">
          <ChamferedImage
            src="/images/generated-1785041456725.png"
            alt="Cytotron Medical Technology"
            id="medtech"
            withStroke
          />
        </div>
      </div>

      {/* ── Referral Row (hover reveals white bg) ── */}
      <div className="about-section group w-full flex flex-col lg:flex-row gap-8 lg:gap-[40px] p-6 md:p-[32px] items-start relative">
        {/* White hover background — hidden by default, fades in on hover */}
        <div 
          className="absolute inset-0 w-full h-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white"
          style={{ clipPath: 'polygon(40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%, 0 40px)' }}
        />

        {/* Referral Image */}
        <div className="relative z-[1] w-full lg:w-auto shrink-0">
          <ChamferedImage
            src="/images/generated-1785041456318.png"
            alt="AEMC Referral Community"
            id="referral"
            withStroke
          />
        </div>

        {/* Referral Text — white text by default, black on hover */}
        <div className="relative z-[2] flex flex-col gap-4 flex-1">
          <span className="text-lg md:text-[24px] font-bold font-sans tracking-[2px] text-[#00FFFF]">
            REFERRAL PROGRAM
          </span>
          <p
            className="text-sm md:text-[18px] font-mono font-normal text-white group-hover:text-black transition-colors duration-500"
            style={{ lineHeight: 1.6 }}
          >
            We offer an online referral program for students around the world. You can earn real money
            ($200 per student) by referring your friends to become a BIEMU student.
          </p>
          <div>
            {/* White button by default, blue visible on hover (stacked approach) */}
            <span className="inline-block group-hover:hidden">
              <ChamferedButton variant="white" onClick={() => navigate('/referral')}>
                SEE MORE
              </ChamferedButton>
            </span>
            <span className="hidden group-hover:inline-block">
              <ChamferedButton variant="blue" onClick={() => navigate('/referral')}>
                SEE MORE
              </ChamferedButton>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
