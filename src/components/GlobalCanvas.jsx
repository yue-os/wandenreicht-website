import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import ShaderBackground from './scene/ShaderBackground';
import CameraRig from './scene/CameraRig';
import TeamScene from './scene/TeamScene';
import MemberScene from './scene/MemberScene';
import { useScene } from '../lib/SceneContext';

function MouseTracker() {
  const { mousePos } = useScene();
  useEffect(() => {
    const onMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mousePos]);
  return null;
}

function Scene() {
  const { activeScene, activeMemberId } = useScene();
  return (
    <>
      <CameraRig />
      <Suspense fallback={null}>
        <ShaderBackground />
        {activeScene === 'home' && <TeamScene />}
        {activeScene === 'member' && activeMemberId && <MemberScene memberId={activeMemberId} />}
      </Suspense>
    </>
  );
}

export default function GlobalCanvas() {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
      camera={{ position: [0, 0, 7], fov: 65, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
    >
      <MouseTracker />
      <Scene />
    </Canvas>
  );
}