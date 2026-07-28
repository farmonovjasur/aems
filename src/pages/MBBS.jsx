import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ChamferedButton from '../components/ui/ChamferedButton';
import ApplicationModal from '../components/modals/ApplicationModal';

/* Chamfered card background SVG — reusable for info cards & badges */
function ChamferedCardBg({ className = '', fill = '#FFFFFF0A', stroke = '#FFFFFF1A' }) {
  return (
    <svg
      viewBox="0 0 400 280"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 w-full h-full ${className}`}
    >
      <path
        d="M25 0l375 0 0 230-25 50-375 0 0-230z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
    </svg>
  );
}

/* Chamfered badge (small tag with chamfered bg) */
function ChamferedBadge({ children }) {
  return (
    <div className="relative h-[44px] md:h-[50px] flex-1 min-w-[120px]">
      <svg
        viewBox="0 0 160 50"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M8 0l152 0 0 40-8 10-152 0 0-40z"
          fill="#FFFFFF0A"
          stroke="#FFFFFF1A"
          strokeWidth="1"
        />
      </svg>
      <div className="relative z-[1] flex items-center justify-center h-full px-2">
        <span className="text-[10px] md:text-xs font-bold font-sans text-white text-center">
          {children}
        </span>
      </div>
    </div>
  );
}

/* Chamfered parallelogram image for BIEMU */
function ChamferedImage({ src, alt }) {
  return (
    <div className="relative w-full">
      <img
        src={src}
        alt={alt}
        className="w-full object-cover"
        style={{
          aspectRatio: '640 / 560',
          clipPath: 'polygon(6.25% 0%, 100% 0%, 100% 80%, 93.75% 100%, 0% 100%, 0% 20%)',
        }}
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80';
        }}
      />
      <svg
        viewBox="0 0 640 560"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <path
          d="M40 0l600 0 0 448-40 112-600 0 0-448z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}

export default function MBBS() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mbbs-element',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const expenseTable = [
    { label: 'Tuition Fee (Per Year)', value: '$2,900 USD' },
    { label: 'Dormitory Fees (Per Year)', value: '$500 USD' },
    { label: 'Mess Fees (Optional, Per Year)', value: '$1,200 USD' },
    { label: 'Police Registration', value: '$300 USD' },
    { label: 'One-Time Charges (OTC)', value: '$500 USD' },
    { label: 'Health Insurance & Checkup', value: '$100 USD' },
  ];

  const infoCards = [
    {
      title: 'Duration',
      desc: '6 years (5 years classroom learning + 1 year clinical training & internship).',
    },
    {
      title: 'Medium of Teaching',
      desc: 'English is adopted as the medium of instruction for foreign students.',
    },
    {
      title: 'Intake',
      desc: 'Begins in July. Application & formalities by end of August. Academic session starts first week of September.',
    },
    {
      title: 'Fees & Cost of Living',
      desc: 'Total course fee ₹15–20 lakh. Monthly expenses around ₹10,000–₹15,000 including accommodation.',
    },
    {
      title: 'Accredited Universities',
      desc: 'Accredited and recognized by WHO, FAIMER, and NMC.',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="bg-black text-white flex flex-col gap-[60px] md:gap-[100px] px-6 md:px-[80px] pt-[60px] md:pt-[80px] pb-[80px] md:pb-[120px] overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="mbbs-element">
        <h1
          className="text-3xl sm:text-5xl md:text-[80px] font-black font-sans text-white"
          style={{ letterSpacing: 2, lineHeight: 1.1 }}
        >
          STUDY MBBS IN UZBEKISTAN
        </h1>
      </div>

      {/* ── Education System + Info Cards Row ── */}
      <div className="mbbs-element flex flex-col lg:flex-row gap-10 lg:gap-[60px]">
        {/* Left — Description */}
        <div className="flex flex-col gap-6 w-full lg:w-[700px] lg:shrink-0">
          <h2
            className="text-xl sm:text-2xl md:text-[32px] font-bold font-sans text-white"
            style={{ lineHeight: 1.3 }}
          >
            Education System in Uzbekistan
          </h2>
          <p
            className="text-[13px] md:text-[16px] font-mono font-normal text-white"
            style={{ lineHeight: 1.6 }}
          >
            MBBS in Uzbekistan is gaining huge popularity among Indian medical aspirants. The medical
            education quality of MBBS in Uzbekistan is at par with universities of the USA, UK, and
            Canada. Medical students from Uzbekistan can apply for a medical licence across the globe.
            The MBBS programs offered by medical universities in Uzbekistan are recognized by top
            bodies including WHO, NMC, and FAIMER. With affordable tuition fee of about 2 Lacs per
            annum, the 5+1-year course is taught in English language making it easier for Indian
            students to learn and practice. Most medical universities offering MBBS in Uzbekistan
            including the Fergana Medical Institute of Public Health, Tashkent Medical Academy
            Uzbekistan, Bukhara State Medical Institute, and Samarkand State Medical University rank
            high in terms of quality of education and facilities. Read on and get all the information
            about pursuing MBBS in Uzbekistan.
          </p>
        </div>

        {/* Right — Info Cards */}
        <div className="flex flex-col gap-4 w-full lg:w-[520px] lg:shrink-0">
          {infoCards.map((card, idx) => (
            <div key={idx} className="mbbs-element relative min-h-[100px] md:min-h-[110px]">
              <ChamferedCardBg />
              <div className="relative z-[1] flex flex-col gap-2 justify-center h-full p-5 md:p-6">
                <span className="text-base md:text-[20px] font-bold font-sans text-[#00A8FF]">
                  {card.title}
                </span>
                <p
                  className="text-xs md:text-[15px] font-mono font-normal text-white"
                  style={{ lineHeight: 1.5 }}
                >
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BIEMU Section ── */}
      <div className="mbbs-element flex flex-col items-center gap-10 md:gap-12">
        <h2
          className="text-xl sm:text-2xl md:text-[40px] font-black font-sans text-white text-center"
          style={{ lineHeight: 1.2 }}
        >
          Bukhara Innovative Education and Medical University (BIEMU)
        </h2>

        <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-[60px]">
          {/* Left — Image + Badges */}
          <div className="flex flex-col gap-4 w-full lg:w-[640px] lg:shrink-0">
            <ChamferedImage
              src="/img/hero.JPG"
              alt="BIEMU Campus"
            />
            {/* Badges row */}
            <div className="flex gap-3 md:gap-4 flex-wrap md:flex-nowrap">
              <ChamferedBadge>WHO/MCI Approved</ChamferedBadge>
              <ChamferedBadge>Experienced Faculty</ChamferedBadge>
              <ChamferedBadge>Modern Labs</ChamferedBadge>
              <ChamferedBadge>English Medium</ChamferedBadge>
            </div>
          </div>

          {/* Right — Fees Table */}
          <div className="relative flex-1 min-h-[480px] md:min-h-[560px]">
            {/* Chamfered bg */}
            <svg
              viewBox="0 0 580 560"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full"
            >
              <path
                d="M36.25 0l543.75 0 0 448-36.25 112-543.75 0 0-448z"
                fill="#0A0A0A"
                stroke="#FFFFFF33"
                strokeWidth="1"
              />
            </svg>

            <div className="relative z-[1] flex flex-col justify-between h-full p-6 md:p-10">
              <div className="flex flex-col gap-0">
                <h3
                  className="text-lg md:text-[24px] font-bold font-sans text-[#00A8FF] mb-4"
                >
                  FEES & EXPENSES
                </h3>

                {expenseTable.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-xs md:text-[15px] font-mono font-normal text-white">
                        {item.label}
                      </span>
                      <span className="text-sm md:text-[18px] font-bold font-sans text-white whitespace-nowrap ml-4">
                        {item.value}
                      </span>
                    </div>
                    <div className="w-full h-px bg-white/10" />
                  </React.Fragment>
                ))}
              </div>

              <div className="pt-6">
                <ChamferedButton
                  variant="white"
                  fullWidth
                  onClick={() => setIsModalOpen(true)}
                >
                  APPLY NOW
                </ChamferedButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
