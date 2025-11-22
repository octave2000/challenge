import React, { useMemo, useRef, forwardRef } from 'react';
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { useStore } from './store';

interface TubeProps {
  id: number;
}

const Tube = forwardRef<THREE.Mesh, TubeProps>(({ id }, ref) => {
  const { tubes, wireframe, selectedTubeId, transformMode, setSelectedTubeId, checkForJointPreview, tubeRefs } = useStore();
  const tube = tubes.find(t => t.id === id);

  if (!tube) return null;

  const { csg } = tube;
  const isSelected = selectedTubeId === id;

  const mesh = useMemo(() => {
    if (!csg) return null;

    const newMesh = CSG.toMesh(csg, new THREE.Matrix4());
    newMesh.material = new THREE.MeshStandardMaterial({
      color: isSelected ? 'hotpink' : 'royalblue',
      wireframe: wireframe,
    });

    return newMesh;
  }, [csg, wireframe, isSelected]);

  if (!mesh) return null;

  const tubeRef = tubeRefs[tubes.findIndex(t => t.id === id)];

  return (
    <TransformControls 
        enabled={isSelected} 
        object={tubeRef.current}
        showX={isSelected}
        showY={isSelected}
        showZ={isSelected}
        mode={transformMode}
        rotationSnap={transformMode === 'rotate' ? Math.PI / 4 : null}
        onChange={checkForJointPreview}
    >
      <primitive object={mesh} ref={ref} onClick={(e) => {
        e.stopPropagation();
        setSelectedTubeId(id);
      }} />
    </TransformControls>
  );
});

export default Tube;