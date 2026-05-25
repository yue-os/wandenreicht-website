import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useScene } from '../lib/SceneContext';

export default function GlobalNav() {
  const location = useLocation();
  const { cameraTarget } = useScene();
  const [coords, setCoords] = useState('X:0.00 Y:0.00 Z:7.00');
  const rafRef = useRef();

  useEffect(() => {
    const tick = () => {
      const { x, y, z } = cameraTarget.current;
      setCoords(`X:${x.toFixed(2)} Y:${y.toFixed(2)} Z:${z.toFixed(2)}`);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cameraTarget]);

  const isHome = location.pathname === '/';

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pointer-events-none"
      style={{
        padding: '14px 24px',
        borderBottom: '1px solid rgba(148,163,184,0.1)',
        backdropFilter: 'blur(2px)',
      }}
    >
      {/* W Logo */}
      <Link to="/" className="pointer-events-auto" style={{ textDecoration: 'none' }}>
        <span style={{
          fontSize: 22,
          fontWeight: 900,
          color: '#F8FAFC',
          fontFamily: '"Arial Black", sans-serif',
          letterSpacing: '-0.02em',
          textShadow: '0 0 20px rgba(99,102,241,0.6)',
        }}>
          W
        </span>
      </Link>

      {/* HUD center */}
      <div style={{ fontSize: 9, color: '#4B5563', letterSpacing: '0.22em', fontFamily: 'monospace', textTransform: 'uppercase' }}>
        WANDENREICHT · {isHome ? 'ROSTER CHAMBER' : 'DEEP DIVE'}
      </div>

      {/* Coordinates */}
      <div style={{ fontSize: 9, color: '#374151', letterSpacing: '0.15em', fontFamily: 'monospace' }}>
        {coords}
      </div>
    </div>
  );
}