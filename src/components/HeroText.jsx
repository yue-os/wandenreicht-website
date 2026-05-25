import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LETTERS = 'WANDENREICHT'.split('');

export default function HeroText() {
  const containerRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /** @type {NodeListOf<HTMLElement>} */
    const els = container.querySelectorAll('.wl');
    gsap.set(els, { opacity: 0 });

    els.forEach((el, i) => {
      const delay = 0.3 + i * 0.055;
      let count = 0;

      const glitchIn = () => {
        if (count >= 7) {
          el.style.opacity = '1';
          el.style.transform = '';
          el.style.color = '#F8FAFC';
          return;
        }
        el.style.opacity = count % 2 === 0 ? '1' : String(0.05 + Math.random() * 0.3);
        el.style.transform = `translateX(${(Math.random() - 0.5) * 6}px) skewX(${(Math.random() - 0.5) * 8}deg)`;
        el.style.color = count % 3 === 0 ? '#6366F1' : '#F8FAFC';
        count++;
        setTimeout(glitchIn, 40);
      };

      setTimeout(() => {
        el.style.opacity = '0.01';
        glitchIn();
      }, delay * 1000);
    });
  }, []);

  return (
    <div ref={containerRef} className="flex items-center justify-center select-none flex-wrap">
      {LETTERS.map((letter, i) => (
        <span
          key={i}
          className="wl inline-block"
          style={{
            fontSize: 'clamp(2.8rem, 9vw, 11rem)',
            fontWeight: 900,
            color: '#F8FAFC',
            letterSpacing: '-0.025em',
            fontFamily: '"Arial Black", "Impact", "Helvetica Neue", sans-serif',
            lineHeight: 0.95,
            textShadow: '0 0 60px rgba(99,102,241,0.35), 0 0 120px rgba(46,91,255,0.15)',
            opacity: 0,
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}