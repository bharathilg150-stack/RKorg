import React, { useState } from 'react';
import { 
  Settings, Phone, Mail, MapPin, Globe, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { SystemSettings } from '../../types';

interface AdminSettingsProps {
  settings: SystemSettings;
  updateSettings: (settings: SystemSettings) => Promise<boolean>;
}

export default function AdminSettings({
  settings,
  updateSettings,
}: AdminSettingsProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<SystemSettings>({
    companyName: settings.companyName || 'Turenakx Staffing & Recruitment Agency',
    tagline: settings.tagline || 'Connecting exceptional talent with world-class employers',
    phone: settings.phone || '+91 8147354351',
    personalEmail: settings.personalEmail || 'rkturenak@gmail.com',
    companyEmail: settings.companyEmail || 'rkturenakx@gmail.com',
    address: settings.address || 'Apollo Towers, Sector 4, Pune, India - 411001',
    whatsapp: settings.whatsapp || '+918147354351',
    mapUrl: settings.mapUrl || 'https://www.google.com/maps/embed?pb=!1m18',
    socialLinks: settings.socialLinks || { linkedin: '', facebook: '', twitter: '', instagram: '' },
    smtpSettings: settings.smtpSettings || { host: '', port: '', user: '' },
    seoSettings: settings.seoSettings || { titleTemplate: '', defaultDescription: '', keywords: [] },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    const ok = await updateSettings(form);
    if (ok) {
      setSuccess(true);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      setError('Failed to persist global systems settings in db.json');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">Agency System Settings</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
          Modify principal hotlines, headquarters address, email destinations, and live WhatsApp integrations
        </p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 uppercase tracking-wide">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ✓ System settings synced and persisted successfully. Realtime clients refreshed.
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2 uppercase tracking-wide">
          <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Core details */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-black text-[#0A2C66] uppercase tracking-wider border-b pb-2">Core Contact Destinations</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agency Hotlines Phone *</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Corporate Client Email *</label>
              <input
                type="email"
                required
                value={form.companyEmail}
                onChange={e => setForm({ ...form, companyEmail: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live WhatsApp Integration API No. *</label>
              <input
                type="text"
                required
                value={form.whatsapp}
                onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
              />
              <span className="text-[9px] text-slate-400 font-semibold block uppercase">Should be without "+" or spaces, e.g. "918147354351"</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Personal Administrator Email *</label>
              <input
                type="email"
                required
                value={form.personalEmail}
                onChange={e => setForm({ ...form, personalEmail: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Branding & Physical presence */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-black text-[#0A2C66] uppercase tracking-wider border-b pb-2">Branding & Office Headquarters Map Embeds</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agency Legal Brand Name *</label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={e => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Corporate Slogan Tagline *</label>
              <input
                type="text"
                required
                value={form.tagline}
                onChange={e => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Google Maps Embed iframe URL *</label>
            <input
              type="text"
              required
              value={form.mapUrl}
              onChange={e => setForm({ ...form, mapUrl: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Corporate HQ Registered Physical Address *</label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white resize-none text-slate-700 leading-relaxed"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-4 bg-[#F97316] text-white hover:bg-orange-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
        >
          Write & Save Corporate System Settings
        </button>
      </form>
    </div>
  );
}
