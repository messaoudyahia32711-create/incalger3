import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from './i18n';

export type AppView = 'landing' | 'login' | 'register' | 'student-dashboard' | 'admin-dashboard' | 'projects' | 'submit-project' | 'about';

interface AppState {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Auth
  user: { id: string; email: string; name: string; role: string } | null;
  setUser: (user: { id: string; email: string; name: string; role: string } | null) => void;

  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Admin tab
  adminTab: string;
  setAdminTab: (tab: string) => void;

  // Student tab
  studentTab: string;
  setStudentTab: (tab: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'landing',
      setCurrentView: (view) => set({ currentView: view }),

      user: null,
      setUser: (user) => set({ user }),

      locale: 'ar',
      setLocale: (locale) => set({ locale }),

      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      adminTab: 'statistics',
      setAdminTab: (tab) => set({ adminTab: tab }),

      studentTab: 'my-projects',
      setStudentTab: (tab) => set({ studentTab: tab }),
    }),
    {
      name: 'inc-alg-3-store',
      partialize: (state) => ({
        locale: state.locale,
        user: state.user,
      }),
    }
  )
);
