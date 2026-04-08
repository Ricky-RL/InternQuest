// Hard-coded semantic compatibility scores for key jobs.
// These simulate AI-powered semantic analysis across three dimensions:
//   technical   — how well the candidate's skills map to the role
//   experience  — alignment between background/projects and what's expected
//   interest    — match between stated interests/major and the job domain
//
// Coverage spans all 6 categories so every major type sees relevant results.

export const semanticScores = {
  // ── SWE ──────────────────────────────────────────────────────────────────
  "google-swe-summer-2025": {
    overall: 94,
    technical: 96,
    experience: 88,
    interest: 91,
    whyMatch: "Your algorithmic foundation aligns with Google's engineering bar",
  },
  "meta-swe-summer-2025": {
    overall: 91,
    technical: 93,
    experience: 86,
    interest: 89,
    whyMatch: "Systems-level thinking maps well to Meta's infrastructure scale",
  },
  "stripe-swe-summer-2025": {
    overall: 88,
    technical: 90,
    experience: 84,
    interest: 87,
    whyMatch: "API design experience is a strong signal for Stripe's platform team",
  },
  "openai-aiml-summer-2025": {
    overall: 93,
    technical: 94,
    experience: 89,
    interest: 95,
    whyMatch: "ML research curiosity and Python depth are an excellent fit",
  },
  "anthropic-aiml-summer-2025": {
    overall: 90,
    technical: 91,
    experience: 86,
    interest: 93,
    whyMatch: "Safety-oriented mindset pairs naturally with Anthropic's mission",
  },
  "vercel-swe-summer-2025": {
    overall: 87,
    technical: 89,
    experience: 83,
    interest: 86,
    whyMatch: "Frontend and DevX experience maps closely to Vercel's product surface",
  },
  "databricks-swe-summer-2025": {
    overall: 85,
    technical: 88,
    experience: 81,
    interest: 84,
    whyMatch: "Data pipeline knowledge translates well to Databricks' core platform",
  },

  // ── AI / ML ───────────────────────────────────────────────────────────────
  "deepmind-aiml-summer-2025": {
    overall: 92,
    technical: 95,
    experience: 87,
    interest: 94,
    whyMatch: "Research-oriented background is well-suited to DeepMind's lab culture",
  },
  "nvidia-aiml-summer-2025": {
    overall: 89,
    technical: 92,
    experience: 85,
    interest: 88,
    whyMatch: "GPU and parallel computing interest aligns with NVIDIA's core work",
  },
  "huggingface-aiml-summer-2025": {
    overall: 88,
    technical: 90,
    experience: 84,
    interest: 91,
    whyMatch: "Open-source ML contributions signal strong cultural fit",
  },
  "scale-ai-aiml-summer-2025": {
    overall: 86,
    technical: 87,
    experience: 83,
    interest: 89,
    whyMatch: "Data-centric AI perspective matches Scale's annotation-first model",
  },

  // ── Finance ───────────────────────────────────────────────────────────────
  "jpmorgan-finance-summer-2025": {
    overall: 91,
    technical: 88,
    experience: 90,
    interest: 93,
    whyMatch: "Quantitative reasoning and finance fundamentals are a strong match",
  },
  "goldman-finance-summer-2025": {
    overall: 89,
    technical: 85,
    experience: 88,
    interest: 91,
    whyMatch: "Analytical rigor and market interest align with Goldman's analyst track",
  },
  "citadel-finance-summer-2025": {
    overall: 92,
    technical: 95,
    experience: 87,
    interest: 90,
    whyMatch: "Strong quant and programming background fits Citadel's tech-driven culture",
  },
  "two-sigma-finance-summer-2025": {
    overall: 90,
    technical: 93,
    experience: 85,
    interest: 88,
    whyMatch: "Data science crossover skills are highly valued at Two Sigma",
  },
  "robinhood-finance-summer-2025": {
    overall: 85,
    technical: 87,
    experience: 82,
    interest: 86,
    whyMatch: "Consumer finance interest pairs well with Robinhood's retail-first mission",
  },

  // ── Product ───────────────────────────────────────────────────────────────
  "figma-product-summer-2025": {
    overall: 90,
    technical: 85,
    experience: 88,
    interest: 94,
    whyMatch: "Design systems thinking and cross-functional experience shine here",
  },
  "notion-product-summer-2025": {
    overall: 87,
    technical: 82,
    experience: 86,
    interest: 91,
    whyMatch: "Productivity tooling interest and user empathy map well to Notion's PM role",
  },
  "stripe-product-summer-2025": {
    overall: 88,
    technical: 84,
    experience: 85,
    interest: 89,
    whyMatch: "Developer-facing product experience is a key differentiator at Stripe",
  },
  "github-product-summer-2025": {
    overall: 86,
    technical: 83,
    experience: 84,
    interest: 88,
    whyMatch: "Open-source community familiarity aligns with GitHub's developer mission",
  },
  "doordash-product-fall-2025": {
    overall: 84,
    technical: 80,
    experience: 83,
    interest: 87,
    whyMatch: "Ops-to-product thinking is a strong signal for DoorDash's marketplace PM",
  },

  // ── Marketing ─────────────────────────────────────────────────────────────
  "hubspot-marketing-summer-2025": {
    overall: 88,
    technical: 80,
    experience: 86,
    interest: 93,
    whyMatch: "Inbound marketing enthusiasm and content strategy skills are a natural fit",
  },
  "adobe-marketing-summer-2025": {
    overall: 85,
    technical: 78,
    experience: 84,
    interest: 90,
    whyMatch: "Creative tooling familiarity and brand storytelling align with Adobe's culture",
  },
  "tiktok-marketing-summer-2025": {
    overall: 87,
    technical: 79,
    experience: 85,
    interest: 94,
    whyMatch: "Social content instincts and creator economy interest are highly relevant",
  },
  "linkedin-marketing-summer-2025": {
    overall: 83,
    technical: 76,
    experience: 83,
    interest: 88,
    whyMatch: "B2B marketing mindset and professional network interest fit LinkedIn well",
  },

  // ── Consulting ────────────────────────────────────────────────────────────
  "mckinsey-consulting-summer-2025": {
    overall: 92,
    technical: 84,
    experience: 91,
    interest: 94,
    whyMatch: "Structured problem-solving and communication skills are McKinsey hallmarks",
  },
  "bcg-consulting-summer-2025": {
    overall: 90,
    technical: 83,
    experience: 89,
    interest: 92,
    whyMatch: "Strategic framing ability and data-driven storytelling are a strong match",
  },
  "bain-consulting-summer-2025": {
    overall: 88,
    technical: 81,
    experience: 87,
    interest: 91,
    whyMatch: "Results-oriented thinking and case prep signal fit with Bain's culture",
  },
  "deloitte-consulting-fall-2025": {
    overall: 85,
    technical: 80,
    experience: 85,
    interest: 88,
    whyMatch: "Cross-industry exposure interest aligns with Deloitte's broad practice areas",
  },
};

// Category-to-job-ID priority list used for major-based recommendations.
// When a user's major maps to a category, these jobs surface first.
export const categoryPriority = {
  swe: [
    "google-swe-summer-2025",
    "meta-swe-summer-2025",
    "stripe-swe-summer-2025",
    "vercel-swe-summer-2025",
    "databricks-swe-summer-2025",
  ],
  aiml: [
    "openai-aiml-summer-2025",
    "anthropic-aiml-summer-2025",
    "deepmind-aiml-summer-2025",
    "nvidia-aiml-summer-2025",
    "huggingface-aiml-summer-2025",
  ],
  finance: [
    "jpmorgan-finance-summer-2025",
    "citadel-finance-summer-2025",
    "goldman-finance-summer-2025",
    "two-sigma-finance-summer-2025",
    "robinhood-finance-summer-2025",
  ],
  product: [
    "figma-product-summer-2025",
    "notion-product-summer-2025",
    "github-product-summer-2025",
    "stripe-product-summer-2025",
    "doordash-product-fall-2025",
  ],
  marketing: [
    "hubspot-marketing-summer-2025",
    "tiktok-marketing-summer-2025",
    "adobe-marketing-summer-2025",
    "linkedin-marketing-summer-2025",
  ],
  consulting: [
    "mckinsey-consulting-summer-2025",
    "bcg-consulting-summer-2025",
    "bain-consulting-summer-2025",
    "deloitte-consulting-fall-2025",
  ],
};

// Infer a category from the user's self-reported major string.
export function inferCategoryFromMajor(major) {
  const m = major.toLowerCase();
  if (/finance|accounting|economics|banking|investment/.test(m)) return "finance";
  if (/marketing|communications|advertising|brand|pr|public relation/.test(m)) return "marketing";
  if (/consult|business|management|mba|strategy/.test(m)) return "consulting";
  if (/product|ux|design|hci|human.computer/.test(m)) return "product";
  if (/machine learning|artificial intelligence|data science|ml|ai/.test(m)) return "aiml";
  if (/computer|software|engineering|cs|information tech|systems/.test(m)) return "swe";
  return null;
}
