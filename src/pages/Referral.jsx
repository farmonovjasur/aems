import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ChamferedButton from '../components/ui/ChamferedButton';
import { UserPlus, Share2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

/* Chamfered parallelogram image — uses CSS clip-path so it scales naturally */
function ChamferedHeroImage({ src, alt }) {
  return (
    <div className="relative w-full">
      <img
        src={src}
        alt={alt}
        className="w-full object-cover"
        style={{
          aspectRatio: '600 / 460',
          clipPath: 'polygon(6.25% 0%, 100% 0%, 100% 80%, 93.75% 100%, 0% 100%, 0% 20%)',
        }}
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';
        }}
      />
      {/* White border overlay matching the chamfered shape */}
      <svg
        viewBox="0 0 600 460"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <path
          d="M37.5 0l562.5 0 0 368-37.5 92-562.5 0 0-368z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}

/* Chamfered card shape as SVG background */
function ChamferedCardBg({ className = '' }) {
  return (
    <svg
      viewBox="0 0 400 280"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 w-full h-full ${className}`}
    >
      <path
        d="M25 0l375 0 0 230-25 50-375 0 0-230z"
        fill="#FFFFFF0A"
        stroke="#FFFFFF1A"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function Referral() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.referral-element',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleGetReferralId = () => {
    toast.info('We\'re still putting the finishing touches on our platform! The referral program will be available once we officially launch. Stay tuned — exciting things are on the way!');
  };

  return (
    <div
      ref={containerRef}
      className="bg-black text-white flex flex-col gap-[80px] md:gap-[120px] px-6 md:px-[80px] pt-[60px] md:pt-[100px] pb-[80px] md:pb-[140px] overflow-hidden"
    >
      {/* ── Hero Section ── */}
      <div className="referral-element w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-[60px]">
        {/* Left — Text & CTA */}
        <div className="flex flex-col gap-5 md:gap-8 w-full lg:w-[620px] lg:shrink-0 order-2 lg:order-1">
          <div className="flex flex-col gap-1 md:gap-2">
            <h1
              className="text-3xl sm:text-4xl md:text-[60px] font-black font-sans text-white"
              style={{ letterSpacing: 2, lineHeight: 1.1 }}
            >
              REFER A FRIEND &
            </h1>
            <span
              className="text-4xl sm:text-5xl md:text-[80px] font-black font-sans text-[#00A8FF]"
              style={{ letterSpacing: 2, lineHeight: 1.1 }}
            >
              EARN $200
            </span>
          </div>

          <p
            className="text-[13px] md:text-[18px] font-mono font-normal text-white"
            style={{ lineHeight: 1.6 }}
          >
            Join our global community and help your friends embark on their medical journey. For every
            student you refer who successfully enrolls at BIEMU, we will reward you with $200. Share your
            unique ID and start earning today!
          </p>

          <div>
            <ChamferedButton
              variant="white"
              onClick={handleGetReferralId}
              className="!w-full sm:!w-[280px] md:!w-[320px]"
            >
              GET REFERRAL ID
            </ChamferedButton>
          </div>
        </div>

        {/* Right — Chamfered Image (shows first on mobile) */}
        <div className="w-full lg:w-[600px] lg:shrink-0 order-1 lg:order-2">
          <ChamferedHeroImage
            src="https://images.unsplash.com/photo-1779903597416-47d005a931ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3ODUwOTY2NDB8&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Students Referral Program"
          />
        </div>
      </div>

      {/* ── How it Works & Conditions ── */}
      <div className="referral-element w-full flex flex-col items-center gap-[40px] md:gap-[60px]">
        <h2
          className="text-2xl sm:text-3xl md:text-[40px] font-black font-sans text-white text-center"
          style={{ lineHeight: 1.2 }}
        >
          How it Works & Conditions
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {/* Step 01 */}
          <div className="referral-element relative min-h-[220px] md:h-[280px]">
            <ChamferedCardBg />
            <div className="relative z-[1] flex flex-col gap-5 h-full p-8 md:py-10 md:px-8">
              <div className="flex items-center justify-between w-full">
                <UserPlus size={32} color="#00A8FF" />
                <span
                  className="text-sm md:text-[16px] font-black font-sans"
                  style={{ color: '#FFFFFF4D' }}
                >
                  STEP 01
                </span>
              </div>
              <h3
                className="text-lg md:text-[24px] font-bold font-sans text-white"
                style={{ lineHeight: 1.3 }}
              >
                Register an Account
              </h3>
              <p
                className="text-xs md:text-[15px] font-mono font-normal text-white"
                style={{ lineHeight: 1.5 }}
              >
                You must be fully registered on our website to receive your unique User ID.
              </p>
            </div>
          </div>

          {/* Step 02 */}
          <div className="referral-element relative min-h-[220px] md:h-[280px]">
            <ChamferedCardBg />
            <div className="relative z-[1] flex flex-col gap-5 h-full p-8 md:py-10 md:px-8">
              <div className="flex items-center justify-between w-full">
                <Share2 size={32} color="#00A8FF" />
                <span
                  className="text-sm md:text-[16px] font-black font-sans"
                  style={{ color: '#FFFFFF4D' }}
                >
                  STEP 02
                </span>
              </div>
              <h3
                className="text-lg md:text-[24px] font-bold font-sans text-white"
                style={{ lineHeight: 1.3 }}
              >
                Share Your ID
              </h3>
              <p
                className="text-xs md:text-[15px] font-mono font-normal text-white"
                style={{ lineHeight: 1.5 }}
              >
                Your referred friend must enter your unique User ID during their registration process.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="referral-element relative min-h-[220px] md:h-[280px]">
            <ChamferedCardBg />
            <div className="relative z-[1] flex flex-col gap-5 h-full p-8 md:py-10 md:px-8">
              <div className="flex items-center justify-between w-full">
                <DollarSign size={32} color="#00A8FF" />
                <span
                  className="text-sm md:text-[16px] font-black font-sans"
                  style={{ color: '#FFFFFF4D' }}
                >
                  STEP 03
                </span>
              </div>
              <h3
                className="text-lg md:text-[24px] font-bold font-sans text-white"
                style={{ lineHeight: 1.3 }}
              >
                Get Rewarded
              </h3>
              <p
                className="text-xs md:text-[15px] font-mono font-normal text-white"
                style={{ lineHeight: 1.5 }}
              >
                You will earn $200 once the referred student successfully enrolls at BIEMU and makes
                their initial tuition payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
