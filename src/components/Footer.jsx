export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-6 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-slate-500 text-sm">&copy; 2025 InternQuest</span>
        <div className="flex gap-4">
          <a href="#" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
            About
          </a>
          <a href="#" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
