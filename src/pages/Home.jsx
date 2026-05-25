import { useEffect } from 'react';
import { useScene } from '../lib/SceneContext';
import HeroText from '../components/HeroText';

export default function Home() {
  const { setActiveScene, setActiveMemberId, cameraTarget } = useScene();

  useEffect(() => {
    setActiveScene('home');
    setActiveMemberId(null);
    cameraTarget.current = { x: 0, y: 0, z: 7 };
  }, []);

  return (
    <>
      {/* Scroll container — gives height for ScrollTrigger */}
      <div style={{ minHeight: '320vh', position: 'relative', zIndex: -1 }} />

      {/* Fixed hero overlay */}
      <div
        className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <HeroText />

        <div style={{
          marginTop: '1.8rem',
          fontSize: 10,
          color: '#4B5563',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
        }}>
          Systems Architecture · Full-Stack Development
        </div>

        {/* Scroll cue */}
        <div style={{
          position: 'absolute',
          bottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 9, color: '#374151', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            Scroll to explore
          </span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, #4B5563, transparent)' }} />
        </div>
      </div>

      {/* Bottom member hint */}
      <div
        className="fixed flex items-end justify-center gap-24 pointer-events-none"
        style={{ bottom: '4rem', left: 0, right: 0, zIndex: 10 }}
      >
        {[
        { name: 'John Mark', color: '#2E5BFF' },
        { name: 'Member 2',    color: '#00F5A0' },
        { name: 'Member 3',  color: '#FF6B6B' },
        { name: 'Member 4',  color: '#A855F7' },
        { name: 'Member 5',  color: '#F59E0B' },
      ].map((m) => (
          <div key={m.name} className="flex flex-col items-center gap-2">
            <div style={{ width: 1, height: 28, background: `linear-gradient(to bottom, transparent, ${m.color}80)` }} />
            <span style={{ fontSize: 9, color: m.color, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'monospace', opacity: 0.6 }}>
              {m.name}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}