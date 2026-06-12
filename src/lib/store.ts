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

export interface StudentProject {
  id: string;
  refNumber: string;
  projectName: string;
  projectNameEn: string;
  projectNameFr: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  faculty: string;
  level: string;
  field: string;
  description: string;
  problem: string;
  targetAudience: string;
  addedValue: string;
  fundingRequired: number;
  stage: string;
  hasPartner: boolean;
  teamSize: number;
  status: string;
  score: number | null;
  evaluationNotes: string;
  legalFramework: string;
  tradeName: string;
  academicYear: string;
  department: string;
  createdAt: string;
  timeline: Array<{ date: string; event: string; eventEn: string }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  faculty: string;
  level: string;
  role: 'admin' | 'student';
  active: boolean;
  avatar?: string;
}

export interface AdminSettings {
  platformNameAr: string;
  platformNameEn: string;
  platformNameFr: string;
  contactEmail: string;
  contactPhone: string;
  addressAr: string;
  addressEn: string;
  addressFr: string;
  adminEmail: string;
  adminPassword: string;
  notifyNewProject: boolean;
  notifyProjectStatus: boolean;
  notifyMessage: boolean;
  heroImages: string[];
}

export interface ProjectTimelineEvent {
  id: string;
  projectId: string;
  date: string;
  event: string;
  eventEn: string;
  addedBy: string;
}

export interface AdminEvent {
  id: string;
  titleAr: string;
  titleEn: string;
  titleFr: string;
  date: string;
  location: string;
  descAr: string;
  descEn: string;
  descFr: string;
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
  studentProjects: Record<string, StudentProject>;
  setStudentProject: (userId: string, project: StudentProject) => void;
  // New state fields
  adminUsers: Record<string, AdminUser>;
  setAdminUser: (userId: string, user: AdminUser) => void;
  adminSettings: AdminSettings;
  setAdminSettings: (settings: AdminSettings) => void;
  projectTimelines: Record<string, ProjectTimelineEvent[]>;
  addProjectTimelineEvent: (projectId: string, event: ProjectTimelineEvent) => void;
  projectStatusOverrides: Record<string, { status: string; score: number | null; evaluationNotes: string }>;
  setProjectStatusOverride: (projectId: string, data: { status: string; score: number | null; evaluationNotes: string }) => void;
  adminEvents: AdminEvent[];
  addAdminEvent: (event: AdminEvent) => void;
  updateAdminEvent: (id: string, event: Partial<AdminEvent>) => void;
  deleteAdminEvent: (id: string) => void;
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

      studentProjects: {},
      setStudentProject: (userId, project) => set((state) => ({
        studentProjects: { ...state.studentProjects, [userId]: project },
      })),

      // New state fields
      adminUsers: {},
      setAdminUser: (userId, userData) => set((state) => ({
        adminUsers: { ...state.adminUsers, [userId]: userData },
      })),

      adminSettings: {
        platformNameAr: 'حاضنة أعمال جامعة الجزائر 3',
        platformNameEn: 'University of Algiers 3 Business Incubator',
        platformNameFr: 'Incubateur d\'Entreprises de l\'Université d\'Alger 3',
        contactEmail: 'incubateur@univ-alger3.dz',
        contactPhone: '+213 21 00 00 00',
        addressAr: 'جامعة الجزائر 3 - دالي إبراهيم - الجزائر',
        addressEn: 'University of Algiers 3 - Dali Ibrahim - Algiers',
        addressFr: 'Université d\'Alger 3 - Dali Ibrahim - Alger',
        adminEmail: 'admin@univ-alger3.dz',
        adminPassword: 'admin123',
        notifyNewProject: true,
        notifyProjectStatus: true,
        notifyMessage: true,
        heroImages: ['/images/hero-bg.png', '/images/cta-bg.png', '/images/about-section.png'],
      },
      setAdminSettings: (settings) => set({ adminSettings: settings }),

      projectTimelines: {},
      addProjectTimelineEvent: (projectId, event) => set((state) => ({
        projectTimelines: {
          ...state.projectTimelines,
          [projectId]: [...(state.projectTimelines[projectId] || []), event],
        },
      })),

      projectStatusOverrides: {},
      setProjectStatusOverride: (projectId, data) => set((state) => ({
        projectStatusOverrides: { ...state.projectStatusOverrides, [projectId]: data },
      })),

      adminEvents: [
        { id: 'e1', titleAr: 'ملتقى المؤسسة الناشئة الإفريقية', titleEn: 'African Startup Conference', titleFr: 'Conférence Africaine des Startups', date: '2025-01-15', location: 'قصر الثقافة، الجزائر العاصمة', descAr: 'مشاركة 20 حامل مشروع من جامعة الجزائر 3', descEn: 'Participation of 20 project holders from University of Algiers 3', descFr: 'Participation de 20 porteurs de projets de l\'Université d\'Alger 3' },
        { id: 'e2', titleAr: 'اليوم الوطني لريادة الأعمال', titleEn: 'National Entrepreneurship Day', titleFr: 'Journée Nationale de l\'Entrepreneuriat', date: '2025-03-21', location: 'مدرج جامعة الجزائر 3', descAr: 'يوم تحسيسي حول ريادة الأعمال', descEn: 'Awareness day about entrepreneurship', descFr: 'Journée de sensibilisation à l\'entrepreneuriat' },
        { id: 'e3', titleAr: 'توقيع اتفاقية شراكة مع CERIST', titleEn: 'Partnership Agreement with CERIST', titleFr: 'Accord de partenariat avec le CERIST', date: '2025-02-05', location: 'رياسة جامعة الجزائر 3', descAr: 'شراكة لدعم التحول الرقمي', descEn: 'Partnership to support digital transformation', descFr: 'Partenariat pour soutenir la transformation numérique' },
        { id: 'e4', titleAr: 'تكريم الدفعة 10', titleEn: 'Batch 10 Graduation', titleFr: 'Remise des diplômes - Promotion 10', date: '2025-06-20', location: 'مدرج جامعة الجزعة 3', descAr: 'حفل تكريم المشاريع المقبولة', descEn: 'Ceremony honoring accepted projects', descFr: 'Cérémonie de remise des diplômes des projets acceptés' },
      ],
      addAdminEvent: (event) => set((state) => ({
        adminEvents: [...state.adminEvents, event],
      })),
      updateAdminEvent: (id, data) => set((state) => ({
        adminEvents: state.adminEvents.map((e) => e.id === id ? { ...e, ...data } : e),
      })),
      deleteAdminEvent: (id) => set((state) => ({
        adminEvents: state.adminEvents.filter((e) => e.id !== id),
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
        studentProjects: state.studentProjects,
        adminUsers: state.adminUsers,
        adminSettings: state.adminSettings,
        projectTimelines: state.projectTimelines,
        projectStatusOverrides: state.projectStatusOverrides,
        adminEvents: state.adminEvents,
      }),
    }
  )
);
