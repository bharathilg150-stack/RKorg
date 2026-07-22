import React, { useState } from 'react';
import { 
  Briefcase, Search, Plus, Trash2, Edit3, X, 
  MapPin, CheckCircle2, DollarSign, Calendar, Layers 
} from 'lucide-react';
import { Job, Company } from '../../types';

interface AdminJobsProps {
  jobs: Job[];
  companies: Company[];
  updateJob: (job: Job) => Promise<boolean>;
  deleteJob: (id: string) => Promise<boolean>;
  createJob: (job: Omit<Job, "id" | "appliedCount">) => Promise<boolean>;
}

export default function AdminJobs({
  jobs,
  companies,
  updateJob,
  deleteJob,
  createJob,
}: AdminJobsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'featured' | 'closed' | 'archived'>('all');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showAddJob, setShowAddJob] = useState(false);

  // Form payload state
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '12 - 18 Lakhs PA',
    experience: '2+ Years',
    location: 'Bangalore (Hybrid)',
    skills: '',
    type: 'Full Time' as Job['type'],
    industry: 'IT & Software',
    status: 'active' as Job['status'],
    companyId: '',
  });

  // Approved companies list for form dropdown
  const approvedCompanies = companies.filter(c => c.status === 'approved');

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.companyId || !jobForm.description) {
      alert('Please fill in required fields: Title, Company, and Description');
      return;
    }

    const selectedCompany = companies.find(c => c.id === jobForm.companyId);
    if (!selectedCompany) return;

    const payload: Omit<Job, 'id' | 'appliedCount'> = {
      title: jobForm.title,
      description: jobForm.description,
      requirements: jobForm.requirements.split(',').map(r => r.trim()).filter(Boolean),
      salary: jobForm.salary,
      experience: jobForm.experience,
      location: jobForm.location,
      skills: jobForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      type: jobForm.type,
      industry: jobForm.industry,
      status: jobForm.status,
      companyId: jobForm.companyId,
      companyName: selectedCompany.name,
      companyLogo: selectedCompany.logoUrl || selectedCompany.logo || '',
      companyLocation: selectedCompany.location || selectedCompany.address,
      created_at: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    };

    const ok = await createJob(payload);
    if (ok) {
      setShowAddJob(false);
      // Reset form
      setJobForm({
        title: '',
        description: '',
        requirements: '',
        salary: '12 - 18 Lakhs PA',
        experience: '2+ Years',
        location: 'Bangalore (Hybrid)',
        skills: '',
        type: 'Full Time',
        industry: 'IT & Software',
        status: 'active',
        companyId: '',
      });
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    const ok = await updateJob(editingJob);
    if (ok) {
      setEditingJob(null);
    }
  };

  // Filter Jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && job.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Active Sourcing Mandates</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Full vacancy database, publishing controls & archival utilities</p>
        </div>

        <button
          onClick={() => {
            setShowAddJob(!showAddJob);
            setEditingJob(null);
          }}
          className="px-4 py-2 bg-[#0A2C66] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {showAddJob ? 'Close Publisher' : 'Publish Sourcing Vacancy'}
        </button>
      </div>

      {/* 1. NEW VACANCY FORM (SLIDE IN OR EXPANDABLE BLOCK) */}
      {showAddJob && (
        <form onSubmit={handleCreateSubmit} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-extrabold text-[#0A2C66] text-xs uppercase tracking-wider">Publish Sourcing Mandate</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Mandate Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Clinical Nurse Practitioner"
                value={jobForm.title}
                onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Client *</label>
              <select
                required
                value={jobForm.companyId}
                onChange={e => setJobForm({ ...jobForm, companyId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white text-slate-700"
              >
                <option value="">-- SELECT SPONSORING COMPANY --</option>
                {approvedCompanies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Vacancy Type</label>
              <select
                value={jobForm.type}
                onChange={e => setJobForm({ ...jobForm, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white text-slate-700"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Headquarters Location</label>
              <input
                type="text"
                placeholder="e.g. Pune, Maharashtra (Hybrid)"
                value={jobForm.location}
                onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Compensation Package</label>
              <input
                type="text"
                placeholder="e.g. 15 - 20 Lakhs PA"
                value={jobForm.salary}
                onChange={e => setJobForm({ ...jobForm, salary: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Experience Range</label>
              <input
                type="text"
                placeholder="e.g. 3+ Years"
                value={jobForm.experience}
                onChange={e => setJobForm({ ...jobForm, experience: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Industry Classification</label>
              <select
                value={jobForm.industry}
                onChange={e => setJobForm({ ...jobForm, industry: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white text-slate-700"
              >
                <option value="IT & Software">IT & Software</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Retail">Retail</option>
                <option value="Automobile">Automobile</option>
                <option value="Banking & Finance">Banking & Finance</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Core Skill tags (comma separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, Node.js"
                value={jobForm.skills}
                onChange={e => setJobForm({ ...jobForm, skills: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Requirements list (comma separated)</label>
              <input
                type="text"
                placeholder="Active MSN license, 5 years experience, shift flexibility"
                value={jobForm.requirements}
                onChange={e => setJobForm({ ...jobForm, requirements: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Role Description Paragraph</label>
            <textarea
              required
              rows={3}
              placeholder="Provide a comprehensive operational summary of this vacant role..."
              value={jobForm.description}
              onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#0A2C66] bg-white resize-none text-slate-700 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-3 bg-[#F97316] text-white font-extrabold text-[10px] uppercase tracking-widest rounded-lg hover:bg-orange-600 transition-all"
          >
            Publish Live Vacancy Block
          </button>
        </form>
      )}

      {/* 2. LIVE EDIT MODAL/FORM */}
      {editingJob && (
        <form onSubmit={handleEditSubmit} className="space-y-4 bg-orange-50/50 p-6 rounded-xl border border-orange-200/60">
          <div className="flex justify-between items-center pb-2 border-b border-orange-100">
            <h3 className="font-extrabold text-[#0A2C66] text-xs uppercase tracking-wider">Modify Sourcing Mandate: {editingJob.id}</h3>
            <button type="button" onClick={() => setEditingJob(null)} className="p-1 text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Job Vacancy Title</label>
              <input
                type="text"
                value={editingJob.title}
                onChange={e => setEditingJob({ ...editingJob, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Compensation Package</label>
              <input
                type="text"
                value={editingJob.salary}
                onChange={e => setEditingJob({ ...editingJob, salary: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Vacancy Sourcing Status</label>
              <select
                value={editingJob.status}
                onChange={e => setEditingJob({ ...editingJob, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700"
              >
                <option value="active">Active Sourcing</option>
                <option value="featured">Featured (Top Row)</option>
                <option value="closed">Closed / Disposed</option>
                <option value="archived">Archived (Silent)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button type="submit" className="px-4 py-2.5 bg-[#0A2C66] text-white font-extrabold text-[10px] uppercase tracking-widest rounded-md hover:bg-slate-800 transition-all">
              Save Modifications
            </button>
            <button type="button" onClick={() => setEditingJob(null)} className="px-4 py-2.5 border border-slate-200 font-extrabold text-[10px] uppercase tracking-widest rounded-md bg-white text-slate-600 hover:bg-slate-100 transition-all">
              Discard Changes
            </button>
          </div>
        </form>
      )}

      {/* 3. FILTERS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by vacancy title, client name, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white placeholder-slate-400"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-2">Display State:</span>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            {(['all', 'active', 'featured', 'closed', 'archived'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 text-[9px] font-extrabold uppercase rounded transition-all ${
                  statusFilter === f ? 'bg-[#0A2C66] text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. JOBS DATABASE GRID/TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-500 font-semibold">
            <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-[#F8FAFC] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Mandate Position</th>
                <th className="py-3.5 px-4">Enterprise Sponsor</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Applicants</th>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold uppercase">
                    No vacant positions fit your matching query filters.
                  </td>
                </tr>
              ) : (
                filteredJobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-[#0A2C66] text-sm flex items-center gap-1.5">
                        {job.title}
                        {job.status === 'featured' && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-orange-100 text-[#F97316]">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{job.companyName}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold flex items-center gap-0.5 pt-4.5">
                      <DollarSign className="h-3 w-3 text-slate-400" />
                      {job.salary}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 text-[9px] font-bold uppercase bg-slate-100 text-slate-500 rounded-full">
                        {job.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#0A2C66] text-center pl-8">{job.appliedCount || 0}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        job.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                        job.status === 'featured' ? 'bg-orange-50 text-[#F97316]' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-3.5 font-extrabold uppercase text-[10px] tracking-wider">
                      <button 
                        onClick={() => {
                          setEditingJob(job);
                          setShowAddJob(false);
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }} 
                        className="text-[#0A2C66] hover:text-[#F97316] transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
                            deleteJob(job.id);
                          }
                        }} 
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
    </div>
  );
}
