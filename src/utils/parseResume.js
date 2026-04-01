import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).href;

/**
 * Extract all text from a PDF file, preserving line breaks
 * by detecting y-coordinate changes between text items.
 */
async function extractText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lines = [];
    let currentLine = '';
    let lastY = null;

    for (const item of content.items) {
      const y = item.transform?.[5]; // y-coordinate from transform matrix
      if (lastY !== null && y !== undefined && Math.abs(y - lastY) > 2) {
        // Y position changed — new line
        if (currentLine.trim()) lines.push(currentLine.trim());
        currentLine = item.str;
      } else {
        currentLine += item.str;
      }
      if (y !== undefined) lastY = y;
    }
    if (currentLine.trim()) lines.push(currentLine.trim());
    pages.push(lines.join('\n'));
  }
  return pages.join('\n');
}

/**
 * Try to extract a person's name from the first few lines.
 * Looks for a line with 2-3 capitalized words that isn't an address or email.
 */
function extractName(lines) {
  for (const line of lines.slice(0, 10)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Skip lines that look like emails, URLs, phone numbers, or addresses
    if (/@/.test(trimmed)) continue;
    if (/http/i.test(trimmed)) continue;
    if (/\d{5}/.test(trimmed)) continue; // ZIP code → address
    if (/\d{3}.*\d{3}/.test(trimmed)) continue; // phone-like

    // Check for 2-3 capitalized words
    const words = trimmed.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      const allCap = words.every((w) => /^[A-Z]/.test(w));
      if (allCap) return trimmed;
    }
  }
  return '';
}

/**
 * Extract university name.
 */
function extractUniversity(text) {
  const patterns = [
    /([A-Z][A-Za-z\s&'-]+(?:University|College|Institute|School of [A-Za-z]+))/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return '';
}

/**
 * Extract major / field of study.
 */
function extractMajor(text) {
  // Pattern: "B.S. in X", "Bachelor of X", "B.A. in X", "Master of X", etc.
  const degreePatterns = [
    /(?:B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|Bachelor(?:'s)?|Master(?:'s)?|Ph\.?D\.?)\s+(?:of|in|of Science in|of Arts in)\s+([A-Za-z\s&]+?)(?:\s*[,|\n(]|$)/i,
    /Major:\s*([A-Za-z\s&]+?)(?:\s*[,|\n(]|$)/i,
    /Concentration:\s*([A-Za-z\s&]+?)(?:\s*[,|\n(]|$)/i,
  ];

  for (const pattern of degreePatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }

  // Look for known major keywords near education section
  const knownMajors = [
    'Computer Science',
    'Computer Engineering',
    'Software Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biomedical Engineering',
    'Data Science',
    'Information Technology',
    'Information Systems',
    'Business Administration',
    'Economics',
    'Finance',
    'Accounting',
    'Marketing',
    'Mathematics',
    'Applied Mathematics',
    'Statistics',
    'Physics',
    'Chemistry',
    'Biology',
    'Psychology',
    'Political Science',
    'Communications',
    'English',
    'History',
  ];

  for (const major of knownMajors) {
    if (text.includes(major)) return major;
  }

  return '';
}

/**
 * Extract graduation year (4-digit year between 2024-2030 near education context).
 */
function extractGradYear(text) {
  // Look for year near graduation keywords first
  const gradPatterns = [
    /(?:graduat|expected|class of|anticipated)\s*[:-]?\s*(20[2-3]\d)/i,
    /(?:May|June|December|Spring|Fall|Summer|Winter)\s+(20[2-3]\d)/i,
  ];

  for (const pattern of gradPatterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }

  // Fall back to any 4-digit year in a reasonable range
  const yearMatch = text.match(/\b(202[4-9]|2030)\b/);
  if (yearMatch) return yearMatch[1];

  return '';
}

/**
 * Extract skills from the resume text.
 * Uses a two-pass approach: first try to find a skills section,
 * then always scan the full text for known skill names.
 */
function extractSkills(text) {
  // Map of lowercase pattern → canonical display name
  const skillMap = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'react native': 'React Native',
    'react.js': 'React',
    'reactjs': 'React',
    'react': 'React',
    'angular': 'Angular',
    'vue.js': 'Vue.js',
    'vuejs': 'Vue.js',
    'vue': 'Vue.js',
    'next.js': 'Next.js',
    'nextjs': 'Next.js',
    'node.js': 'Node.js',
    'nodejs': 'Node.js',
    'express.js': 'Express',
    'express': 'Express',
    'python': 'Python',
    'java': 'Java',
    'c++': 'C++',
    'c#': 'C#',
    'golang': 'Go',
    'rust': 'Rust',
    'ruby': 'Ruby',
    'php': 'PHP',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'scala': 'Scala',
    'matlab': 'MATLAB',
    'sql': 'SQL',
    'nosql': 'NoSQL',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'postgres': 'PostgreSQL',
    'mysql': 'MySQL',
    'redis': 'Redis',
    'graphql': 'GraphQL',
    'rest api': 'REST APIs',
    'rest apis': 'REST APIs',
    'restful': 'REST APIs',
    'aws': 'AWS',
    'amazon web services': 'AWS',
    'azure': 'Azure',
    'gcp': 'GCP',
    'google cloud': 'GCP',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'k8s': 'Kubernetes',
    'terraform': 'Terraform',
    'git': 'Git',
    'github': 'GitHub',
    'gitlab': 'GitLab',
    'ci/cd': 'CI/CD',
    'linux': 'Linux',
    'html': 'HTML',
    'css': 'CSS',
    'sass': 'Sass',
    'scss': 'Sass',
    'tailwind': 'Tailwind',
    'tailwindcss': 'Tailwind',
    'bootstrap': 'Bootstrap',
    'figma': 'Figma',
    'excel': 'Excel',
    'tableau': 'Tableau',
    'power bi': 'Power BI',
    'powerbi': 'Power BI',
    'tensorflow': 'TensorFlow',
    'pytorch': 'PyTorch',
    'pandas': 'Pandas',
    'numpy': 'NumPy',
    'scikit-learn': 'Scikit-learn',
    'sklearn': 'Scikit-learn',
    'spring boot': 'Spring Boot',
    'spring': 'Spring Boot',
    'django': 'Django',
    'flask': 'Flask',
    'fastapi': 'FastAPI',
    'firebase': 'Firebase',
    'supabase': 'Supabase',
    'webpack': 'Webpack',
    'vite': 'Vite',
    'machine learning': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'natural language processing': 'NLP',
    'nlp': 'NLP',
    'computer vision': 'Computer Vision',
    'data analysis': 'Data Analysis',
    'data science': 'Data Science',
    'agile': 'Agile',
    'scrum': 'Scrum',
    'jira': 'Jira',
    'confluence': 'Confluence',
  };

  const textLower = text.toLowerCase();
  const found = new Set();

  // Sort patterns by length descending so multi-word patterns match first
  const patterns = Object.keys(skillMap).sort((a, b) => b.length - a.length);

  for (const pattern of patterns) {
    // Use indexOf for simple, reliable matching (no regex edge cases)
    if (textLower.includes(pattern)) {
      found.add(skillMap[pattern]);
    }
  }

  // Remove "Java" if "JavaScript" is present (common false positive)
  if (found.has('JavaScript') && found.has('Java')) {
    // Only keep Java if it appears independently (not just as part of JavaScript)
    const javaAlone = textLower.replace(/javascript/g, '').includes('java');
    if (!javaAlone) found.delete('Java');
  }

  // Remove "React" duplicate if "React Native" was found
  // (both are valid, keep both — they're different skills)

  return [...found];
}

/**
 * Extract experience / projects summary.
 */
function extractExperience(text) {
  const sectionHeaders = [
    'Work Experience',
    'Professional Experience',
    'Experience',
    'Projects',
    'Relevant Experience',
  ];

  for (const header of sectionHeaders) {
    const regex = new RegExp(
      `${header}\\s*\\n([\\s\\S]*?)(?:\\n(?:Education|Skills|Technical Skills|Awards|Certifications|References|Languages|Interests|Activities)\\s*\\n|$)`,
      'i',
    );
    const match = text.match(regex);
    if (match) {
      // Clean up the extracted text: collapse whitespace, trim
      const cleaned = match[1]
        .replace(/\n+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
      if (cleaned.length > 20) {
        // Truncate to a reasonable length for a summary
        return cleaned.length > 1000 ? cleaned.slice(0, 1000) + '...' : cleaned;
      }
    }
  }

  return '';
}

/**
 * Parse a PDF resume file and extract profile fields.
 * @param {File} file - A PDF File object
 * @returns {Promise<Object>} Extracted profile fields
 */
export async function parseResume(file) {
  const text = await extractText(file);
  const lines = text.split('\n').filter((l) => l.trim());

  const name = extractName(lines);
  const university = extractUniversity(text);
  const major = extractMajor(text);
  const gradYear = extractGradYear(text);
  const skills = extractSkills(text);
  const experience = extractExperience(text);

  return {
    name,
    university,
    major,
    gradYear,
    skills,
    experience,
    resumeFileName: file.name,
  };
}
