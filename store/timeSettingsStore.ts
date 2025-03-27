import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TimeSettings {
  startTime: string;
  endTime: string;
  use24Hour: boolean;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  toggleTimeFormat: () => void;
}

export const useTimeSettingsStore = create<TimeSettings>()(
  persist(
    (set) => ({
      startTime: '08:00',
      endTime: '20:00',
      use24Hour: false,
      setStartTime: (time) => set({ startTime: time }),
      setEndTime: (time) => set({ endTime: time }),
      toggleTimeFormat: () => set((state) => ({ use24Hour: !state.use24Hour })),
    }),
    {
      name: 'time-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
