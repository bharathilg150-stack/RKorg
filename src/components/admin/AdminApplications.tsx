import React, { useState } from 'react';
import { 
  FileSpreadsheet, Search, Brain, Calendar, Mail, Phone, 
  Trash2, X, Clock, Video, FileText, Check, AlertTriangle, 
  HelpCircle, Sparkles, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { Application } from '../../types';

interface AdminApplicationsProps {
  applications: Application[];
  updateApplicationStatus: (
    appId: string, 
    status: Application['status'], 
    interviewDetails?: { date: string; time: string; link: string; notes?: string }
  ) => Promise<boolean>;
}

export default function AdminApplications({
  applications,
  updateApplicationStatus,
}: AdminApplicationsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'applied' | 'shortlisted' | 'interview_scheduled' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Interview Scheduler State
  const [showScheduler, setShowScheduler] = useState(false);
  const [schedulerForm, setSchedulerForm] = useState({
    date: '2026-07-25',
    time: '11:00 AM',
    link: 'https://meet.google.com/abc-defg-hij',
    notes: '',
  });

  // Handle Delete Application via fetch API route
  const handleDeleteApplication = async (appId: string, candName: string) => {
    if (!confirm(`Are you absolute sure you want to delete the sourcing application of "${candName}"?`)) return;
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        if (selectedApp?.id === appId) setSelectedApp(null);
      } else {
        alert('Failed to delete application: ' + data.message);
      }
    } catch (err) {
      console.error('Delete application error', err);
    }
  };

  // Schedule Interview Submit
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const ok = await updateApplicationStatus(
      selectedApp.id, 
      'interview_scheduled', 
      {
        date: schedulerForm.date,
        time: schedulerForm.time,
        link: schedulerForm.link,
        notes: schedulerForm.notes
      }
    );

    if (ok) {
      const updatedApp = {
        ...selectedApp,
        status: 'interview_scheduled' as const,
        interviewDate: schedulerForm.date,
        interviewTime: schedulerForm.time,
        interviewLink: schedulerForm.link,
        notes: schedulerForm.notes
      };
      setSelectedApp(updatedApp);
      setShowScheduler(false);
      alert('✓ Corporate Interview scheduled and virtual meet invites broadcast!');
    }
  };

  // Quick Shortlist Change
  const handleShortlist = async (appId: string) => {
    await updateApplicationStatus(appId, 'shortlisted');
    if (selectedApp?.id === appId) {
      setSelectedApp({ ...selectedApp, status: 'shortlisted' });
    }
  };

  // Quick Reject Change
  const handleReject = async (appId: string) => {
    await updateApplicationStatus(appId, 'rejected');
    if (selectedApp?.id === appId) {
      setSelectedApp({ ...selectedApp, status: 'rejected' });
    }
  };

  // Filter pipeline
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && app.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Applicant Sourcing Pipeline</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
          Active placement mandates, pipeline stage transitions & AI resume diagnostics
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search candidate names, job titles, or emails..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white placeholder-slate-400"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-2">Pipeline Filter:</span>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            {(['all', 'applied', 'shortlisted', 'interview_scheduled', 'rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 text-[9px] font-extrabold uppercase rounded transition-all ${
                  statusFilter === f ? 'bg-[#0A2C66] text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {f === 'interview_scheduled' ? 'Scheduled' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* APPLICATIONS TABLE DATABASE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-500 font-semibold">
            <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-[#F8FAFC] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Talent Applicant</th>
                <th className="py-3.5 px-4">Mandate Position</th>
                <th className="py-3.5 px-4">AI Sourcing Score</th>
                <th className="py-3.5 px-4">Pipeline Stage</th>
                <th className="py-3.5 px-4 text-right">Placement actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-bold uppercase">
                    No active sourcing applicants found.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-800 text-sm">{app.candidateName}</div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5">{app.candidateEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0A2C66]">{app.jobTitle}</td>
                    <td className="py-3.5 px-4">
                      {app.resumeScore ? (
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-full flex items-center gap-1 max-w-fit ${
                          app.resumeScore >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          app.resumeScore >= 60 ? 'bg-orange-50 text-[#F97316] border border-orange-100' :
                          'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          <Brain className="h-3.5 w-3.5 shrink-0" />
                          {app.resumeScore}% Match
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase ${
                        app.status === 'interview_scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        app.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {app.status === 'interview_scheduled' ? 'Interview Scheduled' : app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-3 text-[10px] uppercase font-black tracking-wider">
                      <button 
                        onClick={() => {
                          setSelectedApp(app);
                          setSchedulerForm({
                            date: app.interviewDate || '2026-07-25',
                            time: app.interviewTime || '11:00 AM',
                            link: app.interviewLink || 'https://meet.google.com/abc-defg-hij',
                            notes: app.notes || '',
                          });
                          setShowScheduler(false);
                        }} 
                        className="text-[#0A2C66] hover:text-[#F97316] transition-colors"
                      >
                        Open Dossier
                      </button>
                      <button 
                        onClick={() => handleDeleteApplication(app.id, app.candidateName)} 
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL ANALYSIS AND INTERVIEW SCHEDULER SIDE DRAWER */}
      {selectedApp && (
        <div className="fixed inset-0 bg-[#051430]/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-3xl bg-white h-screen overflow-y-auto shadow-2xl p-8 space-y-8 flex flex-col text-left">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="text-[#F97316] text-[9px] font-black uppercase tracking-widest bg-orange-50 px-2.5 py-1 rounded">
                  Application Sourcing Review
                </span>
                <h3 className="text-2xl font-black text-[#0A2C66] mt-2">{selectedApp.candidateName}</h3>
                <p className="text-xs font-semibold text-slate-400 uppercase mt-1">Applying for: <span className="text-[#0A2C66] font-bold">{selectedApp.jobTitle}</span></p>
              </div>

              <button 
                onClick={() => setSelectedApp(null)} 
                className="p-2 border rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Contacts */}
            <div className="p-4 bg-slate-50 border rounded-xl grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 uppercase">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-bold">Email Handle:</span>
                <div className="text-slate-700 lowercase font-bold">{selectedApp.candidateEmail}</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 font-bold">Phone Handle:</span>
                <div className="text-slate-700 font-bold">{selectedApp.candidatePhone || 'No Phone Number'}</div>
              </div>
            </div>

            {/* Pipeline Stage buttons */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Transition Pipeline Stage</h4>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => handleShortlist(selectedApp.id)}
                  className={`px-4 py-2 rounded text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                    selectedApp.status === 'shortlisted'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Shortlist Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowScheduler(!showScheduler);
                  }}
                  className={`px-4 py-2 rounded text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                    selectedApp.status === 'interview_scheduled'
                      ? 'bg-blue-50 border-blue-300 text-blue-800'
                      : 'bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {selectedApp.status === 'interview_scheduled' ? 'Reschedule Interview ✓' : 'Schedule Corporate Interview'}
                </button>

                <button
                  type="button"
                  onClick={() => handleReject(selectedApp.id)}
                  className={`px-4 py-2 rounded text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                    selectedApp.status === 'rejected'
                      ? 'bg-red-50 border-red-300 text-red-800'
                      : 'bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Reject Mandate
                </button>
              </div>
            </div>

            {/* Scheduled details badge */}
            {selectedApp.status === 'interview_scheduled' && !showScheduler && (
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-3">
                <h5 className="font-extrabold text-[#0A2C66] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#F97316]" /> Registered Corporate Interview Loop
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-500 uppercase">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>{selectedApp.interviewDate} @ {selectedApp.interviewTime}</span>
                  </div>
                  {selectedApp.interviewLink && (
                    <div className="flex items-center gap-1.5 text-blue-600 hover:underline">
                      <Video className="h-4 w-4 text-slate-400" />
                      <a href={selectedApp.interviewLink} target="_blank" rel="noopener noreferrer" className="font-bold">Join Meet Link</a>
                    </div>
                  )}
                  {selectedApp.notes && (
                    <div className="col-span-2 pt-2 border-t text-slate-500 font-medium lowercase">
                      <span className="font-bold uppercase text-[9px] text-slate-400 block mb-0.5">interviewer comments:</span>
                      "{selectedApp.notes}"
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Inline Interview Scheduler Form */}
            {showScheduler && (
              <form onSubmit={handleScheduleSubmit} className="p-5 bg-blue-50 border border-blue-200 rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                  <h4 className="font-extrabold text-[#0A2C66] text-xs uppercase tracking-wider">Configure Corporate Interview Loop</h4>
                  <button type="button" onClick={() => setShowScheduler(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Interview Date *</label>
                    <input
                      type="date"
                      required
                      value={schedulerForm.date}
                      onChange={e => setSchedulerForm({ ...schedulerForm, date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Interview Time *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 02:30 PM IST"
                      value={schedulerForm.time}
                      onChange={e => setSchedulerForm({ ...schedulerForm, time: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Google Meet / Virtual Video Link *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://meet.google.com/xyz-qprs-tuv"
                    value={schedulerForm.link}
                    onChange={e => setSchedulerForm({ ...schedulerForm, link: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Interviewer Preparation Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Provide comments regarding tech loops, vetting questions or focus metrics..."
                    value={schedulerForm.notes}
                    onChange={e => setSchedulerForm({ ...schedulerForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-medium bg-white resize-none text-slate-700 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-[#0A2C66] text-white font-extrabold text-[10px] uppercase tracking-widest rounded shadow-md"
                >
                  Schedule Meet & Save Status
                </button>
              </form>
            )}

            {/* Gemini Diagnostics Section */}
            {selectedApp.resumeAnalysis ? (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                  <Brain className="h-4 w-4 text-[#F97316]" /> Gemini AI Sourcing Diagnostics
                </h4>

                {/* Score badge */}
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-[#F97316] bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                    {selectedApp.resumeAnalysis.jobFitPercentage}%
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">AI Suitability Quotient</span>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-md mt-0.5">
                      Structured semantic analysis generated by Gemini-3.6-flash evaluating qualifications matches.
                    </p>
                  </div>
                </div>

                {/* Strengths & Gaps Sidepane */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
                    <h5 className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <Check className="h-4 w-4 text-emerald-600" /> Key Strengths Matching
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-semibold leading-relaxed">
                      {selectedApp.resumeAnalysis.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <ChevronRight className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps */}
                  <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl space-y-2">
                    <h5 className="text-[10px] font-black text-orange-800 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-orange-500" /> Missing Competency Gaps
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-semibold leading-relaxed">
                      {selectedApp.resumeAnalysis.gaps.map((gap, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <ChevronRight className="h-3.5 w-3.5 text-orange-400 mt-0.5 shrink-0" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 bg-slate-50 border rounded-xl space-y-2 text-xs">
                  <h5 className="text-[10px] font-black text-[#0A2C66] uppercase tracking-wider">Actionable Improvement Recommendations</h5>
                  <ul className="space-y-1.5 text-slate-600 font-semibold leading-relaxed">
                    {selectedApp.resumeAnalysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-[#F97316] mt-0.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-12 border border-dashed rounded-xl text-center text-xs font-extrabold text-slate-400 uppercase tracking-widest flex flex-col items-center gap-3">
                <Brain className="h-8 w-8 text-slate-300" />
                No Gemini Diagnostics structured for this application.
              </div>
            )}

            {/* Plain resume text */}
            {selectedApp.resumeText && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-slate-400" /> Submitted Raw Resume Context
                </h4>
                <div className="p-4 bg-slate-50 border rounded-lg text-slate-600 text-xs font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedApp.resumeText}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
