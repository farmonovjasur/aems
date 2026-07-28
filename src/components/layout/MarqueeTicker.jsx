import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MarqueeTicker({
  text = 'BASED IN TASHKENT, UZ • FIND US @AEMCGROUP • STUDYING IN INDIA • AEMC EXTERNAL BRANCH • EST. 2024 •',
  speed = 30,
  className = '',
}) {
  const marqueeRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!contentRef.current) return;
      const width = contentRef.current.offsetWidth;
      gsap.to(contentRef.current, {
        x: -width / 2,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, [speed]);

  const items = Array(6).fill(text).join(' ');

  return (
    <div
      ref={marqueeRef}
      className={`overflow-hidden whitespace-nowrap bg-black border-y border-aemc-border py-2 text-xs font-mono text-aemc-gray select-none ${className}`}
    >
      <div ref={contentRef} className="inline-block">
        <span className="inline-block px-4 tracking-widest">{items}</span>
        <span className="inline-block px-4 tracking-widest">{items}</span>
      </div>
    </div>
  );
}
