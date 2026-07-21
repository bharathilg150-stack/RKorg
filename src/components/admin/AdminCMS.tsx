import React, { useState } from 'react';
import { 
  Plus, Trash2, BookOpen, HelpCircle, Quote, Star, 
  ChevronRight, Calendar, User, Eye, X, CheckCircle2 
} from 'lucide-react';
import { BlogPost, FAQItem, Testimonial } from '../../types';

interface AdminCMSProps {
  blogs: BlogPost[];
  faqs: FAQItem[];
  testimonials: Testimonial[];
  deleteBlog: (id: string) => Promise<boolean>;
  createBlog: (blog: Omit<BlogPost, 'id' | 'views' | 'date'>) => Promise<boolean>;
}

export default function AdminCMS({
  blogs,
  faqs,
  testimonials,
  deleteBlog,
  createBlog,
}: AdminCMSProps) {
  const [cmsTab, setCmsTab] = useState<'blogs' | 'faqs' | 'testimonials'>('blogs');

  // Add Forms toggles
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);

  // Form states
  const [blogForm, setBlogForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Recruitment',
    author: 'Turenakx Editorial Board',
  });

  const [faqForm, setFAQForm] = useState({
    question: '',
    answer: '',
    category: 'General Sourcing',
  });

  const [testimonialForm, setTestimonialForm] = useState({
    author: '',
    role: '',
    company: '',
    text: '',
    rating: 5,
  });

  // Create Blog Submit
  const handleBlogCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.summary || !blogForm.content) {
      alert('Required: Title, Excerpt Summary, and Body content.');
      return;
    }

    const payload: Omit<BlogPost, 'id' | 'views' | 'date'> = {
      title: blogForm.title,
      slug: blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      summary: blogForm.summary,
      content: blogForm.content,
      author: blogForm.author,
      category: blogForm.category,
      status: 'published' as const,
    };

    const ok = await createBlog(payload);
    if (ok) {
      setShowAddBlog(false);
      setBlogForm({
        title: '',
        summary: '',
        content: '',
        category: 'Recruitment',
        author: 'Turenakx Editorial Board',
      });
    }
  };

  // Create FAQ via direct Fetch
  const handleFAQCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) {
      alert('Required: FAQ Question and Answer.');
      return;
    }

    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddFAQ(false);
        setFAQForm({
          question: '',
          answer: '',
          category: 'General Sourcing',
        });
      } else {
        alert('Failed to save FAQ: ' + data.message);
      }
    } catch (err) {
      console.error('FAQ create error', err);
    }
  };

  // Delete FAQ via Fetch
  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        alert('Failed to delete FAQ: ' + data.message);
      }
    } catch (err) {
      console.error('FAQ delete error', err);
    }
  };

  // Create Testimonial via Fetch
  const handleTestimonialCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.author || !testimonialForm.text || !testimonialForm.company) {
      alert('Required: Author name, Company and Review comments.');
      return;
    }

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddTestimonial(false);
        setTestimonialForm({
          author: '',
          role: '',
          company: '',
          text: '',
          rating: 5,
        });
      } else {
        alert('Failed to save testimonial: ' + data.message);
      }
    } catch (err) {
      console.error('Testimonial create error', err);
    }
  };

  // Delete Testimonial via Fetch
  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to remove this client review?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        alert('Failed to delete testimonial: ' + data.message);
      }
    } catch (err) {
      console.error('Testimonial delete error', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-black text-[#0A2C66] uppercase tracking-tight">CMS Sourced Content Editor</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Publish corporate blogs, answer user FAQs & handle testimonials</p>
        </div>

        {/* CMS Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 border border-slate-200 rounded-lg">
          <button
            onClick={() => setCmsTab('blogs')}
            className={`px-3 py-1.5 text-[9px] font-extrabold uppercase rounded flex items-center gap-1.5 transition-all ${
              cmsTab === 'blogs' ? 'bg-[#0A2C66] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Editorial Blogs
          </button>
          <button
            onClick={() => setCmsTab('faqs')}
            className={`px-3 py-1.5 text-[9px] font-extrabold uppercase rounded flex items-center gap-1.5 transition-all ${
              cmsTab === 'faqs' ? 'bg-[#0A2C66] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Sourcing FAQs
          </button>
          <button
            onClick={() => setCmsTab('testimonials')}
            className={`px-3 py-1.5 text-[9px] font-extrabold uppercase rounded flex items-center gap-1.5 transition-all ${
              cmsTab === 'testimonials' ? 'bg-[#0A2C66] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Quote className="h-3.5 w-3.5" />
            Testimonials
          </button>
        </div>
      </div>

      {/* 1. BLOGS SYSTEM SECTION */}
      {cmsTab === 'blogs' && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Editorial Blogs ({blogs.length})</h3>
            <button
              onClick={() => setShowAddBlog(!showAddBlog)}
              className="px-3 py-1.5 bg-[#0A2C66] text-white text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1 hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              {showAddBlog ? 'Close Form' : 'Add New Article'}
            </button>
          </div>

          {showAddBlog && (
            <form onSubmit={handleBlogCreateSubmit} className="space-y-4 bg-slate-50 p-6 border rounded-xl">
              <h4 className="font-extrabold text-[#0A2C66] text-xs uppercase">Draft Sourced Article</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Navigating Healthcare Sourcing Trends"
                    value={blogForm.title}
                    onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sourcing Category</label>
                  <select
                    value={blogForm.category}
                    onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white text-slate-700"
                  >
                    <option value="Recruitment">Recruitment</option>
                    <option value="Resume Preparation">Resume Preparation</option>
                    <option value="Hiring Trends">Hiring Trends</option>
                    <option value="Career Sourcing Advice">Career Sourcing Advice</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Article Excerpt Summary *</label>
                  <input
                    type="text"
                    required
                    placeholder="A quick 1-sentence synopsis of this blog..."
                    value={blogForm.summary}
                    onChange={e => setBlogForm({ ...blogForm, summary: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Editorial Author</label>
                  <input
                    type="text"
                    required
                    value={blogForm.author}
                    onChange={e => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Complete Body Content *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Draft full paragraphs here. HTML & plaintext are supported..."
                  value={blogForm.content}
                  onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-medium bg-white resize-none text-slate-700 leading-relaxed"
                />
              </div>

              <button type="submit" className="px-4 py-2.5 bg-[#F97316] text-white font-extrabold text-[10px] uppercase tracking-widest rounded shadow-md">
                Publish Sourced Article
              </button>
            </form>
          )}

          <div className="space-y-3">
            {blogs.map(post => (
              <div key={post.id} className="p-4 border rounded-xl flex items-center justify-between bg-white hover:shadow-sm transition-shadow">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[#0A2C66] text-sm">{post.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{post.category}</span>
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> By {post.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date || '2026-07-21'}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views || 0} Views</span>
                  </div>
                </div>

                <button 
                  onClick={() => deleteBlog(post.id)} 
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. FAQS SYSTEM SECTION */}
      {cmsTab === 'faqs' && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Corporate FAQs ({faqs.length})</h3>
            <button
              onClick={() => setShowAddFAQ(!showAddFAQ)}
              className="px-3 py-1.5 bg-[#0A2C66] text-white text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1 hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              {showAddFAQ ? 'Close Form' : 'Publish New FAQ'}
            </button>
          </div>

          {showAddFAQ && (
            <form onSubmit={handleFAQCreateSubmit} className="space-y-4 bg-slate-50 p-6 border rounded-xl">
              <h4 className="font-extrabold text-[#0A2C66] text-xs uppercase">Draft Sourced FAQ</h4>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Question *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. What vetting standards are applied to Turenakx nursing candidates?"
                    value={faqForm.question}
                    onChange={e => setFAQForm({ ...faqForm, question: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">FAQ Category</label>
                  <select
                    value={faqForm.category}
                    onChange={e => setFAQForm({ ...faqForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white text-slate-700"
                  >
                    <option value="General Sourcing">General Sourcing</option>
                    <option value="Candidate Vetting">Candidate Vetting</option>
                    <option value="Employer Billing">Employer Billing</option>
                    <option value="Compliance Standards">Compliance Standards</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Answer Commentary *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise regulatory answer commentary..."
                  value={faqForm.answer}
                  onChange={e => setFAQForm({ ...faqForm, answer: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-medium bg-white resize-none text-slate-700 leading-relaxed"
                />
              </div>

              <button type="submit" className="px-4 py-2.5 bg-[#F97316] text-white font-extrabold text-[10px] uppercase tracking-widest rounded shadow-md">
                Publish Sourced FAQ
              </button>
            </form>
          )}

          <div className="space-y-3">
            {faqs.map(faq => (
              <div key={faq.id} className="p-5 border rounded-xl bg-white space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest bg-blue-50 text-[#0A2C66] px-1.5 py-0.5 rounded">
                      {faq.category}
                    </span>
                    <h4 className="font-extrabold text-[#0A2C66] text-sm mt-1">{faq.question}</h4>
                  </div>
                  <button 
                    onClick={() => handleDeleteFAQ(faq.id)} 
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TESTIMONIALS SYSTEM SECTION */}
      {cmsTab === 'testimonials' && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Client Reviews ({testimonials.length})</h3>
            <button
              onClick={() => setShowAddTestimonial(!showAddTestimonial)}
              className="px-3 py-1.5 bg-[#0A2C66] text-white text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1 hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              {showAddTestimonial ? 'Close Form' : 'Publish Review'}
            </button>
          </div>

          {showAddTestimonial && (
            <form onSubmit={handleTestimonialCreateSubmit} className="space-y-4 bg-slate-50 p-6 border rounded-xl">
              <h4 className="font-extrabold text-[#0A2C66] text-xs uppercase">Draft Corporate Review</h4>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Author Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Akshatha R. K."
                    value={testimonialForm.author}
                    onChange={e => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Corporate Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Director Sourcing"
                    value={testimonialForm.role}
                    onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rating</label>
                  <select
                    value={testimonialForm.rating}
                    onChange={e => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white text-slate-700"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sponsoring Enterprise *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Turenakx Recruitment Directors"
                  value={testimonialForm.company}
                  onChange={e => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Review Comments *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe placement feedback and operational efficiencies experienced..."
                  value={testimonialForm.text}
                  onChange={e => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-medium bg-white resize-none text-slate-700 leading-relaxed"
                />
              </div>

              <button type="submit" className="px-4 py-2.5 bg-[#F97316] text-white font-extrabold text-[10px] uppercase tracking-widest rounded shadow-md">
                Publish Client Review
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(test => (
              <div key={test.id} className="p-6 border rounded-xl bg-white space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-0.5">
                      {Array.from({ length: test.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#F97316] text-[#F97316]" />
                      ))}
                    </div>
                    <button 
                      onClick={() => handleDeleteTestimonial(test.id)} 
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-slate-500 text-xs italic font-medium leading-relaxed">
                    "{test.text}"
                  </p>
                </div>

                <div className="border-t pt-3 flex justify-between items-center text-xs font-semibold">
                  <div>
                    <span className="font-extrabold text-[#0A2C66] block">{test.author}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{test.role || 'Partner'} • {test.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
