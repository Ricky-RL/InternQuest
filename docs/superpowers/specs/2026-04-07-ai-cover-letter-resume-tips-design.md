# Design: AI-Generated Cover Letters & Resume Tips

**Date:** 2026-04-07
**Status:** Approved

---

## Context

InternQuest users browse 112 internship postings but have no help crafting application materials. Adding hardcoded, role-tailored cover letters and resume adjustment suggestions — surfaced through a modal on each job detail page — gives users immediate, actionable value without requiring a backend or AI API calls. The approach mirrors the existing `semanticScores.js` pattern: pre-computed content stored in a static data file, with template fallbacks for jobs without custom entries.

---

## Goals

1. Users can generate a personalized cover letter for any job posting.
2. Users can view 3–5 resume tips tailored to a specific role.
3. Both features feel like AI generation (2.5s loading state) but are fully hardcoded.
4. Content is personalized using the user's profile (name, major, skills) where available.

---

## Architecture

### New Files

**`src/data/aiContent.js`**
The single source of truth for all AI content. Exports:

- `aiContent` — an object keyed by job ID containing `coverLetter` (string) and `resumeTips` (string array) for ~38 featured jobs. Cover letter strings contain `{NAME}`, `{MAJOR}`, and `{SKILLS}` tokens.
- `generateCoverLetter(job, profile)` — template fallback for jobs without custom content; builds a letter from `job.title`, `job.company`, `job.requirements`, and profile fields.
- `generateResumeTips(job)` — fallback that derives 3–5 tips from `job.requirements` and `job.skills`.

Featured jobs are the same ~38 jobs that already have entries in `semanticScores.js`.

**`src/components/AiContentModal.jsx`**
Reusable modal component. Props: `isOpen`, `onClose`, `mode` (`"cover-letter"` | `"resume-tips"`), `job`, `profile`.

Behavior:
1. Opens immediately with dark backdrop overlay.
2. Shows a 2.5-second loading state: animated spinner + contextual message ("Tailoring your cover letter..." or "Analyzing resume fit...").
3. After 2.5s, `isLoading` flips to `false` and content fades in.
4. Cover letter mode: scrollable pre-formatted text block + "Copy to Clipboard" button.
5. Resume tips mode: numbered list of 3–5 bullet points.
6. If profile is incomplete (no name/skills), a soft nudge appears above content: "Add your name and skills on your profile for a more personalized result."
7. Modal header shows job title + company name.
8. Closes on backdrop click or an X button.

### Modified Files

**`src/pages/JobDetail.jsx`**
- Import `useProfile` hook (already used on Profile page — `src/context/useProfile.js`).
- Import `AiContentModal` and `aiContent` / generator functions.
- Add two buttons in a new "AI Tools" row between the Apply button and the Similar Jobs section:
  - "Generate Cover Letter" (violet/primary style)
  - "Resume Tips" (outline/secondary style)
- Manage `modalOpen` and `modalMode` state locally.

---

## Personalization Logic

Inside `AiContentModal.jsx`, before rendering:

```js
const raw = aiContent[job.id]?.coverLetter ?? generateCoverLetter(job, profile)
const letter = raw
  .replace("{NAME}", profile.name || "I")
  .replace("{MAJOR}", profile.major || "my field")
  .replace("{SKILLS}", (profile.skills || []).slice(0, 3).join(", ") || "relevant technologies")
```

Resume tips have no tokens — they are role-specific prose, not profile-aware.

---

## Content Coverage

| Job set | Cover letter | Resume tips |
|---|---|---|
| ~38 featured jobs (same as semanticScores) | Fully hand-written | 3–5 hand-written tips |
| Remaining ~74 jobs | `generateCoverLetter()` template | `generateResumeTips()` template |

---

## UX Details

- Buttons sit between the Apply CTA and Similar Jobs grid on `JobDetail.jsx`.
- "Generate Cover Letter" is violet-filled (matches primary CTA style).
- "Resume Tips" is outlined/secondary.
- Modal uses the same dark glass-morphism style as the rest of the app (`bg-slate-900/95 backdrop-blur`).
- Loading spinner uses an existing Tailwind `animate-spin` border trick (no new dependency).
- Fade-in transition on content reveal: `transition-opacity duration-500`.

---

## Verification

1. Navigate to any job detail page (e.g., `/jobs/google-swe-summer-2025`).
2. Click "Generate Cover Letter" — modal opens, spinner shows for 2.5s, then personalized letter appears.
3. Click "Resume Tips" — same loading flow, then tips list appears.
4. If user has a profile, verify `{NAME}`, `{MAJOR}`, `{SKILLS}` tokens are replaced correctly.
5. Navigate to a job without a custom entry (non-featured job) — verify template fallback renders without errors.
6. If profile is empty, verify the "add your skills" nudge appears.
7. Test "Copy to Clipboard" copies the full letter text.
8. Test modal closes on backdrop click and X button.
