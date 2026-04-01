export default function FilterTabs({ categories, activeCategory, onCategoryChange }) {
  const allTabs = [{ value: 'all', label: 'All' }, ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {allTabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onCategoryChange(tab.value)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === tab.value
              ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white'
              : 'bg-white/[0.06] text-slate-400 border border-white/[0.08] hover:bg-white/[0.1]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
