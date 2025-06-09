import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Resume, ResumeData, ResumeSettings } from '@/types/resume';
import { EditorState } from '@/types/common';

interface ResumeStore {
  // Current resume state
  currentResume: Resume | null;
  resumeData: ResumeData | null;
  resumeSettings: ResumeSettings | null;
  
  // Editor state
  editorState: EditorState;
  
  // UI state
  sidebarCollapsed: boolean;
  previewMode: 'desktop' | 'mobile';
  showPreview: boolean;
  zoomLevel: number;
  
  // Actions
  setCurrentResume: (resume: Resume) => void;
  updateResumeData: (data: Partial<ResumeData>) => void;
  updateResumeSettings: (settings: Partial<ResumeSettings>) => void;
  saveResume: (resume: Resume) => Promise<void>;
  setActiveSection: (section: keyof ResumeData | null) => void;
  setEditing: (editing: boolean) => void;
  markUnsavedChanges: () => void;
  markSaved: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  setShowPreview: (show: boolean) => void;
  setZoomLevel: (level: number) => void;
  resetEditor: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentResume: null,
      resumeData: null,
      resumeSettings: null,
      editorState: {
        activeSection: null,
        isEditing: false,
        hasUnsavedChanges: false,
        lastSaved: null,
        version: 1,
      },
      sidebarCollapsed: false,
      previewMode: 'desktop',
      showPreview: true,
      zoomLevel: 100,

      // Actions
      setCurrentResume: (resume) => {
        set({
          currentResume: resume,
          resumeData: resume.data,
          resumeSettings: resume.settings,
          editorState: {
            activeSection: null,
            isEditing: false,
            hasUnsavedChanges: false,
            lastSaved: new Date(),
            version: resume.version,
          },
        });
      },

      updateResumeData: (data) => {
        const currentData = get().resumeData;
        if (!currentData) return;

        const newData = { ...currentData, ...data };
        set({
          resumeData: newData,
          editorState: {
            ...get().editorState,
            hasUnsavedChanges: true,
          },
        });
      },

      updateResumeSettings: (settings) => {
        const currentSettings = get().resumeSettings;
        if (!currentSettings) return;

        const newSettings = { ...currentSettings, ...settings };
        set({
          resumeSettings: newSettings,
          editorState: {
            ...get().editorState,
            hasUnsavedChanges: true,
          },
        });
      },

      saveResume: async () => {
        // Mock save implementation - would integrate with actual API
        return new Promise((resolve) => {
          setTimeout(() => {
            set({
              editorState: {
                ...get().editorState,
                hasUnsavedChanges: false,
                lastSaved: new Date(),
              },
            });
            resolve();
          }, 500);
        });
      },

      setActiveSection: (section) => {
        set({
          editorState: {
            ...get().editorState,
            activeSection: section,
          },
        });
      },

      setEditing: (editing) => {
        set({
          editorState: {
            ...get().editorState,
            isEditing: editing,
          },
        });
      },

      markUnsavedChanges: () => {
        set({
          editorState: {
            ...get().editorState,
            hasUnsavedChanges: true,
          },
        });
      },

      markSaved: () => {
        set({
          editorState: {
            ...get().editorState,
            hasUnsavedChanges: false,
            lastSaved: new Date(),
          },
        });
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      setPreviewMode: (mode) => {
        set({ previewMode: mode });
      },

      setShowPreview: (show) => {
        set({ showPreview: show });
      },

      setZoomLevel: (level) => {
        set({ zoomLevel: Math.max(50, Math.min(200, level)) });
      },

      resetEditor: () => {
        set({
          currentResume: null,
          resumeData: null,
          resumeSettings: null,
          editorState: {
            activeSection: null,
            isEditing: false,
            hasUnsavedChanges: false,
            lastSaved: null,
            version: 1,
          },
          sidebarCollapsed: false,
          previewMode: 'desktop',
          showPreview: true,
          zoomLevel: 100,
        });
      },
    }),
    {
      name: 'resynk-resume-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        previewMode: state.previewMode,
        showPreview: state.showPreview,
        zoomLevel: state.zoomLevel,
      }),
    }
  )
);

// Template store
interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  isPremium: boolean;
}

interface TemplateStore {
  selectedTemplate: string | null;
  templates: Template[];
  loading: boolean;
  setSelectedTemplate: (templateId: string) => void;
  setTemplates: (templates: Template[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  selectedTemplate: 'modern_professional',
  templates: [],
  loading: false,
  setSelectedTemplate: (templateId) => set({ selectedTemplate: templateId }),
  setTemplates: (templates) => set({ templates }),
  setLoading: (loading) => set({ loading }),
}));

// UI store for global UI state
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
}

interface UIStore {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  notifications: Notification[];
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarOpen: true,
      commandPaletteOpen: false,
      notifications: [],

      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      
      addNotification: (notification) => {
        const notifications = get().notifications;
        set({ notifications: [...notifications, { ...notification, id: Date.now().toString() }] });
      },
      
      removeNotification: (id) => {
        const notifications = get().notifications.filter(n => n.id !== id);
        set({ notifications });
      },
    }),
    {
      name: 'resynk-ui-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
