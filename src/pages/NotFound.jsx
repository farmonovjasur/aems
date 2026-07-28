import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChamferedButton from '../components/ui/ChamferedButton';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 space-y-6">
      <h1 className="text-8xl font-extrabold font-sans text-aemc-neon-blue tracking-widest">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold font-sans text-white">Page Not Found</h2>
      <p className="text-xs md:text-sm font-mono text-aemc-gray max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <div>
        <ChamferedButton variant="white" onClick={() => navigate('/')}>
          RETURN TO HOME
        </ChamferedButton>
      </div>
    </div>
  );
}
