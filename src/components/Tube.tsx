import React, { useRef } from "react";
import { Box, TransformControls } from "@react-three/drei";
import { useStore } from "../store/useStore";
import * as THREE from "three";

interface TubeProps {
  data: {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    dimensions: [number, number, number];
    type: "square" | "rectangular";
  };
}

export const Tube: React.FC<TubeProps> = ({ data }) => {
  const { selectedId, selectTube, updateTube, isWireframe } = useStore();
  const isSelected = selectedId === data.id;
  const meshRef = useRef<THREE.Mesh>(null!);

  const handleTransform = () => {
    if (!meshRef.current) return;
    const { position, rotation } = meshRef.current;
    updateTube(data.id, {
      position: [position.x, position.y, position.z],
      rotation: [rotation.x, rotation.y, rotation.z],
    });
  };

  return (
    <>
      {isSelected && (
        <TransformControls
          object={meshRef.current}
          translationSnap={0.5}
          rotationSnap={Math.PI / 4}
          onObjectChange={handleTransform}
        />
      )}
      <Box
        ref={meshRef}
        args={data.dimensions}
        position={data.position}
        rotation={data.rotation}
        onClick={(e) => {
          e.stopPropagation();
          selectTube(data.id);
        }}
      >
        <meshStandardMaterial
          color={isSelected ? "#ff9f00" : "#cccccc"}
          wireframe={isWireframe}
          transparent
          opacity={isWireframe ? 0.5 : 1}
        />
      </Box>
    </>
  );
};
