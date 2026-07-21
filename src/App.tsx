import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PublicPages from './components/PublicPages';
import JobsPage from './components/JobsPage';
import CandidatePortal from './components/CandidatePortal';
import EmployerPortal from './components/EmployerPortal';
import AdminPanel from './components/AdminPanel';
import { 
  UserSession, Job, Company, Candidate, Application, BlogPost, 
  FAQItem, Testimonial, ContactMessage, SystemSettings, RealtimeAlert 
} from './types';

export default function App() {
  // Routing State
  const [route, setRoute] = useState<string>('home');

  // Core Database States (Fetched from backend)
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    phone: '+91 8147354351',
    companyEmail: 'rkturenakx@gmail.com',
    supportEmail: 'bharathilg150@gmail.com',
    address: '#815, 8th Floor, Sowparnika Pranathi Apartment, Kumbalagudu, Bangalore – 560074, Karnataka, India.',
    mapUrl: 'https://maps.google.com/?q=Kumbalagudu+Bangalore',
    whatsapp: '+918147354351',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/turenakx',
      facebook: 'https://facebook.com/turenakx',
      twitter: 'https://twitter.com/turenakx',
      instagram: 'https://instagram.com/turenakx'
    }
  });

  // Client Specific States
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [realtimeAlerts, setRealtimeAlerts] = useState<RealtimeAlert[]>([]);

  // Fetch Entire Database on mount
  const fetchData = async () => {
    try {
      const res = await fetch('/api/db');
      const data = await res.json();
      if (data.success) {
        setJobs(data.db.jobs || []);
        setCompanies(data.db.companies || []);
        setCandidates(data.db.candidates || []);
        setApplications(data.db.applications || []);
        setBlogs(data.db.blogs || []);
        setFaqs(data.db.faqs || []);
        setTestimonials(data.db.testimonials || []);
        setContactMessages(data.db.contactMessages || []);
        if (data.db.settings) {
          setSettings(data.db.settings);
        }
      }
    } catch (err) {
      console.error('Error fetching data from API', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Check if user session already exists in localStorage
    const savedSession = localStorage.getItem('turenakx_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUser(parsed);
        // Load associated candidate / company profiles
        resolveActiveProfile(parsed);
      } catch (e) {
        console.error('Error parsing saved session', e);
      }
    }
  }, []);

  // Set up Server Sent Events (SSE) for Real-time Notifications & instant database state sync
  useEffect(() => {
    const eventSource = new EventSource('/api/realtime-updates');

    eventSource.onmessage = (event) => {
      try {
        const alert: RealtimeAlert = JSON.parse(event.data);
        
        // Push alert to local list
        setRealtimeAlerts((prev) => [alert, ...prev].slice(0, 50));
        
        // Instantly trigger re-fetch to sync db edits done by admin, candidates, or employers
        fetchData();
      } catch (err) {
        console.error('Error parsing SSE broadcast alert', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE disconnected or failed. Re-connecting...', err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Helper to load candidate / employer profiles
  const resolveActiveProfile = (session: UserSession) => {
    if (session.role === 'candidate') {
      // Fetch or query candidate from database list
      fetch('/api/db')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const list: Candidate[] = data.db.candidates || [];
            let cand = list.find(c => c.email.toLowerCase() === session.email.toLowerCase());
            if (cand) {
              setActiveCandidate(cand);
              setSavedJobs(cand.savedJobs || []);
            } else {
              // Create default candidate model if missing
              const defaultCand: Candidate = {
                id: session.id,
                name: session.name,
                email: session.email,
                phone: '+91 8147354351',
                skills: ['HTML', 'CSS', 'JavaScript'],
                experience: [],
                education: [],
                certificates: [],
                savedJobs: [],
                backgroundVerified: false,
                created_at: new Date().toISOString()
              };
              setActiveCandidate(defaultCand);
            }
          }
        });
    } else if (session.role === 'employer') {
      fetch('/api/db')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const list: Company[] = data.db.companies || [];
            let comp = list.find(c => c.name.toLowerCase() === session.name.toLowerCase() || c.id === session.id);
            if (comp) {
              setActiveCompany(comp);
            } else {
              const defaultComp: Company = {
                id: session.id,
                name: session.name,
                logoUrl: '/logo_compact.png',
                industry: 'IT & Software',
                location: 'Bangalore',
                description: 'Registered employer of Turenakx Staffing Agency.',
                isFeatured: false,
                contactEmail: session.email,
                contactPhone: '+91 8147354351',
                address: 'Kumbalagudu, Bangalore, Karnataka',
                status: 'approved',
                created_at: new Date().toISOString()
              };
              setActiveCompany(defaultComp);
            }
          }
        });
    }
  };

  // -------------------------------------------------------------
  // REST API SERVICES
  // -------------------------------------------------------------
  const loginUser = async (email: string, pass: string, role: 'candidate' | 'employer') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, role })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.session);
        localStorage.setItem('turenakx_session', JSON.stringify(data.session));
        resolveActiveProfile(data.session);
        setRoute(role === 'candidate' ? 'candidate-portal' : 'employer-portal');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Server communication error.' };
    }
  };

  const registerUser = async (email: string, pass: string, role: 'candidate' | 'employer', name: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, role, name })
      });
      const data = await res.json();
      if (data.success) {
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Server communication error.' };
    }
  };

  const loginAdmin = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.session);
        localStorage.setItem('turenakx_session', JSON.stringify(data.session));
        setRoute('admin');
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const logout = () => {
    setUser(null);
    setActiveCandidate(null);
    setActiveCompany(null);
    setSavedJobs([]);
    localStorage.removeItem('turenakx_session');
    setRoute('home');
  };

  // Sourcing Job CRUD
  const createJob = async (jobPayload: any) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...jobPayload,
          companyId: activeCompany?.id || 'comp-1',
          companyName: activeCompany?.name || 'Vetted Client Partner'
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateJob = async (job: Job) => {
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job sourcing mandate?')) return false;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Submit contact message form
  const submitContactMessage = async (msgPayload: Omit<ContactMessage, 'id' | 'status' | 'created_at'>) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgPayload)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Apply to a job posting
  const applyToJob = async (appPayload: any) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appPayload)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Update pipeline status
  const updateApplicationStatus = async (
    appId: string, 
    status: Application['status'], 
    interviewDetails?: { date: string; time: string; link: string; notes?: string }
  ) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...interviewDetails })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Update profiles settings
  const updateCandidateProfile = async (cand: Candidate) => {
    try {
      const res = await fetch(`/api/candidates/${cand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cand)
      });
      const data = await res.json();
      if (data.success) {
        setActiveCandidate(cand);
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateCompany = async (comp: Company) => {
    try {
      const res = await fetch(`/api/companies/${comp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comp)
      });
      const data = await res.json();
      if (data.success) {
        setActiveCompany(comp);
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateCandidate = async (cand: Candidate) => {
    try {
      const res = await fetch(`/api/candidates/${cand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cand)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // CMS Blog edit/creation services
  const createBlog = async (blogPayload: any) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogPayload)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateBlog = async (blog: BlogPost) => {
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return false;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateSettings = async (newSets: SystemSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSets)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return false;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateMessageStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      const res = await fetch(`/api/messages/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Toggle bookmark / saved job
  const toggleSaveJob = async (jobId: string) => {
    let list = [...savedJobs];
    if (list.includes(jobId)) {
      list = list.filter(id => id !== jobId);
    } else {
      list.push(jobId);
    }
    setSavedJobs(list);

    // Save back to db if candidate profile exists
    if (activeCandidate) {
      const updatedCandidate = { ...activeCandidate, savedJobs: list };
      await updateCandidateProfile(updatedCandidate);
    }
  };

  // Switch routing helper for specific login redirection
  const handleSetRoute = (newRoute: string) => {
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      
      {/* Dynamic Navbar */}
      <Navbar 
        currentRoute={route} 
        setRoute={handleSetRoute} 
        user={user} 
        logout={logout} 
      />

      {/* Main viewport Router */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {route === 'jobs' ? (
              <JobsPage 
                jobs={jobs} 
                user={user} 
                savedJobs={savedJobs} 
                toggleSaveJob={toggleSaveJob} 
                applyToJob={applyToJob} 
                setRoute={handleSetRoute} 
              />
            ) : route === 'candidate-portal' ? (
              <CandidatePortal 
                user={user} 
                jobs={jobs} 
                applications={applications} 
                candidate={activeCandidate} 
                loginUser={loginUser} 
                registerUser={registerUser} 
                updateCandidateProfile={updateCandidateProfile} 
                setRoute={handleSetRoute} 
              />
            ) : route === 'employer-portal' ? (
              <EmployerPortal 
                user={user} 
                jobs={jobs} 
                applications={applications} 
                company={activeCompany} 
                loginUser={loginUser} 
                registerUser={registerUser} 
                createJob={createJob} 
                updateApplicationStatus={updateApplicationStatus} 
                setRoute={handleSetRoute} 
              />
            ) : route === 'admin-login' || route === 'admin' ? (
              <AdminPanel 
                user={user} 
                jobs={jobs} 
                companies={companies} 
                candidates={candidates} 
                applications={applications} 
                blogs={blogs} 
                faqs={faqs} 
                testimonials={testimonials} 
                contactMessages={contactMessages} 
                settings={settings} 
                realtimeAlerts={realtimeAlerts} 
                loginAdmin={loginAdmin} 
                updateJob={updateJob} 
                deleteJob={deleteJob} 
                updateCompany={updateCompany} 
                updateCandidate={updateCandidate} 
                updateApplicationStatus={updateApplicationStatus} 
                updateBlog={updateBlog} 
                deleteBlog={deleteBlog} 
                createBlog={createBlog} 
                updateSettings={updateSettings} 
                deleteMessage={deleteMessage} 
                updateMessageStatus={updateMessageStatus} 
              />
            ) : (
              <PublicPages 
                route={route} 
                setRoute={handleSetRoute} 
                jobs={jobs} 
                companies={companies} 
                blogs={blogs} 
                faqs={faqs} 
                testimonials={testimonials} 
                settings={settings} 
                submitContactMessage={submitContactMessage} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Corporate Footer */}
      <Footer 
        setRoute={handleSetRoute} 
        settings={settings} 
      />

    </div>
  );
}
