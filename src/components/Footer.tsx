import React from 'react';
import { Phone, Mail, MapPin, Linkedin, Facebook, Twitter, Instagram, ShieldCheck } from 'lucide-react';
import Logo from './Logo';
import { SystemSettings } from '../types';

interface FooterProps {
  setRoute: (route: string) => void;
  settings: SystemSettings;
}

export default function Footer({ setRoute, settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#051430] text-slate-300 border-t border-slate-900 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-6">
            <Logo variant="light" className="items-start text-left" />
            <p className="text-slate-400 text-sm leading-relaxed">
              Connecting exceptional talent with premier Indian enterprises. Delivering modern executive sourcing, payroll advisory, and specialized IT & non-IT staffing solutions.
            </p>
            
            <div className="space-y-3 pt-2">
              <a href={`tel:${settings.phone}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-[#F97316] transition-all group">
                <div className="p-1.5 bg-slate-800 rounded group-hover:bg-[#F97316]/10">
                  <Phone className="h-4 w-4 text-[#F97316]" />
                </div>
                <span>{settings.phone}</span>
              </a>
              <a href={`mailto:${settings.companyEmail}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-[#F97316] transition-all group">
                <div className="p-1.5 bg-slate-800 rounded group-hover:bg-[#F97316]/10">
                  <Mail className="h-4 w-4 text-[#F97316]" />
                </div>
                <span className="truncate">{settings.companyEmail}</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <div className="p-1.5 bg-slate-800 rounded mt-0.5">
                  <MapPin className="h-4 w-4 text-[#F97316] flex-shrink-0" />
                </div>
                <span className="leading-relaxed text-xs">{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Sourcing Services */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-6 pb-2 border-b border-slate-800/60 max-w-[120px]">
              Our Services
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                'Permanent Recruitment',
                'Executive Search',
                'Contract Staffing',
                'Bulk & Campus Sourcing',
                'IT & Non-IT Recruitment',
                'Payroll & HR Advisory',
                'Background Verification'
              ].map((service, index) => (
                <li key={index}>
                  <button 
                    onClick={() => setRoute('services')}
                    className="hover:text-white hover:underline transition-all text-left text-slate-400 text-xs"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Industries Sourced */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-6 pb-2 border-b border-slate-800/60 max-w-[120px]">
              Industries
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                'IT & Software Engineering',
                'Healthcare & Lifesciences',
                'Automobile & Heavy Tech',
                'Banking & Financial Sourcing',
                'Retail & E-Commerce',
                'Logistics & Supply Chain',
                'Education & Academic'
              ].map((industry, index) => (
                <li key={index}>
                  <button 
                    onClick={() => setRoute('industries')}
                    className="hover:text-white hover:underline transition-all text-left text-slate-400 text-xs"
                  >
                    {industry}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links & Engagement */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-6 pb-2 border-b border-slate-800/60 max-w-[120px]">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm mb-6">
              {[
                { name: 'Latest Jobs Sourced', id: 'jobs' },
                { name: 'Corporate Story & Bio', id: 'about' },
                { name: 'Expert Career Advice', id: 'advice' },
                { name: 'Industry Sourced Blogs', id: 'blog' },
                { name: 'Connect & Reach Us', id: 'contact' },
                { name: 'Privacy Policy Terms', id: 'privacy' },
                { name: 'Terms & Conditions', id: 'terms' }
              ].map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => setRoute(link.id)}
                    className="hover:text-white hover:underline transition-all text-left text-slate-400 text-xs"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Social handles */}
            <div className="flex gap-3 pt-2">
              <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded text-slate-400 hover:text-white hover:bg-[#F97316] transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded text-slate-400 hover:text-white hover:bg-[#F97316] transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded text-slate-400 hover:text-white hover:bg-[#F97316] transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded text-slate-400 hover:text-white hover:bg-[#F97316] transition-all">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Lower Legal Bar & Admin Panel Link */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-semibold tracking-wide">
          <p>© {currentYear} Turenakx Staffing & Recruitment Agency. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setRoute('privacy')} 
              className="hover:text-slate-300 transition-all"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setRoute('terms')} 
              className="hover:text-slate-300 transition-all"
            >
              Terms & Conditions
            </button>
            <span className="text-slate-800">|</span>
            
            {/* Subtle, highly functional Admin Panel Link */}
            <button
              onClick={() => setRoute('admin-login')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-[#F97316] hover:text-white rounded transition-all group font-bold tracking-wider uppercase text-[10px]"
              id="footer-admin-link"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#F97316] group-hover:text-white transition-all" />
              Admin Panel
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
