import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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

// Database JSON File Path
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure data folder exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Helper: Get or Init Database
function getDB() {
  if (!fs.existsSync(DB_PATH)) {
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

    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2), 'utf-8');
    return initialDB;
  }

  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Helper: Save Database
function saveDB(db: any) {
  db.updateVersion = (db.updateVersion || 0) + 1;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  notifyRealtimeClients();
}

// Realtime SSE Subscriptions
let realtimeClients: any[] = [];

function notifyRealtimeClients() {
  console.log(`Broadcasting real-time update to ${realtimeClients.length} connected clients...`);
  realtimeClients.forEach(client => {
    client.write(`event: data-updated\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
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
  res.write(`data: ${JSON.stringify({ status: 'connected' })}\n\n`);

  req.on('close', () => {
    realtimeClients = realtimeClients.filter(client => client !== res);
    console.log(`Client disconnected from SSE. Remaining: ${realtimeClients.length}`);
  });
});

// API: Get entire Database (For frontend initial load and polling fallback)
app.get('/api/db', (req, res) => {
  const db = getDB();
  res.json(db);
});

// API: Submit Contact Message
app.post('/api/messages', (req, res) => {
  const db = getDB();
  const newMessage = {
    id: `msg-${Date.now()}`,
    ...req.body,
    status: 'unread',
    created_at: new Date().toISOString()
  };
  db.contactMessages.unshift(newMessage);
  
  // Log inside audit
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    user: 'Guest User',
    action: 'Contact Message Submission',
    target: `${newMessage.name} (${newMessage.subject})`,
    timestamp: new Date().toISOString()
  });

  saveDB(db);
  res.status(201).json({ success: true, message: newMessage });
});

// API: Auth Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const db = getDB();

  // Admin login
  if (role === 'admin') {
    if (email === 'rkturenak@gmail.com' && password === 'Akshatha agency') {
      // Log inside audit
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

  // Candidate login
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
    // Auto-create/register candidate on first login for demo fluidity (with success message)
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

  // Employer login
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
    // Auto-create employer/company on first login for demonstration speed
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
app.post('/api/auth/register', (req, res) => {
  const { email, password, role, name } = req.body;
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
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  const db = getDB();

  if (email === 'rkturenak@gmail.com' && password === 'Akshatha agency') {
    // Log inside audit
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
app.post('/api/jobs', (req, res) => {
  const db = getDB();
  const newJob = {
    id: `job-${Date.now()}`,
    ...req.body,
    appliedCount: 0,
    created_at: new Date().toISOString(),
    status: req.body.status || 'active'
  };
  db.jobs.unshift(newJob);

  // Log inside audit
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

app.put('/api/jobs/:id', (req, res) => {
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

app.delete('/api/jobs/:id', (req, res) => {
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
app.post('/api/applications', (req, res) => {
  const db = getDB();
  const newApp = {
    id: `app-${Date.now()}`,
    ...req.body,
    status: 'applied',
    appliedAt: new Date().toISOString()
  };
  db.applications.unshift(newApp);

  // Increment appliedCount on the job
  const job = db.jobs.find((j: any) => j.id === newApp.jobId);
  if (job) {
    job.appliedCount = (job.appliedCount || 0) + 1;
  }

  // Update candidate details if missing phone or resume
  const candidate = db.candidates.find((c: any) => c.id === newApp.candidateId);
  if (candidate) {
    candidate.resumeText = newApp.resumeText;
    if (newApp.candidatePhone) candidate.phone = newApp.candidatePhone;
  }

  // Log inside audit
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

app.put('/api/applications/:id', (req, res) => {
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
    return res.json({ success: true, application: db.applications[appIndex] });
  }
  res.status(404).json({ success: false, message: 'Application not found' });
});

// API: CMS Settings Updates
app.put('/api/settings', (req, res) => {
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
app.post('/api/blogs', (req, res) => {
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

app.put('/api/blogs/:id', (req, res) => {
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

app.delete('/api/blogs/:id', (req, res) => {
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
app.post('/api/companies', (req, res) => {
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

app.put('/api/companies/:id', (req, res) => {
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

app.delete('/api/companies/:id', (req, res) => {
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

// API: FAQ items
app.post('/api/faqs', (req, res) => {
  const db = getDB();
  const newFaq = {
    id: `faq-${Date.now()}`,
    ...req.body
  };
  db.faqs.push(newFaq);
  saveDB(db);
  res.status(201).json({ success: true, faq: newFaq });
});

app.delete('/api/faqs/:id', (req, res) => {
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
app.post('/api/testimonials', (req, res) => {
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

app.delete('/api/testimonials/:id', (req, res) => {
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


// Mounting Vite server in Development, or serving static files in Production
async function startFullStackApp() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Turenakx Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

// Bootstrap and run
getDB();
startFullStackApp();
