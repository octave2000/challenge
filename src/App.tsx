import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import { useStore } from "./store/useStore";
import { Tube } from "./components/Tube";

function App() {
  const {
    tubes,
    addTube,
    toggleWireframe,
    isWireframe,
    selectTube,
    selectedId,
    rotateSelectedTube, // New import
  } = useStore();

  const isTubeSelected = selectedId !== null;

  // Rotation in radians for Y-axis (North=0, East=90 deg, South=180 deg, West=270 deg)
  const ROTATION_MAP = {
    N: 0,
    E: Math.PI / 2,
    S: Math.PI,
    W: (3 * Math.PI) / 2,
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      <div
        style={{
          width: "250px",
          background: "#222",
          color: "white",
          padding: "20px",
        }}
      >
        <h3>Tube Joint App</h3>
        <button onClick={() => addTube("square")}>Add Square Tube</button>
        <br />
        <br />
        <button onClick={() => addTube("rectangular")}>Add Rect Tube</button>
        <br />
        <br />
        <h4>Rotate Selected Tube</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => rotateSelectedTube(ROTATION_MAP.N)}
            disabled={!isTubeSelected}
          >
            North (0°)
          </button>
          <button
            onClick={() => rotateSelectedTube(ROTATION_MAP.E)}
            disabled={!isTubeSelected}
          >
            East (90°)
          </button>
          <button
            onClick={() => rotateSelectedTube(ROTATION_MAP.S)}
            disabled={!isTubeSelected}
          >
            South (180°)
          </button>
          <button
            onClick={() => rotateSelectedTube(ROTATION_MAP.W)}
            disabled={!isTubeSelected}
          >
            West (270°)
          </button>
        </div>

        <label>
          <input
            type="checkbox"
            checked={isWireframe}
            onChange={toggleWireframe}
          />
          Wireframe Mode
        </label>
        <div style={{ marginTop: "20px", fontSize: "0.8em", color: "#aaa" }}>
          <p>Click tube to select.</p>
          <p>Use gizmo to move.</p>
          <p>Snaps to 0.5 units.</p>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          onPointerMissed={() => selectTube(null)}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Environment preset="city" />

          <group>
            {tubes.map((tube) => (
              <Tube key={tube.id} data={tube} />
            ))}
          </group>

          <Grid
            infiniteGrid
            fadeDistance={30}
            sectionColor="#444"
            cellColor="#222"
          />
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
