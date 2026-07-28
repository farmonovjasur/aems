import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-aemc-bg border-t border-aemc-border py-16 px-6 md:px-12 text-aemc-gray font-mono">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Brand */}
        <div className="space-y-4">
          <Link to="/" className="text-3xl font-bold font-sans text-white tracking-wider block">
            AEM
          </Link>
          <p className="text-xs text-aemc-gray leading-relaxed">
            Amigos En Mundos LLC — Official portal for MBBS admissions in Uzbekistan, Cytotron Rotational Radio-Therapy, and Referral programs.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest font-sans">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-aemc-neon-blue transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-aemc-neon-blue transition-colors">About Us</Link></li>
            <li><Link to="/cytotron" className="hover:text-aemc-neon-blue transition-colors">Cytotron Therapy</Link></li>
            <li><Link to="/mbbs" className="hover:text-aemc-neon-blue transition-colors">Study MBBS</Link></li>
            <li><Link to="/referral" className="hover:text-aemc-neon-blue transition-colors">Referral Program</Link></li>
            <li><Link to="/contacts" className="hover:text-aemc-neon-blue transition-colors">Contacts</Link></li>
          </ul>
        </div>

        {/* Col 3: Contacts */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest font-sans">Direct Contacts</h4>
          <div className="space-y-1 text-xs">
            <p className="text-white">+998 93 856 48 09</p>
            <p className="text-white">+91 9112961963</p>
            <p className="text-aemc-neon-cyan mt-2">umid.nurov@gmail.com</p>
            <p className="text-aemc-gray mt-2">Bukhara, Uzbekistan</p>
          </div>
        </div>

        {/* Col 4: Socials */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest font-sans">Follow Us</h4>
          <div className="flex space-x-4 text-xs">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-aemc-neon-blue transition-colors">INSTAGRAM</a>
            <a href="https://t.me" target="_blank" rel="noreferrer" className="hover:text-aemc-neon-blue transition-colors">TELEGRAM</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-aemc-neon-blue transition-colors">YOUTUBE</a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-12 pt-6 border-t border-aemc-border flex flex-col sm:flex-row items-center justify-between text-xs text-aemc-gray space-y-4 sm:space-y-0">
        <p className="text-center">© {new Date().getFullYear()} AMIGOS EN MUNDOS LLC. ALL RIGHTS RESERVED.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
