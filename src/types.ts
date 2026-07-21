export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
  companyId?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  salary: string;
  experience: string;
  location: string;
  skills: string[];
  type: 'Full Time' | 'Part Time' | 'Remote' | 'Hybrid' | 'Contract' | 'Internship';
  industry: string;
  status: 'active' | 'featured' | 'archived' | 'closed';
  companyId: string;
  companyName: string;
  companyLogo?: string;
  companyLocation?: string;
  created_at?: string;
  expiry_date?: string;
  appliedCount?: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  resumeText: string;
  resumeScore?: number;
  resumeAnalysis?: {
    strengths: string[];
    gaps: string[];
    recommendations: string[];
    matchedSkills: string[];
    jobFitPercentage: number;
  };
  status: 'applied' | 'shortlisted' | 'rejected' | 'interview_scheduled';
  notes?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewLink?: string;
  appliedAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  logoUrl?: string;
  industry: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  location?: string;
  description: string;
  status: 'pending' | 'approved' | 'suspended';
  isFeatured?: boolean;
  website?: string;
  created_at: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resumeText?: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  savedJobs: string[]; // jobIds
  certificates?: string[];
  backgroundVerified?: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  author: string;
  category: string;
  date: string;
  image?: string;
  status: 'draft' | 'published';
  views: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  image?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'contacted' | 'replied' | 'archived';
  created_at: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface RealtimeAlert {
  id: string;
  message: string;
  timestamp: string;
}

export interface SystemSettings {
  companyName: string;
  tagline: string;
  phone: string;
  personalEmail: string;
  companyEmail: string;
  address: string;
  whatsapp: string;
  mapUrl: string;
  socialLinks: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  smtpSettings: {
    host: string;
    port: string;
    user: string;
  };
  seoSettings: {
    titleTemplate: string;
    defaultDescription: string;
    keywords: string[];
  };
}
