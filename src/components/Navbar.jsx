import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/[0.03] border-b border-white/[0.08] backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent font-extrabold text-xl">
          InternQuest
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/jobs"
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
              location.pathname === '/jobs' || location.pathname.startsWith('/jobs/')
                ? 'text-slate-100 bg-white/[0.08]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
            }`}
          >
            Jobs
          </Link>
          <Link
            to="/profile"
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
              location.pathname === '/profile'
                ? 'text-slate-100 bg-white/[0.08]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
            }`}
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
