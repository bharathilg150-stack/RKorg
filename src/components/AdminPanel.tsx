import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Key, Building2, Users, Briefcase, FileSpreadsheet, 
  MessageSquare, Settings, Bell, ChevronRight, Edit3, Trash2, Check, CheckCircle2, 
  Trash, Plus, Eye, Award, HelpCircle, PhoneCall, ExternalLink, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserSession, Job, Company, Candidate, Application, BlogPost, FAQItem, 
  Testimonial, ContactMessage, SystemSettings, RealtimeAlert 
} from '../types';

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
  settings: SystemSettings;
  realtimeAlerts: RealtimeAlert[];
  loginAdmin: (email: string, pass: string) => Promise<any>;
  updateJob: (job: Job) => Promise<boolean>;
  deleteJob: (id: string) => Promise<boolean>;
  updateCompany: (comp: Company) => Promise<boolean>;
  updateCandidate: (cand: Candidate) => Promise<boolean>;
  updateApplicationStatus: (appId: string, status: Application['status']) => Promise<boolean>;
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
  settings,
  realtimeAlerts,
  loginAdmin,
  updateJob,
  deleteJob,
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

  // Forms / Actions helpers
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [newBlog, setNewBlog] = useState({ title: '', category: 'Recruitment', summary: '', content: '', author: 'Turenakx Editor' });
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [settingForm, setSettingForm] = useState<SystemSettings>({ ...settings });

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

  // Sync settings local form state when settings prop shifts
  useEffect(() => {
    setSettingForm({ ...settings });
  }, [settings]);

  // Handle Settings write
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateSettings(settingForm);
    if (ok) {
      alert('✓ System Settings saved securely and broadcast to public channels!');
    }
  };

  // Handle Blog creation
  const handleBlogCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content || !newBlog.summary) return;
    const ok = await createBlog(newBlog);
    if (ok) {
      setShowAddBlog(false);
      setNewBlog({ title: '', category: 'Recruitment', summary: '', content: '', author: 'Turenakx Editor' });
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
              Enter rkturenak@gmail.com with your assigned security key.
            </p>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-bold flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                  placeholder="••••••••"
                />
                <Key className="h-4 w-4 text-[#F97316] absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-[#0A2C66] text-white hover:bg-slate-800 transition-all rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-900/10"
            >
              Verify Administrative Clearance
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
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
            <span className="text-[#F97316] uppercase font-black text-[10px] tracking-widest">Live Sourcing Feed (SSE Broadcast):</span>
          </div>

          <div className="flex-1 px-6 overflow-hidden">
            <div className="whitespace-nowrap animate-marquee flex gap-12 text-slate-300">
              {realtimeAlerts.length === 0 ? (
                <span className="italic text-[11px]">Subscribed to /api/realtime-updates. Awaiting corporate writes...</span>
              ) : (
                realtimeAlerts.map((alert) => (
                  <span key={alert.id} className="flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F97316]" />
                    <span>{alert.message}</span>
                    <span className="text-[9px] text-slate-500">({new Date(alert.timestamp).toLocaleTimeString()})</span>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            rkturenak@gmail.com
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
                  className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all ${
                    isActive
                      ? 'text-[#0A2C66] bg-slate-50 border-l-4 border-l-[#F97316]'
                      : 'text-slate-500 hover:text-[#0A2C66] hover:bg-slate-50/40'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#F97316]' : ''}`} />
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
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Realtime Agency Metrics</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Global summary statistics, placement ratios & activity streams</p>
              </div>

              {/* Stats Block */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sourced Mandates</span>
                  <div className="text-2xl font-black text-[#0A2C66]">{jobs.length}</div>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Vetted Candidates</span>
                  <div className="text-2xl font-black text-[#F97316]">{candidates.length}</div>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Corporate Partners</span>
                  <div className="text-2xl font-black text-emerald-600">{companies.length}</div>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Applications Filed</span>
                  <div className="text-2xl font-black text-blue-600">{applications.length}</div>
                </div>
              </div>

              {/* Placement pipeline status ratio representation */}
              <div className="border border-slate-200/60 rounded-xl overflow-hidden shadow-inner bg-[#F8FAFC] p-6 space-y-4">
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Recruitment Pipeline Percentiles</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>SHORTLISTED PROFILE RATIO</span>
                      <span>{Math.round((applications.filter(a => a.status === 'shortlisted').length / (applications.length || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#F97316] h-full" style={{ width: `${(applications.filter(a => a.status === 'shortlisted').length / (applications.length || 1)) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>INTERVIEWS SCHEDULED RATIO</span>
                      <span>{Math.round((applications.filter(a => a.status === 'interview_scheduled').length / (applications.length || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#0A2C66] h-full" style={{ width: `${(applications.filter(a => a.status === 'interview_scheduled').length / (applications.length || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sourcing details list */}
              <div className="space-y-4">
                <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">Historical System Logs</h3>
                <div className="border border-slate-200 rounded-xl p-4 divide-y divide-slate-100 text-xs font-semibold text-slate-500 max-h-60 overflow-y-auto">
                  {realtimeAlerts.map(alert => (
                    <div key={alert.id} className="py-3 flex justify-between items-center">
                      <span>{alert.message}</span>
                      <span className="text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                  {realtimeAlerts.length === 0 && (
                    <div className="py-6 text-center text-slate-400">Awaiting write updates...</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANAGE SOURCING JOBS */}
          {activeTab === 'jobs' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Manage Sourcing Jobs</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Full CRUD controls: publish, archive, or feature active corporate vacancies</p>
              </div>

              {editingJob ? (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const ok = await updateJob(editingJob);
                  if (ok) setEditingJob(null);
                }} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-800 text-sm">Edit Job Mandate</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editingJob.title}
                      onChange={e => setEditingJob({ ...editingJob, title: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-xs"
                      placeholder="Job Title"
                    />
                    <select
                      value={editingJob.status}
                      onChange={e => setEditingJob({ ...editingJob, status: e.target.value as any })}
                      className="px-3 py-2 border rounded-lg text-xs bg-white text-slate-700 font-semibold"
                    >
                      <option value="active">Active</option>
                      <option value="featured">Featured</option>
                      <option value="closed">Closed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-[#0A2C66] text-white rounded text-xs font-bold uppercase">Save Updates</button>
                    <button type="button" onClick={() => setEditingJob(null)} className="px-4 py-2 border rounded text-xs font-bold uppercase">Cancel</button>
                  </div>
                </form>
              ) : null}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-500 font-semibold">
                  <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Corporate</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.map(job => (
                      <tr key={job.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-[#0A2C66]">{job.title}</td>
                        <td className="py-3 px-4">{job.companyName}</td>
                        <td className="py-3 px-4">{job.type}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            job.status === 'featured' ? 'bg-orange-50 text-[#F97316]' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button onClick={() => setEditingJob(job)} className="text-[#0A2C66] hover:underline font-bold">Edit</button>
                          <button onClick={() => deleteJob(job.id)} className="text-red-500 hover:underline font-bold">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CANDIDATES */}
          {activeTab === 'candidates' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Review Candidates</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Academic backgrounds, verified skills & background status tracker</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-500 font-semibold">
                  <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Vetting Status</th>
                      <th className="py-3 px-4">Skills</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidates.map(cand => (
                      <tr key={cand.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-800">{cand.name}</td>
                        <td className="py-3 px-4">{cand.email}</td>
                        <td className="py-3 px-4">
                          <select
                            value={cand.backgroundVerified ? 'Verified' : 'Pending'}
                            onChange={async (e) => {
                              const updated: Candidate = { ...cand, backgroundVerified: e.target.value === 'Verified' };
                              await updateCandidate(updated);
                            }}
                            className="px-2.5 py-1 border text-[10px] rounded bg-white font-bold"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Verified">Verified</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 max-w-[200px] truncate">{cand.skills.join(', ')}</td>
                        <td className="py-3 px-4 text-right font-bold">
                          <button onClick={() => alert(`Reviewing plain text resume summary for ${cand.name}:\n\n${cand.skills.join(', ')}`)} className="text-[#0A2C66] hover:underline">View Bio</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: COMPANIES */}
          {activeTab === 'companies' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Corporate Partners</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Review active corporate partnerships & contract credentials</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companies.map(comp => (
                  <div key={comp.id} className="p-5 border border-slate-200 rounded-xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[#0A2C66] text-base">{comp.name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{comp.industry}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded ${
                        comp.isFeatured ? 'bg-orange-50 text-[#F97316]' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {comp.isFeatured ? 'Featured Client' : 'Standard Client'}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {comp.description}
                    </p>

                    <div className="flex justify-between items-center border-t border-slate-50 pt-3 text-xs font-semibold">
                      <span className="text-slate-400">{comp.location}</span>
                      <button
                        onClick={async () => {
                          const updated: Company = { ...comp, isFeatured: !comp.isFeatured };
                          await updateCompany(updated);
                        }}
                        className="text-[#F97316] hover:underline font-bold text-[11px] uppercase tracking-wide"
                      >
                        Toggle Featured
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: APPLICANT MANDATES */}
          {activeTab === 'applications' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Applicant Sourcing Mandates</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Review applicant profiles, pipeline stages, and Gemini fit percentages</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-500 font-semibold">
                  <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Job Requirement</th>
                      <th className="py-3 px-4">Fit Score</th>
                      <th className="py-3 px-4">Pipeline Stage</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-800">{app.candidateName}</td>
                        <td className="py-3 px-4">{app.jobTitle}</td>
                        <td className="py-3 px-4">
                          {app.resumeScore ? (
                            <span className="font-extrabold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded">
                              {app.resumeScore}% Match
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            app.status === 'interview_scheduled' ? 'bg-blue-50 text-blue-700' :
                            app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700' :
                            app.status === 'rejected' ? 'bg-red-50 text-red-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 font-bold">
                          <button onClick={() => updateApplicationStatus(app.id, 'shortlisted')} className="text-emerald-600 hover:underline">Shortlist</button>
                          <button onClick={() => updateApplicationStatus(app.id, 'rejected')} className="text-red-500 hover:underline">Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CMS BLOGS EDITOR */}
          {activeTab === 'blogs' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">CMS Blogs & FAQs Editor</h2>
                  <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Publish editorial blogs, prepare FAQ materials & manage testimonials</p>
                </div>
                <button
                  onClick={() => setShowAddBlog(!showAddBlog)}
                  className="px-4 py-2 bg-[#0A2C66] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  {showAddBlog ? 'Close Editor' : 'New CMS Blog'}
                </button>
              </div>

              {showAddBlog && (
                <form onSubmit={handleBlogCreateSubmit} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-[#0A2C66] text-sm uppercase">Draft Sourced Article</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Title of Article"
                      value={newBlog.title}
                      onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-xs"
                    />
                    <select
                      value={newBlog.category}
                      onChange={e => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-xs bg-white text-slate-700 font-semibold"
                    >
                      <option value="Recruitment">Recruitment</option>
                      <option value="Resume Preparation">Resume Preparation</option>
                      <option value="Hiring Trends">Hiring Trends</option>
                      <option value="Career Sourcing Advice">Career Sourcing Advice</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Short summary excerpt"
                    value={newBlog.summary}
                    onChange={e => setNewBlog({ ...newBlog, summary: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                  <textarea
                    required
                    placeholder="Complete body paragraphs of article..."
                    rows={5}
                    value={newBlog.content}
                    onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs resize-none"
                  />
                  <button type="submit" className="px-5 py-2.5 bg-[#F97316] text-white font-bold text-xs uppercase tracking-wider rounded">
                    Publish Editorial Block
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {blogs.map(post => (
                  <div key={post.id} className="p-4 border rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-[#0A2C66]">{post.title}</h4>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{post.category} • By {post.author} • {post.date}</div>
                    </div>
                    <button onClick={() => deleteBlog(post.id)} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded">
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Review Contact Messages</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Review contact inquiries, client registrations, or candidate help requests</p>
              </div>

              <div className="space-y-4">
                {contactMessages.length === 0 ? (
                  <div className="p-12 border border-dashed rounded-xl text-center text-xs font-semibold text-slate-400 uppercase">
                    No active contact inquiries received.
                  </div>
                ) : (
                  contactMessages.map(msg => (
                    <div key={msg.id} className="p-5 border border-slate-200 rounded-xl space-y-4 text-xs font-medium text-slate-600">
                      <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{msg.subject}</h3>
                          <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">By {msg.name} • {msg.email} • {msg.phone || 'No phone'}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={msg.status}
                            onChange={async (e) => await updateMessageStatus(msg.id, e.target.value as any)}
                            className="px-2.5 py-1 border text-[10px] rounded bg-white font-bold"
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="contacted">Contacted</option>
                            <option value="archived">Archived</option>
                          </select>

                          <button onClick={() => deleteMessage(msg.id)} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border font-medium">
                        "{msg.message}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: AGENCY SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Agency System Settings</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Modify phone lines, headquarters address, email destinations, and live WhatsApp numbers</p>
              </div>

              <form onSubmit={handleSettingsSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Principal Phone *</label>
                    <input
                      type="text"
                      required
                      value={settingForm.phone}
                      onChange={e => setSettingForm({ ...settingForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={settingForm.companyEmail}
                      onChange={e => setSettingForm({ ...settingForm, companyEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">WhatsApp Live Chat Number *</label>
                    <input
                      type="text"
                      required
                      value={settingForm.whatsapp}
                      onChange={e => setSettingForm({ ...settingForm, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Google Maps Embed URL *</label>
                    <input
                      type="text"
                      required
                      value={settingForm.mapUrl}
                      onChange={e => setSettingForm({ ...settingForm, mapUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Office Headquarters Address *</label>
                  <textarea
                    required
                    rows={3}
                    value={settingForm.address}
                    onChange={e => setSettingForm({ ...settingForm, address: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white resize-none text-slate-700 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-[#F97316] text-white hover:bg-orange-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Write & Save System Settings
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
