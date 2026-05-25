import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Obelisk from './Obelisk';
import { TEAM } from '../../lib/teamData';
import { useScene } from '../../lib/SceneContext';
import { useIsMobile } from '../../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

export default function TeamScene() {
  const { cameraTarget, activeScene } = useScene();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (activeScene !== 'home') return;

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.8,
      onUpdate: (self) => {
        const p = self.progress;
        const angle = p * Math.PI * 1.3;
        const xSpread = isMobile ? 1.35 : 2.4;
        const ySpread = isMobile ? 0.25 : 0.5;
        const zSpread = isMobile ? 0.9 : 1.4;
        cameraTarget.current = {
          x: Math.sin(angle) * xSpread,
          y: Math.sin(angle * 0.6) * ySpread,
          z: 7.8 - Math.cos(angle * 0.5) * zSpread,
        };
      },
    });

    return () => st.kill();
  }, [activeScene, cameraTarget, isMobile]);

  const mobilePositions = [
    [-1.65, 0.85, 0],
    [1.65, 0.85, 0],
    [-1.65, -1.45, 0],
    [1.65, -1.45, 0],
    [0, -3.6, 0],
  ];

  return (
    <>
      <ambientLight intensity={0.06} color="#94A3B8" />
      <directionalLight position={[8, 10, 4]} intensity={0.25} color="#6366F1" />
      <directionalLight position={[-8, -4, -4]} intensity={0.12} color="#00D9FF" />
      {TEAM.map((member, index) => (
        <Obelisk
          key={member.id}
          member={isMobile ? { ...member, position: mobilePositions[index] } : member}
        />
      ))}
    </>
  );
}