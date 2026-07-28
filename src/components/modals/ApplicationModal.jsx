import React, { useState, useRef, useEffect } from 'react';
import { X, Globe, ChevronDown, Search } from 'lucide-react';
import { toast } from 'sonner';
import ChamferedButton from '../ui/ChamferedButton';
import { submitApplicationForm } from '../../services/api';
import { COUNTRIES } from '../../utils/countries';

export default function ApplicationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    country: 'India',
    gender: 'male',
    degree: 'MBBS / Bachelor',
    faculty: 'General Medicine',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  // Country Phone Prefix Picker
  const [isPhoneCountryOpen, setIsPhoneCountryOpen] = useState(false);
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(
    COUNTRIES.find((c) => c.name === 'India') || COUNTRIES[0]
  );
  const [searchPhoneCountry, setSearchPhoneCountry] = useState('');
  const phoneDropdownRef = useRef(null);

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

  if (!isOpen) return null;

  const filteredPhoneCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchPhoneCountry.toLowerCase()) ||
      c.code.includes(searchPhoneCountry)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        phone: `${selectedPhoneCountry.code} ${formData.phone}`,
      };

      const res = await submitApplicationForm(payload);
      if (res.success) {
        toast.success(
          res.message || 'BIEMU universiteti uchun arizangiz yuborildi!'
        );
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          country: 'India',
          gender: 'male',
          degree: 'MBBS / Bachelor',
          faculty: 'General Medicine',
          message: '',
        });
        onClose();
      }
    } catch (err) {
      toast.error("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div
        className="relative w-full max-w-[720px] shrink-0 my-auto"
        style={{ filter: 'drop-shadow(0 0 80px rgba(0, 255, 255, 0.3))' }}
      >
        {/* Chamfered Outer Border Layer */}
        <div
          className="absolute inset-0 bg-white/20 pointer-events-none"
          style={{
            clipPath:
              'polygon(45px 0, 100% 0, 100% calc(100% - 45px), calc(100% - 45px) 100%, 0 100%, 0 45px)',
          }}
        />

        {/* Chamfered Inner Background Layer */}
        <div
          className="absolute inset-[1px] bg-[#0A0A0A] pointer-events-none"
          style={{
            clipPath:
              'polygon(44.5px 0, 100% 0, 100% calc(100% - 44.5px), calc(100% - 44.5px) 100%, 0 100%, 0 44.5px)',
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col gap-6 md:gap-8 p-6 sm:p-8 lg:p-12 w-full h-full">
          {/* Header Row */}
          <div className="flex flex-row items-center justify-between w-full">
            <h3 className="text-2xl sm:text-3xl md:text-[32px] font-bold font-sans text-white leading-normal tracking-tight">
              Apply for BIEMU
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-white/50 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            {/* Row 1: Full Name & Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[15px] md:text-[16px] font-bold font-sans text-white">
                  Full Name
                </label>
                <div className="bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] flex items-center px-4 py-3.5 h-[56px] w-full focus-within:border-white/60 transition-colors">
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full bg-transparent border-none outline-none text-[14px] md:text-[15px] font-mono text-white placeholder-white/40"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2 w-full relative">
                <label className="text-[15px] md:text-[16px] font-bold font-sans text-white">
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
                                  setFormData((prev) => ({ ...prev, country: c.name }));
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

            {/* Row 2: Email Address & Select Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Address */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[15px] md:text-[16px] font-bold font-sans text-white">
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

              {/* Select Country */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[15px] md:text-[16px] font-bold font-sans text-white">
                  Select Country
                </label>
                <div className="relative bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] flex items-center h-[56px] w-full focus-within:border-white/60 transition-colors">
                  <select
                    value={formData.country}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      setFormData((prev) => ({ ...prev, country: selectedName }));
                      const foundCountry = COUNTRIES.find((c) => c.name === selectedName);
                      if (foundCountry) {
                        setSelectedPhoneCountry(foundCountry);
                      }
                    }}
                    className="w-full h-full bg-transparent border-none outline-none text-[14px] md:text-[15px] font-mono text-white px-4 pr-10 appearance-none cursor-pointer [&>option]:bg-[#1A1A1A] [&>option]:text-white"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 text-white/50 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Gender & Select Degree */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[15px] md:text-[16px] font-bold font-sans text-white">
                  Gender
                </label>
                <div className="flex items-center gap-8 h-[56px] px-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="appGender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="hidden"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-white/40 group-hover:border-white flex items-center justify-center transition-colors">
                      {formData.gender === 'male' && (
                        <div className="w-2.5 h-2.5 bg-[#00A8FF] rounded-full" />
                      )}
                    </div>
                    <span className="text-[14px] md:text-[15px] font-mono text-white">
                      Male
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="appGender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="hidden"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-white/40 group-hover:border-white flex items-center justify-center transition-colors">
                      {formData.gender === 'female' && (
                        <div className="w-2.5 h-2.5 bg-[#00A8FF] rounded-full" />
                      )}
                    </div>
                    <span className="text-[14px] md:text-[15px] font-mono text-white">
                      Female
                    </span>
                  </label>
                </div>
              </div>

              {/* Select Degree */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[15px] md:text-[16px] font-bold font-sans text-white">
                  Select Degree
                </label>
                <div className="relative bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] flex items-center h-[56px] w-full focus-within:border-white/60 transition-colors">
                  <select
                    value={formData.degree}
                    onChange={(e) =>
                      setFormData({ ...formData, degree: e.target.value })
                    }
                    className="w-full h-full bg-transparent border-none outline-none text-[14px] md:text-[15px] font-mono text-white px-4 pr-10 appearance-none cursor-pointer [&>option]:bg-[#1A1A1A] [&>option]:text-white"
                  >
                    <option value="MBBS / Bachelor">MBBS / Bachelor</option>
                    <option value="MD / Master">MD / Master</option>
                    <option value="DBBS / Diploma">DBBS / Diploma</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 text-white/50 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Select Faculty */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[15px] md:text-[16px] font-bold font-sans text-white">
                Select Faculty
              </label>
              <div className="relative bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] flex items-center h-[56px] w-full focus-within:border-white/60 transition-colors">
                <select
                  value={formData.faculty}
                  onChange={(e) =>
                    setFormData({ ...formData, faculty: e.target.value })
                  }
                  className="w-full h-full bg-transparent border-none outline-none text-[14px] md:text-[15px] font-mono text-white px-4 pr-10 appearance-none cursor-pointer [&>option]:bg-[#1A1A1A] [&>option]:text-white"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Dentistry">Dentistry</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Pharmacy">Pharmacy</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 text-white/50 pointer-events-none"
                />
              </div>
            </div>

            {/* Row 5: Message */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[15px] md:text-[16px] font-bold font-sans text-white">
                Message
              </label>
              <div className="bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] p-4 w-full focus-within:border-white/60 transition-colors">
                <textarea
                  rows={3}
                  placeholder="Write any questions or additional details here..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-transparent border-none outline-none text-[14px] md:text-[15px] font-mono text-white placeholder-white/40 resize-none"
                />
              </div>
            </div>

            {/* Row 6: Submit Button */}
            <div className="pt-2 w-full">
              <ChamferedButton
                type="submit"
                variant="white"
                fullWidth
                disabled={loading}
              >
                {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
              </ChamferedButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
