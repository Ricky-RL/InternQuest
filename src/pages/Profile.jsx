import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/useProfile';
import { matchScore } from '../utils/matchScore';
import { parseResume } from '../utils/parseResume';
import { jobs } from '../data/jobs';

export default function Profile() {
  const { profile, saveProfile } = useProfile();

  const [form, setForm] = useState({
    name: profile.name || '',
    university: profile.university || '',
    major: profile.major || '',
    gradYear: profile.gradYear || '',
    skills: profile.skills || [],
    experience: profile.experience || '',
    resumeFileName: profile.resumeFileName || '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !form.skills.includes(val)) {
        setForm(prev => ({ ...prev, skills: [...prev.skills, val] }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateField('resumeFileName', file.name);

    if (file.name.toLowerCase().endsWith('.pdf')) {
      setParsing(true);
      setParsed(false);
      try {
        const result = await parseResume(file);
        setForm((prev) => ({
          ...prev,
          name: result.name || prev.name,
          university: result.university || prev.university,
          major: result.major || prev.major,
          gradYear: result.gradYear || prev.gradYear,
          skills:
            result.skills.length > 0
              ? [...new Set([...prev.skills, ...result.skills])]
              : prev.skills,
          experience: result.experience || prev.experience,
          resumeFileName: file.name,
        }));
        setParsed(true);
      } catch {
        // Silently fail — the file is still attached, just not parsed
      } finally {
        setParsing(false);
      }
    }
  };

  const handleSave = () => {
    saveProfile(form);
    setSaved(true);
  };

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [saved]);

  useEffect(() => {
    if (!parsed) return;
    const timer = setTimeout(() => setParsed(false), 3000);
    return () => clearTimeout(timer);
  }, [parsed]);

  const topMatches = useMemo(() => {
    if (!form.skills.length) return [];
    return jobs
      .map(job => ({
        job,
        score: matchScore(job, form),
      }))
      .filter(entry => entry.score !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [form]);

  const scoreBadge = (score) => {
    if (score >= 80) {
      return (
        <span className="bg-emerald-900/20 border border-emerald-500/30 text-emerald-300 rounded-full px-2.5 py-0.5 text-sm font-medium">
          {score}%
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="bg-amber-900/20 border border-amber-500/30 text-amber-300 rounded-full px-2.5 py-0.5 text-sm font-medium">
          {score}%
        </span>
      );
    }
    return (
      <span className="bg-white/[0.04] border border-white/10 text-slate-400 rounded-full px-2.5 py-0.5 text-sm font-medium">
        {score}%
      </span>
    );
  };

  const inputClasses =
    'w-full bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition';

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Your Profile</h1>
        <p className="text-slate-400 mt-1">
          Set up your profile to get AI-powered job matching
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white/[0.04] border border-white/10 backdrop-blur-sm rounded-xl p-6 space-y-6 mb-8">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => updateField('name', e.target.value)}
            placeholder="John Doe"
            className={inputClasses}
          />
        </div>

        {/* University */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">University</label>
          <input
            type="text"
            value={form.university}
            onChange={e => updateField('university', e.target.value)}
            placeholder="Stanford University"
            className={inputClasses}
          />
        </div>

        {/* Major */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Major</label>
          <input
            type="text"
            value={form.major}
            onChange={e => updateField('major', e.target.value)}
            placeholder="Computer Science"
            className={inputClasses}
          />
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Graduation Year</label>
          <input
            type="text"
            value={form.gradYear}
            onChange={e => updateField('gradYear', e.target.value)}
            placeholder="2026"
            className={inputClasses}
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Skills (press Enter to add)
          </label>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {form.skills.map(skill => (
                <span
                  key={skill}
                  className="bg-violet-900/30 text-violet-300 rounded-full px-3 py-1 text-sm inline-flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 text-violet-400 hover:text-violet-200 transition"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            placeholder="Type a skill and press Enter"
            className={inputClasses}
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Experience &amp; Past Projects
          </label>
          <textarea
            rows={4}
            value={form.experience}
            onChange={e => updateField('experience', e.target.value)}
            placeholder="Describe your experience, past projects, internships..."
            className={inputClasses + ' resize-none'}
          />
        </div>

        {/* Resume */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Resume</label>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2 text-slate-300 hover:border-violet-500/50 transition text-sm">
              Upload Resume
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
            </label>
            {form.resumeFileName && (
              <span className="text-slate-400 text-sm">{form.resumeFileName}</span>
            )}
            {parsing && (
              <span className="text-violet-400 text-sm animate-pulse">Parsing resume...</span>
            )}
            {parsed && !parsing && (
              <span className="text-emerald-400 text-sm">Resume parsed! Fields auto-filled.</span>
            )}
          </div>
        </div>

        {/* Save button + feedback */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg px-6 py-2 font-medium hover:opacity-90 transition"
          >
            Save Profile
          </button>
          {saved && (
            <span className="text-emerald-400 text-sm font-medium">Profile saved!</span>
          )}
        </div>
      </div>

      {/* Match Preview card */}
      <div className="bg-white/[0.04] border border-white/10 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Profile Match Preview</h2>
        {form.skills.length === 0 ? (
          <p className="text-slate-400">Add skills to see match scores</p>
        ) : (
          <div className="space-y-3">
            {topMatches.map(({ job, score }) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03] rounded px-1 -mx-1 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-slate-100 font-medium truncate">{job.title}</p>
                  <p className="text-slate-400 text-sm">{job.company}</p>
                </div>
                {scoreBadge(score)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
