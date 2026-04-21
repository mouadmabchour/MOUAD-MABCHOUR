import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Shield, FileText, AlertCircle, Bookmark } from 'lucide-react';

export type LegalType = 'privacy' | 'policy' | 'disclaimer' | 'dmca' | 'about';

interface LegalOverlayProps {
  type: LegalType;
  onClose: () => void;
}

const LEGAL_CONTENT: Record<LegalType, { title: string; icon: any; content: React.ReactNode }> = {
  about: {
    title: 'About the Archive',
    icon: Bookmark,
    content: (
      <div className="space-y-6">
        <p>
          Global Lexicon is an experimental digital gateway envisioned as a "digital twin" to the physical collections held in the world's great libraries. Our mission is to democratize access to the shared heritage of human thought, providing a distinctive and immersive way to explore the global archive.
        </p>
        <p>
          By leveraging the Open Library API and the Internet Archive's vast records, we connect international readers to millions of volumes. Our goal is to ensure that every book, regardless of its physical location, has a vibrant and accessible digital presence.
        </p>
        <p>
          This project is part of a broader effort to preserve and celebrate our literary legacy through modern, expressive design and universal accessibility.
        </p>
      </div>
    )
  },
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    content: (
      <div className="space-y-6">
        <p>
          Your privacy is paramount. Global Lexicon is designed as a search and discovery tool that prioritizes anonymity and transparency.
        </p>
        <h3 className="text-xl font-bold font-display uppercase tracking-widest mt-8">Data Collection</h3>
        <p>
          We do not collect, store, or sell your personal information. Your search queries are processed in real-time to fetch data from the Open Library API and are not persisted on our servers.
        </p>
        <h3 className="text-xl font-bold font-display uppercase tracking-widest mt-8">Third-Party Services</h3>
        <p>
          This application interacts with the Open Library API. When you browse the archive, metadata and book imagery are served directly from Open Library and the Internet Archive. We encourage you to review their respective privacy policies for more information on how they handle archival data.
        </p>
      </div>
    )
  },
  policy: {
    title: 'Usage Policy',
    icon: FileText,
    content: (
      <div className="space-y-6">
        <p>
          Global Lexicon is provided for educational, research, and archival purposes. By using this portal, you agree to the following guidelines:
        </p>
        <ul className="list-disc pl-6 space-y-4">
          <li>The service must not be used for any commercial exploitation or unauthorized data scraping.</li>
          <li>Users must respect the copyright and licensing terms associated with the individual volumes found within the archive.</li>
          <li>Automated access to our interface is prohibited to ensure equal availability for human researchers and readers.</li>
        </ul>
        <p>
          We reserve the right to modify or discontinue features of this archival tool at any time without notice.
        </p>
      </div>
    )
  },
  disclaimer: {
    title: 'Legal Disclaimer',
    icon: AlertCircle,
    content: (
      <div className="space-y-6">
        <p className="font-serif italic text-2xl">
          "Information is provided 'as is', for the pursuit of knowledge alone."
        </p>
        <p>
          The bibliographic data, summaries, and images displayed within Global Lexicon are sourced from third-party APIs, primarily Open Library. While we strive for an immersive and accurate experience, we cannot guarantee the complete accuracy, completeness, or timeliness of the archival records.
        </p>
        <p>
          Global Lexicon is not responsible for the content of individual books or the external links provided by archival partners. Users are responsible for their own interpretation and use of the information discovered through this portal.
        </p>
      </div>
    )
  },
  dmca: {
    title: 'Copyright & DMCA',
    icon: FileText,
    content: (
      <div className="space-y-6">
        <p>
          Global Lexicon respects the intellectual property rights of authors and publishers worldwide. As a discovery interface, we do not host the physical digital files (PDFs, EPUBs) ourselves.
        </p>
        <p>
          All bibliographic records and cover images are served via the Open Library and Internet Archive infrastructures.
        </p>
        <h3 className="text-xl font-bold font-display uppercase tracking-widest mt-8">Reporting Infringement</h3>
        <p>
          If you believe your copyrighted work is being infringed upon within the archives displayed here, please direct all formal DMCA notices to the primary source of the data:
        </p>
        <div className="p-6 bg-brand-accent/5 border border-brand-accent/20 rounded-xl font-mono text-sm">
          Internet Archive <br/>
          Attn: Copyright Agent <br/>
          Email: info@archive.org
        </div>
        <p>
          Global Lexicon will promptly remove or disable access to materials upon receiving a valid notification from our data partners regarding copyright issues.
        </p>
      </div>
    )
  }
};

export function LegalOverlay({ type, onClose }: LegalOverlayProps) {
  const page = LEGAL_CONTENT[type];
  const Icon = page.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10 bg-brand-ink/95 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-full bg-brand-paper rounded-[3rem] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="shrink-0 px-8 md:px-12 py-8 flex items-center justify-between border-b border-brand-border">
          <div className="flex items-center gap-6">
             <div className="w-12 h-12 sky-gradient rounded-2xl flex items-center justify-center text-white">
                <Icon className="h-6 w-6" />
             </div>
             <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent">Archival Record</span>
                <h2 className="text-3xl md:text-5xl font-display uppercase tracking-wider leading-none mt-1">{page.title}</h2>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-full hover:bg-brand-accent/5 transition-colors group"
          >
            <X className="h-8 w-8 text-brand-muted group-hover:text-brand-ink transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-16">
          <div className="max-w-2xl mx-auto prose prose-brand">
            <div className="font-serif text-xl leading-relaxed text-brand-ink/80 italic">
               {page.content}
            </div>
            
            <div className="mt-20 pt-10 border-t border-brand-border flex items-center justify-between">
               <button 
                onClick={onClose}
                className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-muted hover:text-brand-ink transition-colors"
               >
                 <ArrowLeft className="h-4 w-4" />
                 Return to Gallery
               </button>
               <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent/50">
                 Document Ref: {type.toUpperCase()}-2026-ARCHIVE
               </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
