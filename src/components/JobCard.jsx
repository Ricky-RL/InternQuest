import { Link } from 'react-router-dom';

function ScoreBadge({ score }) {
  if (score == null) return null;

  let colors;
  if (score >= 80) {
    colors = 'bg-emerald-900/30 text-emerald-300';
  } else if (score >= 60) {
    colors = 'bg-amber-900/30 text-amber-300';
  } else {
    colors = 'bg-white/[0.08] text-slate-400';
  }

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors}`}>
      {score}% match
    </span>
  );
}

export default function JobCard({ job, score }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block bg-white/[0.04] border border-white/10 backdrop-blur-sm rounded-xl p-4 hover:border-violet-500/40 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-white/[0.08] flex items-center justify-center text-slate-300 font-bold text-sm shrink-0 overflow-hidden">
          {job.logoUrl ? (
            <img
              src={job.logoUrl}
              alt={`${job.company} logo`}
              className="w-full h-full object-contain p-1"
              onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <span style={{ display: job.logoUrl ? 'none' : 'flex' }} className="w-full h-full items-center justify-center">
            {job.logoInitial}
          </span>
        </div>
        <ScoreBadge score={score} />
      </div>

      <h3 className="text-slate-100 font-semibold text-sm mb-1">{job.title}</h3>
      <p className="text-slate-400 text-sm mb-3">
        {job.company} &middot; {job.location}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="bg-violet-900/30 text-violet-300 text-xs px-2 py-0.5 rounded-full">
          {job.category}
        </span>
        <span className="bg-blue-900/30 text-blue-300 text-xs px-2 py-0.5 rounded-full">
          {job.pay}
        </span>
        <span className="bg-white/[0.06] text-slate-400 text-xs px-2 py-0.5 rounded-full">
          {job.season}
        </span>
      </div>

      <p className="text-slate-500 text-xs">
        Posted {job.postedDaysAgo} {job.postedDaysAgo === 1 ? 'day' : 'days'} ago
      </p>
    </Link>
  );
}
