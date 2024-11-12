import { create } from "zustand";
import { Completed } from "@/components/list/types";

type State = {
  selectedFiles: Completed[];
  clearSelection: () => void;
  toggleFileSelection: (image: Completed) => void;
};

export const useSelectedFiles = create<State>((set) => ({
  selectedFiles: [],
  clearSelection: () => set(() => ({ selectedFiles: [] })),
  toggleFileSelection: (image) => {
    set((state) => {
      const newSelectedFiles = [...state.selectedFiles];
      const index = newSelectedFiles.findIndex((v) => v.id === image.id);
      if (index >= 0) {
        newSelectedFiles.splice(index, 1);
      } else {
        newSelectedFiles.push(image);
      }

      return {
        selectedFiles: newSelectedFiles,
      };
    });
  },
}));
