import { create } from 'zustand';
import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

interface TubeState {
  id: number;
  width: number;
  height: number;
  length: number;
  thickness: number;
  tubeType: 'rectangular' | 'square';
  csg: CSG | null;
}

interface AppState {
  tubes: TubeState[];
  selectedTubeId: number | null;
  wireframe: boolean;
  transformMode: 'translate' | 'rotate' | 'scale';
  jointPreview: THREE.Mesh | null;
  tubeRefs: React.RefObject<THREE.Mesh>[];

  addTube: () => void;
  removeTube: () => void;
  setSelectedTubeId: (id: number | null) => void;
  updateTube: (tube: TubeState) => void;
  setWireframe: (wireframe: boolean) => void;
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  createJoint: () => void;
  checkForJointPreview: () => void;
  setTubeRefs: (refs: React.RefObject<THREE.Mesh>[]) => void;
}

let tubeId = 0;

const createInitialTube = (id: number): TubeState => {
    const outerBox = new THREE.BoxGeometry(1, 1, 3);
    const innerBox = new THREE.BoxGeometry(1 - 0.1 * 2, 1 - 0.1 * 2, 3);

    const outerMesh = new THREE.Mesh(outerBox);
    const innerMesh = new THREE.Mesh(innerBox);

    const csg = CSG.fromMesh(outerMesh);
    const innerCsg = CSG.fromMesh(innerMesh);

    const result = csg.subtract(innerCsg);

    return { id, width: 1, height: 1, length: 3, thickness: 0.1, tubeType: 'rectangular', csg: result };
}

type StoreWithUndo = AppState & {
    undo: () => void;
    redo: () => void;
    history: { past: AppState[], future: AppState[] };
};

const useStore = create<StoreWithUndo>()(
    (set, get) => {
        const initialState: AppState = {
            tubes: [createInitialTube(tubeId++)],
            selectedTubeId: 0,
            wireframe: false,
            transformMode: 'translate',
            jointPreview: null,
            tubeRefs: [],

            addTube: () => set((state) => ({ ...state, tubes: [...state.tubes, createInitialTube(tubeId++)] })),
            removeTube: () => set((state) => ({
                ...state,
                tubes: state.tubes.filter(tube => tube.id !== state.selectedTubeId),
                selectedTubeId: null,
            })),
            setSelectedTubeId: (id) => set({ ...get(), selectedTubeId: id }),
            updateTube: (tube) => set((state) => {
                const { width, height, length, thickness } = tube;
                const outerBox = new THREE.BoxGeometry(width, height, length);
                const innerBox = new THREE.BoxGeometry(width - thickness * 2, height - thickness * 2, length);
                const outerMesh = new THREE.Mesh(outerBox);
                const innerMesh = new THREE.Mesh(innerBox);
                const csg = CSG.fromMesh(outerMesh).subtract(CSG.fromMesh(innerMesh));
                const newTube = { ...tube, csg };

                return {
                    ...state,
                    tubes: state.tubes.map(t => t.id === newTube.id ? newTube : t)
                }
            }),
            setWireframe: (wireframe) => set({ ...get(), wireframe }),
            setTransformMode: (mode) => set({ ...get(), transformMode: mode }),
            setTubeRefs: (refs) => set({ ...get(), tubeRefs: refs }),
            createJoint: () => {
                const { tubes, selectedTubeId, tubeRefs } = get();
                if (selectedTubeId === null) return;

                const selectedTubeIndex = tubes.findIndex((tube) => tube.id === selectedTubeId);
                const selectedTubeMesh = tubeRefs[selectedTubeIndex].current;
                const selectedTube = tubes[selectedTubeIndex];

                if (!selectedTubeMesh || !selectedTube.csg) return;

                let selectedCsg = selectedTube.csg.clone().applyMatrix(selectedTubeMesh.matrixWorld);

                tubeRefs.forEach((ref, index) => {
                if (index !== selectedTubeIndex && ref.current) {
                    const otherTube = tubes[index];
                    if (otherTube.csg) {
                        const otherCsg = otherTube.csg.clone().applyMatrix(ref.current.matrixWorld);
                        selectedCsg = selectedCsg.subtract(otherCsg);
                    }
                }
                });
                
                const invertedMatrix = selectedTubeMesh.matrixWorld.clone().invert();
                selectedCsg = selectedCsg.applyMatrix(invertedMatrix);

                set((state) => ({
                    ...state,
                    tubes: state.tubes.map(t => t.id === selectedTubeId ? { ...t, csg: selectedCsg } : t)
                }));
            },
            checkForJointPreview: () => {
                const { tubes, selectedTubeId, tubeRefs } = get();
                if (selectedTubeId === null) {
                    set({ ...get(), jointPreview: null });
                    return;
                };

                const selectedTubeIndex = tubes.findIndex((tube) => tube.id === selectedTubeId);
                const selectedTubeMesh = tubeRefs[selectedTubeIndex].current;
                const selectedTube = tubes[selectedTubeIndex];

                if (!selectedTubeMesh || !selectedTube.csg) {
                    set({ ...get(), jointPreview: null });
                    return;
                }

                let intersectionPreview: THREE.Mesh | null = null;

                for (let i = 0; i < tubes.length; i++) {
                    if (i === selectedTubeIndex) continue;

                    const otherTubeMesh = tubeRefs[i].current;
                    const otherTube = tubes[i];

                    if (otherTubeMesh && otherTube.csg) {
                        const selectedAABB = new THREE.Box3().setFromObject(selectedTubeMesh);
                        const otherAABB = new THREE.Box3().setFromObject(otherTubeMesh);

                        if (selectedAABB.intersectsBox(otherAABB)) {
                            const selectedCsg = selectedTube.csg.clone().applyMatrix(selectedTubeMesh.matrixWorld);
                            const otherCsg = otherTube.csg.clone().applyMatrix(otherTubeMesh.matrixWorld);

                            const intersectionCsg = selectedCsg.intersect(otherCsg);
                            const intersectionMesh = CSG.toMesh(intersectionCsg, new THREE.Matrix4());
                            intersectionMesh.material = new THREE.MeshStandardMaterial({ color: 'red', wireframe: true });
                            intersectionPreview = intersectionMesh;
                            break;
                        }
                    }
                }
                set({ ...get(), jointPreview: intersectionPreview });
            }
        };

        return {
            ...initialState,
            history: { past: [], future: [] },
            undo: () => {
                const { history } = get();
                if (history.past.length === 0) return;
                const previousState = history.past[history.past.length - 1];
                set({ ...previousState, history: { past: history.past.slice(0, -1), future: [get(), ...history.future] } });
            },
            redo: () => {
                const { history } = get();
                if (history.future.length === 0) return;
                const nextState = history.future[0];
                set({ ...nextState, history: { past: [...history.past, get()], future: history.future.slice(1) } });
            },
        }
    }
);

export { useStore };