// src/data/projects.js
const projects = [
  {
    id: 1,
    title: 'BloomNet: Flower Classification System',
    description:
      'A deep learning system that identifies and provides detailed information about flower species from images using CNN architecture.',
    image: '/images/projects/bloomnet.png',
    techStack: ['Python', 'TensorFlow', 'CNN', 'OpenCV', 'NumPy'],
    githubUrl: 'https://github.com/Manaspurohit28/Flower_Classification_System.git',
    liveUrl: null,
    featured: true,
    category: 'Machine Learning',
  },
  {
    id: 2,
    title: 'Bangalore House Price Prediction',
    description:
      'A machine learning tool that estimates house prices in Bangalore based on property details like location, size, and amenities.',
    image: '/images/projects/house.png',
    techStack: ['Python', 'Scikit-learn', 'Pandas', 'Flask', 'NumPy'],
    githubUrl: '#',
    liveUrl: null,
    featured: true,
    category: 'Machine Learning',
  },
  {
    id: 3,
    title: 'RAG Evaluation System',
    description:
      'DeepEval-based evaluation software for GenAI QA systems built during TCS internship. Assesses retrieval-augmented generation pipeline quality.',
    image: '/images/projects/ragai.png',
    techStack: ['Python', 'DeepEval', 'LangChain', 'LLM', 'RAG'],
    githubUrl: '#',
    liveUrl: null,
    featured: true,
    category: 'GenAI',
  },
  {
    id: 4,
    title: 'Resume Ranking System',
    description:
      'Automated resume ranking system using local LLM and embeddings to match candidates against job descriptions accurately.',
    image: '/images/projects/resume-rank.png',
    techStack: ['Python', 'Embeddings', 'LLM', 'FAISS', 'NLP'],
    githubUrl: '#',
    liveUrl: null,
    featured: false,
    category: 'GenAI',
  },
  {
    id: 5,
    title: 'Retail Sales Forecasting',
    description:
      'XGBoost-powered retail sales forecasting model built at AllSoft. Uses sales history, holidays, and oil price data for accurate predictions.',
    image: '/images/projects/retail.png',
    techStack: ['Python', 'XGBoost', 'Pandas', 'Feature Engineering', 'Matplotlib'],
    githubUrl: '#',
    liveUrl: null,
    featured: false,
    category: 'Machine Learning',
  },
];

export default projects;