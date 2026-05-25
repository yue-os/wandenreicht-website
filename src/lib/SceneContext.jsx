import { createContext, useContext, useState, useRef, useCallback } from 'react';

/** @typedef {{
 *  activeScene: string,
 *  setActiveScene: import('react').Dispatch<import('react').SetStateAction<string>>,
 *  activeMemberId: string | null,
 *  setActiveMemberId: import('react').Dispatch<import('react').SetStateAction<string | null>>,
 *  mousePos: import('react').MutableRefObject<{ x: number, y: number }>,
 *  cameraTarget: import('react').MutableRefObject<{ x: number, y: number, z: number }>,
 *  navigateTo: (path: string) => void,
 * }} SceneContextValue */

const SceneContext = createContext(/** @type {SceneContextValue} */ ({
  activeScene: 'home',
  setActiveScene: () => {},
  activeMemberId: null,
  setActiveMemberId: () => {},
  mousePos: { current: { x: 0, y: 0 } },
  cameraTarget: { current: { x: 0, y: 0, z: 7 } },
  navigateTo: () => {},
}));

/** @param {{ children: import('react').ReactNode, navigate: (path: string) => void }} props */
export function SceneProvider({ children, navigate }) {
  const [activeScene, setActiveScene] = useState('home');
  const [activeMemberId, setActiveMemberId] = useState(/** @type {string | null} */ (null));
  const mousePos = useRef({ x: 0, y: 0 });
  const cameraTarget = useRef({ x: 0, y: 0, z: 7 });
  const navigateRef = useRef(navigate || (() => {}));
  navigateRef.current = navigate || (() => {});

  /** @param {string} path */
  const navigateTo = useCallback(/** @param {string} path */ (path) => {
    navigateRef.current(path);
  }, []);

  return (
    <SceneContext.Provider value={{
      activeScene, setActiveScene,
      activeMemberId, setActiveMemberId,
      mousePos,
      cameraTarget,
      navigateTo,
    }}>
      {children}
    </SceneContext.Provider>
  );
}

export const useScene = () => useContext(SceneContext);