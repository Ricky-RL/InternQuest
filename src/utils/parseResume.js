import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).href;

/**
 * Extract all text from a PDF file.
 */
async function extractText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    pages.push(strings.join(' '));
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
 */
function extractSkills(text) {
  const knownSkills = [
    'JavaScript',
    'TypeScript',
    'React',
    'React Native',
    'Angular',
    'Vue',
    'Vue.js',
    'Next.js',
    'Node.js',
    'Express',
    'Python',
    'Java',
    'C',
    'C\\+\\+',
    'C#',
    'Go',
    'Rust',
    'Ruby',
    'PHP',
    'Swift',
    'Kotlin',
    'Scala',
    'R',
    'MATLAB',
    'SQL',
    'NoSQL',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'Redis',
    'GraphQL',
    'REST',
    'AWS',
    'Azure',
    'GCP',
    'Docker',
    'Kubernetes',
    'Terraform',
    'Git',
    'GitHub',
    'GitLab',
    'CI/CD',
    'Linux',
    'HTML',
    'CSS',
    'Sass',
    'Tailwind',
    'Bootstrap',
    'Figma',
    'Excel',
    'Tableau',
    'Power BI',
    'TensorFlow',
    'PyTorch',
    'Pandas',
    'NumPy',
    'Spring Boot',
    'Django',
    'Flask',
    'FastAPI',
    'Firebase',
    'Supabase',
    'Webpack',
    'Vite',
  ];

  // Try to find a skills section first
  const skillsSectionPattern =
    /(?:Technical\s+)?Skills|Technologies|Languages|Tools[:\s]*\n?([\s\S]*?)(?:\n\s*\n|\n[A-Z][a-z]+\s*\n|$)/i;
  const sectionMatch = text.match(skillsSectionPattern);

  const searchText = sectionMatch ? sectionMatch[0] : text;

  const found = new Set();
  for (const skill of knownSkills) {
    const regex = new RegExp(`\\b${skill}\\b`, 'i');
    if (regex.test(searchText)) {
      // Normalize the skill name to its canonical form
      const canonical = skill.replace(/\\\+/g, '+');
      found.add(canonical);
    }
  }

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
