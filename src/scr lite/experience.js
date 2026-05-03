// src/data/experience.js
const experience = [
  {
    id: 1,
    type: 'work',
    company: 'Tata Consultancy Services (TCS)',
    role: 'Project Intern',
    period: 'March 2025 – July 2025',
    location: 'Remote',
    description:
      'Worked in the GenAI division building evaluation and ranking systems using large language models.',
    points: [
      'Built DeepEval-based RAG evaluation software for GenAI QA systems.',
      'Developed a resume ranking system using local LLM and vector embeddings.',
      'Researched GenAI tools, frameworks, and advanced evaluation techniques.',
    ],
    techStack: ['Python', 'DeepEval', 'LangChain', 'LLM', 'RAG'],
    logo: '/icons/tcs.png',       // add logo to public/icons/ if you have it
  },
  {
    id: 2,
    type: 'work',
    company: 'AllSoft Solutions and Services',
    role: 'Project Intern',
    period: 'January 2025 – May 2025',
    location: 'Indore, India',
    description:
      'Built a data-driven retail forecasting system using machine learning to improve planning accuracy.',
    points: [
      'Built XGBoost model to forecast retail sales with high accuracy.',
      'Engineered features using sales history, holidays, and oil prices data.',
      'Improved retail planning through data-driven forecasting insights.',
    ],
    techStack: ['Python', 'XGBoost', 'Pandas', 'Feature Engineering'],
    logo: '/icons/allsoft.png',   // add logo to public/icons/ if you have it
  },
];

export default experience;