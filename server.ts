import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { getSupabaseAdmin } from './src/lib/supabaseClient.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS for production deployments (e.g. Vercel)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Gemini SDK with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI successfully initialized server-side');
  } catch (error) {
    console.error('Failed to initialize Gemini SDK:', error);
  }
} else {
  console.log('No valid GEMINI_API_KEY found, running in AI-simulation mode');
}

// Database JSON File Path with Serverless Read-Only Fallback
let inMemoryDB: any = null;

function getDBPath() {
  if (process.env.VERCEL) {
    return path.join('/tmp', 'db.json');
  }
  return path.join(process.cwd(), 'data', 'db.json');
}

const DB_PATH = getDBPath();

// Ensure data folder exists if possible
try {
  if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }
} catch (e) {
  console.warn('Read-only filesystem detected on init:', e);
}

// Helper: Get or Init Database
function getDB() {
  if (inMemoryDB) return inMemoryDB;

  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      inMemoryDB = JSON.parse(data);
      return inMemoryDB;
    }
  } catch (err) {
    console.warn('Read DB file notice:', err);
  }
    const initialDB = {
      jobs: [
        {
          id: 'job-1',
          title: 'Senior Software Engineer (Full Stack)',
          description: 'We are seeking an experienced Full Stack Developer to design and build scalable web applications. You will collaborate with cross-functional teams to deliver exceptional product experiences for our global enterprise clients.',
          requirements: [
            '5+ years of experience in React, Node.js, and TypeScript.',
            'Strong proficiency in SQL database design (PostgreSQL/MySQL).',
            'Experience with AWS or Google Cloud Platform.',
            'Excellent communication and collaborative problem-solving skills.'
          ],
          salary: '12 - 18 Lakhs PA',
          experience: '5+ Years',
          location: 'Bangalore (Hybrid)',
          skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
          type: 'Hybrid',
          industry: 'IT & Software',
          status: 'featured',
          companyId: 'company-1',
          companyName: 'Turenakx Tech Solutions',
          companyLocation: 'Kumbalagudu, Bangalore',
          created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
          expiry_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
          appliedCount: 2
        },
        {
          id: 'job-2',
          title: 'Lead Nurse Practitioner',
          description: 'Join our premium healthcare clinic as a Lead Nurse Practitioner. You will coordinate patient care, oversee a small clinical team, and work alongside senior physicians to deliver high-quality primary care.',
          requirements: [
            'Master’s degree in Nursing (MSN) and active state license.',
            '4+ years of clinical experience in primary care or family medicine.',
            'Leadership or supervisory experience is highly desired.',
            'Empathetic and patient-centric healthcare philosophy.'
          ],
          salary: '8 - 12 Lakhs PA',
          experience: '4+ Years',
          location: 'Bangalore (Full Time)',
          skills: ['Patient Care', 'Clinical Leadership', 'Nursing License', 'Primary Care'],
          type: 'Full Time',
          industry: 'Healthcare',
          status: 'active',
          companyId: 'company-2',
          companyName: 'MediLife Healthcare Networks',
          companyLocation: 'Koramangala, Bangalore',
          created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
          expiry_date: new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString(),
          appliedCount: 1
        },
        {
          id: 'job-3',
          title: 'Technical Project Manager',
          description: 'We are looking for a Technical Project Manager to oversee software engineering projects from kickoff to delivery. You will coordinate sprints, manage backlogs, remove blockers, and align deliverables with business goals.',
          requirements: [
            '7+ years of experience in IT project management.',
            'Certified Scrum Master (CSM) or PMP is a huge plus.',
            'Proven track record of managing large-scale software releases.',
            'Proficiency in JIRA, Confluence, and Agile methodologies.'
          ],
          salary: '18 - 24 Lakhs PA',
          experience: '7+ Years',
          location: 'Remote (India)',
          skills: ['Agile', 'Scrum', 'Project Management', 'JIRA', 'Confluence'],
          type: 'Remote',
          industry: 'IT & Software',
          status: 'featured',
          companyId: 'company-1',
          companyName: 'Turenakx Tech Solutions',
          companyLocation: 'Kumbalagudu, Bangalore',
          created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
          expiry_date: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString(),
          appliedCount: 0
        },
        {
          id: 'job-4',
          title: 'Automotive CAD Design Engineer',
          description: 'An elite automobile manufacturer is seeking a CAD Design Engineer to create precise engineering models for exterior body components. You will work with premium computer-aided design systems and run thermal/stress simulations.',
          requirements: [
            'Bachelor’s degree in Mechanical or Automobile Engineering.',
            '3+ years of professional experience using CATIA v5/v6 and SolidWorks.',
            'Strong understanding of sheet metal and plastic molding designs.',
            'Ability to read and interpret GD&T engineering prints.'
          ],
          salary: '10 - 15 Lakhs PA',
          experience: '3+ Years',
          location: 'Pune (Full Time)',
          skills: ['CATIA', 'SolidWorks', 'CAD modeling', 'Sheet Metal', 'GD&T'],
          type: 'Full Time',
          industry: 'Automobile',
          status: 'active',
          companyId: 'company-4',
          companyName: 'Nippon Auto India',
          companyLocation: 'Chakan, Pune',
          created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
          expiry_date: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString(),
          appliedCount: 0
        },
        {
          id: 'job-5',
          title: 'Investment Banking Associate',
          description: 'A leading corporate banking partner is expanding its Mumbai team. You will lead financial modeling, conduct industry research, construct valuation decks, and support active client advisory portfolios.',
          requirements: [
            'MBA in Finance, CFA, or equivalent professional credential.',
            '2-4 years of experience in investment banking, advisory, or valuation.',
            'Mastery of advanced financial modeling and valuation methodologies.',
            'High endurance and sharp analytical mindset.'
          ],
          salary: '14 - 20 Lakhs PA',
          experience: '2+ Years',
          location: 'Mumbai (Full Time)',
          skills: ['Financial Modeling', 'Valuation', 'CFA', 'Investment Banking', 'Excel'],
          type: 'Full Time',
          industry: 'Banking & Finance',
          status: 'active',
          companyId: 'company-5',
          companyName: 'Elite Banking Partners',
          companyLocation: 'BKC, Mumbai',
          created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
          expiry_date: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
          appliedCount: 0
        }
      ],
      companies: [
        {
          id: 'company-1',
          name: 'Turenakx Tech Solutions',
          logo: '',
          industry: 'IT & Software',
          contactEmail: 'tech@turenakx.com',
          contactPhone: '+91 8147354351',
          address: '8th Floor, Sowparnika Pranathi, Kumbalagudu, Bangalore',
          description: 'Enterprise IT solutions and professional staffing services offering digital transformation expertise globally.',
          status: 'approved',
          website: 'https://turenakx.com',
          created_at: new Date().toISOString()
        },
        {
          id: 'company-2',
          name: 'MediLife Healthcare Networks',
          logo: '',
          industry: 'Healthcare',
          contactEmail: 'careers@medilife.org',
          contactPhone: '+91 9845201244',
          address: 'Koramangala 4th Block, Bangalore',
          description: 'A premium network of private clinics and multi-specialty family care hospitals across Southern India.',
          status: 'approved',
          website: 'https://medilife.org',
          created_at: new Date().toISOString()
        },
        {
          id: 'company-3',
          name: 'Future Retail & Commerce',
          logo: '',
          industry: 'Retail',
          contactEmail: 'jobs@futureretail.in',
          contactPhone: '+91 8847621122',
          address: 'Connaught Place, New Delhi',
          description: 'Omnichannel retail giant managing fast-fashion and electronic lifestyle outlets nationwide.',
          status: 'approved',
          website: 'https://futureretail.in',
          created_at: new Date().toISOString()
        },
        {
          id: 'company-4',
          name: 'Nippon Auto India',
          logo: '',
          industry: 'Automobile',
          contactEmail: 'careers@nipponauto.co.in',
          contactPhone: '+91 7765439121',
          address: 'MIDC Industrial Area, Pune',
          description: 'Premier automotive design house manufacturing components and performance transmission assemblies.',
          status: 'approved',
          website: 'https://nipponauto.co.in',
          created_at: new Date().toISOString()
        },
        {
          id: 'company-5',
          name: 'Elite Banking Partners',
          logo: '',
          industry: 'Banking & Finance',
          contactEmail: 'talent@elitebanking.com',
          contactPhone: '+91 2244910243',
          address: 'Bandra Kurla Complex, Mumbai',
          description: 'A prominent private banking firm offering premier treasury, wealth, and commercial trade funding solutions.',
          status: 'approved',
          website: 'https://elitebanking.com',
          created_at: new Date().toISOString()
        }
      ],
      applications: [
        {
          id: 'app-1',
          jobId: 'job-1',
          jobTitle: 'Senior Software Engineer (Full Stack)',
          candidateId: 'cand-1',
          candidateName: 'Aditya Sharma',
          candidateEmail: 'aditya.sharma@example.com',
          candidatePhone: '+91 9123456789',
          resumeText: 'Experienced Senior Full Stack Developer. Skills: React, Node.js, TypeScript, PostgreSQL. 5 years at TechCorp, building responsive dashboards and scalable APIs.',
          resumeScore: 88,
          resumeAnalysis: {
            strengths: ['Core stack match (React, Node, TypeScript)', 'Database proficiency with SQL', '5 years of professional experience'],
            gaps: ['No specific mention of AWS/GCP cloud architectures', 'Lacks experience in high-traffic scaling'],
            recommendations: ['Detail cloud deployment practices', 'Add system architectural diagrams in portfolio'],
            matchedSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
            jobFitPercentage: 88
          },
          status: 'shortlisted',
          notes: 'Aditya showed exceptionally high knowledge in SQL and client-side optimization. Interview scheduled for final loop.',
          interviewDate: '2026-07-25',
          interviewTime: '11:00 AM',
          interviewLink: 'https://meet.google.com/abc-defg-hij',
          appliedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: 'app-2',
          jobId: 'job-1',
          jobTitle: 'Senior Software Engineer (Full Stack)',
          candidateId: 'cand-2',
          candidateName: 'Priya Patel',
          candidateEmail: 'priya.patel@example.com',
          candidatePhone: '+91 9876543210',
          resumeText: 'React developer with 3 years of frontend experience. Looking for full stack. Skills: HTML, CSS, JavaScript, React, Tailwind CSS. Limited backend experience.',
          resumeScore: 55,
          resumeAnalysis: {
            strengths: ['Strong React frontend skills', 'Tailwind and UI development experience'],
            gaps: ['Lacks 5+ years of required experience (has 3)', 'No Node.js or backend database expertise mentioned'],
            recommendations: ['Build database-driven backend portfolios', 'Learn TypeScript and basic system design'],
            matchedSkills: ['React', 'Tailwind CSS'],
            jobFitPercentage: 55
          },
          status: 'applied',
          notes: 'Needs backend screening.',
          appliedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: 'app-3',
          jobId: 'job-2',
          jobTitle: 'Lead Nurse Practitioner',
          candidateId: 'cand-3',
          candidateName: 'Sister Anjali Mathew',
          candidateEmail: 'anjali.mathew@example.com',
          candidatePhone: '+91 9900887766',
          resumeText: 'Nursing supervisor with 6 years experience. MSN from Manipal. Active RN license. Coordinated family health ward of 20 beds.',
          resumeScore: 92,
          resumeAnalysis: {
            strengths: ['Master’s degree in nursing (MSN)', '6 years experience exceeds the 4-year minimum', 'Active RN license'],
            gaps: ['No direct private family-clinic experience'],
            recommendations: ['Highlight primary care clinic interactions'],
            matchedSkills: ['Patient Care', 'Clinical Leadership', 'Nursing License', 'Primary Care'],
            jobFitPercentage: 92
          },
          status: 'interview_scheduled',
          notes: 'Strong candidate. Verified active license. Patient-focused, very professional.',
          interviewDate: '2026-07-23',
          interviewTime: '02:30 PM',
          interviewLink: 'https://meet.google.com/xyz-qprs-tuv',
          appliedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
        }
      ],
      candidates: [
        {
          id: 'cand-1',
          name: 'Aditya Sharma',
          email: 'aditya.sharma@example.com',
          phone: '+91 9123456789',
          resumeText: 'Experienced Senior Full Stack Developer. Skills: React, Node.js, TypeScript, PostgreSQL. 5 years at TechCorp, building responsive dashboards and scalable APIs.',
          skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redux', 'REST APIs'],
          experience: [
            {
              title: 'Senior Software Engineer',
              company: 'TechCorp Software',
              duration: '2023 - Present',
              description: 'Led a team of 3 developers building responsive fintech dashboards and serverless APIs. Reduced page load speeds by 30%.'
            },
            {
              title: 'Full Stack Developer',
              company: 'InnoSystems',
              duration: '2021 - 2023',
              description: 'Engineered robust database integrations and scalable GraphQL endpoints.'
            }
          ],
          education: [
            {
              degree: 'Bachelor of Technology (B.Tech) in Computer Science',
              school: 'VIT University',
              year: '2021'
            }
          ],
          savedJobs: ['job-3'],
          created_at: new Date().toISOString()
        },
        {
          id: 'cand-2',
          name: 'Priya Patel',
          email: 'priya.patel@example.com',
          phone: '+91 9876543210',
          resumeText: 'React developer with 3 years of frontend experience. Looking for full stack. Skills: HTML, CSS, JavaScript, React, Tailwind CSS. Limited backend experience.',
          skills: ['React', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
          experience: [
            {
              title: 'Frontend Developer',
              company: 'AppStudio Solutions',
              duration: '2023 - Present',
              description: 'Designed pixel-perfect React websites and implemented state management using Redux Toolkit.'
            }
          ],
          education: [
            {
              degree: 'Bachelor of Engineering (BE) in Information Technology',
              school: 'Gujarat Technological University',
              year: '2023'
            }
          ],
          savedJobs: [],
          created_at: new Date().toISOString()
        },
        {
          id: 'cand-3',
          name: 'Sister Anjali Mathew',
          email: 'anjali.mathew@example.com',
          phone: '+91 9900887766',
          resumeText: 'Nursing supervisor with 6 years experience. MSN from Manipal. Active RN license. Coordinated family health ward of 20 beds.',
          skills: ['Patient Care', 'Clinical Leadership', 'Nursing License', 'Primary Care', 'Ward Coordination'],
          experience: [
            {
              title: 'Nursing Supervisor',
              company: 'St. Mary’s General Hospital',
              duration: '2022 - Present',
              description: 'Supervised clinical operations of a 20-bed family health ward. Managed a nursing staff of 12.'
            },
            {
              title: 'Clinical Nurse Practitioner',
              company: 'City Family Clinic',
              duration: '2020 - 2022',
              description: 'Provided primary diagnosis, vaccinations, and therapeutic support to family patients.'
            }
          ],
          education: [
            {
              degree: 'Master of Science in Nursing (MSN)',
              school: 'Manipal Academy of Higher Education',
              year: '2020'
            }
          ],
          savedJobs: [],
          created_at: new Date().toISOString()
        }
      ],
      blogs: [
        {
          id: 'blog-1',
          title: 'How to Optimize Your Resume for ATS Parsers in 2026',
          slug: 'how-to-optimize-resume-for-ats-parsers-2026',
          content: `In the modern recruitment landscape, more than 98% of Fortune 500 corporations and elite staffing agencies utilize Applicant Tracking Systems (ATS) to filter and score incoming resumes. This means your beautifully formatted resume might never be seen by a human recruiter if it is not fully optimized.

### 1. Plain Text is King
While visually complex layouts with columns, circular progress charts, and floating graphical boxes look stunning, they frequently break standard PDF parsing parsers. Stick to a clean, single-column linear layout. Use high-contrast headings and standard fonts like Arial or Calibri.

### 2. Focus on Semantic Keyword Matching
Applicant Tracking Systems parse your document for exact matches of skills, technologies, and certifications highlighted in the job posting. Review your target job listing, extract their exact phrases (such as "React", "Scrum Master", or "Clinical Supervision"), and naturally weave them into your summary and experience blocks.

### 3. Clear Job Titles and Dates
Recruitment parsers attempt to build a historical timeline of your career. Use standard job titles (e.g., "Software Engineer" rather than "Coding Wizard") and explicit date ranges in Month/Year format (e.g., "06/2023 - Present").`,
          summary: 'Unlock the secrets of Applicant Tracking Systems (ATS) and learn standard strategies to pass recruiter parsing engines with a perfect score.',
          author: 'RK Turenakx Staffing Editorial',
          category: 'Career Advice',
          date: 'July 15, 2026',
          image: '',
          status: 'published',
          views: 128
        },
        {
          id: 'blog-2',
          title: 'Top IT and Software Engineering Trends Shaping Careers in India',
          slug: 'top-it-software-engineering-trends-india',
          content: `The tech sector in India is experiencing a profound architectural shift. Beyond simple outsourcing, multinational design centers and local SaaS champions are demanding high-level specialization.

### 1. The Rise of TypeScript & Full Stack Autonomy
The line between frontend and backend is fading. Engineering hubs are prioritizing developers who can own a feature end-to-end—designing React client layouts, building TypeScript server routes, and scaling relational SQL schemas.

### 2. Generative AI Co-Piloting
AI is not replacing engineers, but engineers who master AI tools are replacing those who do not. Recruiters are actively searching for professionals who understand LLM integration, vector databases, and retrieval-augmented workflows.

### 3. Hybrid Workspace Policies
Indian IT offices are settling on balanced 3-day hybrid schedules. Cultivating remote discipline and professional verbal/written communication is now as critical as writing clean code.`,
          summary: 'Explore key industry updates driving full stack tech recruitment and essential skills developers need in the modern workspace.',
          author: 'Bharathi L.G.',
          category: 'Industry Insights',
          date: 'July 19, 2026',
          image: '',
          status: 'published',
          views: 245
        }
      ],
      faqs: [
        {
          id: 'faq-1',
          question: 'How long does it take to find candidates through Turenakx?',
          answer: 'For permanent recruitment and general IT/non-IT roles, we present highly qualified and fully vetted candidate shortlists within 3 to 7 business days. Executive search roles can take 2 to 3 weeks of thorough market mapping.',
          category: 'Employers'
        },
        {
          id: 'faq-2',
          question: 'Are there any fees or registration charges for job seekers?',
          answer: 'None whatsoever. The services of Turenakx Staffing & Recruitment Agency are 100% free for candidates. This includes job matching, interview preparation coaching, and career guidance. We only bill our registered hiring corporate clients.',
          category: 'Candidates'
        },
        {
          id: 'faq-3',
          question: 'Do you offer payroll management and background verification services?',
          answer: 'Yes, we provide end-to-end HR support including comprehensive temporary payroll management, candidate background checking (academic verification, criminal checks, and previous employment audits), and HR advisory.',
          category: 'Services'
        }
      ],
      testimonials: [
        {
          id: 'test-1',
          author: 'Dr. Ananth Krishnan',
          role: 'HR Director',
          company: 'MediLife Healthcare Networks',
          text: 'Turenakx completely transformed our healthcare hiring workflow. Finding qualified lead nurse practitioners and clinical personnel is extremely tough in Bangalore, but their medical recruitment desk presented three vetted candidates within 5 days. Highly professional and streamlined!',
          rating: 5
        },
        {
          id: 'test-2',
          author: 'Meera Deshmukh',
          role: 'Senior React Developer',
          company: 'Candidate Success',
          text: 'The resume feedback and dedicated interview coaching provided by the recruiters at Turenakx made all the difference. They helped me land an elite Senior Full Stack role in Bangalore with a 40% salary hike. Highly recommend their free career guidance services!',
          rating: 5
        },
        {
          id: 'test-3',
          author: 'Rajesh Patel',
          role: 'VP of Operations',
          company: 'QuickRetail & Logistics',
          text: 'We engaged Turenakx for a bulk hiring staffing mandate for our new warehouse hub. They managed candidate sourcing, on-site interviews, and comprehensive background verification for 50+ staff members in under two weeks. Exceptional dedication and execution.',
          rating: 5
        }
      ],
      contactMessages: [
        {
          id: 'msg-1',
          name: 'Sanjeev Kumar',
          email: 'sanjeev.kumar@company.com',
          phone: '+91 9443210099',
          subject: 'Bulk Sourcing Recruitment Partnership',
          message: 'Hello Turenakx Team, we are looking to establish a long-term contract staffing and permanent hiring partnership for our manufacturing facility in Bangalore. Please connect us with your corporate business development head.',
          status: 'unread',
          created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
        }
      ],
      settings: {
        companyName: 'Turenakx Staffing & Recruitment Agency',
        tagline: 'Right People. Right Jobs. Right Future.',
        phone: '+91 8147354351',
        personalEmail: 'bharathilg150@gmail.com',
        companyEmail: 'rkturenakx@gmail.com',
        address: '#815, 8th Floor, Sowparnika Pranathi Apartment, Kumbalagudu, Bangalore – 560074, Karnataka, India',
        whatsapp: '+918147354351',
        mapUrl: 'https://maps.google.com/?q=Sowparnika+Pranathi+Apartment+Kumbalagudu+Bangalore',
        socialLinks: {
          linkedin: 'https://linkedin.com/company/turenakx',
          facebook: 'https://facebook.com/turenakx',
          twitter: 'https://twitter.com/turenakx',
          instagram: 'https://instagram.com/turenakx'
        },
        smtpSettings: {
          host: 'smtp.resend.com',
          port: '587',
          user: 'resend'
        },
        seoSettings: {
          titleTemplate: '%s | Turenakx Staffing Bangalore',
          defaultDescription: 'Turenakx Staffing & Recruitment Agency Bangalore. Connecting elite corporate clients with exceptional professionals across India.',
          keywords: ['Recruitment Agency Bangalore', 'Staffing Services India', 'IT Placement', 'Contract Staffing']
        }
      },
      auditLogs: [
        {
          id: 'log-1',
          user: 'System Bot',
          action: 'Database Bootstrap',
          target: 'data/db.json',
          timestamp: new Date().toISOString()
        }
      ],
      updateVersion: 1
    };

    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Read-only filesystem detected, maintaining DB in memory:', e);
    }
    inMemoryDB = initialDB;
    return initialDB;
}

// Helper: Save Database
function saveDB(db: any) {
  db.updateVersion = (db.updateVersion || 0) + 1;
  inMemoryDB = db;
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to disk (read-only environment), updated in-memory DB:', err);
  }
  notifyRealtimeClients();
}

// ========================================================
// SUPABASE DUAL-MODE ENGINE & HELPER ADAPTERS
// ========================================================

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = 
    process.env.SUPABASE_SERVICE_ROLE_KEY || 
    process.env.SUPABASE_SECRET_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
    process.env.VITE_SUPABASE_ANON_KEY || 
    process.env.SUPABASE_ANON_KEY;
  return !!(url && key);
}

async function getSupabaseDB() {
  const admin = getSupabaseAdmin();
  
  const [
    { data: jobs },
    { data: companies },
    { data: candidates },
    { data: applications },
    { data: blogs },
    { data: faqs },
    { data: testimonials },
    { data: contactMessages },
    { data: auditLogs },
    { data: settingsData }
  ] = await Promise.all([
    admin.from('jobs').select('*').order('created_at', { ascending: false }),
    admin.from('companies').select('*').order('created_at', { ascending: false }),
    admin.from('candidates').select('*').order('created_at', { ascending: false }),
    admin.from('applications').select('*').order('applied_at', { ascending: false }),
    admin.from('blogs').select('*').order('date', { ascending: false }),
    admin.from('faqs').select('*'),
    admin.from('testimonials').select('*'),
    admin.from('contact_messages').select('*').order('created_at', { ascending: false }),
    admin.from('activity_logs').select('*').order('timestamp', { ascending: false }),
    admin.from('settings').select('*').eq('id', 'global').maybeSingle()
  ]);

  return {
    jobs: jobs || [],
    companies: (companies || []).map((c: any) => ({ ...c, logoUrl: c.logo_url })),
    candidates: (candidates || []).map((c: any) => ({
      ...c,
      resumeText: c.resume_text,
      savedJobs: c.saved_jobs || [],
      backgroundVerified: c.background_verified,
    })),
    applications: (applications || []).map((a: any) => ({
      ...a,
      jobId: a.job_id,
      jobTitle: a.job_title,
      candidateId: a.candidate_id,
      candidateName: a.candidate_name,
      candidateEmail: a.candidate_email,
      candidatePhone: a.candidate_phone,
      resumeText: a.resume_text,
      resumeScore: a.resume_score,
      resumeAnalysis: a.resume_analysis,
      interviewDate: a.interview_date,
      interviewTime: a.interview_time,
      interviewLink: a.interview_link,
      appliedAt: a.applied_at
    })),
    blogs: (blogs || []).map((b: any) => ({
      ...b,
      image: b.image || ''
    })),
    faqs: faqs || [],
    testimonials: testimonials || [],
    contactMessages: (contactMessages || []).map((cm: any) => ({
      ...cm,
      createdAt: cm.created_at
    })),
    auditLogs: (auditLogs || []).map((l: any) => ({
      id: l.id,
      user: l.user_name,
      action: l.action,
      target: l.target,
      timestamp: l.timestamp
    })),
    settings: settingsData || {
      companyName: 'Turenakx Staffing & Recruitment Agency',
      tagline: 'Right People. Right Jobs. Right Future.',
      phone: '+91 8147354351',
      personalEmail: 'bharathilg150@gmail.com',
      companyEmail: 'rkturenakx@gmail.com',
      address: '#815, 8th Floor, Sowparnika Pranathi Apartment, Kumbalagudu, Bangalore – 560074, Karnataka, India',
      whatsapp: '+918147354351',
      mapUrl: 'https://maps.google.com/?q=Sowparnika+Pranathi+Apartment+Kumbalagudu+Bangalore',
      socialLinks: { linkedin: '', facebook: '', twitter: '', instagram: '' },
      smtpSettings: { host: '', port: '', user: '' },
      seoSettings: { titleTemplate: '', defaultDescription: '', keywords: [] }
    }
  };
}

async function bootstrapSupabase() {
  if (!isSupabaseConfigured()) {
    console.log('Supabase environment variables not configured yet. Fallback local json db mode active.');
    return;
  }
  
  try {
    const admin = getSupabaseAdmin();
    console.log('Supabase credentials detected. Running auto-initializer and storage check...');
    
    // 1. Create storage buckets
    const buckets = ['resumes', 'company-logos', 'blog-images', 'profile-images', 'documents', 'website-assets'];
    for (const b of buckets) {
      await admin.storage.createBucket(b, { public: true }).catch((e: any) => {});
    }
    
    // 2. Run schema check & seed if empty
    const { data: existingJobs, error: selectErr } = await admin.from('jobs').select('id').limit(1);
    if (selectErr) {
      console.error('⚠ Error checking jobs table in Supabase. Have you run /supabase_schema.sql inside your Supabase SQL Editor?', selectErr.message || selectErr);
      return;
    }

    if (!existingJobs || existingJobs.length === 0) {
      console.log('Supabase tables are empty. Initiating automatic data seeding from data/db.json...');
      const localDB = getDB();
      
      // A. Settings
      if (localDB.settings) {
        await admin.from('settings').upsert({
          id: 'global',
          company_name: localDB.settings.companyName || 'Turenakx Staffing & Recruitment Agency',
          tagline: localDB.settings.tagline || '',
          phone: localDB.settings.phone || '',
          personal_email: localDB.settings.personalEmail || '',
          company_email: localDB.settings.companyEmail || '',
          address: localDB.settings.address || '',
          whatsapp: localDB.settings.whatsapp || '',
          map_url: localDB.settings.mapUrl || '',
          social_links: localDB.settings.socialLinks || {},
          smtp_settings: localDB.settings.smtpSettings || {},
          seo_settings: localDB.settings.seoSettings || {}
        });
      }

      // B. Companies
      if (localDB.companies && localDB.companies.length > 0) {
        await admin.from('companies').insert(localDB.companies.map((c: any) => ({
          id: c.id,
          name: c.name,
          logo_url: c.logoUrl || c.logo || '',
          industry: c.industry || '',
          contact_email: c.contactEmail,
          contact_phone: c.contactPhone || '',
          address: c.address || '',
          location: c.location || '',
          description: c.description || '',
          status: c.status || 'approved',
          is_featured: c.isFeatured || false,
          website: c.website || '',
          created_at: c.created_at || new Date().toISOString()
        })));
      }

      // C. Candidates
      if (localDB.candidates && localDB.candidates.length > 0) {
        await admin.from('candidates').insert(localDB.candidates.map((cand: any) => ({
          id: cand.id,
          name: cand.name,
          email: cand.email,
          phone: cand.phone || '',
          resume_text: cand.resumeText || cand.resume_text || '',
          skills: cand.skills || [],
          experience: cand.experience || [],
          education: cand.education || [],
          saved_jobs: cand.savedJobs || [],
          certificates: cand.certificates || [],
          background_verified: cand.backgroundVerified || false,
          created_at: cand.created_at || new Date().toISOString()
        })));
      }

      // D. Jobs
      if (localDB.jobs && localDB.jobs.length > 0) {
        await admin.from('jobs').insert(localDB.jobs.map((j: any) => ({
          id: j.id,
          title: j.title,
          description: j.description || '',
          requirements: j.requirements || [],
          salary: j.salary || '',
          experience: j.experience || '',
          location: j.location || '',
          skills: j.skills || [],
          type: j.type || 'Full Time',
          industry: j.industry || '',
          status: j.status || 'active',
          company_id: j.companyId,
          company_name: j.companyName || '',
          company_logo: j.companyLogo || '',
          company_location: j.companyLocation || '',
          created_at: j.created_at || new Date().toISOString(),
          expiry_date: j.expiry_date || new Date(Date.now() + 30*24*3600*1000).toISOString(),
          applied_count: j.appliedCount || 0
        })));
      }

      // E. Applications
      if (localDB.applications && localDB.applications.length > 0) {
        await admin.from('applications').insert(localDB.applications.map((a: any) => ({
          id: a.id,
          job_id: a.jobId,
          job_title: a.jobTitle,
          candidate_id: a.candidateId,
          candidate_name: a.candidateName,
          candidate_email: a.candidateEmail,
          candidate_phone: a.candidatePhone || '',
          resume_text: a.resumeText || '',
          resume_score: a.resumeScore || 0,
          resume_analysis: a.resumeAnalysis || {},
          status: a.status || 'applied',
          notes: a.notes || '',
          interview_date: a.interviewDate || '',
          interview_time: a.interviewTime || '',
          interview_link: a.interviewLink || '',
          applied_at: a.appliedAt || new Date().toISOString()
        })));
      }

      // F. Blogs
      if (localDB.blogs && localDB.blogs.length > 0) {
        await admin.from('blogs').insert(localDB.blogs.map((b: any) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          content: b.content,
          summary: b.summary || '',
          author: b.author || '',
          category: b.category || '',
          date: b.date || '',
          image: b.image || '',
          status: b.status || 'published',
          views: b.views || 0
        })));
      }

      // G. FAQs
      if (localDB.faqs && localDB.faqs.length > 0) {
        await admin.from('faqs').insert(localDB.faqs.map((f: any) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          category: f.category || ''
        })));
      }

      // H. Testimonials
      if (localDB.testimonials && localDB.testimonials.length > 0) {
        await admin.from('testimonials').insert(localDB.testimonials.map((t: any) => ({
          id: t.id,
          author: t.author,
          role: t.role || '',
          company: t.company || '',
          text: t.text,
          rating: t.rating || 5,
          image: t.image || ''
        })));
      }

      // I. Contact Messages
      if (localDB.contactMessages && localDB.contactMessages.length > 0) {
        await admin.from('contact_messages').insert(localDB.contactMessages.map((cm: any) => ({
          id: cm.id,
          name: cm.name,
          email: cm.email,
          phone: cm.phone || '',
          subject: cm.subject || '',
          message: cm.message || '',
          status: cm.status || 'unread',
          created_at: cm.created_at || cm.createdAt || new Date().toISOString()
        })));
      }

      // J. Audit Logs
      if (localDB.auditLogs && localDB.auditLogs.length > 0) {
        await admin.from('activity_logs').insert(localDB.auditLogs.map((l: any) => ({
          id: l.id,
          user_name: l.user,
          action: l.action,
          target: l.target,
          timestamp: l.timestamp || new Date().toISOString()
        })));
      }

      console.log('✓ Supabase successfully seeded with live initial operational profiles.');
    } else {
      console.log('Supabase tables contain active live records. Seed operation skipped.');
    }
  } catch (err: any) {
    console.error('Failed to run automatic Supabase initialization:', err.message || err);
  }
}

// Realtime SSE Subscriptions
let realtimeClients: any[] = [];

function notifyRealtimeClients() {
  console.log(`Broadcasting real-time update to ${realtimeClients.length} connected clients...`);
  const alert = {
    id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    message: 'System database synchronized successfully.',
    timestamp: new Date().toISOString()
  };
  realtimeClients.forEach(client => {
    client.write(`event: data-updated\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
    client.write(`data: ${JSON.stringify(alert)}\n\n`);
  });
}

function broadcastAlert(message: string) {
  const alert = {
    id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    message,
    timestamp: new Date().toISOString()
  };
  console.log(`SSE alert broadcast: ${message}`);
  realtimeClients.forEach(client => {
    client.write(`event: data-updated\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
    client.write(`data: ${JSON.stringify(alert)}\n\n`);
  });
}

// API: Server-Sent Events Endpoint for real-time synchronization
app.get('/api/realtime-updates', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  realtimeClients.push(res);
  console.log(`Client subscribed to SSE. Total subscribers: ${realtimeClients.length}`);

  // Send initial ping
  const initialAlert = {
    id: 'initial-ping',
    message: 'Subscribed to real-time administrative intelligence feed.',
    timestamp: new Date().toISOString()
  };
  res.write(`data: ${JSON.stringify(initialAlert)}\n\n`);

  req.on('close', () => {
    realtimeClients = realtimeClients.filter(client => client !== res);
    console.log(`Client disconnected from SSE. Remaining: ${realtimeClients.length}`);
  });
});

// API: Get entire Database (For frontend initial load and polling fallback)
app.get('/api/db', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const db = await getSupabaseDB();
      return res.json({ success: true, db });
    } catch (err: any) {
      console.error('Error fetching Supabase DB, falling back to local JSON:', err.message || err);
    }
  }
  const db = getDB();
  res.json({ success: true, db });
});

// API: Submit Contact Message
app.post('/api/messages', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const newMessage = {
        id: `msg-${Date.now()}`,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || '',
        subject: req.body.subject,
        message: req.body.message,
        status: 'unread',
        created_at: new Date().toISOString()
      };
      
      await admin.from('contact_messages').insert(newMessage);
      
      await admin.from('activity_logs').insert({
        id: `log-${Date.now()}`,
        user_name: 'Guest User',
        action: 'Contact Message Submission',
        target: `${newMessage.name} (${newMessage.subject})`,
        timestamp: new Date().toISOString()
      });

      broadcastAlert(`New contact form message from ${newMessage.name}: "${newMessage.subject}"`);
      return res.status(201).json({ success: true, message: newMessage });
    } catch (err: any) {
      console.error('Supabase message create error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const newMessage = {
    id: `msg-${Date.now()}`,
    ...req.body,
    status: 'unread',
    created_at: new Date().toISOString()
  };
  db.contactMessages.unshift(newMessage);
  
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    user: 'Guest User',
    action: 'Contact Message Submission',
    target: `${newMessage.name} (${newMessage.subject})`,
    timestamp: new Date().toISOString()
  });

  saveDB(db);
  broadcastAlert(`New contact form message from ${newMessage.name}: "${newMessage.subject}"`);
  res.status(201).json({ success: true, message: newMessage });
});

// API: Update Contact Message Status
app.put('/api/messages/:id/status', async (req, res) => {
  const { status } = req.body;

  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: original } = await admin.from('contact_messages').select('*').eq('id', req.params.id).maybeSingle();
      if (original) {
        await admin.from('contact_messages').update({ status }).eq('id', req.params.id);
        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin',
          action: `Contact Message Status: ${status}`,
          target: original.name,
          timestamp: new Date().toISOString()
        });
        broadcastAlert(`Contact message from ${original.name} marked as ${status}`);
        return res.json({ success: true, message: { ...original, status } });
      }
    } catch (err: any) {
      console.error('Supabase status update error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const index = db.contactMessages.findIndex((m: any) => m.id === req.params.id);
  if (index !== -1) {
    db.contactMessages[index].status = status;
    
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin',
      action: `Contact Message Status: ${status}`,
      target: db.contactMessages[index].name,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    broadcastAlert(`Contact message from ${db.contactMessages[index].name} marked as ${status}`);
    return res.json({ success: true, message: db.contactMessages[index] });
  }
  res.status(404).json({ success: false, message: 'Message not found' });
});

// API: Reply to Contact Message
app.post('/api/messages/:id/reply', async (req, res) => {
  const { replyText } = req.body;

  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: original } = await admin.from('contact_messages').select('*').eq('id', req.params.id).maybeSingle();
      if (original) {
        await admin.from('contact_messages').update({ status: 'replied' }).eq('id', req.params.id);
        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin',
          action: 'Replied to Contact Inquiry',
          target: original.email,
          timestamp: new Date().toISOString()
        });
        broadcastAlert(`Sent agency reply email to ${original.name}`);
        return res.json({ success: true, message: { ...original, status: 'replied', reply: replyText } });
      }
    } catch (err: any) {
      console.error('Supabase message reply error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const index = db.contactMessages.findIndex((m: any) => m.id === req.params.id);
  if (index !== -1) {
    db.contactMessages[index].status = 'replied';
    db.contactMessages[index].reply = replyText;
    
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin',
      action: 'Replied to Contact Inquiry',
      target: db.contactMessages[index].email,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    broadcastAlert(`Sent agency reply email to ${db.contactMessages[index].name}`);
    return res.json({ success: true, message: db.contactMessages[index] });
  }
  res.status(404).json({ success: false, message: 'Message not found' });
});

// API: Delete Contact Message
app.delete('/api/messages/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: original } = await admin.from('contact_messages').select('*').eq('id', req.params.id).maybeSingle();
      if (original) {
        await admin.from('contact_messages').delete().eq('id', req.params.id);
        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin',
          action: 'Deleted Contact Message',
          target: original.name,
          timestamp: new Date().toISOString()
        });
        broadcastAlert(`Contact message from ${original.name} deleted successfully`);
        return res.json({ success: true });
      }
    } catch (err: any) {
      console.error('Supabase message delete error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const index = db.contactMessages.findIndex((m: any) => m.id === req.params.id);
  if (index !== -1) {
    const msg = db.contactMessages[index];
    db.contactMessages.splice(index, 1);
    
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin',
      action: 'Deleted Contact Message',
      target: msg.name,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    broadcastAlert(`Contact message from ${msg.name} deleted successfully`);
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, message: 'Message not found' });
});

// API: Auth Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      
      if (role === 'admin') {
        if (email === 'rkturenak@gmail.com' && password === 'Akshatha agency') {
          await admin.from('activity_logs').insert({
            id: `log-${Date.now()}`,
            user_name: 'rkturenak@gmail.com',
            action: 'Admin Login',
            target: 'Admin Dashboard',
            timestamp: new Date().toISOString()
          });
          
          const adminSession = {
            id: 'admin-1',
            name: 'Akshatha - Turenakx Admin',
            email: 'rkturenak@gmail.com',
            role: 'admin' as const
          };
          return res.json({ success: true, user: adminSession, session: adminSession });
        }
        return res.status(401).json({ success: false, message: 'Invalid Admin credentials' });
      }

      // Check if user exists in auth.users by logging them in or querying profiles
      const { data: authSession, error: authErr } = await admin.auth.signInWithPassword({
        email,
        password
      }).catch(() => ({ data: null, error: { message: 'Authentication required' } }));

      let verifiedUser = null;

      if (authSession?.user) {
        const { data: profile } = await admin.from('profiles').select('*').eq('id', authSession.user.id).maybeSingle();
        verifiedUser = {
          id: authSession.user.id,
          name: profile?.name || email.split('@')[0].toUpperCase(),
          email: authSession.user.email,
          role: role
        };
      } else {
        if (role === 'candidate') {
          const { data: cand } = await admin.from('candidates').select('*').eq('email', email).maybeSingle();
          if (cand) {
            verifiedUser = { id: cand.id, name: cand.name, email: cand.email, role: 'candidate' as const };
          } else {
            const newCandId = `cand-${Date.now()}`;
            const newCand = {
              id: newCandId,
              name: email.split('@')[0].toUpperCase(),
              email,
              skills: [],
              experience: [],
              education: [],
              saved_jobs: [],
              certificates: [],
              background_verified: false,
              created_at: new Date().toISOString()
            };
            await admin.from('candidates').insert(newCand);
            verifiedUser = { id: newCandId, name: newCand.name, email, role: 'candidate' as const };
          }
        } else if (role === 'employer') {
          const { data: comp } = await admin.from('companies').select('*').eq('contact_email', email).maybeSingle();
          if (comp) {
            if (comp.status === 'suspended') {
              return res.status(403).json({ success: false, message: 'Your employer account has been suspended.' });
            }
            verifiedUser = { id: `emp-${comp.id}`, name: comp.name, email: comp.contact_email, role: 'employer' as const, companyId: comp.id };
          } else {
            const newCompId = `company-${Date.now()}`;
            const newCompany = {
              id: newCompId,
              name: `${email.split('@')[0].toUpperCase()} Enterprise`,
              industry: 'IT & Software',
              contact_email: email,
              contact_phone: '+91 8147354351',
              address: 'Kumbalagudu, Bangalore',
              description: 'Corporate business seeking elite professionals.',
              status: 'approved',
              created_at: new Date().toISOString()
            };
            await admin.from('companies').insert(newCompany);
            verifiedUser = { id: `emp-${newCompId}`, name: newCompany.name, email, role: 'employer' as const, companyId: newCompId };
          }
        }
      }

      if (verifiedUser) {
        return res.json({ success: true, user: verifiedUser, session: verifiedUser });
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (err: any) {
      console.error('Supabase auth login error, falling back:', err.message || err);
    }
  }

  const db = getDB();

  // Admin login fallback
  if (role === 'admin') {
    if (email === 'rkturenak@gmail.com' && password === 'Akshatha agency') {
      db.auditLogs.unshift({
        id: `log-${Date.now()}`,
        user: 'rkturenak@gmail.com',
        action: 'Admin Login',
        target: 'Admin Dashboard',
        timestamp: new Date().toISOString()
      });
      saveDB(db);

      const adminSession = {
        id: 'admin-1',
        name: 'Akshatha - Turenakx Admin',
        email: 'rkturenak@gmail.com',
        role: 'admin' as const
      };

      return res.json({
        success: true,
        user: adminSession,
        session: adminSession
      });
    }
    return res.status(401).json({ success: false, message: 'Invalid Admin credentials' });
  }

  // Candidate login fallback
  if (role === 'candidate') {
    const candidate = db.candidates.find((c: any) => c.email.toLowerCase() === email.toLowerCase());
    if (candidate) {
      const candidateSession = {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        role: 'candidate' as const
      };
      return res.json({
        success: true,
        user: candidateSession,
        session: candidateSession
      });
    }
    const newCand = {
      id: `cand-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email: email,
      skills: [],
      experience: [],
      education: [],
      savedJobs: [],
      created_at: new Date().toISOString()
    };
    db.candidates.push(newCand);
    saveDB(db);

    const candidateSession = {
      id: newCand.id,
      name: newCand.name,
      email: newCand.email,
      role: 'candidate' as const
    };

    return res.json({
      success: true,
      user: candidateSession,
      session: candidateSession
    });
  }

  // Employer login fallback
  if (role === 'employer') {
    const company = db.companies.find((c: any) => c.contactEmail.toLowerCase() === email.toLowerCase());
    if (company) {
      if (company.status === 'suspended') {
        return res.status(403).json({ success: false, message: 'Your employer account has been suspended. Please contact rkturenakx@gmail.com.' });
      }
      const employerSession = {
        id: `emp-${company.id}`,
        name: company.name,
        email: company.contactEmail,
        role: 'employer' as const,
        companyId: company.id
      };
      return res.json({
        success: true,
        user: employerSession,
        session: employerSession
      });
    }
    const newCompany = {
      id: `company-${Date.now()}`,
      name: `${email.split('@')[0].toUpperCase()} Enterprise`,
      industry: 'IT & Software',
      contactEmail: email,
      contactPhone: '+91 8147354351',
      address: 'Kumbalagudu, Bangalore',
      description: 'Corporate business seeking elite professionals.',
      status: 'approved',
      created_at: new Date().toISOString()
    };
    db.companies.push(newCompany);
    saveDB(db);

    const employerSession = {
      id: `emp-${newCompany.id}`,
      name: newCompany.name,
      email: newCompany.contactEmail,
      role: 'employer' as const,
      companyId: newCompany.id
    };

    return res.json({
      success: true,
      user: employerSession,
      session: employerSession
    });
  }

  res.status(400).json({ success: false, message: 'Unsupported auth flow' });
});

// API: Auth Register Endpoint
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role, name } = req.body;

  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: authData, error: authErr } = await admin.auth.admin.createUser({
        email,
        password: password || 'SecureDefaultPassword123!',
        email_confirm: true
      });
      
      if (authErr && authErr.message !== 'A user with this email already exists') {
        return res.status(400).json({ success: false, message: authErr.message });
      }
      
      const userId = authData?.user?.id || `user-${Date.now()}`;

      await admin.from('profiles').upsert({
        id: userId,
        email,
        name: name || email.split('@')[0].toUpperCase(),
        role: role === 'candidate' ? 'Candidate' : 'Employer',
        created_at: new Date().toISOString()
      });

      if (role === 'candidate') {
        const newCand = {
          id: userId,
          name: name || email.split('@')[0].toUpperCase(),
          email,
          phone: '+91 8147354351',
          resume_text: '',
          skills: [],
          experience: [],
          education: [],
          saved_jobs: [],
          certificates: [],
          background_verified: false,
          created_at: new Date().toISOString()
        };
        await admin.from('candidates').insert(newCand);
        return res.json({ success: true, userId });
      }

      if (role === 'employer') {
        const newCompany = {
          id: userId,
          name: name || `${email.split('@')[0].toUpperCase()} Enterprise`,
          industry: 'IT & Software',
          contact_email: email,
          contact_phone: '+91 8147354351',
          address: 'Kumbalagudu, Bangalore',
          description: 'Corporate business seeking elite professionals.',
          status: 'approved',
          created_at: new Date().toISOString()
        };
        await admin.from('companies').insert(newCompany);
        return res.json({ success: true, userId });
      }
    } catch (err: any) {
      console.error('Supabase auth register error, falling back:', err.message || err);
    }
  }

  const db = getDB();

  if (role === 'candidate') {
    const existing = db.candidates.find((c: any) => c.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Candidate with this email already exists' });
    }
    const newCand = {
      id: `cand-${Date.now()}`,
      name: name || email.split('@')[0].toUpperCase(),
      email: email,
      skills: [],
      experience: [],
      education: [],
      savedJobs: [],
      created_at: new Date().toISOString()
    };
    db.candidates.push(newCand);
    saveDB(db);
    return res.json({ success: true });
  }

  if (role === 'employer') {
    const existing = db.companies.find((c: any) => c.contactEmail.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Company with this email already exists' });
    }
    const newCompany = {
      id: `company-${Date.now()}`,
      name: name || `${email.split('@')[0].toUpperCase()} Enterprise`,
      industry: 'IT & Software',
      contactEmail: email,
      contactPhone: '+91 8147354351',
      address: 'Kumbalagudu, Bangalore',
      description: 'Corporate business seeking elite professionals.',
      status: 'approved',
      created_at: new Date().toISOString()
    };
    db.companies.push(newCompany);
    saveDB(db);
    return res.json({ success: true });
  }

  return res.status(400).json({ success: false, message: 'Unsupported register flow' });
});

// API: Auth Admin-Login Endpoint
app.post('/api/auth/admin-login', async (req, res) => {
  const { email, password } = req.body;

  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      if (email === 'rkturenak@gmail.com' && password === 'Akshatha agency') {
        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'rkturenak@gmail.com',
          action: 'Admin Login',
          target: 'Admin Dashboard',
          timestamp: new Date().toISOString()
        });
        
        const adminSession = {
          id: 'admin-1',
          name: 'Akshatha - Turenakx Admin',
          email: 'rkturenak@gmail.com',
          role: 'admin' as const
        };
        return res.json({ success: true, user: adminSession, session: adminSession });
      }
      return res.status(401).json({ success: false, message: 'Invalid Admin credentials' });
    } catch (err: any) {
      console.error('Supabase admin login error, falling back:', err.message || err);
    }
  }

  const db = getDB();

  if (email === 'rkturenak@gmail.com' && password === 'Akshatha agency') {
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'rkturenak@gmail.com',
      action: 'Admin Login',
      target: 'Admin Dashboard',
      timestamp: new Date().toISOString()
    });
    saveDB(db);

    const adminSession = {
      id: 'admin-1',
      name: 'Akshatha - Turenakx Admin',
      email: 'rkturenak@gmail.com',
      role: 'admin' as const
    };

    return res.json({
      success: true,
      user: adminSession,
      session: adminSession
    });
  }

  return res.status(401).json({ success: false, message: 'Invalid Admin credentials' });
});

// API: Jobs CRUD Operations
app.post('/api/jobs', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const newJob = {
        id: `job-${Date.now()}`,
        title: req.body.title,
        description: req.body.description,
        requirements: req.body.requirements || [],
        salary: req.body.salary,
        experience: req.body.experience,
        location: req.body.location,
        skills: req.body.skills || [],
        type: req.body.type,
        industry: req.body.industry,
        status: req.body.status || 'active',
        company_id: req.body.companyId,
        company_name: req.body.companyName || '',
        company_logo: req.body.companyLogo || '',
        company_location: req.body.companyLocation || '',
        created_at: new Date().toISOString(),
        expiry_date: req.body.expiry_date || new Date(Date.now() + 30*24*3600*1000).toISOString(),
        applied_count: 0
      };

      await admin.from('jobs').insert(newJob);

      await admin.from('activity_logs').insert({
        id: `log-${Date.now()}`,
        user_name: req.body.companyName || 'Employer',
        action: 'Job Posting Created',
        target: newJob.title,
        timestamp: new Date().toISOString()
      });

      broadcastAlert(`New job posted: "${newJob.title}" at ${newJob.company_name}`);
      return res.status(201).json({ success: true, job: newJob });
    } catch (err: any) {
      console.error('Supabase job create error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const newJob = {
    id: `job-${Date.now()}`,
    ...req.body,
    appliedCount: 0,
    created_at: new Date().toISOString(),
    status: req.body.status || 'active'
  };
  db.jobs.unshift(newJob);

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    user: req.body.companyName || 'Employer',
    action: 'Job Posting Created',
    target: newJob.title,
    timestamp: new Date().toISOString()
  });

  saveDB(db);
  res.status(201).json({ success: true, job: newJob });
});

app.put('/api/jobs/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: job } = await admin.from('jobs').select('*').eq('id', req.params.id).maybeSingle();
      if (job) {
        const updateFields = {
          title: req.body.title || job.title,
          description: req.body.description || job.description,
          requirements: req.body.requirements || job.requirements,
          salary: req.body.salary || job.salary,
          experience: req.body.experience || job.experience,
          location: req.body.location || job.location,
          skills: req.body.skills || job.skills,
          type: req.body.type || job.type,
          industry: req.body.industry || job.industry,
          status: req.body.status || job.status,
          expiry_date: req.body.expiry_date || job.expiry_date
        };

        await admin.from('jobs').update(updateFields).eq('id', req.params.id);

        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin/Employer',
          action: 'Job Posting Updated',
          target: updateFields.title,
          timestamp: new Date().toISOString()
        });

        broadcastAlert(`Job updated: "${updateFields.title}"`);
        return res.json({ success: true, job: { ...job, ...updateFields } });
      }
    } catch (err: any) {
      console.error('Supabase job update error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const jobIndex = db.jobs.findIndex((j: any) => j.id === req.params.id);
  if (jobIndex !== -1) {
    db.jobs[jobIndex] = { ...db.jobs[jobIndex], ...req.body };
    
    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin/Employer',
      action: 'Job Posting Updated',
      target: db.jobs[jobIndex].title,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    return res.json({ success: true, job: db.jobs[jobIndex] });
  }
  res.status(404).json({ success: false, message: 'Job not found' });
});

app.delete('/api/jobs/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: job } = await admin.from('jobs').select('*').eq('id', req.params.id).maybeSingle();
      if (job) {
        await admin.from('jobs').delete().eq('id', req.params.id);
        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin/Employer',
          action: 'Job Posting Deleted',
          target: job.title,
          timestamp: new Date().toISOString()
        });
        broadcastAlert(`Job deleted: "${job.title}"`);
        return res.json({ success: true });
      }
    } catch (err: any) {
      console.error('Supabase job delete error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const jobIndex = db.jobs.findIndex((j: any) => j.id === req.params.id);
  if (jobIndex !== -1) {
    const jobTitle = db.jobs[jobIndex].title;
    db.jobs.splice(jobIndex, 1);

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin/Employer',
      action: 'Job Posting Deleted',
      target: jobTitle,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, message: 'Job not found' });
});

// API: Submit Job Application
app.post('/api/applications', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const newApp = {
        id: `app-${Date.now()}`,
        job_id: req.body.jobId,
        job_title: req.body.jobTitle,
        candidate_id: req.body.candidateId,
        candidate_name: req.body.candidateName,
        candidate_email: req.body.candidateEmail,
        candidate_phone: req.body.candidatePhone || '',
        resume_text: req.body.resumeText,
        resume_score: req.body.resumeScore || 0,
        resume_analysis: req.body.resumeAnalysis || {},
        status: 'applied',
        notes: req.body.notes || '',
        applied_at: new Date().toISOString()
      };

      await admin.from('applications').insert(newApp);

      const { data: job } = await admin.from('jobs').select('applied_count').eq('id', newApp.job_id).maybeSingle();
      if (job) {
        await admin.from('jobs').update({ applied_count: (job.applied_count || 0) + 1 }).eq('id', newApp.job_id);
      }

      await admin.from('candidates').update({
        resume_text: newApp.resume_text,
        phone: newApp.candidate_phone
      }).eq('id', newApp.candidate_id);

      await admin.from('activity_logs').insert({
        id: `log-${Date.now()}`,
        user_name: newApp.candidate_name,
        action: 'Job Application Submitted',
        target: newApp.job_title,
        timestamp: new Date().toISOString()
      });

      broadcastAlert(`New application from ${newApp.candidate_name} for "${newApp.job_title}"`);
      return res.status(201).json({ success: true, application: newApp });
    } catch (err: any) {
      console.error('Supabase application submit error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const newApp = {
    id: `app-${Date.now()}`,
    ...req.body,
    status: 'applied',
    appliedAt: new Date().toISOString()
  };
  db.applications.unshift(newApp);

  const job = db.jobs.find((j: any) => j.id === newApp.jobId);
  if (job) {
    job.appliedCount = (job.appliedCount || 0) + 1;
  }

  const candidate = db.candidates.find((c: any) => c.id === newApp.candidateId);
  if (candidate) {
    candidate.resumeText = newApp.resumeText;
    if (newApp.candidatePhone) candidate.phone = newApp.candidatePhone;
  }

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    user: newApp.candidateName,
    action: 'Job Application Submitted',
    target: newApp.jobTitle,
    timestamp: new Date().toISOString()
  });

  saveDB(db);
  res.status(201).json({ success: true, application: newApp });
});

app.put('/api/applications/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: appData } = await admin.from('applications').select('*').eq('id', req.params.id).maybeSingle();
      if (appData) {
        const updateFields = {
          status: req.body.status || appData.status,
          notes: req.body.notes || appData.notes,
          interview_date: req.body.interviewDate || appData.interview_date,
          interview_time: req.body.interviewTime || appData.interview_time,
          interview_link: req.body.interviewLink || appData.interview_link
        };

        await admin.from('applications').update(updateFields).eq('id', req.params.id);

        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Recruiter/Admin',
          action: `Application Stage Update: ${updateFields.status}`,
          target: `App for ${appData.job_title} by ${appData.candidate_name}`,
          timestamp: new Date().toISOString()
        });

        broadcastAlert(`Application for ${appData.candidate_name} updated to stage ${updateFields.status}`);
        return res.json({ success: true, application: { ...appData, ...updateFields, jobId: appData.job_id, jobTitle: appData.job_title, candidateId: appData.candidate_id, candidateName: appData.candidate_name, candidateEmail: appData.candidate_email, resumeText: appData.resume_text, appliedAt: appData.applied_at } });
      }
    } catch (err: any) {
      console.error('Supabase application update error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const appIndex = db.applications.findIndex((a: any) => a.id === req.params.id);
  if (appIndex !== -1) {
    db.applications[appIndex] = { ...db.applications[appIndex], ...req.body };

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Recruiter/Admin',
      action: `Application Stage Update: ${req.body.status || 'Changed'}`,
      target: `App for ${db.applications[appIndex].jobTitle} by ${db.applications[appIndex].candidateName}`,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    broadcastAlert(`Application for ${db.applications[appIndex].candidateName} updated to stage ${db.applications[appIndex].status}`);
    return res.json({ success: true, application: db.applications[appIndex] });
  }
  res.status(404).json({ success: false, message: 'Application not found' });
});

// API: Update Application Status (Specialized for Frontend pipeline updates)
app.put('/api/applications/:id/status', async (req, res) => {
  const { status, date, time, link, notes } = req.body;

  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: appData } = await admin.from('applications').select('*').eq('id', req.params.id).maybeSingle();
      if (appData) {
        const updateFields: any = { status };
        if (date) updateFields.interview_date = date;
        if (time) updateFields.interview_time = time;
        if (link) updateFields.interview_link = link;
        if (notes) updateFields.notes = notes;

        await admin.from('applications').update(updateFields).eq('id', req.params.id);

        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Recruiter/Admin',
          action: `Application Stage Transitioned to: ${status}`,
          target: `App for ${appData.job_title} by ${appData.candidate_name}`,
          timestamp: new Date().toISOString()
        });

        broadcastAlert(`Pipeline update: ${appData.candidate_name} shifted to "${status.replace('_', ' ').toUpperCase()}"`);
        return res.json({ success: true, application: { ...appData, ...updateFields, jobId: appData.job_id, jobTitle: appData.job_title, candidateId: appData.candidate_id, candidateName: appData.candidate_name, candidateEmail: appData.candidate_email, resumeText: appData.resume_text, appliedAt: appData.applied_at } });
      }
    } catch (err: any) {
      console.error('Supabase application status update error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const appIndex = db.applications.findIndex((a: any) => a.id === req.params.id);
  if (appIndex !== -1) {
    db.applications[appIndex].status = status;
    if (date) db.applications[appIndex].interviewDate = date;
    if (time) db.applications[appIndex].interviewTime = time;
    if (link) db.applications[appIndex].interviewLink = link;
    if (notes) db.applications[appIndex].notes = notes;

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Recruiter/Admin',
      action: `Application Stage Transitioned to: ${status}`,
      target: `App for ${db.applications[appIndex].jobTitle} by ${db.applications[appIndex].candidateName}`,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    broadcastAlert(`Pipeline update: ${db.applications[appIndex].candidateName} shifted to "${status.replace('_', ' ').toUpperCase()}"`);
    return res.json({ success: true, application: db.applications[appIndex] });
  }
  res.status(404).json({ success: false, message: 'Application not found' });
});

// API: Delete Sourced Job Application
app.delete('/api/applications/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: appData } = await admin.from('applications').select('*').eq('id', req.params.id).maybeSingle();
      if (appData) {
        await admin.from('applications').delete().eq('id', req.params.id);

        const { data: job } = await admin.from('jobs').select('applied_count').eq('id', appData.job_id).maybeSingle();
        if (job) {
          await admin.from('jobs').update({ applied_count: Math.max(0, (job.applied_count || 1) - 1) }).eq('id', appData.job_id);
        }

        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin',
          action: 'Deleted Job Application',
          target: `${appData.candidate_name} for ${appData.job_title}`,
          timestamp: new Date().toISOString()
        });

        broadcastAlert(`Application for ${appData.candidate_name} deleted successfully`);
        return res.json({ success: true });
      }
    } catch (err: any) {
      console.error('Supabase application delete error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const appIndex = db.applications.findIndex((a: any) => a.id === req.params.id);
  if (appIndex !== -1) {
    const app = db.applications[appIndex];
    db.applications.splice(appIndex, 1);

    const job = db.jobs.find((j: any) => j.id === app.jobId);
    if (job) {
      job.appliedCount = Math.max(0, (job.appliedCount || 0) - 1);
    }

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin',
      action: 'Deleted Job Application',
      target: `${app.candidateName} for ${app.jobTitle}`,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    broadcastAlert(`Application for ${app.candidateName} deleted successfully`);
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, message: 'Application not found' });
});

// API: CMS Settings Updates
app.put('/api/settings', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const updateFields = {
        company_name: req.body.companyName,
        tagline: req.body.tagline,
        phone: req.body.phone,
        personal_email: req.body.personalEmail,
        company_email: req.body.companyEmail,
        address: req.body.address,
        whatsapp: req.body.whatsapp,
        map_url: req.body.mapUrl,
        social_links: req.body.socialLinks || {},
        smtp_settings: req.body.smtpSettings || {},
        seo_settings: req.body.seoSettings || {}
      };

      await admin.from('settings').upsert({ id: 'global', ...updateFields });

      await admin.from('activity_logs').insert({
        id: `log-${Date.now()}`,
        user_name: 'Admin',
        action: 'System Settings Updated',
        target: 'Global Settings',
        timestamp: new Date().toISOString()
      });

      broadcastAlert('Agency global settings updated successfully');
      return res.json({ success: true, settings: req.body });
    } catch (err: any) {
      console.error('Supabase settings update error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  db.settings = { ...db.settings, ...req.body };

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    user: 'Admin',
    action: 'System Settings Updated',
    target: 'Global Settings',
    timestamp: new Date().toISOString()
  });

  saveDB(db);
  res.json({ success: true, settings: db.settings });
});

// API: CMS Blogs CRUD
app.post('/api/blogs', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const newBlog = {
        id: `blog-${Date.now()}`,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author || 'Admin',
        category: req.body.category || 'General',
        image: req.body.image || '',
        read_time: req.body.readTime || '5 min read',
        views: 0,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        created_at: new Date().toISOString()
      };

      await admin.from('blogs').insert(newBlog);

      await admin.from('activity_logs').insert({
        id: `log-${Date.now()}`,
        user_name: 'Admin',
        action: 'Blog Post Created',
        target: newBlog.title,
        timestamp: new Date().toISOString()
      });

      return res.status(201).json({ success: true, blog: { ...newBlog, readTime: newBlog.read_time } });
    } catch (err: any) {
      console.error('Supabase blog create error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const newBlog = {
    id: `blog-${Date.now()}`,
    views: 0,
    ...req.body,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  };
  db.blogs.unshift(newBlog);

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    user: 'Admin',
    action: 'Blog Post Created',
    target: newBlog.title,
    timestamp: new Date().toISOString()
  });

  saveDB(db);
  res.status(201).json({ success: true, blog: newBlog });
});

app.put('/api/blogs/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: blog } = await admin.from('blogs').select('*').eq('id', req.params.id).maybeSingle();
      if (blog) {
        const updateFields = {
          title: req.body.title || blog.title,
          content: req.body.content || blog.content,
          author: req.body.author || blog.author,
          category: req.body.category || blog.category,
          image: req.body.image || blog.image,
          read_time: req.body.readTime || blog.read_time,
          views: req.body.views !== undefined ? req.body.views : blog.views
        };

        await admin.from('blogs').update(updateFields).eq('id', req.params.id);

        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin',
          action: 'Blog Post Updated',
          target: updateFields.title,
          timestamp: new Date().toISOString()
        });

        return res.json({ success: true, blog: { ...blog, ...updateFields, readTime: updateFields.read_time } });
      }
    } catch (err: any) {
      console.error('Supabase blog update error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const blogIndex = db.blogs.findIndex((b: any) => b.id === req.params.id);
  if (blogIndex !== -1) {
    db.blogs[blogIndex] = { ...db.blogs[blogIndex], ...req.body };

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin',
      action: 'Blog Post Updated',
      target: db.blogs[blogIndex].title,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    return res.json({ success: true, blog: db.blogs[blogIndex] });
  }
  res.status(404).json({ success: false, message: 'Blog not found' });
});

app.delete('/api/blogs/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: blog } = await admin.from('blogs').select('*').eq('id', req.params.id).maybeSingle();
      if (blog) {
        await admin.from('blogs').delete().eq('id', req.params.id);
        
        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin',
          action: 'Blog Post Deleted',
          target: blog.title,
          timestamp: new Date().toISOString()
        });

        return res.json({ success: true });
      }
    } catch (err: any) {
      console.error('Supabase blog delete error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const blogIndex = db.blogs.findIndex((b: any) => b.id === req.params.id);
  if (blogIndex !== -1) {
    const blogTitle = db.blogs[blogIndex].title;
    db.blogs.splice(blogIndex, 1);

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin',
      action: 'Blog Post Deleted',
      target: blogTitle,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, message: 'Blog not found' });
});

// API: Company (Employer) Operations
app.post('/api/companies', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const newCompany = {
        id: `company-${Date.now()}`,
        name: req.body.name,
        industry: req.body.industry || 'IT & Software',
        contact_email: req.body.contactEmail,
        contact_phone: req.body.contactPhone || '',
        address: req.body.address || '',
        description: req.body.description || '',
        status: 'pending',
        logo: req.body.logo || '',
        created_at: new Date().toISOString()
      };

      await admin.from('companies').insert(newCompany);

      await admin.from('activity_logs').insert({
        id: `log-${Date.now()}`,
        user_name: 'Self-Registered',
        action: 'Company Sourcing Applied',
        target: newCompany.name,
        timestamp: new Date().toISOString()
      });

      return res.status(201).json({ success: true, company: { ...newCompany, contactEmail: newCompany.contact_email, contactPhone: newCompany.contact_phone } });
    } catch (err: any) {
      console.error('Supabase company create error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const newCompany = {
    id: `company-${Date.now()}`,
    status: 'pending',
    created_at: new Date().toISOString(),
    ...req.body
  };
  db.companies.push(newCompany);

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    user: 'Self-Registered',
    action: 'Company Sourcing Applied',
    target: newCompany.name,
    timestamp: new Date().toISOString()
  });

  saveDB(db);
  res.status(201).json({ success: true, company: newCompany });
});

app.put('/api/companies/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: comp } = await admin.from('companies').select('*').eq('id', req.params.id).maybeSingle();
      if (comp) {
        const updateFields = {
          name: req.body.name || comp.name,
          industry: req.body.industry || comp.industry,
          contact_email: req.body.contactEmail || comp.contact_email,
          contact_phone: req.body.contactPhone || comp.contact_phone,
          address: req.body.address || comp.address,
          description: req.body.description || comp.description,
          status: req.body.status || comp.status,
          logo: req.body.logo || comp.logo
        };

        await admin.from('companies').update(updateFields).eq('id', req.params.id);

        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin',
          action: `Company Status Changed to: ${updateFields.status}`,
          target: updateFields.name,
          timestamp: new Date().toISOString()
        });

        return res.json({ success: true, company: { ...comp, ...updateFields, contactEmail: updateFields.contact_email, contactPhone: updateFields.contact_phone } });
      }
    } catch (err: any) {
      console.error('Supabase company update error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const compIndex = db.companies.findIndex((c: any) => c.id === req.params.id);
  if (compIndex !== -1) {
    db.companies[compIndex] = { ...db.companies[compIndex], ...req.body };

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin',
      action: `Company Status Changed to: ${req.body.status || 'Edited'}`,
      target: db.companies[compIndex].name,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    return res.json({ success: true, company: db.companies[compIndex] });
  }
  res.status(404).json({ success: false, message: 'Company not found' });
});

app.delete('/api/companies/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: comp } = await admin.from('companies').select('*').eq('id', req.params.id).maybeSingle();
      if (comp) {
        await admin.from('companies').delete().eq('id', req.params.id);

        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin',
          action: 'Company Deleted',
          target: comp.name,
          timestamp: new Date().toISOString()
        });

        return res.json({ success: true });
      }
    } catch (err: any) {
      console.error('Supabase company delete error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const compIndex = db.companies.findIndex((c: any) => c.id === req.params.id);
  if (compIndex !== -1) {
    const name = db.companies[compIndex].name;
    db.companies.splice(compIndex, 1);

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin',
      action: 'Company Deleted',
      target: name,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, message: 'Company not found' });
});

// API: Candidates Update/Vetting Endpoint
app.put('/api/candidates/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: cand } = await admin.from('candidates').select('*').eq('id', req.params.id).maybeSingle();
      if (cand) {
        const updateFields = {
          name: req.body.name || cand.name,
          phone: req.body.phone || cand.phone,
          skills: req.body.skills || cand.skills,
          experience: req.body.experience || cand.experience,
          education: req.body.education || cand.education,
          resume_text: req.body.resumeText || cand.resume_text,
          saved_jobs: req.body.savedJobs || cand.saved_jobs,
          certificates: req.body.certificates || cand.certificates,
          background_verified: req.body.backgroundVerified !== undefined ? req.body.backgroundVerified : cand.background_verified
        };

        await admin.from('candidates').update(updateFields).eq('id', req.params.id);

        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin/Candidate',
          action: 'Candidate Profile Updated',
          target: updateFields.name,
          timestamp: new Date().toISOString()
        });

        broadcastAlert(`Candidate profile updated: ${updateFields.name}`);
        return res.json({ success: true, candidate: { ...cand, ...updateFields, resumeText: updateFields.resume_text, savedJobs: updateFields.saved_jobs, backgroundVerified: updateFields.background_verified } });
      }
    } catch (err: any) {
      console.error('Supabase candidate update error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const candIndex = db.candidates.findIndex((c: any) => c.id === req.params.id);
  if (candIndex !== -1) {
    db.candidates[candIndex] = { ...db.candidates[candIndex], ...req.body };

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin/Candidate',
      action: 'Candidate Profile Updated',
      target: db.candidates[candIndex].name,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    broadcastAlert(`Candidate profile updated: ${db.candidates[candIndex].name}`);
    return res.json({ success: true, candidate: db.candidates[candIndex] });
  }
  res.status(404).json({ success: false, message: 'Candidate not found' });
});

// API: Candidates Deletion Endpoint
app.delete('/api/candidates/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const { data: cand } = await admin.from('candidates').select('*').eq('id', req.params.id).maybeSingle();
      if (cand) {
        await admin.from('candidates').delete().eq('id', req.params.id);
        await admin.from('applications').delete().eq('candidate_id', req.params.id);

        await admin.from('activity_logs').insert({
          id: `log-${Date.now()}`,
          user_name: 'Admin',
          action: 'Candidate Profile Deleted',
          target: cand.name,
          timestamp: new Date().toISOString()
        });

        broadcastAlert(`Candidate profile for ${cand.name} removed by administrator`);
        return res.json({ success: true });
      }
    } catch (err: any) {
      console.error('Supabase candidate delete error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const candIndex = db.candidates.findIndex((c: any) => c.id === req.params.id);
  if (candIndex !== -1) {
    const candName = db.candidates[candIndex].name;
    db.candidates.splice(candIndex, 1);

    db.applications = db.applications.filter((a: any) => a.candidateId !== req.params.id);

    db.auditLogs.unshift({
      id: `log-${Date.now()}`,
      user: 'Admin',
      action: 'Candidate Profile Deleted',
      target: candName,
      timestamp: new Date().toISOString()
    });

    saveDB(db);
    broadcastAlert(`Candidate profile for ${candName} removed by administrator`);
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, message: 'Candidate not found' });
});

// API: FAQ items
app.post('/api/faqs', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const newFaq = {
        id: `faq-${Date.now()}`,
        question: req.body.question,
        answer: req.body.answer,
        category: req.body.category || 'General'
      };

      await admin.from('faqs').insert(newFaq);
      return res.status(201).json({ success: true, faq: newFaq });
    } catch (err: any) {
      console.error('Supabase FAQ create error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const newFaq = {
    id: `faq-${Date.now()}`,
    ...req.body
  };
  db.faqs.push(newFaq);
  saveDB(db);
  res.status(201).json({ success: true, faq: newFaq });
});

app.delete('/api/faqs/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      await admin.from('faqs').delete().eq('id', req.params.id);
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Supabase FAQ delete error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const index = db.faqs.findIndex((f: any) => f.id === req.params.id);
  if (index !== -1) {
    db.faqs.splice(index, 1);
    saveDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ success: false });
});

// API: Testimonials CMS
app.post('/api/testimonials', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      const newTest = {
        id: `test-${Date.now()}`,
        name: req.body.name,
        role: req.body.role,
        company: req.body.company,
        content: req.body.content,
        image: req.body.image || '',
        rating: req.body.rating || 5
      };

      await admin.from('testimonials').insert(newTest);
      return res.status(201).json({ success: true, testimonial: newTest });
    } catch (err: any) {
      console.error('Supabase testimonial create error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const newTest = {
    id: `test-${Date.now()}`,
    rating: 5,
    ...req.body
  };
  db.testimonials.push(newTest);
  saveDB(db);
  res.status(201).json({ success: true, testimonial: newTest });
});

app.delete('/api/testimonials/:id', async (req, res) => {
  if (isSupabaseConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      await admin.from('testimonials').delete().eq('id', req.params.id);
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Supabase testimonial delete error, falling back:', err.message || err);
    }
  }

  const db = getDB();
  const index = db.testimonials.findIndex((t: any) => t.id === req.params.id);
  if (index !== -1) {
    db.testimonials.splice(index, 1);
    saveDB(db);
    return res.json({ success: true });
  }
  res.status(404).json({ success: false });
});


// API: AI Resume Parser (Express endpoint calling Gemini API server-side)
app.post('/api/resume-parser', async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText) {
    return res.status(400).json({ success: false, message: 'Missing resume text' });
  }

  // Define structured template schema for the response
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      candidateName: { type: Type.STRING },
      candidatePhone: { type: Type.STRING },
      candidateEmail: { type: Type.STRING },
      skills: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      experience: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            duration: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      },
      education: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            degree: { type: Type.STRING },
            school: { type: Type.STRING },
            year: { type: Type.STRING }
          }
        }
      }
    },
    required: ['candidateName', 'skills', 'experience', 'education']
  };

  // 1. If Gemini AI is active, invoke it
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Parse the following raw candidate resume and extract details structured into sections (Name, Phone, Email, Skills, Work Experience, Education). Resume Text:\n\n${resumeText}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema
        }
      });

      const parsedJSON = JSON.parse(response.text || '{}');
      return res.json({ success: true, parsed: parsedJSON });
    } catch (error) {
      console.error('Gemini Resume Parsing Error, falling back to simulated parser:', error);
    }
  }

  // 2. Automated Smart parsing simulation (if AI fails or key is missing)
  const skillsList = ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'SQL', 'PostgreSQL', 'Python', 'Java', 'Project Management', 'Agile', 'Scrum', 'Framer Motion', 'Vue.js', 'Excel', 'Corporate Finance', 'Excel VBA'];
  const matchedSkills = skillsList.filter(s => resumeText.toLowerCase().includes(s.toLowerCase()));
  if (matchedSkills.length === 0) matchedSkills.push('Customer Support', 'Communication', 'Technical Sourcing');

  // Guess name from first line
  const lines = resumeText.split('\n').map((l: string) => l.trim()).filter(Boolean);
  const guessedName = lines[0] || 'ALEX R. CANDIDATE';
  const guessedEmail = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || 'candidate@turenakx.com';
  const guessedPhone = resumeText.match(/(\+91[\-\s]?)?[0-9]{10}/)?.[0] || '+91 8147354351';

  const simulatedResponse = {
    candidateName: guessedName,
    candidatePhone: guessedPhone,
    candidateEmail: guessedEmail,
    skills: matchedSkills,
    experience: [
      {
        title: 'Professional Practitioner',
        company: 'Active Systems Corp',
        duration: '2023 - Present',
        description: 'Collaborated on delivering agile workflows, technical alignment, and performance benchmarks.'
      }
    ],
    education: [
      {
        degree: 'Bachelor Degree',
        school: 'University Institute of Technology',
        year: '2022'
      }
    ]
  };

  res.json({ success: true, parsed: simulatedResponse });
});

// API: AI Resume Fit Scorer (Gemini server-side analysis)
app.post('/api/resume-score', async (req, res) => {
  const { resumeText, jobTitle, jobDescription, requirements } = req.body;
  if (!resumeText) {
    return res.status(400).json({ success: false, message: 'Missing resume text' });
  }

  const reqStr = Array.isArray(requirements) ? requirements.join(', ') : (requirements || '');

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      strengths: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      gaps: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      recommendations: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      matchedSkills: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      jobFitPercentage: { type: Type.INTEGER }
    },
    required: ['strengths', 'gaps', 'recommendations', 'matchedSkills', 'jobFitPercentage']
  };

  // 1. If Gemini AI is active, invoke it
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Evaluate the matching fitness level between the Candidate Resume and the Job Description. Be constructive, objective, and realistic. Return strengths, missing gaps, actionable improvements, matched core skills, and an overall fit percentage out of 100.
        
        Job Title: ${jobTitle}
        Job Requirements: ${reqStr}
        Job Description: ${jobDescription}
        
        Candidate Resume:
        ${resumeText}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema
        }
      });

      const parsedJSON = JSON.parse(response.text || '{}');
      return res.json({ success: true, analysis: parsedJSON });
    } catch (error) {
      console.error('Gemini Fit Scorer Error, falling back to simulated analysis:', error);
    }
  }

  // 2. Smart Fallback heuristics
  const skillsMatched: string[] = [];
  const keywordHeuristics = ['react', 'node', 'typescript', 'postgres', 'agile', 'scrum', 'clinical', 'nursing', 'cad', 'solidworks', 'banking', 'valuation', 'excel'];
  keywordHeuristics.forEach(kw => {
    if (resumeText.toLowerCase().includes(kw) && (jobDescription + ' ' + reqStr).toLowerCase().includes(kw)) {
      skillsMatched.push(kw.toUpperCase());
    }
  });

  const baseScore = 60 + (skillsMatched.length * 8);
  const finalScore = Math.min(baseScore, 95);

  const mockAnalysis = {
    strengths: [
      'Strong communicative clarity in qualifications summary',
      skillsMatched.length > 0 ? `Explicit match on core skill sets: ${skillsMatched.join(', ')}` : 'Demonstrates active regional experience'
    ],
    gaps: [
      'Lacks extensive enterprise portfolio details',
      skillsMatched.length < 3 ? 'Specific certifications or tools outlined in requirements are not explicitly emphasized' : 'Minor timeline gaps between positions'
    ],
    recommendations: [
      'Restructure qualifications to highlight metrics and quantitative outcomes',
      'Append active projects or clinical certifications to the top of your resume'
    ],
    matchedSkills: skillsMatched.length > 0 ? skillsMatched : ['Corporate Communication', 'Strategic Focus'],
    jobFitPercentage: finalScore
  };

  res.json({ success: true, analysis: mockAnalysis });
});


// Export Express app for Vercel Serverless Functions
export default app;

// Mounting Vite server in Development, or serving static files in Production
async function startFullStackApp() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Turenakx Full-Stack Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

// Bootstrap and run safely
try {
  getDB();
  bootstrapSupabase().catch(e => console.warn('Supabase bootstrap notice:', e));
  if (!process.env.VERCEL) {
    startFullStackApp();
  }
} catch (e) {
  console.warn('Initialization notice:', e);
}
