import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CursorTracker from './components/ui/CursorTracker';

import Home from './pages/Home';
import About from './pages/About';
import Cytotron from './pages/Cytotron';
import MBBS from './pages/MBBS';
import Referral from './pages/Referral';
import Contacts from './pages/Contacts';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <CursorTracker />
      <Toaster position="top-right" theme="dark" richColors />
      <div className="flex flex-col min-h-screen bg-black text-white cursor-none">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/cytotron" element={<Cytotron />} />
            <Route path="/mbbs" element={<MBBS />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
