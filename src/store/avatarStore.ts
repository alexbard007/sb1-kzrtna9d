import { create } from 'zustand';

interface AvatarState {
  speaking: boolean;
  lipSync: {
    mouthOpen: number;
  } | null;
  setSpeaking: (speaking: boolean) => void;
  setLipSync: (lipSync: { mouthOpen: number } | null) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  speaking: false,
  lipSync: null,
  setSpeaking: (speaking) => set({ speaking }),
  setLipSync: (lipSync) => set({ lipSync }),
}));