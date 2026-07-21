import React, { useState } from 'react';
import { 
  Building2, Plus, Search, Trash2, Globe, Mail, 
  Phone, MapPin, X, CheckCircle2, ShieldAlert 
} from 'lucide-react';
import { Company } from '../../types';

interface AdminCompaniesProps {
  companies: Company[];
  updateCompany: (comp: Company) => Promise<boolean>;
}

export default function AdminCompanies({
  companies,
  updateCompany,
}: AdminCompaniesProps) {
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);

  // Form Payload
  const [companyForm, setCompanyForm] = useState({
    name: '',
    industry: 'IT & Software',
    website: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    location: '',
    description: '',
    isFeatured: false,
  });

  // Handle Create Submit via direct fetch
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.name || !companyForm.contactEmail || !companyForm.description) {
      alert('Required fields: Company Name, Contact Email, and Corporate Bio');
      return;
    }

    const payload = {
      ...companyForm,
      id: `company-${Date.now()}`,
      logo: '',
      logoUrl: '',
      status: 'approved' as Company['status'],
      location: companyForm.location || companyForm.address,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddCompany(false);
        setCompanyForm({
          name: '',
          industry: 'IT & Software',
          website: '',
          contactEmail: '',
          contactPhone: '',
          address: '',
          location: '',
          description: '',
          isFeatured: false,
        });
      } else {
        alert('Failed to register partner: ' + data.message);
      }
    } catch (err) {
      console.error('Create company error', err);
    }
  };

  // Handle Delete B2B Client
  const handleDeleteCompany = async (compId: string, compName: string) => {
    if (!confirm(`Are you absolute sure you want to delete corporate partner "${compName}"? Associated active jobs will be orphaned.`)) return;
    try {
      const res = await fetch(`/api/companies/${compId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        alert('Failed to delete corporate partner: ' + data.message);
      }
    } catch (err) {
      console.error('Delete company error', err);
    }
  };

  // Extract unique industries
  const allIndustries = Array.from(
    new Set(companies.map(c => c.industry))
  ).sort();

  // Filter list
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      c.contactEmail.toLowerCase().includes(search.toLowerCase());
    
    const matchesIndustry = industryFilter === '' || c.industry === industryFilter;
    
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Enterprise Corporate Partners</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            B2B client accounts, active alliance states & featured placement mandates
          </p>
        </div>

        <button
          onClick={() => setShowAddCompany(!showAddCompany)}
          className="px-4 py-2 bg-[#0A2C66] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 hover:bg-slate-800 transition-all"
        >
          <Plus className="h-4 w-4" />
          {showAddCompany ? 'Close Registry' : 'Register Corporate Client'}
        </button>
      </div>

      {/* 1. REGISTER CLIENT FORM */}
      {showAddCompany && (
        <form onSubmit={handleCreateSubmit} className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-extrabold text-[#0A2C66] text-xs uppercase tracking-wider">Register B2B Client Alliance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apollo Healthcare Networks"
                value={companyForm.name}
                onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Industrial Domain</label>
              <select
                value={companyForm.industry}
                onChange={e => setCompanyForm({ ...companyForm, industry: e.target.value })}
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

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Corporate Website</label>
              <input
                type="url"
                placeholder="https://apollohealthcare.org"
                value={companyForm.website}
                onChange={e => setCompanyForm({ ...companyForm, website: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Client Contact Email *</label>
              <input
                type="email"
                required
                placeholder="alliances@apollo.org"
                value={companyForm.contactEmail}
                onChange={e => setCompanyForm({ ...companyForm, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Secure Phone Handle</label>
              <input
                type="text"
                placeholder="+91 2244910243"
                value={companyForm.contactPhone}
                onChange={e => setCompanyForm({ ...companyForm, contactPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Geographical Region</label>
              <input
                type="text"
                placeholder="e.g. Pune, Maharashtra"
                value={companyForm.location}
                onChange={e => setCompanyForm({ ...companyForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Corporate Head Office Address</label>
            <input
              type="text"
              placeholder="e.g. Apollo Towers, Sector 4, Pune - 411001"
              value={companyForm.address}
              onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Corporate Bio / Description</label>
            <textarea
              required
              rows={3}
              placeholder="Outline their core operations, employee counts, and focus of candidate placement demands..."
              value={companyForm.description}
              onChange={e => setCompanyForm({ ...companyForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#0A2C66] bg-white resize-none text-slate-700 leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={companyForm.isFeatured}
              onChange={e => setCompanyForm({ ...companyForm, isFeatured: e.target.checked })}
              className="h-4.5 w-4.5 rounded border-slate-300 text-[#0A2C66] focus:ring-[#0A2C66]"
            />
            <label htmlFor="isFeatured" className="text-xs font-extrabold text-slate-500 uppercase tracking-wider cursor-pointer">
              Sponsor Marquee Display Client (Featured Client)
            </label>
          </div>

          <button
            type="submit"
            className="px-5 py-3.5 bg-[#F97316] text-white font-extrabold text-[10px] uppercase tracking-widest rounded-lg hover:bg-orange-600 transition-all"
          >
            Affix Client Alliance Contract
          </button>
        </form>
      )}

      {/* 2. FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search B2B clients by name, contact emails, or office region..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="relative min-w-[200px]">
          <select
            value={industryFilter}
            onChange={e => setIndustryFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#0A2C66] bg-white text-slate-700"
          >
            <option value="">-- ALL INDUSTRIAL DOMAINS --</option>
            {allIndustries.map(ind => (
              <option key={ind} value={ind}>{ind.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. COMPANIES LIST CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-2 p-12 border border-dashed rounded-xl text-center text-xs font-extrabold text-slate-400 uppercase tracking-widest">
            No registered corporate clients fit your filters.
          </div>
        ) : (
          filteredCompanies.map(comp => (
            <div key={comp.id} className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm text-left relative overflow-hidden flex flex-col justify-between">
              
              {/* Highlight ribbon */}
              {comp.isFeatured && (
                <div className="absolute top-0 right-0 bg-[#F97316] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl">
                  Featured Partner
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-[#0A2C66] text-lg">{comp.name}</h3>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-blue-50 text-[#0A2C66] px-2 py-0.5 rounded mt-1.5 inline-block">
                      {comp.industry}
                    </span>
                  </div>
                </div>

                <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3">
                  {comp.description}
                </p>

                {/* Secure Contacts list */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-500">{comp.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-500">{comp.contactPhone || 'No registered phone'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-2 truncate">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-500 truncate">{comp.location || comp.address}</span>
                  </div>
                  {comp.website && (
                    <div className="flex items-center gap-1.5 sm:col-span-2 truncate text-blue-600 hover:underline">
                      <Globe className="h-3.5 w-3.5 text-[#F97316] shrink-0" />
                      <a href={comp.website} target="_blank" rel="noopener noreferrer" className="font-bold">{comp.website}</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action bar */}
              <div className="border-t border-slate-50 pt-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Alliance:</span>
                  <select
                    value={comp.status}
                    onChange={async (e) => {
                      const updated: Company = { ...comp, status: e.target.value as any };
                      await updateCompany(updated);
                    }}
                    className={`px-2.5 py-1 text-[10px] rounded font-black uppercase border ${
                      comp.status === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                      comp.status === 'suspended' ? 'bg-red-50 border-red-200 text-red-800' :
                      'bg-orange-50 border-orange-200 text-[#F97316]'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-wider">
                  <button
                    onClick={async () => {
                      const updated: Company = { ...comp, isFeatured: !comp.isFeatured };
                      await updateCompany(updated);
                    }}
                    className="text-[#F97316] hover:underline"
                  >
                    Toggle Featured
                  </button>
                  <button
                    onClick={() => handleDeleteCompany(comp.id, comp.name)}
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
