import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ChamferedButton from '../components/ui/ChamferedButton';
import { Phone, Mail, Globe, ChevronDown, Search } from 'lucide-react';
import { toast } from 'sonner';
import { submitContactMessage } from '../services/api';
import { COUNTRIES } from '../utils/countries';

/* Chamfered Card BG SVG for 500x180 Info Cards */
function ChamferedInfoCardBg() {
  return (
    <svg
      viewBox="0 0 500 180"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <path
        d="M25 0l475 0 0 155-25 25-475 0 0-155z"
        fill="#FFFFFF0A"
        stroke="#FFFFFF1A"
        strokeWidth="1"
      />
    </svg>
  );
}

/* Chamfered Card BG SVG for Form Card */
function ChamferedFormCardBg() {
  return (
    <svg
      viewBox="0 0 720 620"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <path
        d="M40 0l680 0 0 580-40 40-680 0 0-580z"
        fill="#0A0A0A"
        stroke="#FFFFFF33"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Phone Country Selector
  const [isPhoneCountryOpen, setIsPhoneCountryOpen] = useState(false);
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(
    COUNTRIES.find((c) => c.name === 'Uzbekistan') || COUNTRIES[0]
  );
  const [searchPhoneCountry, setSearchPhoneCountry] = useState('');
  const phoneDropdownRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-element',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        phoneDropdownRef.current &&
        !phoneDropdownRef.current.contains(event.target)
      ) {
        setIsPhoneCountryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPhoneCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchPhoneCountry.toLowerCase()) ||
      c.code.includes(searchPhoneCountry)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        phone: `${selectedPhoneCountry.code} ${formData.phone}`,
      };
      const res = await submitContactMessage(payload);
      if (res.success) {
        toast.success(res.message || 'Xabaringiz muvaffaqiyatli yuborildi!');
        setFormData({ name: '', phone: '', email: '', message: '' });
      }
    } catch (err) {
      toast.error("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-black text-white flex flex-col gap-16 md:gap-20 px-6 md:px-[80px] pt-[80px] md:pt-[100px] pb-[100px] md:pb-[140px] overflow-hidden min-h-screen"
    >
      {/* ── Header ── */}
      <div className="contact-element flex flex-col items-center gap-4 text-center">
        <h1
          className="text-4xl sm:text-6xl md:text-[64px] font-black font-sans text-white tracking-widest leading-none"
          style={{ letterSpacing: 2 }}
        >
          GET IN TOUCH
        </h1>
        <p className="text-base sm:text-lg md:text-[18px] font-mono font-normal text-white/80">
          We're here to answer any questions you may have.
        </p>
      </div>

      {/* ── 2-Column Section: Info Cards + Contact Form ── */}
      <div className="contact-element flex flex-col lg:flex-row gap-10 lg:gap-[60px] justify-center items-start max-w-[1280px] mx-auto w-full">
        {/* Left Column — Info Cards Stack (Width: 500px) */}
        <div className="flex flex-col gap-8 w-full lg:w-[500px] lg:shrink-0">
          {/* Card 1: Phone & WhatsApp */}
          <div className="relative min-h-[180px] w-full">
            <ChamferedInfoCardBg />
            <div className="relative z-[1] flex flex-col justify-center gap-4 h-full p-8 md:p-[32px]">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Phone size={22} className="text-[#00A8FF]" />
                  <h3 className="text-base md:text-[18px] font-bold font-sans text-white">
                    Phone & WhatsApp
                  </h3>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm md:text-[16px] font-mono text-white/80">
                <p>+998 93 656 68 89</p>
                <p>+91 9112961963</p>
              </div>
            </div>
          </div>

          {/* Card 2: Email Address */}
          <div className="relative min-h-[180px] w-full">
            <ChamferedInfoCardBg />
            <div className="relative z-[1] flex flex-col justify-center gap-4 h-full p-8 md:p-[32px]">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Mail size={22} className="text-[#00A8FF]" />
                  <h3 className="text-base md:text-[18px] font-bold font-sans text-white">
                    Email Address
                  </h3>
                </div>
              </div>
              <div className="text-sm md:text-[16px] font-mono text-white/80">
                <p>umid.nurov@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Send a Message Form Card (Width: 720px) */}
        <div className="relative min-h-[620px] w-full lg:w-[720px] lg:shrink-0">
          <ChamferedFormCardBg />
          <div className="relative z-[1] flex flex-col gap-6 md:gap-8 h-full p-6 sm:p-10 md:p-[48px] justify-between">
            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold font-sans text-white">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
              {/* Row 1: Your Name & Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Your Name */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[14px] md:text-[15px] font-bold font-sans text-white">
                    Your Name
                  </label>
                  <div className="bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] flex items-center px-4 py-3.5 h-[56px] w-full focus-within:border-white/60 transition-colors">
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-transparent border-none outline-none text-[14px] md:text-[15px] font-mono text-white placeholder-white/40"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-2 w-full relative">
                  <label className="text-[14px] md:text-[15px] font-bold font-sans text-white">
                    Phone Number
                  </label>
                  <div className="bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] flex items-center px-4 py-3.5 h-[56px] w-full gap-3 relative focus-within:border-white/60 transition-colors">
                    <Globe size={18} className="text-white/70 shrink-0" />

                    {/* Country Selector Dropdown */}
                    <div
                      className="relative flex items-center shrink-0"
                      ref={phoneDropdownRef}
                    >
                      <div
                        className="flex items-center gap-2 cursor-pointer pr-1"
                        onClick={() => setIsPhoneCountryOpen(!isPhoneCountryOpen)}
                      >
                        <span className="text-[15px]">{selectedPhoneCountry.flag}</span>
                        <span className="text-[14px] md:text-[15px] font-mono text-white">
                          {selectedPhoneCountry.code}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`text-white/50 transition-transform ${
                            isPhoneCountryOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>

                      {isPhoneCountryOpen && (
                        <div className="absolute top-[42px] left-[-40px] w-[300px] h-[320px] bg-[#1A1A1A] border border-white/20 rounded-[12px] shadow-2xl z-50 flex flex-col overflow-hidden">
                          <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-[#1A1A1A]">
                            <Search size={16} className="text-white/50 shrink-0" />
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={searchPhoneCountry}
                              onChange={(e) => setSearchPhoneCountry(e.target.value)}
                              className="w-full bg-transparent border-none outline-none text-[13px] font-mono text-white placeholder-white/40"
                              autoFocus
                            />
                          </div>
                          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                            {filteredPhoneCountries.length > 0 ? (
                              filteredPhoneCountries.map((c, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center justify-between p-2 rounded-[6px] cursor-pointer hover:bg-white/10 transition-colors ${
                                    selectedPhoneCountry.name === c.name
                                      ? 'bg-white/10'
                                      : ''
                                  }`}
                                  onClick={() => {
                                    setSelectedPhoneCountry(c);
                                    setIsPhoneCountryOpen(false);
                                    setSearchPhoneCountry('');
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-[16px]">{c.flag}</span>
                                    <span className="text-[13px] font-mono text-white/90">
                                      {c.name}
                                    </span>
                                  </div>
                                  <span className="text-[13px] font-mono text-white/50">
                                    {c.code}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="text-[13px] font-mono text-white/50 text-center p-4">
                                No country found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-[1px] h-[24px] bg-white/20 shrink-0 mx-1" />

                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-transparent border-none outline-none text-[14px] md:text-[15px] font-mono text-white placeholder-white/40 min-w-0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email Address */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[14px] md:text-[15px] font-bold font-sans text-white">
                  Email Address
                </label>
                <div className="bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] flex items-center px-4 py-3.5 h-[56px] w-full focus-within:border-white/60 transition-colors">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-transparent border-none outline-none text-[14px] md:text-[15px] font-mono text-white placeholder-white/40"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Message */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[14px] md:text-[15px] font-bold font-sans text-white">
                  Message
                </label>
                <div className="bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] p-4 w-full focus-within:border-white/60 transition-colors">
                  <textarea
                    rows={4}
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-transparent border-none outline-none text-[14px] md:text-[15px] font-mono text-white placeholder-white/40 resize-none min-h-[120px]"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Submit Button */}
              <div className="pt-2 w-full">
                <ChamferedButton
                  type="submit"
                  variant="white"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'SENDING...' : 'SEND MESSAGE'}
                </ChamferedButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
