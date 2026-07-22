import React, { useState } from 'react';
import { 
  Users, Search, ShieldCheck, ShieldAlert, Trash2, 
  Eye, X, Phone, Mail, Award, BookOpen, Briefcase, FileText, CheckCircle2 
} from 'lucide-react';
import { Candidate } from '../../types';

interface AdminCandidatesProps {
  candidates: Candidate[];
  updateCandidate: (cand: Candidate) => Promise<boolean>;
}

export default function AdminCandidates({
  candidates,
  updateCandidate,
}: AdminCandidatesProps) {
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Delete Candidate dynamically via fetch API route
  const handleDeleteCandidate = async (candId: string) => {
    if (!confirm('Are you absolute sure you want to delete this candidate profile? All associated applications will also be removed.')) return;
    try {
      const res = await fetch(`/api/candidates/${candId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        if (selectedCandidate?.id === candId) setSelectedCandidate(null);
      } else {
        alert('Failed to delete candidate: ' + (data.message || 'Unknown network error'));
      }
    } catch (err) {
      console.error('Delete Candidate Error', err);
    }
  };

  // Save Vetting Notes
  const handleSaveVettingNotes = async (cand: Candidate) => {
    const updated: Candidate = {
      ...cand,
      resumeText: adminNotes ? `${cand.resumeText || ''}\n\n[Vetting Note]: ${adminNotes}` : cand.resumeText
    };
    const ok = await updateCandidate(updated);
    if (ok) {
      setAdminNotes('');
      setSelectedCandidate(updated);
      alert('✓ Verification checks and review comments appended securely.');
    }
  };

  // Extract all unique skills across all candidates for filter dropdown
  const allSkills = Array.from(
    new Set(candidates.flatMap(c => c.skills || []))
  ).sort();

  // Filter candidates list
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = 
      cand.name.toLowerCase().includes(search.toLowerCase()) ||
      cand.email.toLowerCase().includes(search.toLowerCase()) ||
      (cand.phone && cand.phone.includes(search));
    
    const matchesSkill = skillFilter === '' || cand.skills.includes(skillFilter);
    
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight font-sans">Vetted Candidate Pool</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
          Background vetting check, profile records, & comprehensive resume indexes
        </p>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="Search candidates by name, email handle, or contact numbers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="relative">
          <select
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white text-slate-700"
          >
            <option value="">-- ALL RECRUITMENT SKILLS --</option>
            {allSkills.map(sk => (
              <option key={sk} value={sk}>{sk.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CANDIDATES TABLE GRID */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-500 font-semibold">
            <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-[#F8FAFC] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Talent Name</th>
                <th className="py-3.5 px-4">Secure Contact Handle</th>
                <th className="py-3.5 px-4">Vetting State</th>
                <th className="py-3.5 px-4">Assigned Skills</th>
                <th className="py-3.5 px-4 text-right">Corporate Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-bold uppercase">
                    No matching candidate profiles registered.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map(cand => (
                  <tr key={cand.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-800 text-sm">{cand.name}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-600 font-bold">{cand.email}</div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5">{cand.phone || 'No Phone Number'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={cand.backgroundVerified ? 'Verified' : 'Pending'}
                        onChange={async (e) => {
                          const updated: Candidate = { ...cand, backgroundVerified: e.target.value === 'Verified' };
                          await updateCandidate(updated);
                        }}
                        className={`px-3 py-1 text-[10px] rounded font-black uppercase border ${
                          cand.backgroundVerified 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                            : 'bg-orange-50 border-orange-200 text-[#F97316]'
                        }`}
                      >
                        <option value="Pending">Pending Audit</option>
                        <option value="Verified">Verified Check</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {cand.skills.slice(0, 3).map(sk => (
                          <span key={sk} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase">
                            {sk}
                          </span>
                        ))}
                        {cand.skills.length > 3 && (
                          <span className="text-[9px] text-slate-400 font-bold">+{cand.skills.length - 3} more</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-3 text-[10px] uppercase font-black tracking-wider">
                      <button 
                        onClick={() => {
                          setSelectedCandidate(cand);
                          setAdminNotes('');
                        }} 
                        className="text-[#0A2C66] hover:text-[#F97316] transition-colors"
                      >
                        Open Drawer
                      </button>
                      <button 
                        onClick={() => handleDeleteCandidate(cand.id)} 
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

      {/* SLIDEOUT RIGHT HAND PANEL / BIO OVERLAY DRAWER */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-[#051430]/60 backdrop-blur-sm z-50 flex justify-end transition-opacity">
          <div className="w-full max-w-2xl bg-white h-screen overflow-y-auto shadow-2xl p-8 space-y-8 flex flex-col text-left">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-[#0A2C66]">{selectedCandidate.name}</h3>
                  {selectedCandidate.backgroundVerified ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase rounded-full">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Vetted
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-[#F97316] text-[9px] font-bold uppercase rounded-full">
                      <ShieldAlert className="h-3.5 w-3.5 text-[#F97316]" />
                      Unverified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-wide mt-2">
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-slate-400" /> {selectedCandidate.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-slate-400" /> {selectedCandidate.phone || 'No phone number'}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCandidate(null)} 
                className="p-2 border rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Resume Skills list */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-4 w-4 text-[#F97316]" /> Registered Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map(sk => (
                  <span key={sk} className="px-3 py-1 bg-slate-50 border rounded text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Work Experience timeline */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-[#0A2C66]" /> Professional History Timeline
              </h4>

              <div className="space-y-4 border-l-2 border-slate-100 pl-4 ml-2">
                {selectedCandidate.experience && selectedCandidate.experience.length > 0 ? (
                  selectedCandidate.experience.map((exp, idx) => (
                    <div key={idx} className="relative space-y-1.5">
                      <span className="absolute -left-[23px] top-1.5 h-2 w-2 rounded-full bg-[#0A2C66]" />
                      <div className="flex justify-between text-xs font-black">
                        <span className="text-[#0A2C66] text-sm">{exp.title}</span>
                        <span className="text-[#F97316] uppercase font-bold text-[10px] tracking-widest">{exp.duration}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-extrabold uppercase">{exp.company}</div>
                      <p className="text-slate-500 text-xs leading-relaxed font-medium">
                        {exp.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic">No historical timeline available.</div>
                )}
              </div>
            </div>

            {/* Education timeline */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-emerald-600" /> Academic Qualifications
              </h4>

              <div className="space-y-3 border-l-2 border-slate-100 pl-4 ml-2">
                {selectedCandidate.education && selectedCandidate.education.length > 0 ? (
                  selectedCandidate.education.map((edu, idx) => (
                    <div key={idx} className="relative space-y-0.5">
                      <span className="absolute -left-[23px] top-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                      <div className="flex justify-between text-xs font-black">
                        <span className="text-slate-800 text-xs">{edu.degree}</span>
                        <span className="text-slate-400 font-bold">{edu.year}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">{edu.school}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic">No educational records logged.</div>
                )}
              </div>
            </div>

            {/* Resume Plain-Text File */}
            {selectedCandidate.resumeText && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-slate-400" /> Structured Resume Extract
                </h4>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedCandidate.resumeText}
                </div>
              </div>
            )}

            {/* Admin Audit Vetting actions */}
            <div className="border-t pt-6 space-y-4">
              <h4 className="text-[10px] font-black text-[#0A2C66] uppercase tracking-wider">Agency Vetting Notes & Review Check</h4>
              
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase">Background Verification Audit:</span>
                <button
                  type="button"
                  onClick={async () => {
                    const updated = { ...selectedCandidate, backgroundVerified: !selectedCandidate.backgroundVerified };
                    const ok = await updateCandidate(updated);
                    if (ok) setSelectedCandidate(updated);
                  }}
                  className={`px-4 py-1.5 rounded text-[10px] font-extrabold uppercase tracking-widest border transition-all ${
                    selectedCandidate.backgroundVerified 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100' 
                      : 'bg-orange-50 border-orange-200 text-[#F97316] hover:bg-orange-100'
                  }`}
                >
                  {selectedCandidate.backgroundVerified ? 'Verified ✓' : 'Mark as Verified'}
                </button>
              </div>

              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Add Review Vetting Comments</label>
                <textarea
                  placeholder="e.g. Cleared criminal history. High integrity on active RN licenses. Commending top client placement."
                  rows={2}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white resize-none text-slate-700 leading-relaxed"
                />
              </div>

              <button
                type="button"
                onClick={() => handleSaveVettingNotes(selectedCandidate)}
                className="w-full px-5 py-3.5 bg-[#0A2C66] text-white font-extrabold text-[10px] uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-colors"
              >
                Save Review Comments & Append Vetting Status
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
