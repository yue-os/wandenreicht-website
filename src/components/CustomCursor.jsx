import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../hooks/use-mobile';

export default function CustomCursor() {
  const dotRef  = useRef();
  const ringRef = useRef();
  const posRef  = useRef({ x: -100, y: -100 });
  const lagRef  = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    const onOver = (e) => {
      if (e.target.closest('button, a')) setHovering(true);
    };
    const onOut = (e) => {
      if (e.target.closest('button, a')) setHovering(false);
    };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    let raf;
    const loop = () => {
      const p = posRef.current;
      const l = lagRef.current;
      l.x += (p.x - l.x) * 0.1;
      l.y += (p.y - l.y) * 0.1;

      if (dotRef.current) {
        dotRef.current.style.left = `${p.x}px`;
        dotRef.current.style.top  = `${p.y}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${l.x}px`;
        ringRef.current.style.top  = `${l.y}px`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  if (isMobile) {
    return null;
  }

  const ringSize = 38;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: '#F8FAFC',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999,
          pointerEvents: 'none',
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: ringSize,
          height: ringSize,
          transform: 'translate(-50%, -50%)',
          border: `1.5px solid ${hovering ? '#6366F1' : 'rgba(248,250,252,0.45)'}`,
          borderRadius: hovering ? '3px' : '50%',
          zIndex: 99998,
          pointerEvents: 'none',
          transition: 'border-radius 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          boxShadow: hovering ? '0 0 14px rgba(99,102,241,0.5)' : 'none',
        }}
      />
    </>
  );
}