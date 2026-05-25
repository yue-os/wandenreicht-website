import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScene } from '../../lib/SceneContext';

export default function CameraRig() {
  const { camera } = useThree();
  const { cameraTarget } = useScene();

  useFrame((_, delta) => {
    const speed = Math.min(delta * 2.8, 0.12);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraTarget.current.x, speed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraTarget.current.y, speed);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraTarget.current.z, speed);
    camera.lookAt(0, 0, 0);
  });

  return null;
}