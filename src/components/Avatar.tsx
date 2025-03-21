import React, { useEffect, useRef, Suspense } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAvatarStore } from '../store/avatarStore';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Model Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      );
    }

    return this.props.children;
  }
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="blue" wireframe />
    </mesh>
  );
}

function AvatarModel({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);
  const { speaking, lipSync } = useAvatarStore();

  useEffect(() => {
    // Cleanup function
    return () => {
      if (actions) {
        Object.values(actions).forEach(action => action?.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (actions?.Talk) {
      if (speaking) {
        actions.Talk.play();
      } else {
        actions.Talk.stop();
      }
    }
  }, [speaking, actions]);

  useFrame(() => {
    if (!group.current || !lipSync || !scene) return;

    const head = scene.getObjectByName('Wolf3D_Head');
    if (head && head.morphTargetDictionary && head.morphTargetInfluences) {
      const mouthOpenIndex = head.morphTargetDictionary['mouthOpen'];
      if (typeof mouthOpenIndex === 'number') {
        head.morphTargetInfluences[mouthOpenIndex] = lipSync.mouthOpen;
      }
    }
  });

  return <primitive ref={group} object={scene} dispose={null} />;
}

export function Avatar({ url }: { url: string }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ModelErrorBoundary>
        <AvatarModel url={url} />
      </ModelErrorBoundary>
    </Suspense>
  );
}