import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { jobs } from '../data/jobs';
import { useProfile } from '../context/useProfile';
import { matchScore } from '../utils/matchScore';
import JobCard from '../components/JobCard';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const job = jobs.find(j => j.id === id);

  const score = useMemo(
    () => (job ? matchScore(job, profile) : null),
    [job, profile],
  );

  const similarJobs = useMemo(() => {
    if (!job) return [];
    return jobs
      .filter(j => j.category === job.category && j.id !== job.id)
      .slice(0, 3);
  }, [job]);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 text-center">
        <h1 className="text-2xl font-bold text-slate-100 mb-4">Job not found</h1>
        <Link to="/jobs" className="text-violet-400 hover:text-violet-300 transition">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const scoreBanner = () => {
    if (score === null) return null;

    let containerClasses, label;
    if (score >= 80) {
      containerClasses = 'bg-emerald-900/20 border border-emerald-500/30 text-emerald-300';
      label = `${score}% Match — Great fit for your profile!`;
    } else if (score >= 60) {
      containerClasses = 'bg-amber-900/20 border border-amber-500/30 text-amber-300';
      label = `${score}% Match — Good potential fit`;
    } else {
      containerClasses = 'bg-white/[0.04] border border-white/10 text-slate-400';
      label = `${score}% Match`;
    }

    return (
      <div className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${containerClasses}`}>
        {label}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/jobs')}
        className="text-slate-400 hover:text-slate-200 transition mb-6 inline-flex items-center gap-1"
      >
        &larr; Back to Jobs
      </button>

      {/* Header card */}
      <div className="bg-white/[0.04] border border-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-white/[0.08] rounded-xl text-2xl font-bold text-slate-300 flex items-center justify-center shrink-0">
            {job.logoInitial}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-100">{job.title}</h1>
            <p className="text-slate-400 mt-1">
              {job.company} &middot; {job.location} &middot; {job.season} &middot; {job.pay}
            </p>
          </div>
        </div>
        {scoreBanner()}
      </div>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Description</h2>
        <p className="text-slate-300 leading-relaxed">{job.description}</p>
      </section>

      {/* Responsibilities */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">What You&apos;ll Do</h2>
        <ul className="list-disc list-inside text-slate-300 space-y-1">
          {job.responsibilities.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Requirements */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">What We&apos;re Looking For</h2>
        <ul className="list-disc list-inside text-slate-300 space-y-1">
          {job.requirements.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {job.skills.map(skill => (
            <span
              key={skill}
              className="bg-violet-900/30 text-violet-300 rounded-full px-3 py-1 text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Apply button */}
      <div className="mb-12">
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:opacity-90 transition text-center"
        >
          Apply Now &rarr;
        </a>
      </div>

      {/* Similar Jobs */}
      {similarJobs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Similar Internships</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarJobs.map(sj => (
              <JobCard
                key={sj.id}
                job={sj}
                score={matchScore(sj, profile)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
