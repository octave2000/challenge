// import { create } from "zustand";
// import { v4 as uuidv4 } from "uuid";

// interface TubeData {
//   id: string;
//   position: [number, number, number];
//   rotation: [number, number, number];
//   dimensions: [number, number, number];
//   type: "square" | "rectangular";
// }

// interface AppState {
//   tubes: TubeData[];
//   selectedId: string | null;
//   isWireframe: boolean;
//   addTube: (type: "square" | "rectangular") => void;
//   updateTube: (id: string, data: Partial<TubeData>) => void;
//   selectTube: (id: string | null) => void;
//   toggleWireframe: () => void;
// }

// export const useStore = create<AppState>((set) => ({
//   tubes: [],
//   selectedId: null,
//   isWireframe: false,
//   addTube: (type) =>
//     set((state) => ({
//       tubes: [
//         ...state.tubes,
//         {
//           id: uuidv4(),
//           position: [0, 0.5, 0],
//           rotation: [0, 0, 0],
//           dimensions: type === "square" ? [1, 1, 3] : [1, 2, 3],
//           type,
//         },
//       ],
//       selectedId: null,
//     })),
//   updateTube: (id, data) =>
//     set((state) => ({
//       tubes: state.tubes.map((t) => (t.id === id ? { ...t, ...data } : t)),
//     })),
//   selectTube: (id) => set({ selectedId: id }),
//   toggleWireframe: () => set((state) => ({ isWireframe: !state.isWireframe })),
// }));

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface TubeData {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: [number, number, number];
  type: "square" | "rectangular";
}

interface AppState {
  tubes: TubeData[];
  selectedId: string | null;
  isWireframe: boolean;
  addTube: (type: "square" | "rectangular") => void;
  updateTube: (id: string, data: Partial<TubeData>) => void;
  selectTube: (id: string | null) => void;
  toggleWireframe: () => void;
  rotateSelectedTube: (yRotation: number) => void;
}

export const useStore = create<AppState>((set) => ({
  tubes: [],
  selectedId: null,
  isWireframe: false,
  addTube: (type) =>
    set((state) => ({
      tubes: [
        ...state.tubes,
        {
          id: uuidv4(),
          position: [0, 0.5, 0],
          rotation: [0, 0, 0],
          dimensions: type === "square" ? [1, 1, 3] : [1, 2, 3],
          type,
        },
      ],
      selectedId: null,
    })),
  updateTube: (id, data) =>
    set((state) => ({
      tubes: state.tubes.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  selectTube: (id) => set({ selectedId: id }),
  toggleWireframe: () => set((state) => ({ isWireframe: !state.isWireframe })),
  // New function to rotate the currently selected tube
  rotateSelectedTube: (yRotation) =>
    set((state) => {
      if (!state.selectedId) return state;

      const newTubes = state.tubes.map((t) => {
        if (t.id === state.selectedId) {
          // Only update the Y-rotation component
          return {
            ...t,
            rotation: [t.rotation[0], yRotation, t.rotation[2]] as [
              number,
              number,
              number,
            ],
          };
        }
        return t;
      });

      return { tubes: newTubes };
    }),
}));
