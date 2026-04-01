import { Link } from 'react-router-dom';

const valueProps = [
  {
    icon: '\uD83D\uDCCB',
    title: 'Centralized Feed',
    description: 'Every internship from top companies, aggregated in one place so you never miss an opportunity.',
  },
  {
    icon: '\uD83E\uDD16',
    title: 'AI Matching',
    description: 'Our algorithm scores each role against your skills and preferences for a personalized feed.',
  },
  {
    icon: '\uD83D\uDE80',
    title: 'One-Click Apply',
    description: 'Save your profile once, then apply to any listing with a single click.',
  },
];

export default function Landing() {
  return (
    <div className="text-slate-100">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Find Your Dream Internship
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            One platform. Every internship. AI-powered matching to find your perfect fit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/jobs"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold transition-opacity hover:opacity-90"
            >
              Browse Jobs
            </Link>
            <Link
              to="/profile"
              className="px-6 py-3 rounded-lg border border-white/[0.15] text-slate-300 font-semibold hover:bg-white/[0.08] transition-all"
            >
              Build My Profile
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {valueProps.map((prop) => (
            <div
              key={prop.title}
              className="bg-white/[0.04] border border-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-4">{prop.icon}</div>
              <h3 className="text-slate-100 font-semibold text-lg mb-2">{prop.title}</h3>
              <p className="text-slate-400 text-sm">{prop.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="text-center py-12 px-6">
        <p className="text-slate-400 text-lg font-medium">
          42+ Postings &middot; 6 Categories &middot; AI-Powered Matching
        </p>
      </section>

      {/* Bottom CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-6">
          Ready to start?
        </h2>
        <Link
          to="/jobs"
          className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold transition-opacity hover:opacity-90"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
