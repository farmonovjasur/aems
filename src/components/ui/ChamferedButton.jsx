import React from 'react';
import { clsx } from 'clsx';

export default function ChamferedButton({
  children,
  onClick,
  variant = 'white', // 'white' | 'blue' | 'boost'
  className = '',
  type = 'button',
  disabled = false,
  fullWidth = false,
}) {
  const baseStyles = 'btn-chamfered h-9 px-4 text-[11px] md:h-[50px] md:px-8 md:text-sm font-bold tracking-wider select-none';
  
  const variants = {
    white: 'bg-white text-black',
    blue: 'bg-[#00A8FF] text-black',
    boost: 'bg-white text-black min-w-[180px] md:min-w-[220px]',
  };

  const sweepColors = {
    white: '#00F0FF',
    blue: '#00FFFF',
    boost: '#00F0FF',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ '--sweep-color': sweepColors[variant] || sweepColors.white }}
      className={clsx(
        baseStyles,
        variants[variant] || variants.white,
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span>{children}</span>
    </button>
  );
}

