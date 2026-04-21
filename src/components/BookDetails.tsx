import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Author, libraryService } from '../services/libraryService';
import { X, User, Calendar, BookOpen, Layers, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface BookDetailsProps {
  book: Book;
  onClose: () => void;
  onAuthorClick: (authorKey: string) => void;
}

export function BookDetails({ book, onClose, onAuthorClick }: BookDetailsProps) {
  const [details, setDetails] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const data = await libraryService.getBookDetails(book.key);
        setDetails(data);
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, [book.key]);

  const coverUrl = libraryService.getCoverUrl(book, 'L');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-ink/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl bg-brand-paper shadow-2xl flex flex-col md:flex-row"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-brand-paper/80 backdrop-blur border border-brand-border text-brand-ink hover:bg-brand-ink hover:text-brand-paper transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Cover Section */}
        <div className="w-full md:w-2/5 p-8 flex flex-col items-center justify-center bg-brand-border/20 border-b md:border-b-0 md:border-r border-brand-border">
          <div className="relative group">
            <img
              src={coverUrl}
              alt={book.title}
              referrerPolicy="no-referrer"
              className="max-h-[400px] w-auto shadow-xl rounded-sm border-r-4 border-r-brand-ink/10"
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
             <a 
              href={`https://openlibrary.org${book.key}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-brand-ink text-brand-paper hover:bg-brand-ink/90 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Read on Open Library
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-3/5 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-xl mx-auto md:mx-0">
            <h2 className="text-4xl md:text-6xl font-display leading-[0.9] mb-8">
              {book.title}
            </h2>
            
            <div className="mt-8 space-y-10">
              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-8 pb-10 border-b-2 border-brand-border">
                {book.author_name && (
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-brand-accent font-bold mb-3">Author(s)</span>
                    <div className="flex flex-wrap gap-4">
                      {book.author_name.map((name, i) => (
                        <button
                          key={i}
                          onClick={() => book.author_key?.[i] && onAuthorClick(book.author_key[i])}
                          className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-brand-accent transition-colors"
                        >
                          <User className="h-4 w-4 text-brand-accent" />
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {book.first_publish_year && (
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-brand-accent font-bold mb-3">First Published</span>
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                      <Calendar className="h-4 w-4 text-sunset-orange" />
                      {book.first_publish_year}
                    </div>
                  </div>
                )}
                {book.edition_count && (
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-brand-accent font-bold mb-3">Editions</span>
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                      <Layers className="h-4 w-4 text-sunset-blue" />
                      {book.edition_count} Available
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <span className="block text-[11px] uppercase tracking-[0.2em] text-brand-muted font-bold mb-6">Volume Overview</span>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
                  </div>
                ) : (
                  <p className="text-brand-ink/90 leading-relaxed font-serif text-xl italic">
                    {details?.description || "No detailed description available from Open Library for this edition."}
                  </p>
                )}
              </div>

              {/* Subjects/Tags */}
              {book.subject && book.subject.length > 0 && (
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-brand-muted font-semibold mb-3">Subjects</span>
                  <div className="flex flex-wrap gap-2">
                    {book.subject.slice(0, 12).map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-brand-border/40 text-[11px] font-medium text-brand-ink/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bibliographic Data */}
              <div className="pt-6 border-t border-brand-border">
                <span className="block text-[10px] uppercase tracking-wider text-brand-muted font-semibold mb-3">Bibliographic Data</span>
                <div className="flex flex-wrap gap-3">
                  {(['json', 'yml', 'rdf'] as const).map((format) => (
                    <a
                      key={format}
                      href={libraryService.getBibliographicUrl(book.key, format)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:text-brand-ink transition-colors border-b border-brand-accent/30"
                    >
                      Download {format}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
