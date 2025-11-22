import React, { useEffect, useRef, createRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Tube from './Tube';
import Controls from './components/Controls';
import { useStore } from './store';

function App() {
  const {
    tubes,
    wireframe,
    selectedTubeId,
    transformMode,
    addTube,
    removeTube,
    updateTube,
    setWireframe,
    setTransformMode,
    createJoint,
    undo,
    redo,
    jointPreview,
    checkForJointPreview,
    setTubeRefs,
  } = useStore();

  const selectedTube = tubes.find(t => t.id === selectedTubeId);
  
  useEffect(() => {
    const refs = tubes.map(() => createRef<any>());
    setTubeRefs(refs);
  }, [tubes, setTubeRefs]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'z' && e.ctrlKey) {
        undo();
      } else if (e.key === 'y' && e.ctrlKey) {
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {selectedTube && (
        <Controls
          tubeType={selectedTube.tubeType}
          setTubeType={(tubeType) => updateTube({ ...selectedTube, tubeType })}
          width={selectedTube.width}
          setWidth={(width) => updateTube({ ...selectedTube, width })}
          height={selectedTube.height}
          setHeight={(height) => updateTube({ ...selectedTube, height })}
          length={selectedTube.length}
          setLength={(length) => updateTube({ ...selectedTube, length })}
          thickness={selectedTube.thickness}
          setThickness={(thickness) => updateTube({ ...selectedTube, thickness })}
          wireframe={wireframe}
          setWireframe={setWireframe}
        />
      )}
      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={() => setTransformMode('translate')}>Translate</button>
        <button onClick={() => setTransformMode('rotate')}>Rotate</button>
        <button onClick={() => setTransformMode('scale')}>Scale</button>
        <button onClick={addTube}>Add Tube</button>
        <button onClick={removeTube} disabled={!selectedTube}>Remove Tube</button>
        <button onClick={createJoint} disabled={!selectedTube}>Create Joint</button>
      </div>
      <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls onChange={checkForJointPreview} />
        {tubes.map((tube, i) => (
          <Tube
            key={tube.id}
            ref={useStore.getState().tubeRefs[i]}
            id={tube.id}
          />
        ))}
        {jointPreview && <primitive object={jointPreview} />}
      </Canvas>
    </div>
  );
}

export default App;