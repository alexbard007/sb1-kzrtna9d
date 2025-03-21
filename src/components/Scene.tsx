import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Avatar } from './Avatar';

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 3], fov: 50 }}
      style={{ height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {/* Using a simple box as fallback while we wait for a proper avatar model */}
      <Avatar url="https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/wooden-mannequin/model.gltf" />
      <Environment preset="city" />
      <OrbitControls
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        enableZoom={false}
      />
    </Canvas>
  );
}