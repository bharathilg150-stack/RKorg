import React, { useState } from 'react';
import { 
  Building2, Users, Trophy, Milestone, CheckCircle2, ChevronRight, 
  Search, ArrowUpRight, HelpCircle, PhoneCall, MessageSquare, Briefcase, 
  UserCheck, ShieldAlert, Award, FileSpreadsheet, MapPin, ExternalLink, Calendar, Eye
} from 'lucide-react';
import { motion } from 'motion/react';
import { Job, Company, BlogPost, FAQItem, Testimonial, ContactMessage, SystemSettings } from '../types';
import TrustedCompanies from './TrustedCompanies';

interface PublicPagesProps {
  route: string;
  setRoute: (route: string) => void;
  jobs: Job[];
  companies: Company[];
  blogs: BlogPost[];
  faqs: FAQItem[];
  testimonials: Testimonial[];
  settings: SystemSettings;
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>) => Promise<boolean>;
}

// -------------------------------------------------------------
// MAIN COMPONENT EXPORTER
// -------------------------------------------------------------
export default function PublicPages({
  route,
  setRoute,
  jobs,
  companies,
  blogs,
  faqs,
  testimonials,
  settings,
  submitContactMessage,
}: PublicPagesProps) {
  switch (route) {
    case 'about':
      return <AboutPage settings={settings} />;;
    case 'services':
      return <ServicesPage />;;
    case 'industries':
      return <IndustriesPage />;;
    case 'blog':
      return <BlogPage blogs={blogs} />;;
    case 'advice':
      return <CareerAdvicePage />;;
    case 'contact':
      return <ContactPage settings={settings} submitContactMessage={submitContactMessage} />;;
    case 'privacy':
      return <PrivacyPage />;;
    case 'terms':
      return <TermsPage />;;
    default:
      return (
        <HomePage 
          setRoute={setRoute} 
          jobs={jobs} 
          companies={companies} 
          blogs={blogs} 
          faqs={faqs} 
          testimonials={testimonials} 
          settings={settings} 
        />
      );
  }
}

// -------------------------------------------------------------
// 1. HOME PAGE
// -------------------------------------------------------------
function HomePage({
  setRoute,
  jobs,
  companies,
  blogs,
  faqs,
  testimonials,
  settings,
}: Omit<PublicPagesProps, 'route' | 'submitContactMessage'>) {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  // Stats Data
  const stats = [
    { number: '12,000+', label: 'Vetted Candidates' },
    { number: '450+', label: 'Enterprise Hires' },
    { number: '98.4%', label: 'Retention Rating' },
    { number: '12 Days', label: 'Average Sourcing Speed' }
  ];

  // Process Steps
  const steps = [
    { num: '01', title: 'Consult & Map', desc: 'We align on candidate personas, culture requirements, and sourcing parameters.' },
    { num: '02', title: 'Dynamic Sourcing', desc: 'Our team queries direct matching vectors, deep networking channels, and proprietary rosters.' },
    { num: '03', title: 'Strict Vetting', desc: 'Pre-screening interview loops and initial academic/technical validation audits.' },
    { num: '04', title: 'Hire & Retain', desc: 'We coordinate interviews, payroll onboarding, background checks, and integration feedback.' }
  ];

  return (
    <div className="font-sans text-slate-800 bg-[#F8FAFC]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Hero text */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-[#F97316] text-[11px] font-bold tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                Elite Corporate Sourcing
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0A2C66] leading-tight tracking-tight">
                Finding the Right Talent. <br />
                <span className="text-[#F97316]">Building Successful Careers.</span>
              </h1>
              
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
                Connecting top-tier businesses with exceptional professionals through modern, vetted recruitment solutions across Bangalore and all of India. Right People. Right Jobs. Right Future.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setRoute('contact')}
                  className="px-8 py-4 bg-[#0A2C66] text-white hover:bg-slate-800 rounded-lg text-sm font-bold tracking-wider uppercase transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                >
                  Hire Exceptional Talent
                  <ChevronRight className="h-4 w-4 text-[#F97316]" />
                </button>
                <button
                  onClick={() => setRoute('jobs')}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 rounded-lg text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                >
                  Find Vetted Jobs
                  <Search className="h-4 w-4 text-[#0A2C66]" />
                </button>
              </div>

              {/* Minimal bullet items */}
              <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-100 max-w-md">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  No Placement Fee for Candidates
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-[#F97316]" />
                  98% Executive Retention
                </div>
              </div>
            </div>

            {/* Hero image placeholder / sleek visual graphic */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-orange-500/10 rounded-2xl filter blur-3xl transform -translate-y-4"></div>
              <div className="relative bg-white border border-slate-100 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h3 className="text-[#0A2C66] text-sm font-black uppercase tracking-wider">Live Sourcing Feed</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Real-Time Placement Status</p>
                  </div>
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100/50 flex justify-between items-center">
                    <div>
                      <div className="text-slate-800 font-bold">Aditya Sharma</div>
                      <div className="text-[10px] text-slate-400">Senior Full-Stack Engineer</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold">SHORTLISTED</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100/50 flex justify-between items-center">
                    <div>
                      <div className="text-slate-800 font-bold">Sister Anjali Mathew</div>
                      <div className="text-[10px] text-slate-400">Lead Nurse Practitioner</div>
                    </div>
                    <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded text-[9px] font-bold">INTERVIEW BOOKED</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100/50 flex justify-between items-center">
                    <div>
                      <div className="text-slate-800 font-bold">Priya Patel</div>
                      <div className="text-[10px] text-slate-400">Frontend Developer</div>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-[9px] font-bold">APPLIED</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 text-center">
                  <p className="text-[10px] text-slate-400">Matched securely across Bangalore & India hubs</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUSTED BY LEADING COMPANIES SECTION */}
      <TrustedCompanies />

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-widest">Our Core Advantage</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A2C66] tracking-tight">
              Why Corporate Leaders Choose Turenakx
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              We reject low-quality mass resumes. We operate as a tactical recruiting partner, matching your culture with thoroughly verified professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 rounded-xl border border-slate-100/60 text-left space-y-4 hover:shadow-lg transition-all">
              <div className="p-3 bg-[#0A2C66]/5 text-[#0A2C66] w-fit rounded-lg">
                <Briefcase className="h-6 w-6 text-[#0A2C66]" />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">Highly Tailored Shortlists</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                We deliver a maximum of 3 highly qualified, fully pre-screened candidates per job posting, eliminating resume fatigue.
              </p>
            </div>
            <div className="p-8 bg-slate-50 rounded-xl border border-slate-100/60 text-left space-y-4 hover:shadow-lg transition-all">
              <div className="p-3 bg-orange-50 text-[#F97316] w-fit rounded-lg">
                <UserCheck className="h-6 w-6 text-[#F97316]" />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">Multi-Tier Background Checks</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                We conduct complete academic confirmation, previous employment audits, and criminal record verification before onboarding.
              </p>
            </div>
            <div className="p-8 bg-slate-50 rounded-xl border border-slate-100/60 text-left space-y-4 hover:shadow-lg transition-all">
              <div className="p-3 bg-blue-50 text-blue-600 w-fit rounded-lg">
                <Award className="h-6 w-6 text-[#0A2C66]" />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">Guaranteed Retention</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                If a hired candidate exits within their first 90 days of permanent placement, we supply a complete replacement at zero fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#0A2C66] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F97316]">{stat.number}</div>
                <div className="text-slate-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR RECRUITMENT PROCESS */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-widest">Sourcing Framework</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A2C66] tracking-tight">
              Our Professional Sourcing Process
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              We optimize candidate discovery with structured, linear workflows, ensuring high-speed delivery of elite profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="p-6 relative bg-slate-50/50 rounded-xl border border-slate-100 text-left space-y-4">
                <div className="text-3xl font-black text-[#F97316]/20 font-sans">{step.num}</div>
                <h3 className="text-slate-800 font-bold text-base">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-widest">Strategic Expertise</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A2C66] tracking-tight">
              Industries We Serve
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Our recruiters have dedicated category expertise, sourcing elite, highly certified professionals for specialized niches.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'IT & Software', desc: 'React, Node, Java, Systems' },
              { name: 'Healthcare', desc: 'Nurse, Doctors, Techs' },
              { name: 'Manufacturing', desc: 'CAD Design, QA, Operations' },
              { name: 'Banking & Finance', desc: 'Associates, CFOs, Analyst' },
              { name: 'Retail & Omnichannel', desc: 'Operations, CRM, Merchandising' },
              { name: 'Logistics', desc: 'Supply Chain, Managers' },
              { name: 'Education', desc: 'Instructors, Deans, Staff' },
              { name: 'Automobile', desc: 'Design, R&D, CAD CATIA' }
            ].map((ind, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 text-left hover:border-[#F97316]/30 hover:shadow-md transition-all cursor-pointer" onClick={() => setRoute('industries')}>
                <div className="h-2 w-10 bg-[#0A2C66] rounded mb-4" />
                <h3 className="text-slate-800 font-bold text-sm mb-1">{ind.name}</h3>
                <p className="text-slate-400 text-[10px] leading-relaxed font-semibold uppercase">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS CTA */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-widest">Latest Placement Demands</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A2C66] tracking-tight">
              Featured Corporate Openings
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Review immediate, active mandates from approved Turenakx staffing partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.filter(j => j.status === 'featured' || j.status === 'active').slice(0, 3).map((job) => (
              <div key={job.id} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm text-left flex flex-col justify-between hover:border-[#0A2C66]/20 transition-all">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-[#F97316] bg-orange-50 px-2.5 py-1 rounded uppercase tracking-wider">
                      {job.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{job.experience}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-[#0A2C66] font-bold text-base hover:underline cursor-pointer" onClick={() => setRoute('jobs')}>
                      {job.title}
                    </h3>
                    <p className="text-slate-500 text-xs font-semibold">{job.companyName}</p>
                  </div>

                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="border-t border-slate-50 pt-4 mt-6 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">{job.salary}</span>
                  <button onClick={() => setRoute('jobs')} className="text-[#0A2C66] hover:text-[#F97316] font-bold flex items-center gap-1">
                    Apply Now
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setRoute('jobs')} className="px-6 py-3 bg-[#0A2C66] text-white hover:bg-slate-800 transition-all rounded-lg text-xs font-bold uppercase tracking-wider">
            Explore All Openings
          </button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-widest">Partner Experiences</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A2C66] tracking-tight">
              Testimonials from Clients & Candidates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div key={test.id} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-all">
                <p className="text-slate-500 text-xs leading-relaxed italic mb-6">
                  "{test.text}"
                </p>
                <div>
                  <div className="text-[#0A2C66] font-bold text-sm">{test.author}</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">{test.role} • {test.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-widest">Common Inquiries</span>
            <h2 className="text-3xl font-black text-[#0A2C66] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50/50">
                <button
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                  className="w-full text-left px-5 py-4 font-bold text-slate-800 text-sm hover:bg-slate-50 flex justify-between items-center"
                >
                  <span>{faq.question}</span>
                  <HelpCircle className="h-4 w-4 text-[#F97316]" />
                </button>
                {activeFaq === faq.id && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-500 leading-relaxed bg-white border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-20 bg-[#0A2C66] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Ready to Accelerate Your Recruitment Funnel?
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto font-medium">
            Contact Turenakx today. Connect with our principal recruiters to source high-impact professionals for permanent, contract, or executive leadership vacancies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setRoute('contact')} className="px-8 py-3.5 bg-[#F97316] text-white hover:bg-orange-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-all">
              Establish Hiring Mandate
            </button>
            <a href={`https://wa.me/${settings.whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer" className="px-8 py-3.5 bg-[#075e54] text-white hover:bg-[#128c7e] rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 2. ABOUT PAGE
// -------------------------------------------------------------
function AboutPage({ settings }: { settings: SystemSettings }) {
  const coreValues = [
    { title: 'Absolute Integrity', desc: 'We deliver clear-cut candidate vetting reports with no glossed-over data.' },
    { title: 'Execution Speed', desc: 'Our dedicated desks operate in sprint formats, delivering shortlists inside 3-7 days.' },
    { title: 'Quality Prerequisite', desc: 'We pre-screen technical capabilities and verify references before representation.' },
    { title: 'Career Alignment', desc: 'We map candidates only to roles where their growth vectors align with hiring companies.' }
  ];

  return (
    <div className="font-sans text-slate-800 bg-[#F8FAFC]">
      {/* HEADER */}
      <section className="bg-[#0A2C66] text-white py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-wider">Corporate Narrative</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            About Turenakx Staffing
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl font-medium">
            Sourcing excellence, driving integration, and building highly retained team architectures. Our professional team serves Bangalore and pan-India markets with premium standards.
          </p>
        </div>
      </section>

      {/* CORE DETAILS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-black text-[#0A2C66] uppercase tracking-tight">Our Story</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Turenakx Staffing & Recruitment Agency was established to address a persistent corporate pain-point: recruitment fatigue driven by low-quality auto-generated resumes. We built a premier specialized desk agency focusing on bespoke sourcing.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              With our Bangalore headquarters, we serve high-tech softwarer houses, specialty clinic networks, manufacturing hubs, and corporate banking firms. We do not just match descriptions; we map capability, potential, and professional synergy.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <div className="bg-white p-5 rounded-xl shadow-sm text-left space-y-2">
              <h3 className="text-[#0A2C66] font-bold text-sm uppercase tracking-wider border-b pb-1">Mission</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                To source top-tier professionals seamlessly, enabling client enterprises to reach execution velocity and job seekers to access secure future pathways.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm text-left space-y-2">
              <h3 className="text-[#F97316] font-bold text-sm uppercase tracking-wider border-b pb-1">Vision</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                To become India’s most trusted staffing partner, renowned for strict verification standards, absolute placement retention, and elite candidate mapping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-slate-50/50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-2xl font-black text-[#0A2C66] uppercase tracking-tight">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 text-left space-y-3">
                <CheckCircle2 className="h-5 w-5 text-[#F97316]" />
                <h3 className="text-slate-800 font-bold text-sm">{v.title}</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM BIO */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-black text-[#0A2C66] uppercase tracking-tight">Our Leadership Desk</h2>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Turenakx Recruitment Directors</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-3xl mx-auto">
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center space-y-4">
              <div className="h-20 w-20 bg-[#0A2C66]/5 rounded-full mx-auto flex items-center justify-center">
                <Users className="h-8 w-8 text-[#0A2C66]" />
              </div>
              <div>
                <h3 className="text-[#0A2C66] font-bold text-lg">Bharathi L.G.</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Managing Partner & Sourcing Expert</p>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                Oversees candidate discovery, resume validation matrix, and business operations out of Bangalore.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center space-y-4">
              <div className="h-20 w-20 bg-orange-50 rounded-full mx-auto flex items-center justify-center">
                <Building2 className="h-8 w-8 text-[#F97316]" />
              </div>
              <div>
                <h3 className="text-[#0A2C66] font-bold text-lg">Akshatha</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Principal Agency Executive</p>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                Directs permanent placements, corporate mandate negotiations, and background vetting systems.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 3. SERVICES PAGE
// -------------------------------------------------------------
function ServicesPage() {
  const corporateServices = [
    { title: 'Permanent Recruitment', desc: 'Direct end-to-end recruitment of verified professionals. We handle screening, coordinate schedules, check references, and guarantee 90-day retention.' },
    { title: 'Executive Search', desc: 'Specialized executive mapping for C-suite roles (CFOs, VP of Engineering, Clinical Directors). Confidentially sourced and thoroughly checked.' },
    { title: 'Contract Staffing', desc: 'Flexible contingent talent for sprint-based engineering projects or busy seasonal medical operations.' },
    { title: 'Bulk & Campus Sourcing', desc: 'Scale recruitment operations for new hubs, warehouse facilities, or fresh academic batches across major Indian tech campuses.' },
    { title: 'Specialized Sourcing Desks', desc: 'Dedicated teams for Software Engineering (React, Node, DBs) and clinical Healthcare personnel (Nurse, Practitioners).' },
    { title: 'Payroll & HR Consulting', desc: 'Comprehensive payroll management, contract structures, wage advice, and general HR audits.' },
    { title: 'Candidate Background Checking', desc: 'Strict multi-source background verification covering criminal record checks, previous employment audit, and academic validation.' }
  ];

  const seekerServices = [
    { title: '100% Free Placement Matching', desc: 'Job seekers pay zero fees. We map your resume only to approved corporate mandates.' },
    { title: 'AI Resume Score Checker', desc: 'Submit your resume against target openings. Get clear mismatch indicators and resume edits.' },
    { title: 'Expert Interview Prep', desc: 'Our category recruiters coach you on specific technical loops and executive communications.' }
  ];

  return (
    <div className="font-sans text-slate-800 bg-[#F8FAFC]">
      {/* HEADER */}
      <section className="bg-[#0A2C66] text-white py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-wider">Recruitment Capabilities</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Our Staffing & HR Services
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl font-medium">
            From direct-hire executive searches to bulk staff sourcing and background verifications, we supply premium-grade HR support.
          </p>
        </div>
      </section>

      {/* CORPORATE SERVICES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl text-left space-y-3">
            <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-widest">Enterprise Solutions</span>
            <h2 className="text-2xl font-black text-[#0A2C66] uppercase tracking-tight">For Hiring Corporate Clients</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {corporateServices.map((srv, idx) => (
              <div key={idx} className="p-6 bg-[#F8FAFC] border border-slate-100 rounded-xl space-y-3 text-left hover:border-[#0A2C66]/20 hover:shadow-md transition-all">
                <div className="h-1.5 w-8 bg-[#F97316] rounded" />
                <h3 className="font-bold text-slate-800 text-base">{srv.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEEKER SERVICES */}
      <section className="py-20 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl text-left space-y-3">
            <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-widest">Job Seeker Support</span>
            <h2 className="text-2xl font-black text-[#0A2C66] uppercase tracking-tight">For Vetted Candidates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {seekerServices.map((srv, idx) => (
              <div key={idx} className="p-6 bg-white border border-slate-100 rounded-xl space-y-3 text-left hover:border-[#0A2C66]/20 hover:shadow-md transition-all">
                <div className="h-1.5 w-8 bg-[#0A2C66] rounded" />
                <h3 className="font-bold text-slate-800 text-base">{srv.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 4. INDUSTRIES PAGE
// -------------------------------------------------------------
function IndustriesPage() {
  const industries = [
    { title: 'IT & Software Engineering', role: 'Full Stack Devs, React/Node Engineers, Team Leads, Solution Architects' },
    { title: 'Healthcare & Lifesciences', role: 'Lead Nurse Practitioners, General Doctors, Clinical Lab Assistants, Ward Supervisors' },
    { title: 'Manufacturing & Heavy Tech', role: 'Mechanical Engineers, CAD designers, Quality Assurance Inspectors, Operations Managers' },
    { title: 'Banking & Financial Sourcing', role: 'Valuation Associates, Investment Bankers, Chartered Accountants, Portfolio Managers' },
    { title: 'Retail & Omnichannel', desc: 'Omnichannel retail staff, logistics personnel, store managers, and visual merchandisers.' },
    { title: 'Logistics & Supply Chain', desc: 'Fulfillment operations supervisors, warehouse leads, transport coordinators, and supply chain analysts.' },
    { title: 'Education & Academics', desc: 'Principal professors, specialized academic instructors, administrative heads, and deans.' },
    { title: 'Automobile Engineering', desc: 'R&D engineers, CATIA/Solidworks experts, sheet metal component designers, and thermal modeling scientists.' }
  ];

  return (
    <div className="font-sans text-slate-800 bg-[#F8FAFC]">
      {/* HEADER */}
      <section className="bg-[#0A2C66] text-white py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-wider">Placement Niches</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Industries We Serve
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl font-medium">
            We operate highly specialized recruiting desks matching candidates into their native functional domains.
          </p>
        </div>
      </section>

      {/* INDUSTRY GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((ind, idx) => (
              <div key={idx} className="bg-[#F8FAFC] border border-slate-100 p-8 rounded-xl text-left space-y-3 hover:border-[#0A2C66]/20 transition-all">
                <h3 className="text-[#0A2C66] font-bold text-lg uppercase tracking-tight">{ind.title}</h3>
                <div className="h-[2px] w-12 bg-[#F97316]" />
                <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                  {ind.role || ind.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 5. BLOG PAGE
// -------------------------------------------------------------
function BlogPage({ blogs }: { blogs: BlogPost[] }) {
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);

  if (activeBlog) {
    return (
      <div className="font-sans text-slate-800 bg-white min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <button onClick={() => setActiveBlog(null)} className="text-xs font-bold text-[#0A2C66] hover:text-[#F97316] flex items-center gap-1.5 uppercase border border-slate-100 px-3.5 py-2 rounded-lg bg-slate-50">
            ← Return to Sourced Blogs
          </button>

          <div className="space-y-4 text-left">
            <span className="px-3 py-1 bg-orange-50 text-[#F97316] text-[10px] font-bold uppercase rounded-full tracking-wider">
              {activeBlog.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0A2C66] leading-tight tracking-tight">
              {activeBlog.title}
            </h1>
            <div className="flex gap-4 text-xs font-semibold text-slate-400">
              <span>By {activeBlog.author}</span>
              <span>•</span>
              <span>{activeBlog.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {activeBlog.views} Reads</span>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100"></div>

          {/* Render blog markdown text in styled paragraphs */}
          <div className="text-slate-600 text-sm leading-relaxed text-left space-y-6 whitespace-pre-line font-medium">
            {activeBlog.content}
          </div>

          <div className="h-[1px] bg-slate-100 pt-6"></div>

          {/* Mock Comments Disabled Banner */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-400">
            <ShieldAlert className="h-4 w-4 text-slate-400" />
            <span>Comments on Turenakx Editorial posts are disabled to protect professional candidate privacy.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-800 bg-[#F8FAFC]">
      {/* HEADER */}
      <section className="bg-[#0A2C66] text-white py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-wider">Sourced Publications</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Turenakx Recruitment Blog
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl font-medium">
            Explore active hiring news, staffing trends, resume optimization, and placement resources compiled by our principal desk heads.
          </p>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((post) => (
              <div key={post.id} className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-6 flex flex-col justify-between hover:border-[#0A2C66]/20 transition-all text-left shadow-sm">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-[#F97316] bg-orange-50 px-2.5 py-1 rounded uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="text-[#0A2C66] font-bold text-lg hover:underline cursor-pointer leading-snug" onClick={() => setActiveBlog(post)}>
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center text-xs font-semibold text-slate-400">
                  <span>{post.date}</span>
                  <button onClick={() => setActiveBlog(post)} className="text-[#0A2C66] hover:text-[#F97316] font-bold">
                    Read Article →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 6. CAREER ADVICE PAGE
// -------------------------------------------------------------
function CareerAdvicePage() {
  const piecesOfAdvice = [
    { title: 'The 2026 Resignation Protocol', text: 'Resigning is a professional transition. Ensure you provide a formal 30-day or 60-day written notice, detailed hand-over notes, and keep verbal descriptions strictly positive. Never burn a bridge; India’s tech & corporate sectors are tightly-knit networks.' },
    { title: 'Structuring High-Impact Resumes', text: 'Reject visual templates with complicated timelines or circular skill bars. Build a clean, single-column document utilizing Calibri or Arial. Put your experience in reverse chronological order, detail achievements using action metrics (e.g. "Increased sales by 20%"), and list core keywords clearly.' },
    { title: 'Excel in Technical Sourcing Loops', text: 'When interview loops involve whiteboards or case studies, emphasize your verbal communication as much as your code or calculations. Explain your reasoning as you sketch your system design or project layout.' },
    { title: 'Navigating Salary Counter-Offers', text: 'Always research regional salary percentiles before negotiations. When offered a counter-offer by your current company, analyze if the underlying push-factors for your job search have truly been resolved, or if it is a transient retainer.' }
  ];

  return (
    <div className="font-sans text-slate-800 bg-[#F8FAFC]">
      {/* HEADER */}
      <section className="bg-[#0A2C66] text-white py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-wider">Resources & Tips</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Expert Career Advice
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl font-medium">
            Learn resume architectures, executive negotiation strategies, and how to successfully navigate complex Indian corporate hiring pipelines.
          </p>
        </div>
      </section>

      {/* ADVICE CARDS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {piecesOfAdvice.map((adv, idx) => (
            <div key={idx} className="bg-[#F8FAFC] border border-slate-100 p-8 rounded-xl text-left space-y-3 hover:border-l-4 hover:border-l-[#F97316] hover:shadow-sm transition-all">
              <h3 className="text-[#0A2C66] font-bold text-lg">{adv.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                {adv.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 7. CONTACT PAGE
// -------------------------------------------------------------
function ContactPage({
  settings,
  submitContactMessage,
}: {
  settings: SystemSettings;
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>) => Promise<boolean>;
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setIsSubmitting(true);
    const ok = await submitContactMessage(form);
    setIsSubmitting(false);
    if (ok) {
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 6000);
    }
  };

  return (
    <div className="font-sans text-slate-800 bg-[#F8FAFC]">
      {/* HEADER */}
      <section className="bg-[#0A2C66] text-white py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <span className="text-[#F97316] text-[11px] font-bold uppercase tracking-wider">Get In Touch</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Connect With Turenakx
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl font-medium">
            Establish a placement mandate or upload a custom candidate query. Our principal desk heads review incoming inquiries within 12 hours.
          </p>
        </div>
      </section>

      {/* CORE CONTACT LAYOUT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Column 1: Info & Details */}
          <div className="lg:col-span-5 text-left space-y-8">
            <h2 className="text-2xl font-black text-[#0A2C66] uppercase tracking-tight">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="p-5 bg-slate-50 border border-slate-100/60 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Principal Phone</div>
                <div className="text-slate-800 font-bold text-base">{settings.phone}</div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-100/60 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recruitment Sourcing Desk</div>
                <div className="text-slate-800 font-bold text-sm truncate">{settings.companyEmail}</div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-100/60 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Office HQ Address</div>
                <div className="text-slate-800 font-semibold text-xs leading-relaxed">{settings.address}</div>
              </div>
            </div>

            {/* Whatsapp Buttons */}
            <div className="pt-2">
              <a 
                href={`https://wa.me/${settings.whatsapp.replace('+', '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-[#075e54] text-white hover:bg-[#128c7e] rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow"
              >
                <MessageSquare className="h-5 w-5 text-white" />
                Open WhatsApp Live Chat
              </a>
            </div>
          </div>

          {/* Column 2: Contact Form */}
          <div className="lg:col-span-7 bg-[#F8FAFC] border border-slate-100 p-8 rounded-2xl">
            <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight mb-6 text-left">Submit Sourcing Query</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs font-bold">
                  ✓ Your contact message has been submitted to rkturenakx@gmail.com. Our principal recruitment desk will connect back within 12 hours.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Inquiry Subject *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message Body *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Detail your hiring numbers, role descriptions, or candidate backgrounds..."
                  className="w-full px-4 py-3 border border-slate-200 focus:border-[#0A2C66] rounded-lg text-xs font-semibold focus:outline-none bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-[#0A2C66] text-white hover:bg-slate-800 transition-all rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Transmit Sourcing Inquiry'}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* MOCK GOOGLE MAPS DESIGN */}
      <section className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex justify-between items-center text-left">
            <div>
              <h3 className="text-[#0A2C66] text-sm font-black uppercase tracking-wider">Office Location Map</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Kumbalagudu, Bangalore, Karnataka</p>
            </div>
            <a 
              href={settings.mapUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-[#F97316] font-bold uppercase tracking-wide hover:underline"
            >
              Open in Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="bg-slate-200 h-80 rounded-xl border border-slate-300 relative overflow-hidden shadow-inner flex flex-col items-center justify-center space-y-3">
            <div className="absolute inset-0 bg-slate-100 opacity-60">
              {/* Abstract layout sketch */}
              <div className="w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>
            <div className="relative p-4 bg-white border border-slate-200 rounded-xl shadow-lg max-w-sm text-left space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A2C66] uppercase">
                <MapPin className="h-4 w-4 text-[#F97316]" />
                Turenakx HQ Bangalore
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                Sowparnika Pranathi Apartment, 8th Floor, #815, Kumbalagudu, Bangalore, Karnataka – 560074, India.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// 8. PRIVACY POLICY
// -------------------------------------------------------------
function PrivacyPage() {
  return (
    <div className="font-sans text-slate-800 bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 text-left space-y-8 font-medium">
        <h1 className="text-3xl font-black text-[#0A2C66] uppercase tracking-tight">Privacy Policy</h1>
        <p className="text-slate-400 text-xs font-bold">Last Updated: July 21, 2026</p>
        <div className="h-[1px] bg-slate-100"></div>

        <div className="text-slate-600 text-xs leading-relaxed space-y-6">
          <p>
            At Turenakx Staffing & Recruitment Agency, we are strictly committed to defending the professional privacy and data confidentiality of our candidates, executive job seekers, and hiring corporate entities.
          </p>

          <h3 className="text-slate-800 font-bold text-sm">1. Sourced Information We Collect</h3>
          <p>
            We collect profile information actively provided during resume uploads, manual candidate builder submission, and employer sourcing registration (including professional names, academic certificates, contact phone numbers, employment logs, and email handles).
          </p>

          <h3 className="text-slate-800 font-bold text-sm">2. Data Sharing and Vetting Protocol</h3>
          <p>
            We strictly do NOT sell, license, or lease personal candidate profiles to third-party list houses. We transmit vetted resumes, backgrounds, and evaluation reports ONLY to approved, registered hiring clients who have engaged us on verified mandates.
          </p>

          <h3 className="text-slate-800 font-bold text-sm">3. Candidates’ Privacy Rights</h3>
          <p>
            At any stage, job seekers have the right to request full removal of their profiles and uploaded resumes. Email rkturenakx@gmail.com with the subject "Data Removal" to execute immediate erasure within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 9. TERMS & CONDITIONS
// -------------------------------------------------------------
function TermsPage() {
  return (
    <div className="font-sans text-slate-800 bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 text-left space-y-8 font-medium">
        <h1 className="text-3xl font-black text-[#0A2C66] uppercase tracking-tight">Terms & Conditions</h1>
        <p className="text-slate-400 text-xs font-bold">Last Updated: July 21, 2026</p>
        <div className="h-[1px] bg-slate-100"></div>

        <div className="text-slate-600 text-xs leading-relaxed space-y-6">
          <p>
            Welcome to the digital portal of Turenakx Staffing & Recruitment Agency. By interacting with our public pages or candidate/employer portals, you agree to these corporate terms.
          </p>

          <h3 className="text-slate-800 font-bold text-sm">1. Candidate Placement Warranties</h3>
          <p>
            Our placement matching and coaching services are 100% free of charge for candidates. We represent job seekers honestly, but do not warrant that submission translates directly to instant recruitment or contractual guarantees.
          </p>

          <h3 className="text-slate-800 font-bold text-sm">2. Employer Obligations</h3>
          <p>
            Corporate clients posting jobs must supply verified role specs and honor active corporate agreements. Background checks handled by Turenakx are advisory; final employment decisions rest with the onboarding client.
          </p>

          <h3 className="text-slate-800 font-bold text-sm">3. Jurisdiction</h3>
          <p>
            Any disputes or claims involving the platforms, mandates, or contracts of Turenakx Staffing are subject exclusively to the jurisdiction of the corporate courts of Bangalore, Karnataka, India.
          </p>
        </div>
      </div>
    </div>
  );
}
