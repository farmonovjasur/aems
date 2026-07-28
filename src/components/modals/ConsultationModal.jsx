import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Globe, ChevronDown, Upload, FileText, Search } from 'lucide-react';
import { toast } from 'sonner';
import ChamferedButton from '../ui/ChamferedButton';
import { submitConsultationRequest } from '../../services/api';
import { COUNTRIES } from '../../utils/countries';

export default function ConsultationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'male',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [searchCountry, setSearchCountry] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchCountry.toLowerCase()) || 
    c.code.includes(searchCountry)
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        toast.success(`Fayl biriktirildi: ${acceptedFiles[0].name}`);
      }
    },
    onDropRejected: () => {
      toast.error('Fayl hajmi 10MB dan oshmasligi va faqat PDF, DOC, JPG, PNG bo\'lishi kerak!');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', `${selectedCountry.code} ${formData.phone}`);
      data.append('email', formData.email);
      data.append('gender', formData.gender);
      if (file) {
        data.append('document', file);
      }

      const res = await submitConsultationRequest(data);
      if (res.success) {
        toast.success(res.message || 'Konsultatsiya so\'rovingiz yuborildi!');
        setFormData({ name: '', phone: '', email: '', gender: 'male' });
        setFile(null);
        onClose();
      }
    } catch (err) {
      toast.error('Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-10">
        <div 
          className="relative w-full max-w-[600px] shrink-0"
          style={{ filter: 'drop-shadow(0 0 40px rgba(0, 255, 255, 0.2))' }}
        >
          {/* Border layer */}
          <div 
            className="absolute inset-0 bg-white/20 pointer-events-none"
            style={{ clipPath: 'polygon(37.5px 0, 100% 0, 100% calc(100% - 37.5px), calc(100% - 37.5px) 100%, 0 100%, 0 37.5px)' }}
          ></div>
          
          {/* Inner background layer */}
          <div 
            className="absolute inset-[1px] bg-[#050505] pointer-events-none"
            style={{ clipPath: 'polygon(37px 0, 100% 0, 100% calc(100% - 37px), calc(100% - 37px) 100%, 0 100%, 0 37px)' }}
          ></div>

          <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 lg:p-10 w-full h-full">
            {/* Header Row */}
            <div className="flex flex-row items-center justify-between w-full">
              <h3 className="text-[24px] sm:text-[32px] font-bold font-sans text-white leading-normal">
                Book a Consultation
              </h3>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              {/* Name */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[15px] font-bold font-sans text-white">Name</label>
                <div className="bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] flex items-center px-5 py-4 w-full">
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-none outline-none text-[15px] font-mono text-white placeholder-white/40"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2 w-full relative">
                <label className="text-[15px] font-bold font-sans text-white">Phone Number</label>
                <div className="bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] flex items-center px-4 py-3 w-full gap-3 relative focus-within:border-white/60 transition-colors">
                  <Globe size={18} className="text-white/70 shrink-0" />
                  
                  {/* Custom Country Dropdown */}
                  <div className="relative flex items-center shrink-0" ref={dropdownRef}>
                    <div 
                      className="flex items-center gap-2 cursor-pointer pr-1"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    >
                      <span className="text-[15px]">{selectedCountry.flag}</span>
                      <span className="text-[15px] font-mono text-white">{selectedCountry.code}</span>
                      <ChevronDown size={14} className={`text-white/50 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isCountryDropdownOpen && (
                      <div className="absolute top-[40px] left-[-40px] w-[300px] h-[320px] bg-[#1A1A1A] border border-white/20 rounded-[12px] shadow-2xl z-50 flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-[#1A1A1A]">
                          <Search size={16} className="text-white/50 shrink-0" />
                          <input 
                            type="text"
                            placeholder="Search country..."
                            value={searchCountry}
                            onChange={(e) => setSearchCountry(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-[13px] font-mono text-white placeholder-white/40"
                            autoFocus
                          />
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                          {filteredCountries.length > 0 ? filteredCountries.map((c, i) => (
                            <div 
                              key={i}
                              className={`flex items-center justify-between p-2 rounded-[6px] cursor-pointer hover:bg-white/10 transition-colors ${selectedCountry.name === c.name ? 'bg-white/10' : ''}`}
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsCountryDropdownOpen(false);
                                setSearchCountry('');
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-[16px]">{c.flag}</span>
                                <span className="text-[13px] font-mono text-white/90">{c.name}</span>
                              </div>
                              <span className="text-[13px] font-mono text-white/50">{c.code}</span>
                            </div>
                          )) : (
                            <div className="text-[13px] font-mono text-white/50 text-center p-4">
                              No country found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-[1px] h-[24px] bg-white/20 shrink-0 mx-1"></div>
                  <input
                    type="tel"
                    placeholder="90 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-none outline-none text-[15px] font-mono text-white placeholder-white/40 min-w-0"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[15px] font-bold font-sans text-white">Email</label>
                <div className="bg-[#FFFFFF0A] border border-[#FFFFFF33] rounded-[8px] flex items-center px-5 py-4 w-full">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-none outline-none text-[15px] font-mono text-white placeholder-white/40"
                    required
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-3 w-full">
                <label className="text-[16px] font-bold font-sans text-white">Gender</label>
                <div className="flex flex-row items-center gap-10">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="hidden"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-white/40 group-hover:border-white flex items-center justify-center transition-colors">
                      {formData.gender === 'male' && <div className="w-2.5 h-2.5 bg-[#00A8FF] rounded-full"></div>}
                    </div>
                    <span className="text-[15px] font-mono text-white">Male</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="hidden"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-white/40 group-hover:border-white flex items-center justify-center transition-colors">
                      {formData.gender === 'female' && <div className="w-2.5 h-2.5 bg-[#00A8FF] rounded-full"></div>}
                    </div>
                    <span className="text-[15px] font-mono text-white">Female</span>
                  </label>
                </div>
              </div>

              {/* Medical Document Upload */}
              <div className="flex flex-col gap-2.5 w-full mt-2">
                <label className="text-[16px] font-bold font-sans text-white">Medical Document / Report</label>
                <div
                  {...getRootProps()}
                  className={`bg-[#FFFFFF05] border border-[#FFFFFF33] rounded-[8px] flex flex-col items-center justify-center p-8 gap-3 cursor-pointer transition-colors ${
                    isDragActive ? 'border-white bg-[#FFFFFF1A]' : 'hover:border-white/60 hover:bg-[#FFFFFF0A]'
                  }`}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="flex items-center justify-center gap-3 text-white">
                      <FileText size={32} className="text-white/70" />
                      <div className="text-left">
                        <p className="font-mono text-[14px] text-white truncate max-w-[200px]">{file.name}</p>
                        <p className="font-mono text-[12px] text-white/30">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="text-white/50" />
                      <div className="font-mono text-[14px] text-white/50 text-center">Click or drag file to upload</div>
                      <div className="font-mono text-[12px] text-white/30 text-center">Supported formats: PDF, DOCX, JPG (Max 10MB)</div>
                    </>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 w-full">
                <ChamferedButton
                  type="submit"
                  variant="white"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
                </ChamferedButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
