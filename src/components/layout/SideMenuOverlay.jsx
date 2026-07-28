import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import ChamferedButton from '../ui/ChamferedButton';

export default function SideMenuOverlay({ isOpen, onClose }) {
  const overlayRef = useRef(null);
  const menuListRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.4,
        ease: 'power3.out',
      });
      if (menuListRef.current) {
        gsap.fromTo(
          menuListRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
        );
      }
    } else {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3,
        ease: 'power3.in',
      });
    }
  }, [isOpen]);

  const menuItems = [
    { number: '01', title: 'MAIN HOME', path: '/' },
    { number: '02', title: 'ABOUT AEM', path: '/about' },
    { number: '03', title: 'CYTOTRON', path: '/cytotron' },
    { number: '04', title: 'REFERRAL', path: '/referral' },
    { number: '05', title: 'CONTACTS', path: '/contacts' },
    { number: '06', title: 'MBBS/MD/DBBS', path: '/mbbs' },
  ];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black p-6 md:p-12 opacity-0 pointer-events-none transition-opacity"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-widest font-sans text-white">
          AEM
        </Link>
        <ChamferedButton variant="white" onClick={onClose}>
          CLOSE
        </ChamferedButton>
      </div>

      {/* Menu List */}
      <div ref={menuListRef} className="my-auto flex flex-col space-y-4 max-w-4xl mx-auto w-full">
        {menuItems.map((item) => (
          <Link
            key={item.number}
            to={item.path}
            className="group flex items-center justify-between border-b border-aemc-border py-4 transition-colors hover:border-aemc-neon-blue"
          >
            <div className="flex items-center space-x-6">
              <span className="text-xs font-mono text-aemc-gray group-hover:text-aemc-neon-blue transition-colors">
                {item.number}
              </span>
              <span className="text-2xl md:text-4xl font-bold font-sans tracking-wide text-white group-hover:text-aemc-neon-blue transition-colors">
                {item.title}
              </span>
            </div>
            <span className="text-2xl font-mono text-aemc-gray group-hover:text-white transition-transform group-hover:translate-x-1">
              +
            </span>
          </Link>
        ))}
      </div>

      {/* Footer / Socials */}
      <div className="flex flex-col md:flex-row items-center justify-between border-t border-aemc-border pt-6 text-xs text-aemc-gray space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-aemc-neon-blue transition-colors"
          >
            INSTAGRAM
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="hover:text-aemc-neon-blue transition-colors"
          >
            TELEGRAM
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-aemc-neon-blue transition-colors"
          >
            YOUTUBE
          </a>
        </div>
        <p className="font-mono text-center">© {new Date().getFullYear()} AEMC. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  );
}
