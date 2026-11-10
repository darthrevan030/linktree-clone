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
  techStack?: string[];
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
      'GEM Ambassador, Office of Global Education and Mobility: selected on leadership and cultural intelligence; mentor peers and represent NTU at host-university exchange fairs',
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
    title: 'Open Impact Fellow, Security & Quality track',
    organisation: 'Open Government Products Singapore × Mojaloop Foundation × YouthTechSG',
    start: 'May 2026',
    end: 'Present',
    bullets: [
      'Selected for national open-source fellowship supported by Infocomm Media Development Authority (IMDA) Singapore, contributing to the Mojaloop Foundation, an open-source payments platform for financial inclusion',
      'Won Key Contributor Award, MojaCom32 (Mojaloop Community), 2026',
      'Fixed credential leak in Mojaloop’s shared logging plugin (central-services-shared): DELETE request streams were serialised into logs, exposing Bearer tokens in plaintext. Sanitised payload logging, added unit tests. Merged (PR #524)',
      'Built QuantumTrace, post-quantum cryptography scanner for Mojaloop, as fellowship deliverable. Reviewed by Mojaloop maintainers',
      'Merged 3 PRs across 3 Mojaloop repos (central-services-shared, account-lookup-service, database-lib), including non-breaking dependency upgrades verified against audit, lint and full test suite',
    ],
    techStack: ['Python', 'JavaScript/TypeScript', 'Hapi', 'CircleCI', 'Grype', 'audit-ci', 'Git'],
  },
  {
    title: 'Product Lead',
    organisation: 'Money Pasar',
    start: 'Sep 2025',
    end: 'Present',
    bullets: [
      'Architecting Go-based payments backend integrating cross-border FX API for SGD↔MYR currency exchange',
      'Built database-driven blog CMS with responsive Next.js frontend and admin dashboard for investor communications and user onboarding',
      'Engineered production RBAC system (NextAuth v5) across three permission tiers with secure API routes',
      'Led Firebase → MongoDB Atlas migration, designing scalable schemas and optimizing connection pooling for serverless deployment on Vercel',
    ],
    techStack: ['Go', 'Next.js 16', 'TypeScript', 'MongoDB Atlas', 'NextAuth v5', 'REST APIs', 'Vercel'],
  },
  {
    title: 'QA Engineer Intern / Business Analyst Intern',
    organisation: 'Temus',
    orgNote: 'Temasek × US Tech JV',
    start: 'Jan 2026',
    end: 'Jul 2026',
    bullets: [
      'Built AI automation workflow that generates manual UAT test steps for new features, cutting test case drafting time 50% and improving consistency across releases',
      'Wrote and ran SQL on production databases to extract and validate test data, supporting defect investigation and QA reporting',
      'Functional testing and log-based debugging on production APIs; root-cause analysis with engineering teams',
      'As BA: wrote user stories and acceptance criteria in Agile/Scrum squads; demoed progress to senior leadership',
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
  { category: 'Languages', items: ['Go', 'TypeScript', 'JavaScript', 'Python', 'Java', 'SQL', 'C/C++'] },
  { category: 'Frameworks', items: ['Next.js', 'React', 'Node.js', 'Express.js', 'REST APIs', 'NextAuth'] },
  { category: 'Cloud & DevOps', items: ['AWS', 'Terraform', 'Docker', 'CI/CD', 'Git', 'Vercel'] },
  { category: 'Data', items: ['PostgreSQL', 'Supabase', 'MongoDB Atlas', 'Firebase'] },
  { category: 'AI', items: ['Anthropic API', 'OpenRouter', 'MCP (FastMCP)', 'agentic workflows'] },
  { category: 'Security', items: ['RBAC', 'API security', 'PDPA compliance', 'post-quantum crypto analysis'] },
];

export const activities: Activity[] = [
  {
    title: 'Captain, Darts Team',
    organisation: 'Hall of Residence 3, NTU',
    start: 'Aug 2024',
    end: 'Aug 2025',
    bullets: [
      'Coached 20-member team to Round of 8, Inter-Hall Recreational Games Championship, undefeated record',
    ],
  },
  {
    title: 'Active Member',
    organisation: 'NTU Cybersecurity Club',
    start: 'Aug 2024',
    end: 'Present',
    bullets: [
      'Workshops on threat analysis, penetration testing, security protocols (CyberSG R&D Programme Office)',
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
