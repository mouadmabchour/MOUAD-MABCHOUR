import { useState, useRef, useEffect, FormEvent } from 'react';
import { Search, X, Loader2, ArrowUpDown } from 'lucide-react';
import { SearchType, SortType } from '../services/libraryService';
import { cn } from '../lib/utils';

interface SearchBarProps {
  onSearch: (query: string, type: SearchType, sort: SortType) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<SearchType>('all');
  const [sort, setSort] = useState<SortType>('relevance');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), type, sort);
    }
  };

  const types: { value: SearchType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'subject', label: 'Genre' }
  ];

  const sorts: { value: SortType; label: string }[] = [
    { value: 'relevance', label: 'Best Match' },
    { value: 'new', label: 'Newest' },
    { value: 'old', label: 'Oldest' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto px-4">
      <div className="flex flex-col gap-6">
        <div className="relative flex items-center group">
          <div className="absolute left-6 text-brand-muted/80 group-focus-within:text-brand-accent transition-colors">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Search className="h-6 w-6" />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the global archive for millions of volumes..."
            className="w-full h-16 pl-16 pr-16 rounded-2xl border-2 border-brand-border bg-white/90 backdrop-blur-md text-brand-ink text-lg focus:outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all placeholder:text-brand-muted/50 shadow-xl shadow-brand-ink/5"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-6 p-1.5 rounded-full text-brand-muted hover:bg-brand-paper transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-2 p-1 bg-brand-border/30 rounded-full border border-brand-border backdrop-blur-sm">
            {types.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={cn(
                  "px-6 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all",
                  type === t.value
                    ? "bg-brand-ink text-white shadow-lg"
                    : "text-brand-muted hover:text-brand-ink"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-brand-border bg-white/50 backdrop-blur-sm">
            <span className="text-[11px] uppercase tracking-widest font-bold text-brand-muted flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sorting:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="bg-transparent text-[11px] uppercase tracking-widest font-bold text-brand-ink focus:outline-none cursor-pointer border-b border-brand-accent/40 pb-0.5 hover:text-brand-accent transition-colors"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </form>
  );
}
