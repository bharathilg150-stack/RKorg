import React, { useState } from 'react';
import { 
  Search, MapPin, Briefcase, IndianRupee, Clock, ChevronRight, CheckCircle2, 
  Share2, Bookmark, BookmarkCheck, UploadCloud, Cpu, AlertCircle, FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Job, Application, UserSession } from '../types';

interface JobsPageProps {
  jobs: Job[];
  user: UserSession | null;
  savedJobs: string[];
  toggleSaveJob: (jobId: string) => void;
  applyToJob: (app: Omit<Application, 'id' | 'status' | 'appliedAt'>) => Promise<boolean>;
  setRoute: (route: string) => void;
}

export default function JobsPage({
  jobs,
  user,
  savedJobs,
  toggleSaveJob,
  applyToJob,
  setRoute,
}: JobsPageProps) {
  // Advanced Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedExp, setSelectedExp] = useState('');

  // Apply Modal States
  const [activeApplyJob, setActiveApplyJob] = useState<Job | null>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', resumeText: '' });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [simulatedFileName, setSimulatedFileName] = useState('');

  // AI Parser & Analysis States
  const [isParsing, setIsParsing] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [parsedProfile, setParsedProfile] = useState<any | null>(null);
  const [aiScoreResponse, setAiScoreResponse] = useState<any | null>(null);
  const [isSuccessApplied, setIsSuccessApplied] = useState(false);

  // Copy Share Feedback
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Filter Jobs
  const filteredJobs = jobs.filter(job => {
    if (job.status === 'archived' || job.status === 'closed') return false;

    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = !selectedLocation || job.location.includes(selectedLocation);
    const matchesType = !selectedType || job.type === selectedType || job.location.includes(selectedType);
    const matchesIndustry = !selectedIndustry || job.industry === selectedIndustry;
    
    let matchesExp = true;
    if (selectedExp) {
      matchesExp = job.experience.includes(selectedExp) || job.title.toLowerCase().includes(selectedExp.toLowerCase());
    }

    return matchesSearch && matchesLocation && matchesType && matchesIndustry && matchesExp;
  });

  // Unique list of filters
  const locations = ['Bangalore', 'Remote', 'Pune', 'Mumbai', 'Chennai'];
  const types = ['Full Time', 'Part Time', 'Remote', 'Hybrid', 'Contract', 'Internship'];
  const industries = ['IT & Software', 'Healthcare', 'Retail', 'Automobile', 'Banking & Finance', 'Logistics'];
  const experiences = ['Entry', '2+', '3+', '4+', '5+', '7+'];

  // Handle Share Job click
  const handleShare = (job: Job) => {
    const shareUrl = `${window.location.origin}/jobs?id=${job.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShareFeedback(job.id);
    setTimeout(() => setShareFeedback(null), 3000);
  };

  // Drag and Drop simulated file load
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setSimulatedFileName(file.name);
      simulateResumeParse(file.name);
    }
  };

  // Drag simulation helper
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setResumeFile(file);
      setSimulatedFileName(file.name);
      simulateResumeParse(file.name);
    }
  };

  // Call simulated / Real-time resume parser on upload
  const simulateResumeParse = async (fileName: string) => {
    setIsParsing(true);
    setParsedProfile(null);
    setAiScoreResponse(null);

    // Realistic resume texts based on file name or simple strings
    let sampleResumeText = `ADITYA PRASAD SHARMA\nSoftware Engineer\n+91 8147354351\naditya.sharma@turenakx.com\n\nExperience:\n- Senior Software Architect at Intel, 2024 - Present.\n- Full Stack Web Engineer at Flipkart, 3 years. Engineered React dashboards and Node.js APIs.\n\nSkills:\nReact, Node.js, TypeScript, PostgreSQL, REST APIs, Tailwind CSS, AWS Cloud S3.`;
    
    if (fileName.toLowerCase().includes('medical') || fileName.toLowerCase().includes('nurse') || fileName.toLowerCase().includes('health')) {
      sampleResumeText = `SISTER ANJALI MATHEW\nLead Nurse Practitioner\n+91 9900887766\nanjali.mathew@medilife.org\n\nExperience:\n- Ward Sourcing Supervisor at Apollo, 4 years.\n- General Nurse Practitioner, City Clinic Bangalore, 2 years.\n\nSkills:\nPatient Care, Clinical Sourcing, Nursing License, Primary Care, Emergency Diagnostics, Ward Supervision.`;
    } else if (fileName.toLowerCase().includes('finance') || fileName.toLowerCase().includes('analyst') || fileName.toLowerCase().includes('bank')) {
      sampleResumeText = `SANJAY GUPTA\nValuation Analyst\n+91 9123456789\nsanjay@elitebanking.com\n\nExperience:\n- Investment Associate at Goldman, 3 years.\n- Financial Intern, Mumbai Partners.\n\nSkills:\nFinancial Modeling, Valuation, Excel, Corporate Finance, Analysis, CFA Candidate.`;
    }

    try {
      const res = await fetch('/api/resume-parser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: sampleResumeText })
      });
      const data = await res.json();
      if (data.success) {
        setParsedProfile(data.parsed);
        // Prefill form
        setApplyForm({
          name: data.parsed.candidateName,
          email: data.parsed.candidateEmail,
          phone: data.parsed.candidatePhone || '+91 8147354351',
          resumeText: sampleResumeText
        });

        // Trigger scoring
        if (activeApplyJob) {
          setIsScoring(true);
          const scoreRes = await fetch('/api/resume-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resumeText: sampleResumeText,
              jobTitle: activeApplyJob.title,
              jobDescription: activeApplyJob.description,
              requirements: activeApplyJob.requirements
            })
          });
          const scoreData = await scoreRes.json();
          if (scoreData.success) {
            setAiScoreResponse(scoreData.analysis);
          }
          setIsScoring(false);
        }
      }
    } catch (err) {
      console.error('Error parsing resume', err);
    }
    setIsParsing(false);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApplyJob) return;

    const finalResumeText = applyForm.resumeText || `Candidate Name: ${applyForm.name}\nEmail: ${applyForm.email}\nPhone: ${applyForm.phone}\nSkills: React, Node, SQL`;

    // Package application
    const appPayload: Omit<Application, 'id' | 'status' | 'appliedAt'> = {
      jobId: activeApplyJob.id,
      jobTitle: activeApplyJob.title,
      candidateId: user ? user.id : `cand-${Date.now()}`,
      candidateName: applyForm.name,
      candidateEmail: applyForm.email,
      candidatePhone: applyForm.phone,
      resumeText: finalResumeText,
      resumeScore: aiScoreResponse?.jobFitPercentage || 75,
      resumeAnalysis: aiScoreResponse || {
        strengths: ['Direct professional application', 'Responsive communications'],
        gaps: ['Requires formal review'],
        recommendations: ['Complete full onboarding review'],
        matchedSkills: activeApplyJob.skills.slice(0, 2),
        jobFitPercentage: 75
      },
      notes: 'Applied through Turenakx Public Portal.'
    };

    const ok = await applyToJob(appPayload);
    if (ok) {
      setIsSuccessApplied(true);
      setTimeout(() => {
        setIsSuccessApplied(false);
        setActiveApplyJob(null);
        // Clear forms
        setApplyForm({ name: '', email: '', phone: '', resumeText: '' });
        setResumeFile(null);
        setSimulatedFileName('');
        setParsedProfile(null);
        setAiScoreResponse(null);
      }, 5000);
    }
  };

  return (
    <div className="font-sans text-slate-800 bg-[#F8FAFC] min-h-screen pb-24">
      {/* HEADER banner */}
      <section className="bg-[#0A2C66] text-white py-16 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-wider">Enterprise Jobs Feed</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Advanced Job Sourcing
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl font-medium">
            Search active corporate hiring mandates across software engineering, healthcare clinics, manufacturing hubs, and corporate banks.
          </p>
        </div>
      </section>

      {/* SEARCH AND FILTERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-6 text-left h-fit space-y-6 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-[#0A2C66] font-bold text-sm uppercase tracking-wider">Sourcing Filters</h3>
            <button 
              onClick={() => {
                setSelectedLocation('');
                setSelectedType('');
                setSelectedIndustry('');
                setSelectedExp('');
                setSearchTerm('');
              }}
              className="text-[10px] text-[#F97316] hover:underline font-bold uppercase"
            >
              Clear All
            </button>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
            <select 
              value={selectedLocation} 
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-[#0A2C66]"
            >
              <option value="">All Locations</option>
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placement Type</label>
            <select 
              value={selectedType} 
              onChange={e => setSelectedType(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-[#0A2C66]"
            >
              <option value="">All Types</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Industry Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</label>
            <select 
              value={selectedIndustry} 
              onChange={e => setSelectedIndustry(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-[#0A2C66]"
            >
              <option value="">All Industries</option>
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Min Experience</label>
            <select 
              value={selectedExp} 
              onChange={e => setSelectedExp(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-[#0A2C66]"
            >
              <option value="">Any Experience</option>
              {experiences.map(exp => <option key={exp} value={exp}>{exp}</option>)}
            </select>
          </div>
        </div>

        {/* Jobs Feed List Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main search input bar */}
          <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by keywords, job titles, or specific skills (e.g. React, CAD, Nursing)..."
              className="w-full bg-transparent border-none text-sm outline-none focus:ring-0 text-slate-700 font-medium"
            />
          </div>

          {/* Results count banner */}
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            <span>Sourced mandate matches ({filteredJobs.length})</span>
            {searchTerm && <span>Keyword: "{searchTerm}"</span>}
          </div>

          {/* Job Feed Cards */}
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 rounded-xl text-center space-y-4">
                <Briefcase className="h-12 w-12 text-[#0A2C66]/20 mx-auto" />
                <h3 className="text-slate-800 font-bold text-base uppercase">No sourcing mandates matched</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Try clearing your search filters or modifying the keyword parameters to discover other openings.
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isSaved = savedJobs.includes(job.id);
                return (
                  <motion.div
                    key={job.id}
                    layout
                    className="bg-white border border-slate-200/60 rounded-xl p-6 hover:shadow-md hover:border-[#0A2C66]/20 transition-all text-left flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* upper bar */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#F97316] bg-orange-50 px-2.5 py-1 rounded uppercase tracking-wider inline-block">
                            {job.type}
                          </span>
                          <h2 className="text-[#0A2C66] font-black text-lg mt-2 leading-tight">
                            {job.title}
                          </h2>
                          <div className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-wide">
                            {job.companyName} • <span className="text-slate-400">{job.location}</span>
                          </div>
                        </div>

                        {/* Top-right action icon row */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className="p-2 text-slate-400 hover:text-[#F97316] rounded-lg hover:bg-slate-50 transition-all"
                            title={isSaved ? 'Unsave Job' : 'Save Job'}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="h-5 w-5 text-[#F97316]" />
                            ) : (
                              <Bookmark className="h-5 w-5" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleShare(job)}
                            className="p-2 text-slate-400 hover:text-[#0A2C66] rounded-lg hover:bg-slate-50 transition-all relative"
                            title="Share Job Listing"
                          >
                            <Share2 className="h-5 w-5" />
                            {shareFeedback === job.id && (
                              <span className="absolute -top-8 right-0 bg-slate-900 text-white text-[9px] px-2 py-1 rounded font-sans whitespace-nowrap">
                                Copied URL!
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 text-xs leading-relaxed font-medium">
                        {job.description}
                      </p>

                      {/* Requirements bullets */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-50">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Mandatory Criteria:</div>
                        {job.requirements.map((req, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                            <CheckCircle2 className="h-4 w-4 text-[#F97316] flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>

                      {/* Skills Tags row */}
                      <div className="flex flex-wrap gap-1.5 pt-3">
                        {job.skills.map(skill => (
                          <span 
                            key={skill} 
                            className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Lower Info & CTA footer */}
                    <div className="border-t border-slate-100 pt-4 mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div className="flex flex-wrap gap-4 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <span className="flex items-center gap-1.5">
                          <IndianRupee className="h-4 w-4 text-[#F97316]" />
                          {job.salary}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-[#0A2C66]" />
                          {job.experience} Required
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveApplyJob(job);
                          // prefill name/email if candidate user is logged in
                          if (user && user.role === 'candidate') {
                            setApplyForm(prev => ({
                              ...prev,
                              name: user.name,
                              email: user.email
                            }));
                          }
                        }}
                        className="px-5 py-2.5 bg-[#0A2C66] text-white hover:bg-slate-800 transition-all rounded-lg text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-md shadow-blue-900/10"
                      >
                        Apply Sourcing Mandate
                        <ChevronRight className="h-4 w-4 text-[#F97316]" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

        </div>
      </div>

      {/* APPLY MODAL (With Integrated Gemini AI Resume Parser and score feedback) */}
      <AnimatePresence>
        {activeApplyJob && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative text-left"
            >
              
              {/* Header */}
              <div className="bg-[#0A2C66] text-white p-6 relative">
                <button
                  onClick={() => {
                    setActiveApplyJob(null);
                    setParsedProfile(null);
                    setAiScoreResponse(null);
                    setSimulatedFileName('');
                  }}
                  className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-white rounded bg-white/5"
                >
                  ✕
                </button>
                <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest">Sourcing Application</span>
                <h2 className="text-xl font-black mt-1 leading-tight">{activeApplyJob.title}</h2>
                <p className="text-xs text-slate-300 mt-1">{activeApplyJob.companyName} • {activeApplyJob.location}</p>
              </div>

              {/* Form / Scroll Container */}
              <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 font-sans">
                
                {isSuccessApplied ? (
                  <div className="py-12 text-center space-y-4">
                    <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                    <h3 className="text-slate-800 font-black text-lg uppercase">Application Transmitted Successfully!</h3>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto">
                      ✓ Your vetted profile, resume score ({aiScoreResponse?.jobFitPercentage || 75}%), and analysis report have been shared with {activeApplyJob.companyName} and rkturenakx@gmail.com.
                    </p>
                    <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase">This window will close shortly...</div>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-6">
                    
                    {/* SECTION 1: Resume Sourcing (Drag and drop click upload) */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Upload Professional Resume *
                        </label>
                        <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Cpu className="h-3 w-3 text-[#F97316]" />
                          Integrated AI parser
                        </span>
                      </div>

                      <div 
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 hover:border-[#0A2C66] transition-all text-center space-y-2 relative cursor-pointer"
                      >
                        <input
                          type="file"
                          accept=".pdf,.txt,.doc,.docx"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <UploadCloud className="h-8 w-8 text-slate-400 mx-auto" />
                        <div className="text-xs font-semibold text-slate-700">
                          {simulatedFileName ? (
                            <span className="text-[#0A2C66] font-bold">{simulatedFileName}</span>
                          ) : (
                            <span>Drag & drop resume here, or <span className="text-[#F97316] underline">browse files</span></span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">PDF, TXT, DOC up to 5MB. AI will instantly parse skills, education & score fit.</p>
                      </div>
                    </div>

                    {/* Loader */}
                    {isParsing && (
                      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3">
                        <span className="animate-spin h-5 w-5 border-2 border-[#F97316] border-t-transparent rounded-full"></span>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide animate-pulse">
                          Gemini 3.6 Flash parsing resume attributes...
                        </span>
                      </div>
                    )}

                    {/* Integrated AI Score Widget */}
                    {parsedProfile && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-slate-200 rounded-xl overflow-hidden bg-[#F8FAFC] shadow-inner"
                      >
                        <div className="bg-[#0A2C66]/5 p-4 flex justify-between items-center border-b border-slate-200">
                          <div>
                            <div className="text-xs font-black text-[#0A2C66] uppercase tracking-wide">
                              AI Sourced Resume Summary
                            </div>
                            <p className="text-[10px] text-slate-400">Extracted dynamically via server-side Gemini SDK</p>
                          </div>

                          {aiScoreResponse ? (
                            <div className="text-center bg-white border border-slate-200 px-4 py-2 rounded-lg">
                              <div className="text-xl font-black text-[#F97316]">{aiScoreResponse.jobFitPercentage}%</div>
                              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Fit Score</div>
                            </div>
                          ) : isScoring ? (
                            <span className="text-xs font-bold text-slate-400 animate-pulse uppercase">Scoring...</span>
                          ) : null}
                        </div>

                        <div className="p-4 space-y-4 text-xs font-medium text-slate-600">
                          {/* Name / Email Pre-Filled Feedback */}
                          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Name</span>
                              <div className="text-slate-800 font-bold">{parsedProfile.candidateName}</div>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Extracted Email</span>
                              <div className="text-slate-800 font-bold">{parsedProfile.candidateEmail}</div>
                            </div>
                          </div>

                          {/* Fit Score Analysis strengths/gaps if finished */}
                          {aiScoreResponse && (
                            <div className="space-y-3">
                              <div>
                                <span className="text-[9px] text-[#0A2C66] font-bold uppercase">Candidate Strengths:</span>
                                <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] text-slate-500">
                                  {aiScoreResponse.strengths.map((str: string, i: number) => <li key={i}>{str}</li>)}
                                </ul>
                              </div>
                              <div>
                                <span className="text-[9px] text-[#F97316] font-bold uppercase">Missing Gaps / Recommendations:</span>
                                <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] text-slate-500">
                                  {aiScoreResponse.recommendations.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* SECTION 2: Manual Contacts validation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Candidate Full Name *</label>
                        <input
                          type="text"
                          required
                          value={applyForm.name}
                          onChange={e => setApplyForm({ ...applyForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Email *</label>
                        <input
                          type="email"
                          required
                          value={applyForm.email}
                          onChange={e => setApplyForm({ ...applyForm, email: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white text-slate-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number *</label>
                        <input
                          type="text"
                          required
                          value={applyForm.phone}
                          onChange={e => setApplyForm({ ...applyForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white text-slate-700"
                        />
                      </div>
                      <div className="text-slate-400 text-xs flex items-center pt-6">
                        <AlertCircle className="h-4 w-4 text-[#F97316] mr-2 flex-shrink-0" />
                        <span>Sourcing placements are fully compliant with GDPR and candidates privacy.</span>
                      </div>
                    </div>

                    {/* SECTION 3: Raw resume text if manual editor fallback */}
                    {!simulatedFileName && (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Or Paste Resume Plain Text Here
                        </label>
                        <textarea
                          rows={6}
                          value={applyForm.resumeText}
                          onChange={e => setApplyForm({ ...applyForm, resumeText: e.target.value })}
                          placeholder="Paste academic qualifications, employment histories, and skills list directly here..."
                          className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white resize-none text-slate-700"
                        />
                      </div>
                    )}

                    {/* Submit Actions */}
                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveApplyJob(null);
                          setParsedProfile(null);
                          setAiScoreResponse(null);
                          setSimulatedFileName('');
                        }}
                        className="w-1/2 px-6 py-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider text-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 px-6 py-3 bg-[#0A2C66] text-white hover:bg-slate-800 transition-all rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/10"
                      >
                        Submit Sourcing Application
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
