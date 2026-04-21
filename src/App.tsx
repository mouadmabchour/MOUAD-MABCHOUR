/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { BookCard } from './components/BookCard';
import { BookDetails } from './components/BookDetails';
import { AuthorDetails } from './components/AuthorDetails';
import { LegalOverlay, LegalType } from './components/LegalOverlay';
import { libraryService, Book, SearchType, SortType } from './services/libraryService';
import { Loader2, BookOpen, Layers, Globe, ArrowRight, Library as LibraryIcon } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [results, setResults] = useState<Book[]>([]);
  const [categories, setCategories] = useState<{ name: string; books: Book[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedAuthorKey, setSelectedAuthorKey] = useState<string | null>(null);
  const [activeLegalPage, setActiveLegalPage] = useState<LegalType | null>(null);
  const [lastQuery, setLastQuery] = useState('');

  const CATEGORY_NAMES = ['History', 'Science Fiction', 'Mystery', 'Classics', 'Art'];

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoryData = await Promise.all(
          CATEGORY_NAMES.map(async (name) => ({
            name,
            books: await libraryService.getBooksBySubject(name, 24) // Fetch more to allow for filtering
          }))
        );

        const seenKeys = new Set<string>();
        const uniqueCategories = categoryData.map(cat => {
          const uniqueBooks: Book[] = [];
          for (const book of cat.books) {
            if (!seenKeys.has(book.key) && uniqueBooks.length < 12) {
              uniqueBooks.push(book);
              seenKeys.add(book.key);
            }
          }
          return { ...cat, books: uniqueBooks };
        });

        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }
    loadCategories();
  }, []);

  const handleSearch = async (query: string, type: SearchType, sort: SortType) => {
    try {
      setLoading(true);
      setHasSearched(true);
      setLastQuery(query);
      const data = await libraryService.search(query, type, sort);
      setResults(data.docs);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHomeClick = () => {
    setHasSearched(false);
    setResults([]);
    setLastQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onHomeClick={handleHomeClick} />

      <main className="flex-1">
        {/* Hero & Search Section */}
        <section className={cn(
          "w-full transition-all duration-700 ease-in-out px-6 relative overflow-hidden flex flex-col justify-center",
          hasSearched ? "py-12 bg-brand-accent/5 backdrop-blur-md" : "h-[calc(100vh-80px)] md:h-[calc(100vh-73px)] sky-gradient text-white"
        )}>
          {!hasSearched && (
            <>
              {/* Decorative elements suggesting the image style */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-sunset-blue/40 to-transparent pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl mx-auto text-center mb-16 relative z-10"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-[11px] uppercase font-bold tracking-[0.2em] text-white mb-8 border border-white/30">
                  <Globe className="h-3.5 w-3.5" />
                  Global Literary Archive
                </div>
                <h1 className="text-7xl md:text-[10rem] font-display uppercase tracking-[-0.02em] mb-4 leading-[0.8] text-white text-layered-shadow transition-shadow">
                  Global <br />
                  Lexicon
                </h1>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="mt-16 border-t border-white/20 pt-8 max-w-sm mx-auto"
                >
                  <p className="text-sm md:text-base font-serif italic text-white/70 leading-relaxed tracking-wide">
                    "Regret is the price we pay <br /> for not taking chances."
                  </p>
                  <span className="block mt-4 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Archival Insight</span>
                </motion.div>
              </motion.div>
            </>
          )}
        </section>

        {/* Results or Landing Content */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <AnimatePresence mode="wait">
            {hasSearched ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-16 pb-6 border-b-2 border-brand-accent/20">
                  <h2 className="text-4xl">
                    Results for <span className="italic font-serif normal-case text-brand-accent">"{lastQuery}"</span>
                  </h2>
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-muted">{results.length} volumes available</span>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-40 space-y-6">
                    <Loader2 className="h-12 w-12 animate-spin text-brand-accent" />
                    <p className="text-sm font-bold uppercase tracking-widest text-brand-muted animate-pulse">Navigating the infinite archive...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-10 gap-y-16">
                    {results.map((book) => (
                      <BookCard 
                        key={book.key} 
                        book={book} 
                        onClick={setSelectedBook} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-40">
                    <p className="text-2xl text-brand-muted font-serif italic">No volumes matched your inquiry in the global archive.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-40 -mt-12"
              >
                {/* Categorized Sections */}
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.name} className="relative">
                      <div className="flex items-end justify-between mb-10 px-2 lg:px-0">
                        <div className="space-y-2">
                           <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent">Collection</span>
                           <h2 className="text-4xl md:text-6xl font-display uppercase tracking-wider">{category.name}</h2>
                        </div>
                        <button 
                          onClick={() => handleSearch(category.name, 'subject', 'relevance')}
                          className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-muted hover:text-brand-accent transition-all flex items-center gap-3 px-5 py-2.5 rounded-full border-2 border-brand-border hover:border-brand-accent group shadow-sm bg-white"
                        >
                          Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                      
                      <div className="relative -mx-6 px-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory flex gap-8 pb-10">
                        {category.books.map((book) => (
                          <div key={book.key} className="min-w-[200px] md:min-w-[280px] snap-start">
                            <BookCard 
                              book={book} 
                              onClick={setSelectedBook} 
                            />
                          </div>
                        ))}
                        {/* More Link at end of scroll */}
                        <div className="min-w-[150px] md:min-w-[200px] flex items-center justify-center p-4 snap-start">
                            <button 
                              onClick={() => handleSearch(category.name, 'subject', 'relevance')}
                              className="group flex flex-col items-center gap-4 text-brand-muted hover:text-brand-accent transition-colors"
                            >
                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-brand-border flex items-center justify-center group-hover:border-brand-accent transition-colors">
                                    <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-center">View More <br/> {category.name}</span>
                            </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Skeleton state for categories
                  CATEGORY_NAMES.map((name) => (
                    <div key={name} className="space-y-12">
                       <div className="flex items-center gap-8 px-2 lg:px-0">
                         <div className="space-y-3">
                           <div className="h-3 bg-brand-accent/5 w-24 rounded animate-pulse" />
                           <div className="h-12 bg-brand-accent/5 w-64 rounded animate-pulse" />
                         </div>
                      </div>
                      <div className="flex gap-8 overflow-hidden -mx-6 px-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="min-w-[250px] space-y-4">
                            <div className="aspect-[2/3] bg-brand-accent/5 animate-pulse rounded-xl" />
                            <div className="h-4 bg-brand-accent/5 animate-pulse w-3/4 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}

                {/* Mission Section */}
                <div className="relative group p-1">
                   <div className="absolute inset-0 sky-gradient opacity-10 blur-xl group-hover:opacity-20 transition-opacity rounded-[3rem]" />
                   <div className="bg-white border-2 border-brand-accent/20 text-brand-ink p-12 md:p-32 rounded-[3rem] relative z-10">
                      <div className="max-w-4xl">
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-accent mb-10 block">Archival Mission</span>
                        <h2 className="text-5xl md:text-8xl leading-none mb-10 text-brand-ink">
                          Universal Legacy, <br />
                          <span className="italic font-serif text-brand-accent normal-case">Preserve Every Page.</span>
                        </h2>
                        <div className="grid md:grid-cols-2 gap-16 mt-16 font-serif text-xl md:text-2xl leading-relaxed text-brand-ink/70 italic">
                          <p>
                            We envision a world where every book has a web page, connecting international readers to the shared physical legacy of our global libraries.
                          </p>
                          <p>
                            Through the Open Library initiative, we strive to create a comprehensive gateway for knowledge that remains open to all, forever.
                          </p>
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="w-full bg-brand-ink text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sky-gradient rounded-xl flex items-center justify-center text-white shadow-lg">
                  <LibraryIcon className="h-6 w-6" />
                </div>
                <span className="text-2xl font-display uppercase tracking-widest">Global Lexicon</span>
              </div>
              <p className="text-sm font-serif italic text-white/50 max-w-sm leading-relaxed">
                A digital portal dedicated to the preservation and accessibility of the world's literary treasures.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 uppercase tracking-[0.2em] text-[10px] font-bold text-white/40">
              <div className="space-y-6">
                <span className="text-white">Archive</span>
                <nav className="flex flex-col gap-4">
                  <a href="#" className="hover:text-sunset-pink transition-colors">Books</a>
                  <a href="#" className="hover:text-sunset-pink transition-colors">Authors</a>
                  <a href="#" className="hover:text-sunset-pink transition-colors">Subjects</a>
                </nav>
              </div>
              <div className="space-y-6">
                <span className="text-white">Project</span>
                <nav className="flex flex-col gap-4">
                  <button onClick={() => setActiveLegalPage('about')} className="hover:text-sunset-orange transition-colors text-left">About</button>
                  <a href="https://openlibrary.org/developers/api" target="_blank" rel="noopener noreferrer" className="hover:text-sunset-orange transition-colors">API</a>
                  <a href="https://github.com/internetarchive/openlibrary" target="_blank" rel="noopener noreferrer" className="hover:text-sunset-orange transition-colors">Source</a>
                </nav>
              </div>
              <div className="space-y-6">
                <span className="text-white">Social</span>
                <nav className="flex flex-col gap-4">
                  <a href="https://twitter.com/openlibrary" target="_blank" rel="noopener noreferrer" className="hover:text-sunset-lavender transition-colors">Twitter</a>
                  <a href="https://github.com/internetarchive" target="_blank" rel="noopener noreferrer" className="hover:text-sunset-lavender transition-colors">GitHub</a>
                  <a href="https://openlibrary.org/contact" target="_blank" rel="noopener noreferrer" className="hover:text-sunset-lavender transition-colors">Contact</a>
                </nav>
              </div>
              <div className="space-y-6">
                <span className="text-white">Legal</span>
                <nav className="flex flex-col gap-4">
                  <button onClick={() => setActiveLegalPage('privacy')} className="hover:text-brand-accent transition-colors text-left uppercase">Privacy</button>
                  <button onClick={() => setActiveLegalPage('policy')} className="hover:text-brand-accent transition-colors text-left uppercase">Policy</button>
                  <button onClick={() => setActiveLegalPage('disclaimer')} className="hover:text-brand-accent transition-colors text-left uppercase">Disclaimer</button>
                  <button onClick={() => setActiveLegalPage('dmca')} className="hover:text-brand-accent transition-colors text-left uppercase text-xs">DMCA</button>
                </nav>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                Data Provided by Open Library.
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                Internet Archive initiative.
              </p>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
              © 2026 Global Lexicon Archive. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {activeLegalPage && (
          <LegalOverlay 
            type={activeLegalPage} 
            onClose={() => setActiveLegalPage(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBook && (
          <BookDetails 
            book={selectedBook} 
            onClose={() => setSelectedBook(null)}
            onAuthorClick={(key) => setSelectedAuthorKey(key)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAuthorKey && (
          <AuthorDetails 
            authorKey={selectedAuthorKey} 
            onClose={() => setSelectedAuthorKey(null)}
            onBookClick={setSelectedBook}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Library(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  );
}
