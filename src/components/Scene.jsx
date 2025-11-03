import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Scene = ({ children }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.7} />
 
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
    
      <OrbitControls enableZoom={true} />
      
      
      {children}
    </Canvas>
  );
};

export default Scene;
