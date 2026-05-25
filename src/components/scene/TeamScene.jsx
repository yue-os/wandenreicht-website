import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Obelisk from './Obelisk';
import { TEAM } from '../../lib/teamData';
import { useScene } from '../../lib/SceneContext';

gsap.registerPlugin(ScrollTrigger);

export default function TeamScene() {
  const { cameraTarget, activeScene } = useScene();

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
        cameraTarget.current = {
          x: Math.sin(angle) * 2.4,
          y: Math.sin(angle * 0.6) * 0.5,
          z: 7.8 - Math.cos(angle * 0.5) * 1.4,
        };
      },
    });

    return () => st.kill();
  }, [activeScene, cameraTarget]);

  return (
    <>
      <ambientLight intensity={0.06} color="#94A3B8" />
      <directionalLight position={[8, 10, 4]} intensity={0.25} color="#6366F1" />
      <directionalLight position={[-8, -4, -4]} intensity={0.12} color="#00D9FF" />
      {TEAM.map((member) => (
        <Obelisk key={member.id} member={member} />
      ))}
    </>
  );
}