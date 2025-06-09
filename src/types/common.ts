// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// Form validation types
export interface FormErrors {
  [key: string]: string | string[] | FormErrors;
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts: {
    sans: string;
    serif: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Editor types
export interface EditorState {
  activeSection: keyof ResumeData | null;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  version: number;
}

export interface DragItem {
  id: string;
  type: string;
  index: number;
  section?: string;
}

// Collaboration types
export interface Collaborator {
  id: string;
  user_id: string;
  resume_id: string;
  permission: 'view' | 'edit' | 'admin';
  invited_by: string;
  invited_at: Date;
  accepted_at?: Date;
  status: 'pending' | 'accepted' | 'declined';
}

export interface ResumeVersion {
  version: number;
  created_at: Date;
  created_by: string;
  changes_summary: string;
  is_current: boolean;
  data: ResumeData;
}

// Export and sharing types
export interface ShareSettings {
  is_public: boolean;
  share_url?: string;
  password_protected: boolean;
  password?: string;
  expires_at?: Date;
  view_count: number;
  allow_downloads: boolean;
  allow_comments: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  industry?: string;
  is_premium?: boolean;
  sort_by?: 'name' | 'popularity' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

// File upload types
export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploaded_at: Date;
}

// Subscription and billing types
export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  created_at: Date;
}
