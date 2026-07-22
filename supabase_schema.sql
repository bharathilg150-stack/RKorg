-- ==========================================
-- TURENAKX STAFFING AGENCY - SUPABASE SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Role-Based Access Control linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('Super Admin', 'Admin', 'Recruiter', 'Employer', 'Candidate')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. COMPANIES (EMPLOYERS)
CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY, -- Can correspond to a user ID or custom text id e.g. company-1
  name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT,
  contact_email TEXT UNIQUE NOT NULL,
  contact_phone TEXT,
  address TEXT,
  location TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
  is_featured BOOLEAN DEFAULT false,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies are viewable by everyone" ON public.companies
  FOR SELECT USING (true);

CREATE POLICY "Admins and owner can write companies" ON public.companies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Super Admin', 'Admin')
    ) OR 
    contact_email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
  );

-- 3. CANDIDATES
CREATE TABLE IF NOT EXISTS public.candidates (
  id TEXT PRIMARY KEY, -- references auth.users or candidate-1
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  resume_text TEXT,
  skills TEXT[] DEFAULT '{}',
  experience JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  saved_jobs TEXT[] DEFAULT '{}',
  certificates TEXT[] DEFAULT '{}',
  background_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates are viewable by admins and recruiters" ON public.candidates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Super Admin', 'Admin', 'Recruiter')
    ) OR
    email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
  );

CREATE POLICY "Candidates can update their own profile" ON public.candidates
  FOR UPDATE USING (
    email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
  );

-- 4. JOBS
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT[] DEFAULT '{}',
  salary TEXT,
  experience TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  type TEXT CHECK (type IN ('Full Time', 'Part Time', 'Remote', 'Hybrid', 'Contract', 'Internship')),
  industry TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'featured', 'archived', 'closed')),
  company_id TEXT REFERENCES public.companies(id) ON DELETE SET NULL,
  company_name TEXT,
  company_logo TEXT,
  company_location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expiry_date TIMESTAMPTZ,
  applied_count INT DEFAULT 0
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone" ON public.jobs
  FOR SELECT USING (true);

CREATE POLICY "Employers can modify their own jobs" ON public.jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = jobs.company_id AND companies.contact_email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Super Admin', 'Admin', 'Recruiter')
    )
  );

-- 5. APPLICATIONS
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  job_id TEXT REFERENCES public.jobs(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  candidate_id TEXT REFERENCES public.candidates(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_phone TEXT,
  resume_text TEXT NOT NULL,
  resume_score INT,
  resume_analysis JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'rejected', 'interview_scheduled')),
  notes TEXT,
  interview_date TEXT,
  interview_time TEXT,
  interview_link TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view their own applications" ON public.applications
  FOR SELECT USING (
    candidate_email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Super Admin', 'Admin', 'Recruiter')
    ) OR
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id AND EXISTS (
        SELECT 1 FROM public.companies 
        WHERE companies.id = jobs.company_id AND companies.contact_email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
      )
    )
  );

CREATE POLICY "Admins and candidates can create applications" ON public.applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins and employers can update applications" ON public.applications
  FOR UPDATE USING (true);

-- 6. INTERVIEWS TABLE (Explicit lookup tracker)
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id TEXT REFERENCES public.applications(id) ON DELETE CASCADE,
  job_id TEXT REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id TEXT REFERENCES public.candidates(id) ON DELETE CASCADE,
  interview_date DATE,
  interview_time TIME,
  meeting_link TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read related interviews" ON public.interviews
  FOR SELECT USING (true);

-- 7. BLOGS (CMS)
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  author TEXT,
  category TEXT,
  date TEXT,
  image TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  views INT DEFAULT 0
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blogs viewable by everyone" ON public.blogs
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify blogs" ON public.blogs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Super Admin', 'Admin')
    )
  );

-- 8. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- 9. TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  role TEXT,
  company TEXT,
  text TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  image TEXT
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials viewable by everyone" ON public.testimonials
  FOR SELECT USING (true);

-- 10. FAQS
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQs viewable by everyone" ON public.faqs
  FOR SELECT USING (true);

-- 11. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'contacted', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage contact messages" ON public.contact_messages
  FOR ALL USING (true); -- Accessible through server client / api routes

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own notifications" ON public.notifications
  FOR SELECT USING (true);

-- 13. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  company_name TEXT NOT NULL,
  tagline TEXT,
  phone TEXT,
  personal_email TEXT,
  company_email TEXT,
  address TEXT,
  whatsapp TEXT,
  map_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  smtp_settings JSONB DEFAULT '{}'::jsonb,
  seo_settings JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings viewable by everyone" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" ON public.settings
  FOR UPDATE USING (true);

-- 14. ACTIVITY/AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  user_name TEXT,
  action TEXT NOT NULL,
  target TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity logs" ON public.activity_logs
  FOR SELECT USING (true);

-- ========================================================
-- ENABLE REALTIME SUBSCIPTIONS ON TABLES
-- ========================================================
alter publication supabase_realtime add table public.jobs;
alter publication supabase_realtime add table public.applications;
alter publication supabase_realtime add table public.candidates;
alter publication supabase_realtime add table public.companies;
alter publication supabase_realtime add table public.contact_messages;
alter publication supabase_realtime add table public.blogs;
alter publication supabase_realtime add table public.settings;

-- ========================================================
-- PRE-BOOTSTRAP DEFAULT STORAGE BUCKETS
-- (Run inside database)
-- ========================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('website-assets', 'website-assets', true) ON CONFLICT (id) DO NOTHING;
