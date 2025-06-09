-- Resynk Database Schema for Cloudflare D1

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'enterprise')),
    usage_resumes_created INTEGER DEFAULT 0,
    usage_ai_credits_used INTEGER DEFAULT 0,
    usage_ai_credits_limit INTEGER DEFAULT 100,
    usage_storage_used TEXT DEFAULT '0MB',
    usage_storage_limit TEXT DEFAULT '100MB',
    preferences_theme TEXT DEFAULT 'system' CHECK (preferences_theme IN ('light', 'dark', 'system')),
    preferences_default_template TEXT DEFAULT 'modern_professional',
    preferences_auto_save BOOLEAN DEFAULT true,
    preferences_notifications BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Templates table
CREATE TABLE templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('professional', 'creative', 'minimal', 'modern', 'academic')),
    industry TEXT,
    preview_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    popularity_score INTEGER DEFAULT 0,
    template_data TEXT NOT NULL, -- JSON string containing template structure
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Resumes table
CREATE TABLE resumes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    template_id TEXT NOT NULL,
    resume_data TEXT NOT NULL, -- JSON string containing ResumeData
    settings TEXT NOT NULL, -- JSON string containing ResumeSettings
    is_public BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(id)
);

-- Resume versions table (for version control)
CREATE TABLE resume_versions (
    id TEXT PRIMARY KEY,
    resume_id TEXT NOT NULL,
    version INTEGER NOT NULL,
    created_by TEXT NOT NULL,
    changes_summary TEXT,
    resume_data TEXT NOT NULL, -- JSON string containing ResumeData at this version
    is_current BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE(resume_id, version)
);

-- Collaborators table
CREATE TABLE collaborators (
    id TEXT PRIMARY KEY,
    resume_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    permission TEXT NOT NULL CHECK (permission IN ('view', 'edit', 'admin')),
    invited_by TEXT NOT NULL,
    invited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_at DATETIME,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by) REFERENCES users(id),
    UNIQUE(resume_id, user_id)
);

-- Resume analytics table
CREATE TABLE resume_analytics (
    id TEXT PRIMARY KEY,
    resume_id TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    applications_tracked INTEGER DEFAULT 0,
    last_viewed DATETIME,
    view_history TEXT, -- JSON array of daily view/download counts
    geographic_data TEXT, -- JSON array of country-wise view data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    UNIQUE(resume_id)
);

-- AI suggestions table
CREATE TABLE ai_suggestions (
    id TEXT PRIMARY KEY,
    resume_id TEXT NOT NULL,
    section TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('improvement', 'keyword', 'formatting', 'content', 'structure')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    original_content TEXT,
    suggested_content TEXT,
    impact TEXT NOT NULL CHECK (impact IN ('low', 'medium', 'high')),
    is_applied BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

-- Share settings table
CREATE TABLE share_settings (
    id TEXT PRIMARY KEY,
    resume_id TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    share_url TEXT UNIQUE,
    password_protected BOOLEAN DEFAULT false,
    password_hash TEXT,
    expires_at DATETIME,
    view_count INTEGER DEFAULT 0,
    allow_downloads BOOLEAN DEFAULT true,
    allow_comments BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    UNIQUE(resume_id)
);

-- Notifications table
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_label TEXT,
    action_href TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan TEXT NOT NULL CHECK (plan IN ('free', 'premium', 'enterprise')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
    current_period_start DATETIME NOT NULL,
    current_period_end DATETIME NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    stripe_subscription_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_template_id ON resumes(template_id);
CREATE INDEX idx_resumes_updated_at ON resumes(updated_at);
CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id);
CREATE INDEX idx_collaborators_resume_id ON collaborators(resume_id);
CREATE INDEX idx_collaborators_user_id ON collaborators(user_id);
CREATE INDEX idx_ai_suggestions_resume_id ON ai_suggestions(resume_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Insert default templates
INSERT INTO templates (id, name, description, category, preview_url, thumbnail_url, template_data) VALUES
('modern_professional', 'Modern Professional', 'Clean and modern design perfect for corporate roles', 'professional', '/templates/modern_professional_preview.png', '/templates/modern_professional_thumb.png', '{"layout": "single_column", "sections": ["personal", "summary", "experience", "education", "skills"], "styling": {"primary_color": "#2563eb", "font": "Inter"}}'),
('creative_designer', 'Creative Designer', 'Showcase your creativity with this vibrant template', 'creative', '/templates/creative_designer_preview.png', '/templates/creative_designer_thumb.png', '{"layout": "two_column", "sections": ["personal", "summary", "projects", "experience", "skills", "education"], "styling": {"primary_color": "#7c3aed", "font": "Poppins"}}'),
('minimal_clean', 'Minimal Clean', 'Simple and elegant design that focuses on content', 'minimal', '/templates/minimal_clean_preview.png', '/templates/minimal_clean_thumb.png', '{"layout": "single_column", "sections": ["personal", "summary", "experience", "education", "skills"], "styling": {"primary_color": "#64748b", "font": "Inter"}}'),
('academic_researcher', 'Academic Researcher', 'Perfect for academic and research positions', 'academic', '/templates/academic_researcher_preview.png', '/templates/academic_researcher_thumb.png', '{"layout": "single_column", "sections": ["personal", "summary", "education", "experience", "certifications", "achievements"], "styling": {"primary_color": "#1f2937", "font": "Times New Roman"}}'),
('tech_modern', 'Tech Modern', 'Modern template optimized for tech professionals', 'modern', '/templates/tech_modern_preview.png', '/templates/tech_modern_thumb.png', '{"layout": "two_column_sidebar", "sections": ["personal", "summary", "experience", "projects", "skills", "education"], "styling": {"primary_color": "#059669", "font": "JetBrains Mono"}}');
