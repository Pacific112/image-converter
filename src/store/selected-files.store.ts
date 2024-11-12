import { create } from "zustand";

type State = {
  selectedFiles: Set<string>;
  clearSelection: () => void;
  toggleFileSelection: (id: string) => void;
};

export const useSelectedFiles = create<State>((set) => ({
  selectedFiles: new Set(),
  clearSelection: () => set(() => ({ selectedFiles: new Set() })),
  toggleFileSelection: (id) => {
    set((state) => {
      const newSelectedFiles = new Set<string>(state.selectedFiles);
      if (newSelectedFiles.has(id)) {
        newSelectedFiles.delete(id);
      } else {
        newSelectedFiles.add(id);
      }

      return {
        selectedFiles: newSelectedFiles,
      };
    });
  },
}));
