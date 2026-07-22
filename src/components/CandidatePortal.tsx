import React, { useState } from 'react';
import { 
  User, Briefcase, FileText, Bookmark, Calendar, Bell, Settings, Award, 
  ChevronRight, ArrowUpRight, CheckCircle2, ShieldAlert, Cpu, Video, Plus, Trash2, Download 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Candidate, Application, Job, UserSession } from '../types';
import Logo from './Logo';

interface CandidatePortalProps {
  user: UserSession | null;
  jobs: Job[];
  applications: Application[];
  candidate: Candidate | null;
  loginUser: (email: string, pass: string, role: 'candidate' | 'employer') => Promise<any>;
  registerUser: (email: string, pass: string, role: 'candidate' | 'employer', name: string) => Promise<any>;
  updateCandidateProfile: (cand: Candidate) => Promise<boolean>;
  setRoute: (route: string) => void;
}

export default function CandidatePortal({
  user,
  jobs,
  applications,
  candidate,
  loginUser,
  registerUser,
  updateCandidateProfile,
  setRoute,
}: CandidatePortalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Active Tab inside Dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'builder' | 'saved' | 'interviews' | 'settings'>('overview');

  // Resume Builder States
  const [builderForm, setBuilderForm] = useState<any>({
    skills: candidate?.skills || [],
    experience: candidate?.experience || [],
    education: candidate?.education || [],
    certificates: candidate?.certificates || []
  });

  // Builder Item inputs
  const [newSkill, setNewSkill] = useState('');
  const [expInput, setExpInput] = useState({ title: '', company: '', duration: '', description: '' });
  const [eduInput, setEduInput] = useState({ degree: '', school: '', year: '' });
  const [certInput, setCertInput] = useState('');

  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Filter applications for current user
  const userApps = applications.filter(app => app.candidateEmail.toLowerCase() === user?.email.toLowerCase());
  const savedJobsList = jobs.filter(job => candidate?.savedJobs.includes(job.id));

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isLogin) {
      const res = await loginUser(email, password, 'candidate');
      if (!res.success) {
        setErrorMsg(res.message || 'Login failed.');
      } else {
        setSuccessMsg('Successfully logged in! Accessing Candidate Dashboard...');
      }
    } else {
      if (!name) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      const res = await registerUser(email, password, 'candidate', name);
      if (!res.success) {
        setErrorMsg(res.message || 'Registration failed.');
      } else {
        setSuccessMsg('Successfully registered! Logging in...');
        setTimeout(() => setIsLogin(true), 1500);
      }
    }
  };

  // Helper additions for Resume Builder
  const addSkill = () => {
    if (newSkill.trim() && !builderForm.skills.includes(newSkill.trim())) {
      setBuilderForm({ ...builderForm, skills: [...builderForm.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (s: string) => {
    setBuilderForm({ ...builderForm, skills: builderForm.skills.filter((sk: string) => sk !== s) });
  };

  const addExp = () => {
    if (expInput.title && expInput.company && expInput.duration) {
      setBuilderForm({ ...builderForm, experience: [...builderForm.experience, expInput] });
      setExpInput({ title: '', company: '', duration: '', description: '' });
    }
  };

  const removeExp = (idx: number) => {
    setBuilderForm({ ...builderForm, experience: builderForm.experience.filter((_: any, i: number) => i !== idx) });
  };

  const addEdu = () => {
    if (eduInput.degree && eduInput.school && eduInput.year) {
      setBuilderForm({ ...builderForm, education: [...builderForm.education, eduInput] });
      setEduInput({ degree: '', school: '', year: '' });
    }
  };

  const removeEdu = (idx: number) => {
    setBuilderForm({ ...builderForm, education: builderForm.education.filter((_: any, i: number) => i !== idx) });
  };

  const addCert = () => {
    if (certInput.trim() && !builderForm.certificates.includes(certInput.trim())) {
      setBuilderForm({ ...builderForm, certificates: [...builderForm.certificates, certInput.trim()] });
      setCertInput('');
    }
  };

  const removeCert = (c: string) => {
    setBuilderForm({ ...builderForm, certificates: builderForm.certificates.filter((ct: string) => ct !== c) });
  };

  const saveCandidateProfile = async () => {
    if (!candidate) return;
    setIsProfileSaving(true);
    const updated: Candidate = {
      ...candidate,
      skills: builderForm.skills,
      experience: builderForm.experience,
      education: builderForm.education,
      certificates: builderForm.certificates
    };
    const ok = await updateCandidateProfile(updated);
    setIsProfileSaving(false);
    if (ok) {
      alert('✓ Professional Resume & Sourcing Profile updated successfully!');
    }
  };

  const downloadMockResumePDF = () => {
    // Generates simple professional plain text representation to simulate a PDF download
    const docText = `
=========================================
  TURENAKX STAFFING VETTED RESUME
=========================================
NAME: ${candidate?.name || user?.name}
EMAIL: ${candidate?.email || user?.email}
PHONE: ${candidate?.phone || '+91 8147354351'}

CORE TECH SKILLS:
${builderForm.skills.join(', ')}

WORK HISTORY:
${builderForm.experience.map((exp: any) => `- ${exp.title} at ${exp.company} (${exp.duration})\n  ${exp.description}`).join('\n\n')}

ACADEMIC HISTORY:
${builderForm.education.map((edu: any) => `- ${edu.degree} from ${edu.school} (${edu.year})`).join('\n')}

CERTIFICATIONS:
${builderForm.certificates.join(', ')}
=========================================
`;
    const blob = new Blob([docText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(candidate?.name || 'Resume').replace(/\s+/g, '_')}_Turenakx_Resume.txt`;
    a.click();
  };

  // 1. AUTH LOGIN/REGISTER SCREEN
  if (!user) {
    return (
      <div className="font-sans text-slate-800 bg-[#F8FAFC] min-h-[80vh] flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 w-full max-w-md p-8 rounded-2xl shadow-xl space-y-6 text-left"
        >
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <Logo variant="full" />
            </div>
            <span className="text-[#F97316] text-[10px] font-bold uppercase tracking-widest bg-orange-50 px-3 py-1 rounded">
              Candidate Portal Access
            </span>
            <h2 className="text-2xl font-black text-[#0A2C66] tracking-tight">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-xs font-semibold">
              {isLogin ? 'Access your applications, scheduled interviews & AI resume builder.' : 'Join Turenakx and submit your profile to India’s top employers.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
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

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                  placeholder="e.g. Aditya Sharma"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                placeholder="aditya.sharma@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3.5 bg-[#0A2C66] text-white hover:bg-slate-800 transition-all rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              {isLogin ? 'Authenticate Access' : 'Create Candidate Account'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-[#F97316] hover:underline font-bold"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already registered? Sign In'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. CANDIDATE PORTAL DASHBOARD (AUTHENTICATED)
  return (
    <div className="font-sans text-slate-800 bg-[#F8FAFC] min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Sidebar Controls */}
      <div className="lg:col-span-3 space-y-6 text-left">
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-4 shadow-sm">
          <div className="h-14 w-14 bg-[#0A2C66]/5 rounded-full mx-auto flex items-center justify-center">
            <User className="h-6 w-6 text-[#0A2C66]" />
          </div>
          <div>
            <h3 className="text-slate-800 font-bold text-base">{user.name}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.email}</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-center gap-4">
            <div className="text-center">
              <div className="text-lg font-black text-[#0A2C66]">{userApps.length}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Applied</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-100"></div>
            <div className="text-center">
              <div className="text-lg font-black text-[#F97316]">{savedJobsList.length}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Saved</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1">
          {[
            { id: 'overview', name: 'Dashboard Overview', icon: User },
            { id: 'applications', name: 'My Applications', icon: Briefcase },
            { id: 'builder', name: 'Resume Builder', icon: FileText },
            { id: 'saved', name: 'Saved Sourcing Jobs', icon: Bookmark },
            { id: 'interviews', name: 'Interview Schedules', icon: Calendar }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all ${
                  isActive
                    ? 'text-[#0A2C66] bg-slate-50'
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

      {/* Main Dashboard Content Panel */}
      <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-8 text-left shadow-sm min-h-[60vh]">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Candidate Overview</h2>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Status, alerts & immediate placement items</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sourced Mandates Applied</span>
                <div className="text-2xl font-black text-[#0A2C66]">{userApps.length}</div>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bookmarks</span>
                <div className="text-2xl font-black text-[#F97316]">{savedJobsList.length}</div>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Upcoming Interviews</span>
                <div className="text-2xl font-black text-emerald-600">
                  {userApps.filter(a => a.status === 'interview_scheduled').length}
                </div>
              </div>
            </div>

            {/* Resume strength audit banner */}
            <div className="p-5 bg-orange-50 border border-orange-100/50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-3">
                <Cpu className="h-6 w-6 text-[#F97316] mt-1" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Automate Your Profile Discoverability</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-lg mt-0.5">
                    Utilize our Resume Builder tab to structure your core skills, employment histories, and certificates. Our corporate matching algorithm parses this to trigger direct auto-sourcing alerts for clients.
                  </p>
                </div>
              </div>
              <button onClick={() => setActiveTab('builder')} className="px-4 py-2 bg-[#0A2C66] text-white hover:bg-slate-800 transition-all text-xs font-bold uppercase tracking-wide rounded-lg whitespace-nowrap">
                Open Builder
              </button>
            </div>

            {/* Recent Application stages */}
            <div className="space-y-4">
              <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">Active Sourcing Applications</h3>
              {userApps.length === 0 ? (
                <div className="p-6 border border-dashed border-slate-200 rounded-lg text-center text-xs font-semibold text-slate-400 uppercase">
                  No sourcing applications tracked yet. Settle on a job mandate in the "Jobs" tab.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {userApps.slice(0, 3).map((app) => (
                    <div key={app.id} className="py-4 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-[#0A2C66] hover:underline cursor-pointer" onClick={() => setRoute('jobs')}>{app.jobTitle}</div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase ${
                          app.status === 'interview_scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          app.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                          'bg-slate-100 text-slate-600 border'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MY APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Active Job Applications</h2>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Full pipelines and historical interview details</p>
            </div>

            {userApps.length === 0 ? (
              <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center space-y-3">
                <Briefcase className="h-8 w-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-400 uppercase">No job applications submitted</div>
              </div>
            ) : (
              <div className="space-y-6">
                {userApps.map((app) => (
                  <div key={app.id} className="p-6 border border-slate-200 rounded-xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-3">
                      <div>
                        <h3 className="text-[#0A2C66] font-black text-sm">{app.jobTitle}</h3>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Applied via Turenakx Desk • {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>

                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                        app.status === 'interview_scheduled' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* AI score rating representation */}
                    {app.resumeScore && (
                      <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                        <Cpu className="h-4 w-4 text-[#F97316]" />
                        <div className="text-xs text-slate-500 leading-relaxed font-semibold">
                          Your profile achieved a <span className="text-[#0A2C66] font-extrabold">{app.resumeScore}% AI Fit Score</span> against this job requirement.
                        </div>
                      </div>
                    )}

                    {/* Stage status messages */}
                    {app.status === 'interview_scheduled' && app.interviewDate && (
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider">
                          <Video className="h-4 w-4 text-[#F97316]" />
                          Scheduled Video Sourcing Loop
                        </div>
                        <p className="text-slate-600 text-xs font-medium">
                          Date: <span className="font-extrabold text-[#0A2C66]">{app.interviewDate}</span> at <span className="font-extrabold text-[#0A2C66]">{app.interviewTime}</span> (IST)
                        </p>
                        {app.interviewLink && (
                          <a href={app.interviewLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#F97316] font-bold uppercase hover:underline">
                            Open Sourcing Meet Link
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Stage notes */}
                    {app.notes && (
                      <div className="text-xs text-slate-500 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                        <span className="font-bold text-slate-700 block uppercase text-[9px] tracking-widest mb-1">Recruiter Desk Notes:</span>
                        "{app.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESUME BUILDER TAB */}
        {activeTab === 'builder' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Structured Resume Builder</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Manage skills, experience timelines, and certificate lists</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={downloadMockResumePDF}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </button>
                <button
                  onClick={saveCandidateProfile}
                  disabled={isProfileSaving}
                  className="px-4 py-2 bg-[#F97316] hover:bg-orange-600 text-white rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow"
                >
                  {isProfileSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>

            {/* Skills Sourcing Section */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider">Core Professional Skills</h3>
              <div className="flex gap-3 max-w-md">
                <input
                  type="text"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="e.g. React, Node.js, Nursing License"
                  className="px-3.5 py-2 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold outline-none bg-slate-50 w-full"
                />
                <button onClick={addSkill} className="px-4 py-2 bg-[#0A2C66] hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {builderForm.skills.length === 0 ? (
                  <span className="text-xs text-slate-400 font-semibold italic">No skills cataloged yet.</span>
                ) : (
                  builderForm.skills.map((s: string) => (
                    <span key={s} className="px-2.5 py-1 bg-[#0A2C66]/5 border text-slate-800 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                      {s}
                      <button onClick={() => removeSkill(s)} className="text-red-500 hover:text-red-700">✕</button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Work History section */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider">Employment & Work Histories</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <input
                  type="text"
                  placeholder="Job Title (e.g. Senior Architect)"
                  value={expInput.title}
                  onChange={e => setExpInput({ ...expInput, title: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none bg-white"
                />
                <input
                  type="text"
                  placeholder="Company Name (e.g. Intel)"
                  value={expInput.company}
                  onChange={e => setExpInput({ ...expInput, company: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none bg-white"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 2024 - Present)"
                  value={expInput.duration}
                  onChange={e => setExpInput({ ...expInput, duration: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none bg-white"
                />
                <textarea
                  placeholder="Details of achievements and tech tools owned..."
                  value={expInput.description}
                  rows={2}
                  onChange={e => setExpInput({ ...expInput, description: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none bg-white sm:col-span-3 resize-none"
                />
                <button type="button" onClick={addExp} className="px-4 py-2 bg-[#0A2C66] text-white rounded-lg text-xs font-bold sm:col-span-3 flex justify-center items-center gap-1">
                  <Plus className="h-4 w-4" /> Record Employment Block
                </button>
              </div>

              <div className="space-y-4">
                {builderForm.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="p-4 border border-slate-100 rounded-xl flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-[#0A2C66] text-sm">{exp.title}</h4>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{exp.company} • {exp.duration}</div>
                      <p className="text-slate-500 text-xs leading-relaxed mt-1">{exp.description}</p>
                    </div>
                    <button onClick={() => removeExp(idx)} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic History section */}
            <div className="space-y-4">
              <h3 className="text-slate-800 font-bold text-sm uppercase tracking-wider">Academic History</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <input
                  type="text"
                  placeholder="Degree (e.g. B.Tech Computer Science)"
                  value={eduInput.degree}
                  onChange={e => setEduInput({ ...eduInput, degree: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none bg-white"
                />
                <input
                  type="text"
                  placeholder="Institution Name (e.g. VIT University)"
                  value={eduInput.school}
                  onChange={e => setEduInput({ ...eduInput, school: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none bg-white"
                />
                <input
                  type="text"
                  placeholder="Completion Year (e.g. 2021)"
                  value={eduInput.year}
                  onChange={e => setEduInput({ ...eduInput, year: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold outline-none bg-white"
                />
                <button type="button" onClick={addEdu} className="px-4 py-2 bg-[#0A2C66] text-white rounded-lg text-xs font-bold sm:col-span-3 flex justify-center items-center gap-1">
                  <Plus className="h-4 w-4" /> Record Academic Block
                </button>
              </div>

              <div className="space-y-4">
                {builderForm.education.map((edu: any, idx: number) => (
                  <div key={idx} className="p-4 border border-slate-100 rounded-xl flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-[#0A2C66] text-sm">{edu.degree}</h4>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{edu.school} • {edu.year}</div>
                    </div>
                    <button onClick={() => removeEdu(idx)} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SAVED JOBS TAB */}
        {activeTab === 'saved' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Saved Sourcing Jobs</h2>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Bookmarked mandates saved for active application</p>
            </div>

            {savedJobsList.length === 0 ? (
              <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center space-y-3">
                <Bookmark className="h-8 w-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-400 uppercase">No jobs bookmarked yet</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedJobsList.map((job) => (
                  <div key={job.id} className="p-5 border border-slate-200 rounded-xl space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#F97316] bg-orange-50 px-2.5 py-1 rounded uppercase tracking-wider inline-block">{job.type}</span>
                      <h3 className="font-bold text-slate-800 text-sm mt-2">{job.title}</h3>
                      <p className="text-slate-400 text-[10px] font-bold uppercase mt-0.5">{job.companyName} • {job.location}</p>
                    </div>
                    <button
                      onClick={() => setRoute('jobs')}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 rounded text-xs font-bold text-[#0A2C66] uppercase border text-center transition-all"
                    >
                      View Details & Apply
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INTERVIEW TAB */}
        {activeTab === 'interviews' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Interview Schedules</h2>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Sourcing interview loops calendar</p>
            </div>

            {userApps.filter(a => a.status === 'interview_scheduled').length === 0 ? (
              <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center space-y-3">
                <Calendar className="h-8 w-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-400 uppercase">No upcoming interview loops found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {userApps.filter(a => a.status === 'interview_scheduled').map((app) => (
                  <div key={app.id} className="p-6 border border-slate-200 rounded-xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{app.jobTitle}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{app.jobTitle} Sourcing Round</p>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-extrabold uppercase">ACTIVE LOOP</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Date</span>
                        <div className="text-slate-800 font-bold">{app.interviewDate}</div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Time (IST)</span>
                        <div className="text-slate-800 font-bold">{app.interviewTime}</div>
                      </div>
                    </div>

                    {app.interviewLink && (
                      <div className="pt-2">
                        <a
                          href={app.interviewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#0A2C66] text-white hover:bg-slate-800 transition-all rounded text-xs font-bold uppercase tracking-wider flex items-center w-fit gap-1.5"
                        >
                          <Video className="h-4 w-4 text-[#F97316]" />
                          Launch Video Call
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
