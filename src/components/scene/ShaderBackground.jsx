import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScene } from '../../lib/SceneContext';
import { getMemberById } from '../../lib/teamData';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy * 2.0, 1.0, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
      f += w * noise(p);
      p *= 2.1;
      w *= 0.5;
    }
    return f;
  }

  void main() {
    vec2 uv = vUv;
    vec2 m = uMouse * 0.12;
    float n  = fbm(uv * 1.8 + m + vec2(uTime * 0.035, uTime * 0.02));
    float n2 = fbm(uv * 3.5 - m * 0.6 + vec2(-uTime * 0.022, uTime * 0.028));
    float c  = n * 0.6 + n2 * 0.4;

    vec3 base   = vec3(0.023, 0.023, 0.031);
    vec3 accent = mix(uColorA, uColorB, clamp(uv.x + sin(uTime * 0.06) * 0.2, 0.0, 1.0));
    float glow  = smoothstep(0.35, 0.78, c) * 0.18;

    vec2  vd  = uv * 2.0 - 1.0;
    float vig = clamp(1.0 - dot(vd * 0.38, vd * 0.38), 0.0, 1.0);

    vec3 col = (base + accent * glow) * (vig * 1.4 + 0.15);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function ShaderBackground() {
  const matRef = useRef();
  const { mousePos, activeMemberId } = useScene();

  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uMouse:  { value: new THREE.Vector2(0, 0) },
    uColorA: { value: new THREE.Color('#2E5BFF') },
    uColorB: { value: new THREE.Color('#00F5A0') },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uMouse.value.lerp({ x: mousePos.current.x, y: mousePos.current.y }, 0.05);
    const member = activeMemberId ? getMemberById(activeMemberId) : null;
    u.uColorA.value.lerp(new THREE.Color(member ? member.colorA : '#2E5BFF'), 0.022);
    u.uColorB.value.lerp(new THREE.Color(member ? member.colorB : '#00F5A0'), 0.022);
  });

  return (
    <mesh renderOrder={-100} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}