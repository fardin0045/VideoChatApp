import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('nextMeet-theme') || 'dark',
  setTheme: (theme) => {
    localStorage.setItem('nextMeet-theme', theme);
    set({ theme });
  },
}));
