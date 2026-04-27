import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VerificationOutcome } from "c2pa-react-component";

export interface ReaderAsset {
  id: string;
  title: string;
  manifest: VerificationOutcome;
  markdown: string;
}

interface ReaderStore {
  assets: ReaderAsset[];
  insertAsset: (asset: ReaderAsset) => void;
  deleteAsset: (id: string) => void;
  getAssets: () => ReaderAsset[];
}

export const useReaderStore = create<ReaderStore>()(
  persist(
    (set, get) => ({
      assets: [],
      insertAsset: (asset) =>
        set((state) => ({ assets: [...state.assets, asset] })),
      deleteAsset: (id) =>
        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id),
        })),
      getAssets: () => get().assets,
    }),
    {
      name: "reader-assets",
    },
  ),
);
