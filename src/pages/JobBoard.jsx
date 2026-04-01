import { useState, useMemo } from 'react';
import { jobs } from '../data/jobs';
import { useProfile } from '../context/useProfile';
import { matchScore } from '../utils/matchScore';
import FilterTabs from '../components/FilterTabs';
import JobCard from '../components/JobCard';

const CATEGORIES = [
  { value: 'swe', label: 'SWE' },
  { value: 'aiml', label: 'AI/ML' },
  { value: 'finance', label: 'Finance' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'consulting', label: 'Consulting' },
];

export default function JobBoard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { profile } = useProfile();

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesCategory = activeCategory === 'all' || job.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.skills.some(s => s.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Internships</h1>
        <p className="text-slate-400">Discover opportunities at top companies</p>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search roles, companies, skills..."
        className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 mb-6"
      />

      <FilterTabs
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <p className="text-slate-400 text-sm mb-4">
        {filteredJobs.length} internships found
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map(job => (
          <JobCard key={job.id} job={job} score={matchScore(job, profile)} />
        ))}
      </div>
    </div>
  );
}
