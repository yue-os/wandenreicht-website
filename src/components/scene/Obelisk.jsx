import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useScene } from '../../lib/SceneContext';

export default function Obelisk({ member }) {
  const meshRef  = useRef();
  const lightRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { navigateTo, setActiveMemberId, setActiveScene, cameraTarget } = useScene();
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const s = hovered ? 1.1 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), delta * 6);
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity, hovered ? 5.0 : 1.5, delta * 6
      );
    }
  });

  const handleClick = () => {
    cameraTarget.current = { x: member.position[0] * 0.4, y: 0, z: 3.0 };
    setActiveMemberId(member.id);
    setActiveScene('member');
    setTimeout(() => navigateTo(`/member/${member.id}`), 700);
  };

  return (
    <Float speed={isMobile ? 0.9 : 1.4} rotationIntensity={isMobile ? 0.08 : 0.18} floatIntensity={isMobile ? 0.28 : 0.55}>
      <group position={member.position}>
        <pointLight ref={lightRef} color={member.colorA} intensity={1.5} distance={6} decay={2} />

        {/* Main pillar */}
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[0.44, 3.2, 0.44]} />
          <meshPhysicalMaterial
            color={member.colorA}
            emissive={member.colorA}
            emissiveIntensity={hovered ? 0.4 : 0.1}
            metalness={0.05}
            roughness={0.06}
            transmission={0.72}
            thickness={1.4}
            ior={1.55}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Base */}
        <mesh position={[0, -1.75, 0]}>
          <boxGeometry args={[0.85, 0.07, 0.85]} />
          <meshStandardMaterial
            color={member.colorA}
            emissive={member.colorA}
            emissiveIntensity={0.6}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>

        {/* Apex */}
        <mesh position={[0, 1.72, 0]}>
          <coneGeometry args={[0.24, 0.52, 4]} />
          <meshStandardMaterial
            color={member.colorB}
            emissive={member.colorB}
            emissiveIntensity={hovered ? 1.0 : 0.35}
            metalness={0.9}
            roughness={0.08}
          />
        </mesh>

        {/* Hover label */}
        {hovered && (
          <Html position={[0.65, 0, 0]} center={false} style={{ pointerEvents: 'none' }}>
            <div style={{
              borderLeft: `1px solid ${member.colorA}`,
              paddingLeft: 12,
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}>
              <div style={{ color: '#F8FAFC', fontSize: 13, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                {member.name}
              </div>
              <div style={{ color: member.colorA, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 3, fontFamily: 'monospace' }}>
                {member.role}
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}