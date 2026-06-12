import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from './i18n';

export type AppView = 'landing' | 'login' | 'register' | 'student-dashboard' | 'admin-dashboard' | 'projects' | 'submit-project' | 'about' | 'project-detail';

export interface Message {
  id: string;
  from: string; // userId
  fromName: string;
  fromRole: 'student' | 'admin';
  to: string; // userId
  text: string;
  timestamp: string;
  read: boolean;
}

export interface BMCBlock {
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valueProposition: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
}

export interface EditableStats {
  totalSubmitted: number;
  accepted: number;
  evaluating: number;
  startups: number;
  trainedBatches: number;
  incubatedProjects: number;
  successRate: number;
}

export interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  faculty: string;
  level: string;
  password: string;
}

interface AppState {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  previousView: AppView;
  user: { id: string; email: string; name: string; role: string; faculty?: string; level?: string; phone?: string } | null;
  setUser: (user: { id: string; email: string; name: string; role: string; faculty?: string; level?: string; phone?: string } | null) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;
  studentTab: string;
  setStudentTab: (tab: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  messages: Message[];
  addMessage: (msg: Message) => void;
  markMessagesRead: (userId: string, fromRole: string) => void;
  bmcData: Record<string, BMCBlock>;
  setBmcData: (projectId: string, data: BMCBlock) => void;
  editableStats: EditableStats;
  setEditableStats: (stats: EditableStats) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  studentGuideStep: number;
  setStudentGuideStep: (step: number) => void;
  studentProfiles: Record<string, StudentProfile>;
  setStudentProfile: (userId: string, profile: StudentProfile) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'landing',
      setCurrentView: (view) => set({ currentView: view, previousView: view }),
      previousView: 'landing',

      user: null,
      setUser: (user) => set({ user }),

      locale: 'ar',
      setLocale: (locale) => set({ locale }),

      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      adminTab: 'overview',
      setAdminTab: (tab) => set({ adminTab: tab }),

      studentTab: 'overview',
      setStudentTab: (tab) => set({ studentTab: tab }),

      selectedProjectId: null,
      setSelectedProjectId: (id) => set({ selectedProjectId: id }),

      messages: [],
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      markMessagesRead: (userId, fromRole) => set((state) => ({
        messages: state.messages.map((m) =>
          m.to === userId && m.fromRole === fromRole ? { ...m, read: true } : m
        ),
      })),

      bmcData: {},
      setBmcData: (projectId, data) => set((state) => ({
        bmcData: { ...state.bmcData, [projectId]: data },
      })),

      editableStats: {
        totalSubmitted: 1800,
        accepted: 245,
        evaluating: 380,
        startups: 130,
        trainedBatches: 11,
        incubatedProjects: 610,
        successRate: 72,
      },
      setEditableStats: (stats) => set({ editableStats: stats }),

      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      studentGuideStep: 0,
      setStudentGuideStep: (step) => set({ studentGuideStep: step }),

      studentProfiles: {},
      setStudentProfile: (userId, profile) => set((state) => ({
        studentProfiles: { ...state.studentProfiles, [userId]: profile },
      })),
    }),
    {
      name: 'inc-alg-3-store',
      partialize: (state) => ({
        locale: state.locale,
        user: state.user,
        messages: state.messages,
        bmcData: state.bmcData,
        editableStats: state.editableStats,
        studentProfiles: state.studentProfiles,
      }),
    }
  )
);
