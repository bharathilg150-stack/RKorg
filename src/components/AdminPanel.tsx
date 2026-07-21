import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Key, Building2, Users, Briefcase, FileSpreadsheet, 
  MessageSquare, Settings, Bell, CheckCircle2, RefreshCw, Edit3, LogOut 
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  UserSession, Job, Company, Candidate, Application, BlogPost, FAQItem, 
  Testimonial, ContactMessage, SystemSettings, RealtimeAlert, AuditLog 
} from '../types';

// Import subcomponents
import AdminMetrics from './admin/AdminMetrics';
import AdminJobs from './admin/AdminJobs';
import AdminCandidates from './admin/AdminCandidates';
import AdminCompanies from './admin/AdminCompanies';
import AdminApplications from './admin/AdminApplications';
import AdminCMS from './admin/AdminCMS';
import AdminMessages from './admin/AdminMessages';
import AdminSettings from './admin/AdminSettings';

interface AdminPanelProps {
  user: UserSession | null;
  jobs: Job[];
  companies: Company[];
  candidates: Candidate[];
  applications: Application[];
  blogs: BlogPost[];
  faqs: FAQItem[];
  testimonials: Testimonial[];
  contactMessages: ContactMessage[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
  realtimeAlerts: RealtimeAlert[];
  loginAdmin: (email: string, pass: string) => Promise<any>;
  updateJob: (job: Job) => Promise<boolean>;
  deleteJob: (id: string) => Promise<boolean>;
  createJob: (job: Omit<Job, 'id' | 'appliedCount'>) => Promise<boolean>;
  updateCompany: (comp: Company) => Promise<boolean>;
  updateCandidate: (cand: Candidate) => Promise<boolean>;
  updateApplicationStatus: (appId: string, status: Application['status'], details?: any) => Promise<boolean>;
  updateBlog: (blog: BlogPost) => Promise<boolean>;
  deleteBlog: (id: string) => Promise<boolean>;
  createBlog: (blog: Omit<BlogPost, 'id' | 'views' | 'date'>) => Promise<boolean>;
  updateSettings: (sets: SystemSettings) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => Promise<boolean>;
}

export default function AdminPanel({
  user,
  jobs,
  companies,
  candidates,
  applications,
  blogs,
  faqs,
  testimonials,
  contactMessages,
  auditLogs,
  settings,
  realtimeAlerts,
  loginAdmin,
  updateJob,
  deleteJob,
  createJob,
  updateCompany,
  updateCandidate,
  updateApplicationStatus,
  updateBlog,
  deleteBlog,
  createBlog,
  updateSettings,
  deleteMessage,
  updateMessageStatus,
}: AdminPanelProps) {
  // Login credentials state
  const [email, setEmail] = useState('rkturenak@gmail.com');
  const [password, setPassword] = useState('Akshatha agency');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'metrics' | 'jobs' | 'candidates' | 'companies' | 'applications' | 'blogs' | 'messages' | 'settings'>('metrics');

  // Handle Admin Authorization
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = await loginAdmin(email, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Verification failed. Please review credentials.');
    } else {
      setSuccessMsg('Corporate security verified. Launching principal panel...');
    }
  };

  // GUEST LOGIN SCREEN
  if (!user || user.role !== 'admin') {
    return (
      <div className="font-sans text-slate-800 bg-[#051430] min-h-[90vh] flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur border border-slate-200/80 w-full max-w-md p-8 rounded-2xl shadow-2xl text-left"
        >
          <div className="text-center space-y-2">
            <span className="text-[#F97316] text-[10px] font-bold uppercase tracking-widest bg-orange-50 px-3 py-1 rounded">
              High Security Desk Access
            </span>
            <h2 className="text-2xl font-black text-[#0A2C66] tracking-tight">
              Principal Administration
            </h2>
            <p className="text-slate-400 text-xs font-semibold">
              Enter credentials with your assigned security key.
            </p>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-4 mt-6">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-bold flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs font-bold">
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Security Handle</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white text-slate-700"
                  placeholder="rkturenak@gmail.com"
                />
                <ShieldCheck className="h-4 w-4 text-[#0A2C66] absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Agency Security Key</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white text-slate-700"
                  placeholder="••••••••"
                />
                <Key className="h-4 w-4 text-[#F97316] absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-[#0A2C66] text-white hover:bg-slate-800 transition-all rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-900/10 cursor-pointer"
            >
              Verify Administrative Clearance
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Authorized Access Only. Actions Logged.</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN PANEL LAYOUT
  return (
    <div className="font-sans text-slate-800 bg-[#F8FAFC] min-h-screen">
      
      {/* 1. REAL-TIME EVENT STREAMING BAR */}
      <div className="bg-[#0A2C66] border-b border-slate-900 text-white text-xs font-semibold py-3 overflow-hidden shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[#F97316] uppercase font-black text-[10px] tracking-widest">Live Sourcing Feed:</span>
          </div>

          <div className="flex-1 px-6 overflow-hidden">
            <div className="whitespace-nowrap animate-marquee flex gap-12 text-slate-300">
              {realtimeAlerts.length === 0 ? (
                <span className="italic text-[11px]">Subscribed to live events. Awaiting corporate writes...</span>
              ) : (
                realtimeAlerts.map((alert) => (
                  <span key={alert.id} className="flex items-center gap-1.5 text-xs font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F97316]" />
                    <span>{alert.message}</span>
                    <span className="text-[9px] text-slate-500">({new Date(alert.timestamp).toLocaleTimeString()})</span>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black shrink-0">
            {user.email}
          </div>
        </div>
      </div>

      {/* Main Panel Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-6 text-left">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-1">
            <h3 className="text-[#0A2C66] font-black text-xs uppercase tracking-wider px-3 pb-3 border-b border-slate-50 mb-3">
              Principal Console
            </h3>

            {[
              { id: 'metrics', name: 'Realtime Metrics', icon: RefreshCw },
              { id: 'jobs', name: 'Manage Sourcing Jobs', icon: Briefcase },
              { id: 'candidates', name: 'Review Candidates', icon: Users },
              { id: 'companies', name: 'Corporate Partners', icon: Building2 },
              { id: 'applications', name: 'Applicant Mandates', icon: FileSpreadsheet },
              { id: 'blogs', name: 'CMS & Blogs Editor', icon: Edit3 },
              { id: 'messages', name: 'Contact Messages', icon: MessageSquare },
              { id: 'settings', name: 'Agency Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#0A2C66] bg-slate-50 border-l-4 border-l-[#F97316]'
                      : 'text-slate-500 hover:text-[#0A2C66] hover:bg-slate-50/40'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#F97316]' : ''}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Panel */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-left min-h-[70vh]">
          
          {/* TAB 1: METRICS */}
          {activeTab === 'metrics' && (
            <div className="animate-fadeIn">
              <AdminMetrics 
                jobs={jobs} 
                companies={companies} 
                candidates={candidates} 
                applications={applications} 
                auditLogs={auditLogs} 
                realtimeAlerts={realtimeAlerts} 
              />
            </div>
          )}

          {/* TAB 2: JOBS */}
          {activeTab === 'jobs' && (
            <div className="animate-fadeIn">
              <AdminJobs 
                jobs={jobs} 
                companies={companies} 
                updateJob={updateJob} 
                deleteJob={deleteJob} 
                createJob={createJob} 
              />
            </div>
          )}

          {/* TAB 3: CANDIDATES */}
          {activeTab === 'candidates' && (
            <div className="animate-fadeIn">
              <AdminCandidates 
                candidates={candidates} 
                updateCandidate={updateCandidate} 
              />
            </div>
          )}

          {/* TAB 4: COMPANIES */}
          {activeTab === 'companies' && (
            <div className="animate-fadeIn">
              <AdminCompanies 
                companies={companies} 
                updateCompany={updateCompany} 
              />
            </div>
          )}

          {/* TAB 5: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="animate-fadeIn">
              <AdminApplications 
                applications={applications} 
                updateApplicationStatus={updateApplicationStatus} 
              />
            </div>
          )}

          {/* TAB 6: CMS */}
          {activeTab === 'blogs' && (
            <div className="animate-fadeIn">
              <AdminCMS 
                blogs={blogs} 
                faqs={faqs} 
                testimonials={testimonials} 
                deleteBlog={deleteBlog} 
                createBlog={createBlog} 
              />
            </div>
          )}

          {/* TAB 7: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="animate-fadeIn">
              <AdminMessages 
                contactMessages={contactMessages} 
                updateMessageStatus={updateMessageStatus} 
                deleteMessage={deleteMessage} 
              />
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="animate-fadeIn">
              <AdminSettings 
                settings={settings} 
                updateSettings={updateSettings} 
              />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
