import { create } from 'zustand';
import { MarkdownFile, db } from '@/lib/db';

interface FileStore {
  files: MarkdownFile[];
  activeFileId: string | null;
  setActiveFile: (id: string) => void;
  addFile: (file: MarkdownFile) => Promise<void>;
  loadFiles: () => Promise<void>;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  activeFileId: null,
  setActiveFile: (id) => set({ activeFileId: id }),
  addFile: async (file) => {
    await db.files.add(file);
    set((state) => ({
      files: [...state.files, file],
      activeFileId: file.id,
    }));
  },
  deleteFile: async (id: string) => {
    await db.files.delete(id);
    set((state) => {
      const newFiles = state.files.filter((f) => f.id !== id);
      const newActiveFileId = state.activeFileId === id ? (newFiles.length > 0 ? newFiles[0].id : null) : state.activeFileId;
      return { files: newFiles, activeFileId: newActiveFileId };
    });
  },
  loadFiles: async () => {
    const allFiles = await db.files.toArray();
    set({ files: allFiles });
  },
}));