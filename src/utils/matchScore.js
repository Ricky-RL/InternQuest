/**
 * Calculates a mock AI compatibility score between a job and a user profile.
 * Returns a number 0–100, or null if no profile skills are set or job has no skills.
 *
 * @param {{ skills: string[] }} job
 * @param {{ skills: string[] }} profile
 * @returns {number|null}
 */
export function matchScore(job, profile) {
  if (!profile?.skills?.length) return null;
  if (!job?.skills?.length) return null;
  const userSkills = profile.skills.map(s => s.toLowerCase());
  const jobSkills = job.skills.map(s => s.toLowerCase());
  const matches = jobSkills.filter(s => userSkills.includes(s)).length;
  return Math.round((matches / jobSkills.length) * 100);
}
