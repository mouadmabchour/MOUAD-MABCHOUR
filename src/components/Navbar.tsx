import { Book as BookIcon, Globe, Library } from 'lucide-react';

interface NavbarProps {
  onHomeClick: () => void;
}

export function Navbar({ onHomeClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between bg-brand-paper/80 backdrop-blur-xl border-b border-brand-border">
      <div 
        onClick={onHomeClick}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 sky-gradient rounded-xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow">
          <Library className="h-6 w-6" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl font-display uppercase tracking-widest text-brand-ink leading-none">Global Lexicon</h1>
          <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-accent mt-1">Universal Archive</p>
        </div>
      </div>

    </nav>
  );
}
