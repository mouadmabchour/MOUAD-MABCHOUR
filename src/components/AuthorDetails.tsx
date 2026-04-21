import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Author, libraryService, Book } from '../services/libraryService';
import { X, Calendar, MapPin, User, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { BookCard } from './BookCard';

interface AuthorDetailsProps {
  authorKey: string;
  onClose: () => void;
  onBookClick: (book: Book) => void;
}

export function AuthorDetails({ authorKey, onClose, onBookClick }: AuthorDetailsProps) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [works, setWorks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthorData() {
      try {
        setLoading(true);
        const [authorData, searchData] = await Promise.all([
          libraryService.getAuthorDetails(authorKey),
          libraryService.search(authorKey, 'author', 'relevance', 1)
        ]);
        setAuthor(authorData);
        setWorks(searchData.docs);
      } catch (error) {
        console.error('Failed to fetch author data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAuthorData();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [authorKey]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-paper">
        <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  // Documentation suggests using OLID (authorKey) for the photo URL.
  const photoUrl = libraryService.getAuthorPhotoUrl(author?.photos?.[0] || authorKey, 'L');

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] flex flex-col bg-brand-paper overflow-y-auto custom-scrollbar"
    >
      <div className="sticky top-0 z-10 w-full px-6 py-4 bg-brand-paper/80 backdrop-blur border-b border-brand-border flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted hover:text-brand-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Archive
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent">Archival Profile</span>
      </div>

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Left Column: Info */}
          <div className="w-full md:w-1/3 text-center md:text-left">
            <div className="relative inline-block md:block mx-auto md:mx-0">
               <div className="absolute inset-0 bg-brand-accent/20 blur-2xl rounded-full scale-90" />
               <img
                src={photoUrl}
                alt={author?.name}
                referrerPolicy="no-referrer"
                className="relative w-48 h-48 md:w-full md:h-auto md:aspect-square rounded-2xl object-cover shadow-2xl border-2 border-brand-border"
              />
            </div>
            
            <div className="mt-10 space-y-8">
              <h1 className="text-5xl md:text-7xl font-display leading-[0.9]">{author?.name}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-brand-muted">
                {(author?.birth_date || author?.death_date) && (
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                    <Calendar className="h-4 w-4 text-sunset-orange" />
                    <span>{author.birth_date}{author.death_date ? ` — ${author.death_date}` : ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Works */}
          <div className="flex-1 space-y-20">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-6 border-b border-brand-border pb-4">Archival Biography</h2>
              <p className="text-xl font-serif italic leading-relaxed text-brand-ink/90 whitespace-pre-wrap mb-10">
                {author?.bio || `${author?.name} is a distinguished author in the Open Library global archive.`}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-6 border-t border-brand-border/40">
                <span className="text-[10px] uppercase tracking-wider text-brand-muted font-bold self-center">Record Formats:</span>
                {(['json', 'yml', 'rdf'] as const).map((format) => (
                  <a
                    key={format}
                    href={libraryService.getBibliographicUrl(authorKey, format)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:text-brand-ink transition-colors border-b border-brand-accent/30"
                  >
                    {format}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-brand-border">
                <h2 className="text-3xl font-display uppercase tracking-widest">Notable Works</h2>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted">{works.length} items cataloged</span>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {works.map((work) => (
                  <BookCard
                    key={work.key}
                    book={work}
                    onClick={onBookClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
