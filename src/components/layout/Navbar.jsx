import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ChamferedButton from '../ui/ChamferedButton';
import SideMenuOverlay from './SideMenuOverlay';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-aemc-border">
        <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-10">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold font-sans tracking-widest text-white hover:text-aemc-neon-blue transition-colors">
            AEM
          </Link>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <ChamferedButton variant="white" onClick={() => setIsMenuOpen(true)}>
              MENU
            </ChamferedButton>
            <ChamferedButton variant="blue" className="hidden sm:inline-flex" onClick={() => toast.info('Coming soon!')}>
              SIGN UP / IN
            </ChamferedButton>
          </div>
        </div>

      </header>

      {/* Side Menu Overlay */}
      <SideMenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
