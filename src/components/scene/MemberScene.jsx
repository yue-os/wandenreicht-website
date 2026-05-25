import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScene } from '../../lib/SceneContext';
import { getMemberById } from '../../lib/teamData';

const PARTICLE_COUNT = 220;

function Particles({ member }) {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 3 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.04;
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.025) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={PARTICLE_COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={member.colorA} size={0.035} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function MemberScene({ memberId }) {
  const { cameraTarget } = useScene();
  const member = getMemberById(memberId);

  useEffect(() => {
    if (!member) return;
    cameraTarget.current = {
      x: member.position[0] * 0.3,
      y: 0,
      z: 3.8,
    };
  }, [member, cameraTarget]);

  if (!member) return null;

  return (
    <>
      <ambientLight intensity={0.07} color={member.colorA} />
      <pointLight
        position={[member.position[0] * 0.5, 2.5, 2]}
        color={member.colorA}
        intensity={4}
        distance={10}
        decay={2}
      />
      <pointLight
        position={[0, -2, 1]}
        color={member.colorB}
        intensity={2}
        distance={7}
        decay={2}
      />
      <Particles member={member} />
    </>
  );
}