// All portfolio content lives here so copy is easy to edit in one place.
// Values are drawn from Manoj's CV.

export const profile = {
  name: 'Manoj P.',
  firstName: 'Manoj',
  role: 'Full Stack Developer',
  roles: [
    'Full Stack Developer',
    'AI Engineering (Project-Based)',
    'React & Node.js Developer',
    'RAG & LLM Application Builder',
  ],
  location: 'London, UK',
  email: 'manojpalanisamy46@gmail.com',
  phone: '+44 7818 933697',
  // TODO(Manoj): replace these with your real profile URLs.
  github: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
  cv: '/Manoj_P_CV.pdf',
  // Public URL where this site is deployed (used in social/OG meta tags).
  // TODO(Manoj): set to your real domain once deployed.
  siteUrl: 'https://manoj-portfolio.vercel.app',
  // Optional: paste a Formspree endpoint (https://formspree.io/f/xxxx) OR a
  // Web3Forms access key below to make the contact form submit in-page. If both
  // are empty, the form gracefully falls back to opening the visitor's email
  // app pre-addressed to you — so it works with zero setup.
  formspreeEndpoint: '',
  web3formsKey: '',
  tagline:
    'I build responsive web, cloud, and LLM-powered applications — from production React front-ends to retrieval-augmented AI prototypes.',
  summary:
    "Full Stack Developer with 2+ years' experience building responsive web and cloud applications using React.js, JavaScript, PHP, Node.js and AWS, including commercial delivery at Maverick Technologies. Hands-on, project-based AI engineering experience gained through self-directed development of LLM-powered chat, retrieval-augmented generation (RAG), AI resume generation and workflow automation prototypes.",
}

export const stats = [
  { value: 2, suffix: '+', label: "Years' experience" },
  { value: 4, suffix: '', label: 'Production sites shipped' },
  { value: 1000, suffix: '+', label: 'Users supported' },
  { value: 40, suffix: '+', label: 'Production issues resolved' },
]

export const skillGroups = [
  {
    title: 'AI Engineering',
    accent: 'violet',
    skills: [
      'Generative AI',
      'LLM API Integration',
      'Prompt Engineering',
      'Retrieval-Augmented Generation (RAG)',
      'Embeddings',
      'Vector Databases',
      'Semantic Search',
      'Context Management',
      'Structured JSON Outputs',
      'Document Q&A',
      'AI Workflow Automation',
    ],
  },
  {
    title: 'Languages',
    accent: 'cyan',
    skills: ['JavaScript (ES6+)', 'Python', 'PHP', 'HTML5', 'CSS3'],
  },
  {
    title: 'Frontend',
    accent: 'violet',
    skills: [
      'React.js',
      'Redux',
      'Bootstrap',
      'Responsive Design',
      'DOM Manipulation',
      'jQuery',
      'Chart.js',
    ],
  },
  {
    title: 'Backend & APIs',
    accent: 'cyan',
    skills: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'Fetch API',
      'Async Programming',
      'CRUD',
      'JSON',
      'API Error Handling',
    ],
  },
  {
    title: 'Databases & Cloud',
    accent: 'violet',
    skills: ['MySQL', 'MongoDB', 'AWS'],
  },
  {
    title: 'Tools & Practices',
    accent: 'cyan',
    skills: [
      'Git & GitHub',
      'Postman',
      'VS Code',
      'OOP',
      'Modular JS',
      'Agile',
      'Testing',
      'Debugging',
      'Performance Optimisation',
    ],
  },
]

// A compact list for the marquee.
export const marqueeSkills = [
  'React.js',
  'JavaScript',
  'Node.js',
  'Python',
  'PHP',
  'AWS',
  'Redux',
  'RAG',
  'LLM APIs',
  'Prompt Engineering',
  'Embeddings',
  'Vector DBs',
  'REST APIs',
  'MongoDB',
  'MySQL',
  'Chart.js',
  'Git',
]

export const experience = [
  {
    role: 'Front End & Full Stack Web Developer',
    company: 'Maverick Technologies',
    period: 'Jan 2025 — Present',
    kind: 'Commercial',
    points: [
      'Developed and maintained 4 production websites with React.js, JavaScript and PHP, supporting 500–1,000 users with reliable, responsive experiences.',
      'Built reusable React.js and Bootstrap components through modular development, reducing effort and improving maintainability.',
      'Collaborated with designers, copywriters and QA across 8–10 Agile sprints, resolving 40+ production issues.',
      'Integrated WordPress customisations and third-party APIs into CMS-driven websites.',
      'Improved front-end performance by 25–30% through lazy loading and rendering optimisation.',
    ],
  },
  {
    role: 'Full Stack Development Trainee',
    company: 'GUVI (IIT-M Incubated)',
    period: '2023 — 2024',
    kind: 'Training',
    points: [
      'Developed 6+ full-stack web applications using HTML5, CSS3, JavaScript, PHP and REST APIs.',
      'Built 15+ responsive interfaces and backend modules, strengthening end-to-end skills.',
      'Deployed cloud-hosted applications on AWS and practised scalable deployment workflows.',
      'Performed cross-browser testing and debugging within Agile teams across 5+ assignments.',
    ],
  },
  {
    role: 'AI Engineering & Full-Stack Development',
    company: 'Self-Directed',
    period: '2026 — Present',
    kind: 'Independent',
    points: [
      'Project-led learning in generative AI, LLM application development, full-stack JavaScript and cloud deployment.',
      'Built prototypes connecting React interfaces to LLM and REST APIs via Node.js and Python, with async handling and error states.',
      'Implemented RAG workflows: ingestion, chunking, embeddings, vector storage, semantic retrieval and grounded responses.',
      'Designed prompts for chat, document Q&A, summarisation, resume generation and structured extraction.',
    ],
  },
]

export const projects = [
  // AI projects
  {
    title: 'AI Chat Application',
    category: 'AI',
    tag: 'Personal Prototype',
    stack: ['React', 'JavaScript', 'Node.js', 'REST APIs', 'LLM API'],
    description:
      'A responsive full-stack chat interface with backend LLM integration, multi-turn history, reusable prompt templates, async requests, loading/error states and structured response rendering.',
    icon: '💬',
  },
  {
    title: 'RAG Document Q&A Assistant',
    category: 'AI',
    tag: 'Personal Prototype',
    stack: ['Python', 'LLM API', 'Embeddings', 'Vector DB', 'RAG'],
    description:
      'A document ingestion, chunking, embedding and vector-storage pipeline that retrieves semantically relevant passages and grounds LLM answers in supporting text.',
    icon: '📚',
  },
  {
    title: 'AI Resume Builder',
    category: 'AI',
    tag: 'Personal Prototype',
    stack: ['React', 'Node.js', 'LLM API', 'Prompt Engineering', 'JSON'],
    description:
      'An AI-assisted workflow that combines CV information and a target job description to draft ATS-aligned content using structured prompts and JSON responses, with user review before finalising.',
    icon: '📝',
  },
  {
    title: 'AI Workflow Automation Toolkit',
    category: 'AI',
    tag: 'Personal Prototype',
    stack: ['Python', 'JavaScript', 'REST APIs', 'LLM API'],
    description:
      'Reusable API-driven workflows for summarisation, classification, extraction and text transformation, with validation, retry logic and error handling.',
    icon: '⚙️',
  },
  // Full-stack projects
  {
    title: 'Micro-SaaS Task Manager',
    category: 'Full-Stack',
    tag: 'Full-Stack Project',
    stack: ['React.js', 'Node.js', 'PHP', 'JWT', 'AWS'],
    description:
      'A real-time task management platform with role-based dashboards, responsive workflows, JWT authentication and AWS deployment for scalable team collaboration.',
    icon: '✅',
  },
  {
    title: 'Multi-Vendor Marketplace',
    category: 'Full-Stack',
    tag: 'Full-Stack Project',
    stack: ['React.js', 'Bootstrap', 'PHP', 'Stripe'],
    description:
      'Buyer and seller portals with secure Stripe payments, product listings and inventory management; API optimisation reduced response latency by 25%.',
    icon: '🛒',
  },
  {
    title: 'Expense Tracker with Analytics',
    category: 'Full-Stack',
    tag: 'Full-Stack Project',
    stack: ['React.js', 'Redux', 'Chart.js'],
    description:
      'A responsive expense dashboard with centralised state management, interactive reports and dynamic visualisations of spending patterns.',
    icon: '📊',
  },
  {
    title: 'Online Examination Platform',
    category: 'Full-Stack',
    tag: 'Full-Stack Project',
    stack: ['React.js', 'PHP', 'MySQL', 'AWS'],
    description:
      'Quiz, administration and analytics workflows with automated results and a scalable architecture designed to support ~100 concurrent users.',
    icon: '🎓',
  },
]

export const education = [
  {
    degree: 'MSc Management with Project Management',
    school: 'BPP University',
    year: '2024',
    detail:
      'Project delivery, stakeholder management, business strategy and technology project execution.',
  },
  {
    degree: 'Bachelor of Computer Applications',
    school: 'K.S. Rangasamy College of Arts and Science',
    year: '2022',
    detail:
      'Foundations in software development, databases, programming and application design.',
  },
]

export const certifications = [
  {
    title: 'Full Stack Development Program',
    issuer: 'GUVI (IIT-M Incubated)',
    detail: 'HTML5, CSS3, JavaScript, PHP, MySQL, REST APIs, Git, Agile & AWS deployment.',
  },
]

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]
