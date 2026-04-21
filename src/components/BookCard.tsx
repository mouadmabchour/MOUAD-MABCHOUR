import { motion } from 'motion/react';
import { Book, libraryService } from '../services/libraryService';
import { cn } from '../lib/utils';
import { User, Calendar } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
  key?: string | number;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const coverUrl = libraryService.getCoverUrl(book, 'M');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onClick(book)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border-2 border-brand-border bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-brand-accent/20 group-hover:border-brand-accent">
        <img
          src={coverUrl}
          alt={book.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      
      <div className="mt-4 space-y-2">
        <h3 className="line-clamp-2 text-xl font-display uppercase tracking-wider leading-[1.1] transition-colors group-hover:text-brand-accent">
          {book.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
          {book.author_name && book.author_name.length > 0 && (
            <span className="flex items-center gap-1.5">
              <User className="h-3 w-3 text-brand-accent" />
              <span className="line-clamp-1">{book.author_name[0]}</span>
            </span>
          )}
          {book.first_publish_year && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-sunset-orange" />
              <span>{book.first_publish_year}</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
