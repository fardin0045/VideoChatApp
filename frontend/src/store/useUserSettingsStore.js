import { create } from 'zustand';

const STORAGE_KEY = 'nextMeet-user-settings';

const readStoredSettings = () => {
  if (typeof window === 'undefined') {
    return {
      notificationsEnabled: true,
      showOnlineStatus: true,
      compactMode: false,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          notificationsEnabled: true,
          showOnlineStatus: true,
          compactMode: false,
        };
  } catch {
    return {
      notificationsEnabled: true,
      showOnlineStatus: true,
      compactMode: false,
    };
  }
};

const persistSettings = (settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const useUserSettingsStore = create((set, get) => ({
  ...readStoredSettings(),
  updateSetting: (key, value) => {
    const nextSettings = { ...get(), [key]: value };
    persistSettings({
      notificationsEnabled: nextSettings.notificationsEnabled,
      showOnlineStatus: nextSettings.showOnlineStatus,
      compactMode: nextSettings.compactMode,
    });
    set(nextSettings);
  },
  resetSettings: () => {
    const defaultSettings = {
      notificationsEnabled: true,
      showOnlineStatus: true,
      compactMode: false,
    };
    persistSettings(defaultSettings);
    set(defaultSettings);
  },
}));