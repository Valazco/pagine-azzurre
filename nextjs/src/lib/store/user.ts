import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, LoginResponse } from '@/types';
import { signin as signinApi, register as registerApi } from '@/lib/api/users';

interface UserStore {
  userInfo: LoginResponse | null;
  loading: boolean;
  error: string | null;

  // Actions
  setUserInfo: (info: LoginResponse) => void;
  signin: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  signout: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userInfo: null,
      loading: false,
      error: null,

      setUserInfo: (info) => set({ userInfo: info }),

      signin: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const data = await signinApi(email, password);
          set({ userInfo: data, loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Errore durante il login',
            loading: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        try {
          set({ loading: true, error: null });
          const response = await registerApi(data);
          set({ userInfo: response, loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Errore durante la registrazione',
            loading: false,
          });
          throw error;
        }
      },

      signout: () => {
        set({ userInfo: null, error: null });
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user-storage');
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
