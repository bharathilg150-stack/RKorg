import React, { useState } from 'react';
import { 
  Building, Briefcase, Users, PlusCircle, Calendar, MessageSquare, ShieldAlert, CheckCircle2, 
  ChevronRight, Cpu, Plus, Trash2, Video, Search, ArrowUpRight, Clock, IndianRupee 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Company, Job, Application, UserSession } from '../types';

interface EmployerPortalProps {
  user: UserSession | null;
  jobs: Job[];
  applications: Application[];
  company: Company | null;
  loginUser: (email: string, pass: string, role: 'candidate' | 'employer') => Promise<any>;
  registerUser: (email: string, pass: string, role: 'candidate' | 'employer', name: string) => Promise<any>;
  createJob: (job: Omit<Job, 'id' | 'companyId' | 'companyName' | 'status' | 'created_at'>) => Promise<boolean>;
  updateApplicationStatus: (appId: string, status: Application['status'], interviewDetails?: { date: string; time: string; link: string; notes?: string }) => Promise<boolean>;
  setRoute: (route: string) => void;
}

export default function EmployerPortal({
  user,
  jobs,
  applications,
  company,
  loginUser,
  registerUser,
  createJob,
  updateApplicationStatus,
  setRoute,
}: EmployerPortalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tab state inside dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applicants' | 'post-job'>('overview');

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    type: 'Full Time',
    location: 'Bangalore',
    salary: '₹12,00,000 - ₹18,00,000 L.P.A',
    experience: '3 - 5 Years',
    description: '',
    industry: 'IT & Software',
    requirementsRaw: '',
    skillsRaw: '',
  });

  // Scheduling Modal State
  const [activeSchedulingApp, setActiveSchedulingApp] = useState<Application | null>(null);
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', link: '', notes: '' });

  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Filter jobs for this specific logged-in employer
  // Match by companyId or companyName
  const employerJobs = jobs.filter(j => j.companyName.toLowerCase() === company?.name.toLowerCase() || j.companyId === company?.id);
  const employerJobIds = employerJobs.map(j => j.id);

  // Filter applications for jobs posted by this employer
  const employerApps = applications.filter(app => employerJobIds.includes(app.jobId));

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isLogin) {
      const res = await loginUser(email, password, 'employer');
      if (!res.success) {
        setErrorMsg(res.message || 'Login failed.');
      } else {
        setSuccessMsg('Authenticating corporate credentials...');
      }
    } else {
      if (!companyName) {
        setErrorMsg('Please supply your Company / Corporate Name.');
        return;
      }
      const res = await registerUser(email, password, 'employer', companyName);
      if (!res.success) {
        setErrorMsg(res.message || 'Registration failed.');
      } else {
        setSuccessMsg('Corporate account registered! Logging in...');
        setTimeout(() => setIsLogin(true), 1500);
      }
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.description || !newJob.requirementsRaw) return;

    setIsPosting(true);
    
    // Split raw comma-separated inputs
    const requirements = newJob.requirementsRaw.split('\n').map(r => r.trim()).filter(Boolean);
    const skills = newJob.skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      title: newJob.title,
      type: newJob.type,
      location: newJob.location,
      salary: newJob.salary,
      experience: newJob.experience,
      description: newJob.description,
      industry: newJob.industry,
      requirements,
      skills: skills.length > 0 ? skills : ['Sourcing', 'Talent'],
    };

    const ok = await createJob(payload);
    setIsPosting(false);
    if (ok) {
      setPostSuccess(true);
      setNewJob({
        title: '',
        type: 'Full Time',
        location: 'Bangalore',
        salary: '₹12,00,000 - ₹18,00,000 L.P.A',
        experience: '3 - 5 Years',
        description: '',
        industry: 'IT & Software',
        requirementsRaw: '',
        skillsRaw: '',
      });
      setTimeout(() => {
        setPostSuccess(false);
        setActiveTab('jobs');
      }, 3000);
    }
  };

  // Schedule Interview action
  const triggerScheduleModal = (app: Application) => {
    setActiveSchedulingApp(app);
    setScheduleForm({
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
      time: '11:00 AM',
      link: 'https://meet.google.com/pqp-gndg-kpq',
      notes: 'Initial Sourcing Evaluation round with Principal Lead.'
    });
  };

  const submitSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSchedulingApp) return;

    const ok = await updateApplicationStatus(activeSchedulingApp.id, 'interview_scheduled', {
      date: scheduleForm.date,
      time: scheduleForm.time,
      link: scheduleForm.link,
      notes: scheduleForm.notes
    });

    if (ok) {
      setActiveSchedulingApp(null);
    }
  };

  // 1. GUEST AUTH SCREEN
  if (!user) {
    return (
      <div className="font-sans text-slate-800 bg-[#F8FAFC] min-h-[80vh] flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 w-full max-w-md p-8 rounded-2xl shadow-xl space-y-6 text-left"
        >
          <div className="text-center space-y-2">
            <span className="text-[#F97316] text-[10px] font-bold uppercase tracking-widest bg-orange-50 px-3 py-1 rounded">
              Employer Corporate Portal
            </span>
            <h2 className="text-2xl font-black text-[#0A2C66] tracking-tight">
              {isLogin ? 'Corporate Sign In' : 'Register Enterprise'}
            </h2>
            <p className="text-slate-400 text-xs font-semibold">
              {isLogin ? 'Manage your hiring mandates, pre-screen candidates & review resume scores.' : 'Submit your business details to connect with Bengaluru’s finest.'}
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                  placeholder="e.g. Intel Corp Bangalore"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Corporate Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                placeholder="hr@intelcorp.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Security Key *</label>
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
              {isLogin ? 'Authenticate Sourcing Access' : 'Create Enterprise Account'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-[#F97316] hover:underline font-bold"
            >
              {isLogin ? "No corporate account? Register Enterprise" : 'Registered partner? Sign In'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. CORPORATE DASHBOARD (AUTHENTICATED)
  return (
    <div className="font-sans text-slate-800 bg-[#F8FAFC] min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Sidebar Controls */}
      <div className="lg:col-span-3 space-y-6 text-left">
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-4 shadow-sm">
          <div className="h-14 w-14 bg-[#F97316]/5 rounded-full mx-auto flex items-center justify-center">
            <Building className="h-6 w-6 text-[#F97316]" />
          </div>
          <div>
            <h3 className="text-slate-800 font-bold text-base">{company?.name || user.name}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.email}</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-center gap-4">
            <div className="text-center">
              <div className="text-lg font-black text-[#0A2C66]">{employerJobs.length}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Active Jobs</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-100"></div>
            <div className="text-center">
              <div className="text-lg font-black text-[#F97316]">{employerApps.length}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Applicants</div>
            </div>
          </div>
        </div>

        {/* Tab Links */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1">
          {[
            { id: 'overview', name: 'Dashboard Overview', icon: Building },
            { id: 'jobs', name: 'My Active Mandates', icon: Briefcase },
            { id: 'applicants', name: 'Candidate Pipeline', icon: Users },
            { id: 'post-job', name: 'Post Sourcing Mandate', icon: PlusCircle }
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

      {/* Main Panel Content */}
      <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-8 text-left shadow-sm min-h-[60vh]">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Corporate Sourcing Hub</h2>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Pre-screen metrics and instant talent feeds</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hiring Openings</span>
                <div className="text-2xl font-black text-[#0A2C66]">{employerJobs.length}</div>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Candidate Applications</span>
                <div className="text-2xl font-black text-[#F97316]">{employerApps.length}</div>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Shortlisted Candidates</span>
                <div className="text-2xl font-black text-emerald-600">
                  {employerApps.filter(a => a.status === 'shortlisted').length}
                </div>
              </div>
            </div>

            {/* Partner alert banner */}
            <div className="p-5 bg-blue-50 border border-blue-100/50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-3">
                <Cpu className="h-6 w-6 text-[#0A2C66] mt-1" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Automated Sourcing & Vetting Live</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-lg mt-0.5">
                    Your candidate applications are pre-vetted using server-side Gemini AI models. Look for the "AI Fit Score" badge to prioritize high-matching technical or clinical professionals.
                  </p>
                </div>
              </div>
              <button onClick={() => setActiveTab('applicants')} className="px-4 py-2 bg-[#F97316] text-white hover:bg-orange-600 transition-all text-xs font-bold uppercase tracking-wide rounded-lg whitespace-nowrap">
                Review Pipeline
              </button>
            </div>

            {/* Recents */}
            <div className="space-y-4">
              <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">Recent Sourcing Candidates</h3>
              {employerApps.length === 0 ? (
                <div className="p-6 border border-dashed border-slate-200 rounded-lg text-center text-xs font-semibold text-slate-400 uppercase">
                  No applicant profiles received yet. Post a mandate to trigger active applications.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {employerApps.slice(0, 3).map((app) => (
                    <div key={app.id} className="py-4 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-[#0A2C66]">{app.candidateName}</div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase">Applied for: {app.jobTitle}</div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {app.resumeScore && (
                          <span className="text-[10px] font-extrabold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded">
                            {app.resumeScore}% Fit
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">{new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MY ACTIVE MANDATES TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Active Sourcing Mandates</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Sourcing pipelines hosted on Turenakx public boards</p>
              </div>
              <button onClick={() => setActiveTab('post-job')} className="px-4 py-2 bg-[#0A2C66] text-white text-xs font-bold uppercase tracking-wider rounded-lg">
                + New Mandate
              </button>
            </div>

            {employerJobs.length === 0 ? (
              <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center space-y-3">
                <Briefcase className="h-8 w-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-400 uppercase">No active job openings cataloged</div>
              </div>
            ) : (
              <div className="space-y-4">
                {employerJobs.map((job) => (
                  <div key={job.id} className="p-5 border border-slate-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-[#F97316] bg-orange-50 px-2.5 py-1 rounded uppercase tracking-wider inline-block">{job.type}</span>
                      <h3 className="font-bold text-slate-800 text-sm mt-1.5">{job.title}</h3>
                      <div className="flex gap-3 text-[10px] text-slate-400 font-bold uppercase mt-1">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.salary}</span>
                        <span>•</span>
                        <span>{job.experience}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('applicants');
                      }}
                      className="px-4 py-2 border text-[#0A2C66] hover:bg-slate-50 transition-all rounded text-xs font-bold uppercase tracking-wide whitespace-nowrap"
                    >
                      View Applicants
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CANDIDATE PIPELINE PIPELINE TAB */}
        {activeTab === 'applicants' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Sourcing Pipeline</h2>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Review pre-vetted resumes, AI score fit percentiles & manage interview rounds</p>
            </div>

            {employerApps.length === 0 ? (
              <div className="p-12 border border-dashed border-slate-200 rounded-xl text-center space-y-3">
                <Users className="h-8 w-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-400 uppercase">No candidate profiles received yet</div>
              </div>
            ) : (
              <div className="space-y-6">
                {employerApps
                  .sort((a, b) => (b.resumeScore || 0) - (a.resumeScore || 0)) // highest AI score first
                  .map((app) => (
                    <div key={app.id} className="p-6 border border-slate-200 rounded-xl space-y-4">
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-slate-800 text-sm">{app.candidateName}</h3>
                            {app.resumeScore && (
                              <span className="px-2 py-0.5 bg-orange-50 text-[#F97316] rounded font-extrabold text-[10px]">
                                {app.resumeScore}% Match
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Applied for: {app.jobTitle} • {app.candidateEmail} • {app.candidatePhone}</p>
                        </div>

                        {/* Pipeline Stage buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'shortlisted')}
                            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                              app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Shortlist
                          </button>
                          
                          <button
                            onClick={() => triggerScheduleModal(app)}
                            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                              app.status === 'interview_scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Schedule Call
                          </button>

                          <button
                            onClick={() => updateApplicationStatus(app.id, 'rejected')}
                            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                              app.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </div>

                      {/* AI parsed Strengths and Recommendations block */}
                      {app.resumeAnalysis && (
                        <div className="bg-[#F8FAFC] border border-slate-200/60 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
                          <div>
                            <span className="text-[9px] text-[#0A2C66] font-bold uppercase tracking-wider block mb-1">Key Match Strengths:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-500">
                              {app.resumeAnalysis.strengths?.slice(0, 3).map((str, i) => <li key={i}>{str}</li>) || <li>Strong functional alignment.</li>}
                            </ul>
                          </div>
                          <div>
                            <span className="text-[9px] text-[#F97316] font-bold uppercase tracking-wider block mb-1">Identified Gaps / Advisory:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-500">
                              {app.resumeAnalysis.recommendations?.slice(0, 3).map((rec, i) => <li key={i}>{rec}</li>) || <li>Vetting verification matches perfectly.</li>}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Display resume text representation */}
                      {app.resumeText && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Candidate Resume Plain-Text:</span>
                          <div className="p-3 bg-slate-50 border rounded-lg text-[11px] text-slate-500 max-h-32 overflow-y-auto whitespace-pre-line leading-relaxed font-sans font-medium">
                            {app.resumeText}
                          </div>
                        </div>
                      )}

                      {/* Interview loop scheduled feedback */}
                      {app.status === 'interview_scheduled' && app.interviewDate && (
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1.5">
                              <Video className="h-4 w-4 text-[#F97316]" />
                              Sourcing Video interview scheduled
                            </div>
                            <div className="text-slate-500 font-semibold">
                              Date: <span className="text-[#0A2C66] font-extrabold">{app.interviewDate}</span> at <span className="text-[#0A2C66] font-extrabold">{app.interviewTime}</span> (IST)
                            </div>
                          </div>
                          {app.interviewLink && (
                            <a href={app.interviewLink} target="_blank" rel="noreferrer" className="text-[#F97316] font-extrabold hover:underline uppercase flex items-center gap-1 font-sans text-[11px]">
                              Meet Link
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      )}

                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* POST JOB TAB */}
        {activeTab === 'post-job' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Post Sourcing Mandate</h2>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-1">Host a new placement opening on Turenakx search boards</p>
            </div>

            {postSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-bold">
                ✓ Sourcing mandate posted successfully! Syncing live across Bangalore boards...
              </div>
            )}

            <form onSubmit={handlePostJob} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                    placeholder="e.g. Lead Nurse Practitioner"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sourcing Category *</label>
                  <select
                    value={newJob.industry}
                    onChange={e => setNewJob({ ...newJob, industry: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white text-slate-700"
                  >
                    <option value="IT & Software">IT & Software</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Automobile">Automobile</option>
                    <option value="Banking & Finance">Banking & Finance</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Placement Type</label>
                  <select
                    value={newJob.type}
                    onChange={e => setNewJob({ ...newJob, type: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white text-slate-700"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Office Location</label>
                  <input
                    type="text"
                    required
                    value={newJob.location}
                    onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                    placeholder="e.g. Bangalore"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Salary range (L.P.A) *</label>
                  <input
                    type="text"
                    required
                    value={newJob.salary}
                    onChange={e => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                    placeholder="₹12,00,000 - ₹18,00,000 L.P.A"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience Requirements *</label>
                  <input
                    type="text"
                    required
                    value={newJob.experience}
                    onChange={e => setNewJob({ ...newJob, experience: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                    placeholder="e.g. 3 - 5 Years"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skills Tags (comma separated) *</label>
                  <input
                    type="text"
                    required
                    value={newJob.skillsRaw}
                    onChange={e => setNewJob({ ...newJob, skillsRaw: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
                    placeholder="e.g. React, Node.js, Nursing License"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Job Description *</label>
                <textarea
                  required
                  rows={4}
                  value={newJob.description}
                  onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Detail primary roles, company values, and team sizes..."
                  className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mandatory Criteria (one per line) *</label>
                <textarea
                  required
                  rows={4}
                  value={newJob.requirementsRaw}
                  onChange={e => setNewJob({ ...newJob, requirementsRaw: e.target.value })}
                  placeholder="Pre-requisite 1&#10;Pre-requisite 2&#10;Pre-requisite 3"
                  className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPosting}
                className="w-full px-6 py-4 bg-[#0A2C66] text-white hover:bg-slate-800 transition-all rounded-lg text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-1"
              >
                {isPosting ? 'Hosting Opening...' : 'Publish Sourcing Opening'}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* SCHEDULING INTERVIEW POPUP MODAL */}
      <AnimatePresence>
        {activeSchedulingApp && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative text-left"
            >
              <div className="bg-[#0A2C66] text-white p-5">
                <button
                  onClick={() => setActiveSchedulingApp(null)}
                  className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded bg-white/5"
                >
                  ✕
                </button>
                <span className="text-[9px] font-bold text-[#F97316] uppercase tracking-widest">Sourcing Coordination</span>
                <h3 className="text-base font-black mt-1 leading-tight">Schedule Interview Round</h3>
                <p className="text-xs text-slate-300">Applicant: {activeSchedulingApp.candidateName}</p>
              </div>

              <form onSubmit={submitSchedule} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Interview Date *</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.date}
                    onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Interview Time (IST) *</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.time}
                    onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold outline-none bg-white"
                    placeholder="e.g. 11:00 AM"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Video Sourcing Call Link *</label>
                  <input
                    type="url"
                    required
                    value={scheduleForm.link}
                    onChange={e => setScheduleForm({ ...scheduleForm, link: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold outline-none bg-white"
                    placeholder="https://meet.google.com/..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Instructions Notes</label>
                  <textarea
                    rows={2}
                    value={scheduleForm.notes}
                    onChange={e => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold outline-none bg-white resize-none"
                    placeholder="e.g. Initial technical evaluation loop..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSchedulingApp(null)}
                    className="w-1/2 py-2.5 border text-slate-500 rounded-lg text-xs font-bold uppercase text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-[#0A2C66] text-white rounded-lg text-xs font-bold uppercase flex justify-center items-center gap-1"
                  >
                    Confirm Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
