// Portfolio data for Praveen Sentha
window.PORTFOLIO_DATA = {
  name: "Praveen Sentha",
  role: "Infrastructure & AI Engineer",
  tagline: "Building automation, observability, and AI tools at scale.",
  location: "San Diego, CA",
  email: "praveen.sentha@gmail.com",
  phone: "(925) 366-0766",
  website: "psentha02.github.io",
  citizenship: "U.S. Citizen",

  about: {
    short: "Infrastructure engineer turning servers, telemetry, and LLMs into reliable systems.",
    long: "I'm an Infrastructure Engineer at Qualcomm working on server lifecycle automation — everything from racking new hardware to building LangChain agents that let directors ask plain-English questions about our fleet. Currently pursuing an M.S. in CS (AI track) at Georgia Tech while shipping production tooling that touches 5,000+ ESXi hosts and 20+ global data centers.",
    interests: ["Distributed systems", "LLM agents & RAG", "Observability", "Tennis", "Scouting"],
  },

  education: [
    {
      school: "Georgia Institute of Technology",
      degree: "M.S. Computer Science, Artificial Intelligence",
      dates: "Jan 2026 – Present",
    },
    {
      school: "Purdue University",
      degree: "B.S. Data Science, Certificate in Entrepreneurship & Innovation",
      dates: "Aug 2020 – Dec 2023",
    },
  ],

  experience: [
    {
      company: "Qualcomm",
      title: "Infrastructure Engineer — Server Lifecycle Automation",
      location: "San Diego, CA",
      dates: "Feb 2024 – Present",
      highlights: [
        "Delivered ~100 production servers across 20+ global data centers — owning procurement-to-production lifecycle and validating firmware, BIOS, and out-of-band management for customer-facing engineering workloads.",
        "Built a LangChain + Anthropic LLM + FAISS natural-language text-to-SQL agent with a semantic layer for infrastructure resources, cutting time-to-insight for RCA by ~90%.",
        "Enabled continuous infrastructure telemetry ingestion (~100K+ rows / 30-min cadence) using PowerShell and Python workflows orchestrated through Azure DevOps CI/CD.",
        "Drove director-level capacity planning by designing a structured SQL data model and delivering Grafana dashboards and alerting for CPU, memory, and storage optimization.",
        "Secured credentials for 5,000+ ESXi hosts (400+ monthly net-new onboardings) by leading CyberArk PAM onboarding with automated password vaulting and rotation.",
      ],
    },
    {
      company: "Qualcomm",
      title: "Software Engineering Intern — Server Lifecycle Automation",
      location: "San Diego, CA",
      dates: "May 2023 – Aug 2023",
      highlights: [
        "Developed a showback notification framework with query views and director-level visuals to reduce company-wide virtualization costs.",
        "Constructed a VM template pipeline on Azure DevOps + VMware vRealize with monthly template updates, new security features, and automated deployment tests.",
        "Enhanced a system-management software framework used by IT; validated end-to-end with Postman.",
      ],
    },
    {
      company: "Stryker",
      title: "Software Design Engineering Intern",
      location: "San Jose, CA",
      dates: "May 2022 – Aug 2022",
      highlights: [
        "Built a C# GUI app that dynamically presents and updates parameters, improving display monitor testing efficiency by 70%.",
        "Used Microsoft SQL Server to store performance data for further analysis.",
      ],
    },
  ],

  projects: [
    {
      name: "Hunch",
      tagline: "Peer-to-peer prediction market platform",
      url: "hunch-beta.vercel.app",
      description: "Production-ready P2P prediction market — market creation, predictions, outcome resolution, and fair zero-sum payouts via a refund-based model. Serverless on Next.js + Supabase + Vercel + Google OAuth.",
      stack: ["Next.js", "Supabase", "PostgreSQL", "Vercel", "OAuth"],
    },
    {
      name: "Text-to-SQL Infra Agent",
      tagline: "Natural-language queries over our server fleet",
      description: "Internal LangChain + Anthropic + FAISS agent with a semantic layer over infrastructure data. Engineers and directors ask plain-English questions; the agent writes the SQL, runs it, and returns answers. Cut RCA time-to-insight by ~90%.",
      stack: ["LangChain", "Anthropic", "FAISS", "PostgreSQL", "Python"],
    },
    {
      name: "Telemetry Ingestion Pipelines",
      tagline: "100K+ rows on a 30-minute cadence",
      description: "PowerShell + Python collection workflows orchestrated through Azure DevOps CI/CD with distributed low-latency ingestion VMs, validation checks, and automated alerting.",
      stack: ["PowerShell", "Python", "Azure DevOps", "Grafana"],
    },
  ],

  skills: {
    "Languages": ["Python", "PowerShell", "SQL", "Go", "Java", "JavaScript", "C#", "R"],
    "Infrastructure": ["VMware ESXi", "vCenter", "Hyper-V", "SCVMM", "Azure Local", "VDI", "Cloud PCs", "CyberArk PAM", "Active Directory"],
    "Cloud & DevOps": ["Azure", "AWS", "Azure DevOps", "Git", "Terraform", "Kubernetes"],
    "Data & Observability": ["Grafana", "Prometheus", "MS SQL Server", "PostgreSQL", "MongoDB", "Neo4j", "Spark", "Hadoop", "Kibana"],
    "AI": ["LangChain", "FAISS", "RAG", "Text-to-SQL", "Prompt Engineering", "Claude", "Cursor"],
  },

  honors: ["Eagle Scout", "Varsity Tennis Captain", "Azure Fundamentals certified"],

  contact: {
    email: "praveen.sentha@gmail.com",
    phone: "(925) 366-0766",
    website: "psentha02.github.io",
    linkedin: "linkedin.com/in/praveensentha", // placeholder
    github: "github.com/psentha02", // placeholder
  },

  starters: [
    "What does Praveen do at Qualcomm?",
    "Tell me about the text-to-SQL agent",
    "What's his tech stack?",
    "Is he open to new opportunities?",
    "What's Hunch?",
  ],
};
