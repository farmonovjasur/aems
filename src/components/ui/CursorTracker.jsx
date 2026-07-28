import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CursorTracker() {
  const cursorRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Hide on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      cursor.style.display = 'none';
      return;
    }

    const onMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      gsap.to(cursor, {
        x: pos.current.x,
        y: pos.current.y,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    const onMouseEnterText = () => {
      gsap.to(cursor, {
        scale: 3.5,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const onMouseLeaveText = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    // Track mouse position
    window.addEventListener('mousemove', onMouseMove);

    // Observe text elements for hover expansion
    const textSelectors = 'p, span, h1, h2, h3, h4, h5, h6, a, li, label, td, th, blockquote';
    const textElements = document.querySelectorAll(textSelectors);

    textElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterText);
      el.addEventListener('mouseleave', onMouseLeaveText);
    });

    // Use MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => {
      const newTextElements = document.querySelectorAll(textSelectors);
      newTextElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterText);
        el.removeEventListener('mouseleave', onMouseLeaveText);
        el.addEventListener('mouseenter', onMouseEnterText);
        el.addEventListener('mouseleave', onMouseLeaveText);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      textElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterText);
        el.removeEventListener('mouseleave', onMouseLeaveText);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        width: 16,
        height: 16,
        marginLeft: -8,
        marginTop: -8,
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        mixBlendMode: 'difference',
        willChange: 'transform',
      }}
    />
  );
}
