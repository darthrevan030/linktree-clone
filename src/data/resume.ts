/**
 * Canonical public resume data.
 *
 * This is NOT your working copy — the Word doc stays the source for
 * per-application tailoring. Update this only when *facts* change
 * (a new role, a new qualification). Projects live in
 * src/content/projects/ and are rendered onto /resume from there, so they
 * are deliberately absent from this file.
 *
 * Schema is flat and obviously-named on purpose: updates are made by pasting
 * Word-doc content to an AI and asking it to add an entry.
 */

export type Education = {
  institution: string;
  qualification: string;
  detail?: string;
  start: string;
  end: string;
  notes: string[];
};

export type Role = {
  title: string;
  organisation: string;
  orgNote?: string;
  start: string;
  end: string;
  bullets: string[];
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type Activity = {
  title: string;
  organisation: string;
  start: string;
  end: string;
  bullets: string[];
};

export const education: Education[] = [
  {
    institution: 'Nanyang Technological University, Singapore',
    qualification: 'Bachelor of Engineering in Computer Engineering',
    detail: 'Second Major in Business (International Trade)',
    start: 'Aug 2024',
    end: 'Present',
    notes: [
      'Honours (Merit)',
      'Semester Exchange — Universidad Carlos III de Madrid, Spain (Aug – Dec 2026)',
      'GEM Ambassador, Office of Global Education and Mobility (OGEM) — selected for ambassadorial programme based on leadership, cultural intelligence, and international outlook. Responsibilities include mentoring peers and representing NTU at host university exchange fairs',
      'Relevant modules — Introduction to Computational Thinking & Programming, Digital Logic, Computer Organisation & Architecture, C & C++ Programming, Data Structures and Algorithms, Algorithm Design & Analysis, Object Oriented Design & Programming, Financial Management, Financial Accounting, Commodity Markets, Marketing',
    ],
  },
  {
    institution: "St. Joseph's Institution (Independent), Singapore",
    qualification: 'Integrated Program International Baccalaureate (IP-IB) Diploma Program',
    start: 'Jan 2016',
    end: 'Dec 2021',
    notes: [
      'Higher Level — Mathematics Analysis and Approaches, Chemistry, Economics',
      'Standard Level — Spanish B Ab Initio, English Language and Literature, Geography',
    ],
  },
];

export const experience: Role[] = [
  {
    title: 'Business Analyst Intern',
    organisation: 'Temus',
    orgNote: 'Temasek × US Tech JV',
    start: 'Jan 2026',
    end: 'Apr 2026',
    bullets: [
      'Worked in Agile/Scrum squads delivering digital transformation projects, writing user stories and acceptance criteria for platform features across product, engineering, and design',
      'Delivered stakeholder demos presenting feature progress to senior leadership, translating technical complexity into business outcomes',
      'Used Jira for sprint planning, backlog grooming, and cross-functional coordination',
    ],
  },
  {
    title: 'QA Engineer Intern',
    organisation: 'Temus',
    orgNote: 'Temasek × US Tech JV',
    start: 'Apr 2026',
    end: 'Jul 2026',
    bullets: [
      'Scoped an AI automation workflow to generate UAT test steps for new features, identifying integration requirements and institutional blockers',
      'Wrote and executed SQL queries to extract and validate test data, supporting defect investigation and QA reporting across production databases',
      'Conducted functional testing and log-based debugging on production APIs, collaborating with engineering teams on root-cause analysis and resolution',
    ],
  },
  {
    title: 'YouthTechSG Open Impact Fellow',
    organisation: 'Open Source Programme',
    start: 'May 2026',
    end: 'Present',
    bullets: [
      'Selected for national open-source fellowship supported by IMDA, contributing to open-source projects with social impact focus',
    ],
  },
  {
    title: 'Product Lead',
    organisation: 'Money Pasar',
    start: 'Sep 2025',
    end: 'Present',
    bullets: [
      'Architecting and building Go-based payments backend integrating with EurexaX API for cross-border P2P currency exchange between SGD and MYR markets',
      'Engineered production RBAC system with NextAuth v5, implementing secure API routes and granular access controls across three permission levels (user, admin, superadmin)',
      'Led complete database migration from Firebase to MongoDB Atlas, designing scalable schemas and optimizing connection pooling for serverless deployment on Vercel',
      'Built database-driven blog CMS with admin dashboard, supporting investor communications and user onboarding, integrating Cloudinary for asset management',
    ],
  },
  {
    title: 'Human Resources Administrator & Data Analyst',
    organisation: 'ForYouths',
    start: 'Feb 2023',
    end: 'Jul 2024',
    bullets: [
      'Architected and deployed organization-wide intranet system with role-based access control, improving operational security and ensuring PDPA compliance across 200+ users',
      'Developed intelligent matching algorithm pairing volunteer mentors with mentees based on interests, academic background, and career goals — reducing manual processing time by 80%',
      'Established comprehensive data security protocols and document management framework',
    ],
  },
];

export const skills: SkillGroup[] = [
  {
    category: 'Programming Languages',
    items: ['Go', 'SQL', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C/C++'],
  },
  {
    category: 'Technologies & Frameworks',
    items: ['Next.js 16', 'Node.js', 'Express.js', 'React', 'REST APIs', 'NextAuth v5'],
  },
  {
    category: 'Databases',
    items: ['MongoDB Atlas', 'PostgreSQL', 'Supabase', 'Firebase'],
  },
  {
    category: 'DevOps & Tools',
    items: ['Vercel', 'Git', 'Docker', 'CI/CD pipelines', 'Jira'],
  },
  {
    category: 'Security & Best Practices',
    items: ['RBAC implementation', 'API security', 'Helmet.js', 'CORS', 'PDPA compliance'],
  },
  {
    category: 'Data & Analytics',
    items: ['Power BI', 'Jupyter Notebook', 'Database optimization', 'Connection pooling'],
  },
];

export const activities: Activity[] = [
  {
    title: 'Captain, Darts Team',
    organisation: 'Hall of Residence 3, NTU',
    start: 'Aug 2024',
    end: 'Aug 2025',
    bullets: [
      'Coached 20-member team from beginner to competitive level through structured training programs and weekly practice sessions',
      'Led team to Round of 8 in Inter-Hall Recreational Games Championship with undefeated record',
      'Developed comprehensive training curriculum and peer mentorship framework',
    ],
  },
  {
    title: 'Active Member',
    organisation: 'NTU Cybersecurity Club',
    start: 'Aug 2024',
    end: 'Present',
    bullets: [
      'Advancing cybersecurity expertise through professional seminars and hands-on applications (supported by CyberSG R&D Programme Office)',
      'Participating in practical workshops covering threat analysis, penetration testing, and security protocols',
    ],
  },
];

export const languages: string[] = [
  'English (Native)',
  'Hindi (Fluent)',
  'Spanish (Conversational)',
];

export const interests: string[] = [
  'Photography',
  'Fiction Literature',
  'Cybersecurity Research',
  'Emerging Technologies',
];
