import React, { useState } from 'react';
import { 
  Users, Briefcase, Building2, FileSpreadsheet, RefreshCw, 
  Search, Calendar, Terminal, Filter, Trash
} from 'lucide-react';
import { Job, Company, Candidate, Application, AuditLog, RealtimeAlert } from '../../types';

interface AdminMetricsProps {
  jobs: Job[];
  companies: Company[];
  candidates: Candidate[];
  applications: Application[];
  auditLogs: AuditLog[];
  realtimeAlerts: RealtimeAlert[];
}

export default function AdminMetrics({
  jobs,
  companies,
  candidates,
  applications,
  auditLogs,
  realtimeAlerts,
}: AdminMetricsProps) {
  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState<'all' | 'Admin' | 'Candidate' | 'Recruiter' | 'Guest User'>('all');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Statistics Computations
  const activeJobs = jobs.filter(j => j.status === 'active' || j.status === 'featured').length;
  const closedJobs = jobs.filter(j => j.status === 'closed' || j.status === 'archived').length;
  const verifiedCandidates = candidates.filter(c => c.backgroundVerified).length;
  const pendingCandidates = candidates.length - verifiedCandidates;
  const pendingReviewsCount = applications.filter(a => a.status === 'applied').length;
  
  // Pipeline aggregates
  const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
  const scheduled = applications.filter(a => a.status === 'interview_scheduled').length;

  // Monthly breakdown heuristic data for the premium SVG Line Chart (Jan - Jun 2026)
  const monthlyData = [
    { name: 'Jan', sourced: 15, shortlisted: 8, placed: 3 },
    { name: 'Feb', sourced: 22, shortlisted: 12, placed: 5 },
    { name: 'Mar', sourced: 28, shortlisted: 18, placed: 9 },
    { name: 'Apr', sourced: 35, shortlisted: 22, placed: 12 },
    { name: 'May', sourced: 42, shortlisted: 30, placed: 18 },
    { name: 'Jun', sourced: applications.length + 10, shortlisted: shortlisted + 5, placed: scheduled + 2 }
  ];

  // Industry demographic metrics
  const industryCounts: Record<string, number> = {};
  jobs.forEach(job => {
    industryCounts[job.industry] = (industryCounts[job.industry] || 0) + 1;
  });
  const totalIndustryJobs = jobs.length || 1;

  // Filter logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.target.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.user.toLowerCase().includes(logSearch.toLowerCase());
    
    if (logFilter === 'all') return matchesSearch;
    return matchesSearch && log.user.includes(logFilter);
  });

  return (
    <div className="space-y-8">
      {/* Executive Summary Cards */}
      <div>
        <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Realtime Agency Intelligence</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
          Dynamic monitoring, placement metrics & automated telemetry
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Mandates</span>
            <div className="text-2xl font-black text-[#0A2C66]">{activeJobs}</div>
            <div className="text-[10px] text-slate-400 font-semibold">{closedJobs} closed/archived</div>
          </div>
          <div className="p-3 bg-blue-50 text-[#0A2C66] rounded-lg">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vetted Talent</span>
            <div className="text-2xl font-black text-[#F97316]">{candidates.length}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">{verifiedCandidates} verified check</div>
          </div>
          <div className="p-3 bg-orange-50 text-[#F97316] rounded-lg">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enterprise B2B</span>
            <div className="text-2xl font-black text-emerald-600">{companies.length}</div>
            <div className="text-[10px] text-slate-400 font-semibold">Approved corporate alliances</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pipeline Volume</span>
            <div className="text-2xl font-black text-blue-600">{applications.length}</div>
            <div className="text-[10px] text-[#F97316] font-semibold">{pendingReviewsCount} pending review</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Dual Analytics Section: SVG Line Chart & Industry Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Line Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#0A2C66] text-sm uppercase tracking-wide">Monthly Sourcing Pipeline</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Sourcing progression over latest half-yearly horizon</p>
            </div>
            
            {/* Custom Legend Keys */}
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-[#0A2C66] rounded-full inline-block"></span> Sourced</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-[#F97316] rounded-full inline-block"></span> Shortlists</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-emerald-500 rounded-full inline-block"></span> Interviews</span>
            </div>
          </div>

          {/* SVG Line Chart Construction */}
          <div className="relative pt-2 h-64">
            <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="60" x2="480" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="100" x2="480" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="140" x2="480" y2="140" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="180" x2="480" y2="180" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3" />

              {/* Chart Lines Paths */}
              {/* Line 1: Sourced (Navy Blue #0A2C66) */}
              <path 
                d={`M 50 ${180 - (monthlyData[0].sourced * 3)} 
                   L 130 ${180 - (monthlyData[1].sourced * 3)} 
                   L 210 ${180 - (monthlyData[2].sourced * 3)} 
                   L 290 ${180 - (monthlyData[3].sourced * 3)} 
                   L 370 ${180 - (monthlyData[4].sourced * 3)} 
                   L 450 ${180 - (monthlyData[5].sourced * 3)}`}
                fill="none" 
                stroke="#0A2C66" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Line 2: Shortlisted (Orange #F97316) */}
              <path 
                d={`M 50 ${180 - (monthlyData[0].shortlisted * 3)} 
                   L 130 ${180 - (monthlyData[1].shortlisted * 3)} 
                   L 210 ${180 - (monthlyData[2].shortlisted * 3)} 
                   L 290 ${180 - (monthlyData[3].shortlisted * 3)} 
                   L 370 ${180 - (monthlyData[4].shortlisted * 3)} 
                   L 450 ${180 - (monthlyData[5].shortlisted * 3)}`}
                fill="none" 
                stroke="#F97316" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Line 3: Placed/Scheduled (Emerald #10B981) */}
              <path 
                d={`M 50 ${180 - (monthlyData[0].placed * 3)} 
                   L 130 ${180 - (monthlyData[1].placed * 3)} 
                   L 210 ${180 - (monthlyData[2].placed * 3)} 
                   L 290 ${180 - (monthlyData[3].placed * 3)} 
                   L 370 ${180 - (monthlyData[4].placed * 3)} 
                   L 450 ${180 - (monthlyData[5].placed * 3)}`}
                fill="none" 
                stroke="#10B981" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Hover Guides & Circles */}
              {monthlyData.map((data, idx) => {
                const xVal = 50 + (idx * 80);
                const isHovered = hoveredMonth === idx;
                return (
                  <g key={idx} onMouseEnter={() => setHoveredMonth(idx)} onMouseLeave={() => setHoveredMonth(null)} className="cursor-pointer">
                    {/* Interactive Vertical Hover bar */}
                    {isHovered && (
                      <line x1={xVal} y1="20" x2={xVal} y2="180" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3,3" />
                    )}

                    {/* Sourced circle node */}
                    <circle cx={xVal} cy={180 - (data.sourced * 3)} r={isHovered ? "5" : "3.5"} fill="#0A2C66" stroke="#FFFFFF" strokeWidth="1.5" />
                    {/* Shortlisted circle node */}
                    <circle cx={xVal} cy={180 - (data.shortlisted * 3)} r={isHovered ? "5" : "3.5"} fill="#F97316" stroke="#FFFFFF" strokeWidth="1.5" />
                    {/* Placed circle node */}
                    <circle cx={xVal} cy={180 - (data.placed * 3)} r={isHovered ? "5" : "3.5"} fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />

                    {/* Month Text Anchor Labels */}
                    <text x={xVal} y="200" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 uppercase tracking-wider">{data.name}</text>
                  </g>
                );
              })}
            </svg>

            {/* Float Tooltip */}
            {hoveredMonth !== null && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#051430] border border-slate-700/60 p-3.5 rounded-lg text-[10px] font-bold text-white shadow-xl space-y-1 text-left min-w-[120px]">
                <div className="text-slate-400 border-b border-slate-700/50 pb-1 uppercase tracking-widest text-[9px]">
                  Pipeline: {monthlyData[hoveredMonth].name} 2026
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-300">SOURCED:</span>
                  <span className="text-white font-extrabold">{monthlyData[hoveredMonth].sourced}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-orange-400">SHORTLIST:</span>
                  <span className="text-white font-extrabold">{monthlyData[hoveredMonth].shortlisted}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-emerald-400">PLACED:</span>
                  <span className="text-white font-extrabold">{monthlyData[hoveredMonth].placed}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Corporate Demographics Distribution (Vertical Progress bars) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-[#0A2C66] text-sm uppercase tracking-wide">Industry Distribution</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Vacancy volume metrics by industrial sectors</p>
          </div>

          <div className="space-y-4">
            {Object.keys(industryCounts).length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">No active listings to classify.</div>
            ) : (
              Object.entries(industryCounts).map(([industry, count]) => {
                const percent = Math.round((count / totalIndustryJobs) * 100);
                return (
                  <div key={industry} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                      <span className="truncate max-w-[180px]">{industry}</span>
                      <span className="text-[#0A2C66]">{count} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#0A2C66] to-[#F97316] h-full transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Audit Log Panel with Filter & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-[#0A2C66] text-sm uppercase tracking-wide flex items-center gap-2">
              <Terminal className="h-4 w-4 text-[#F97316]" />
              Historical System Telemetry Logs
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Automated logging, administrator audit trails, & user writes</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH AUDIT LOGS..."
                value={logSearch}
                onChange={e => setLogSearch(e.target.value)}
                className="pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0A2C66] uppercase"
              />
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
              {(['all', 'Admin', 'Candidate', 'Guest User'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setLogFilter(f)}
                  className={`px-3 py-1 text-[9px] font-bold uppercase rounded ${
                    logFilter === f ? 'bg-white text-[#0A2C66] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logs Timeline */}
        <div className="border border-slate-100 rounded-lg divide-y divide-slate-100 max-h-80 overflow-y-auto bg-slate-50/50">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold uppercase">
              No matching audit telemetry logs found.
            </div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold hover:bg-slate-100/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-md mt-0.5 ${
                    log.user.includes('Admin') ? 'bg-orange-50 text-[#F97316]' :
                    log.user.includes('Guest') ? 'bg-slate-200 text-slate-600' :
                    'bg-blue-50 text-[#0A2C66]'
                  }`}>
                    <Terminal className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-slate-800 flex items-center gap-2">
                      <span className="font-extrabold text-[#0A2C66]">{log.user}</span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] bg-slate-200 text-slate-500 uppercase font-black">{log.action}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Target: <span className="font-bold text-slate-600">{log.target}</span></p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 sm:self-center">
                  <Calendar className="h-3 w-3" />
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
