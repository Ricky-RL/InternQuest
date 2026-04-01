/**
 * Hardcoded internship job postings.
 *
 * Each job object shape:
 * @typedef {Object} Job
 * @property {string} id           - Unique slug, e.g. "google-swe-2025"
 * @property {string} title        - Role title, e.g. "Software Engineer Intern"
 * @property {string} company      - Company name, e.g. "Google"
 * @property {string} logoInitial  - Single letter shown as logo placeholder
 * @property {string} location     - e.g. "Mountain View, CA"
 * @property {'swe'|'aiml'|'finance'|'product'|'marketing'|'consulting'} category
 * @property {string} pay          - e.g. "$45/hr"
 * @property {string} season       - e.g. "Summer 2025"
 * @property {number} postedDaysAgo
 * @property {string} description  - 2–3 sentence summary
 * @property {string[]} responsibilities
 * @property {string[]} requirements
 * @property {string[]} skills     - Used for matchScore calculation
 * @property {string} applyUrl     - External URL or "#"
 */

/** @type {Job[]} */
export const jobs = [];
