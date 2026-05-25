import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import { useScene } from '../lib/SceneContext';
import { getMemberById } from '../lib/teamData';

export default function MemberProfile() {
  const { id }   = useParams();
  const member   = getMemberById(id);
  const contentRef = useRef(null);
  const { setActiveScene, setActiveMemberId, cameraTarget, navigateTo } = useScene();

  useEffect(() => {
    if (!member) return;
    setActiveMemberId(id ?? null);
    setActiveScene('member');

    // Fade in content
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.5 }
      );
    }
  }, [id]);

  const handleBack = () => {
    if (contentRef.current) {
      gsap.to(contentRef.current, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.in' });
    }
    cameraTarget.current = { x: 0, y: 0, z: 7 };
    setTimeout(() => {
      setActiveMemberId(null);
      setActiveScene('home');
      navigateTo('/');
    }, 500);
  };

  const handlePortfolio = () => {
    if (!member || !member.website) return;

    if (contentRef.current) {
      gsap.to(contentRef.current, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.in' });
    }

    setTimeout(() => {
      window.location.href = member.website;
    }, 450);
  };

  if (!member) return (
    <div className="fixed inset-0 flex items-center justify-center px-6 text-center" style={{ zIndex: 10 }}>
      <span style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.2em' }}>
        MEMBER NOT FOUND
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {/* Back button */}
      <button
        onClick={handleBack}
        className="pointer-events-auto absolute"
        style={{
          top: 'clamp(16px, 5vw, 60px)', left: 'clamp(16px, 3vw, 24px)',
          background: 'none',
          border: '1px solid rgba(148,163,184,0.25)',
          color: '#6B7280',
          fontSize: 'clamp(8px, 1.2vw, 9px)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
          padding: '10px 18px',
          transition: 'border-color 0.3s, color 0.3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = member.colorA; e.currentTarget.style.color = member.colorA; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.25)'; e.currentTarget.style.color = '#6B7280'; }}
      >
        ← Back to Wandenreich
      </button>

      {/* Main content */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col md:flex-row items-start md:items-center overflow-y-auto md:overflow-hidden"
        style={{ padding: 'clamp(72px, 12vh, 120px) clamp(20px, 7vw, 7vw) clamp(32px, 6vh, 64px)', opacity: 0 }}
      >
        {/* Left watermark */}
        <div className="flex-1 hidden md:flex items-center justify-center" style={{ overflow: 'hidden', paddingRight: '4vw' }}>
          <div style={{
            fontWeight: 900,
            color: member.colorA,
            opacity: 0.06,
            fontFamily: '"Arial Black", sans-serif',
            letterSpacing: '-0.03em',
            lineHeight: 0.88,
            userSelect: 'none',
            textTransform: 'uppercase',
            fontSize: 'clamp(3rem, 7vw, 8.5rem)',
          }}>
            {member.name.split(' ').map((w, i) => <div key={i}>{w}</div>)}
          </div>
        </div>

        {/* Right HUD */}
        <div className="w-full flex-1 flex flex-col" style={{ gap: 20, maxWidth: 500 }}>
          {/* Role */}
          <div style={{ fontSize: 'clamp(8px, 1.2vw, 9px)', color: member.colorA, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            // {member.role}
          </div>

          {/* Name */}
          <div style={{
            fontWeight: 900,
            color: '#F8FAFC',
            fontFamily: '"Arial Black", sans-serif',
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            fontSize: 'clamp(2rem, 4.5vw, 4.5rem)',
          }}>
            {member.name}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: `linear-gradient(to right, ${member.colorA}, transparent)` }} />

          {/* Bio */}
          <p style={{ color: '#9CA3AF', fontSize: 'clamp(14px, 1.9vw, 15px)', lineHeight: 1.75, fontFamily: 'Inter, system-ui, sans-serif', margin: 0 }}>
            {member.bio}
          </p>

          <div className="pointer-events-auto">
            <button
              onClick={handlePortfolio}
              className="inline-flex items-center justify-center rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] transition-transform duration-200 hover:-translate-y-0.5"
              style={{
                borderColor: member.colorA,
                color: '#F8FAFC',
                background: `linear-gradient(135deg, ${member.colorA}22, ${member.colorB}18)`,
                boxShadow: `0 0 24px ${member.colorA}22`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 0 32px ${member.colorA}35`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = `0 0 24px ${member.colorA}22`;
              }}
            >
              Portfolio
            </button>
          </div>

          {/* Tech stack */}
          <div>
            <div style={{ fontSize: 'clamp(8px, 1.2vw, 9px)', color: '#4B5563', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>
              Tech Stack
            </div>
            <div className="flex flex-wrap" style={{ gap: 8 }}>
              {member.techStack.map((tech) => (
                <span
                  key={tech}
                  className="pointer-events-auto"
                  style={{
                    padding: '5px 13px',
                    border: `1px solid ${member.colorA}35`,
                    color: '#E5E7EB',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    fontFamily: 'monospace',
                    background: `${member.colorA}0C`,
                    transition: 'border-color 0.2s, box-shadow 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = member.colorA;
                    e.currentTarget.style.boxShadow = `0 0 14px ${member.colorA}35`;
                    e.currentTarget.style.color = '#F8FAFC';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = `${member.colorA}35`;
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.color = '#E5E7EB';
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}