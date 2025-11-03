import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const TYPE_MAP = {
  fire: { color: "#f97316", emblem: "cone" },
  water: { color: "#3b82f6", emblem: "drop" },
  grass: { color: "#22c55e", emblem: "leaf" },
  bug: { color: "#22c55e", emblem: "box" },
  electric: { color: "#facc15", emblem: "triangle" },
  fairy: { color: "#facc15", emblem: "cone" },
  ice: { color: "#93c5fd", emblem: "crystal" },
  rock: { color: "#644444ff", emblem: "box" },
  ground: { color: "#b7791f", emblem: "cube" },
  flying: { color: "#60a5fa", emblem: "ring" },
  ghost: { color: "#6b7280", emblem: "spooky" },
  dragon: { color: "#806b7bff", emblem: "crystal" },
  default: { color: "#94a3b8", emblem: "box" },
};

function DefaultCube() {
  return (
    <mesh>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
}

function EmblemMesh({ emblem, color }) {
  switch (emblem) {
    case "cone":
      return (
        <mesh>
          <coneGeometry args={[0.8, 1.6, 32]} />
          <meshStandardMaterial color={color} metalness={0.25} roughness={0.45} />
        </mesh>
      );
    case "drop":
      return (
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.95}
            metalness={0.05}
            roughness={0.25}
          />
        </mesh>
      );
    case "leaf":
      return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.8, 1.0, 4, 1]} />
          <meshStandardMaterial side={THREE.DoubleSide} color={color} />
        </mesh>
      );
    case "triangle":
      return (
        <mesh>
          <coneGeometry args={[0.8, 1.1, 3]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    case "crystal":
      return (
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial transmission={0.6} roughness={0.05} color={color} />
        </mesh>
      );
    default:
      return (
        <mesh>
          <boxGeometry args={[1.2, 1.2, 0.6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
  }
}

function FBXModel({ path, color, onError }) {
  const ref = useRef();
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load(
      path,
      (object) => {

        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(color),
              metalness: 0.4,
              roughness: 0.5,
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });


        const box = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        box.getSize(size);

        const maxDimension = Math.max(size.x, size.y, size.z);
        const desiredSize = 3.0;
        const scaleFactor = desiredSize / maxDimension;

        object.scale.setScalar(scaleFactor);


        const center = new THREE.Vector3();
        box.getCenter(center);
        object.position.set(0, -center.y * scaleFactor, 0);

        setModel(object);
      },
      undefined,
      (err) => {
        console.warn(`No se pudo cargar modelo FBX: ${path}`, err);
        setModel(null);
        if (onError) onError();
      }
    );
  }, [path, color]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += 0.3 * delta;
  });

  return model ? <primitive ref={ref} object={model} /> : null;
}



function Emblem({ typeName }) {
  const meta = TYPE_MAP[typeName] || TYPE_MAP.default;
  const ref = useRef();
  const [fbxExists, setFbxExists] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const fbxPath = `/models/${typeName}.fbx`;


  useEffect(() => {
    setLoadFailed(false);
    fetch(fbxPath, { method: "HEAD" })
      .then((res) => setFbxExists(res.ok))
      .catch(() => setFbxExists(false));
  }, [fbxPath]);

  useFrame((_, delta) => {
    if (ref.current && (!fbxExists || loadFailed)) ref.current.rotation.y += 0.6 * delta;
  });

  let content;
  if (fbxExists && !loadFailed) {
    content = <FBXModel path={fbxPath} color={meta.color} onError={() => setLoadFailed(true)} />;
  } else if (loadFailed || !fbxExists) {
    content = <DefaultCube />;
  } else {
    content = <EmblemMesh emblem={meta.emblem} color={meta.color} />;
  }

  return (
    <group ref={ref} scale={[0.9, 0.9, 0.9]}>
      <Suspense fallback={null}>{content}</Suspense>
      <Text
        position={[0, -1.9, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {typeName ?? ""}
      </Text>
    </group>
  );
}

export default function TypeLogo3D({ types = [] }) {
  const primary = types[0]?.type?.name || "default";

  return (
    <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
      <Canvas
        style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />

        <OrbitControls
          makeDefault
          enableZoom
          enablePan
          enableRotate
          enableDamping
          dampingFactor={0.08}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
          <planeGeometry args={[6, 6]} />
          <meshStandardMaterial color="#00000000" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>

        <group position={[0, 0.15, 0]}>
          <Emblem typeName={primary} />
        </group>
      </Canvas>
    </div>
  );
}
