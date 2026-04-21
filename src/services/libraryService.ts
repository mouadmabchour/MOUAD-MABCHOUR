export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  cover_i?: number;
  cover_edition_key?: string;
  isbn?: string[];
  first_publish_year?: number;
  subject?: string[];
  edition_count?: number;
  description?: string;
}

export interface Author {
  key: string;
  name: string;
  bio?: string;
  photos?: number[];
  birth_date?: string;
  death_date?: string;
}

export interface SearchResponse {
  numFound: number;
  docs: Book[];
}

export type SearchType = 'all' | 'title' | 'author' | 'subject';
export type SortType = 'relevance' | 'new' | 'old' | 'random' | 'rating';

const API_BASE = 'https://openlibrary.org';

export const libraryService = {
  async search(query: string, type: SearchType = 'all', sort: SortType = 'relevance', page = 1): Promise<SearchResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
      fields: 'key,title,author_name,author_key,cover_i,cover_edition_key,isbn,first_publish_year,subject,edition_count',
    });

    if (sort !== 'relevance') params.append('sort', sort);

    if (type === 'title') params.append('title', query);
    else if (type === 'author') params.append('author', query);
    else if (type === 'subject') params.append('subject', query);
    else params.append('q', query);

    const response = await fetch(`${API_BASE}/search.json?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch search results');
    const data = await response.json();
    
    // Support both numFound and num_found
    return {
      numFound: data.numFound ?? data.num_found ?? 0,
      docs: data.docs || [],
    };
  },

  async getBookDetails(workKey: string): Promise<Book> {
    const key = workKey.startsWith('/') ? workKey : `/works/${workKey}`;
    const response = await fetch(`${API_BASE}${key}.json`);
    if (!response.ok) throw new Error('Failed to fetch book details');
    const data = await response.json();
    
    // Normalize description
    const description = typeof data.description === 'string' 
      ? data.description 
      : data.description?.value || '';

    return {
      ...data,
      description,
    };
  },

  getBibliographicUrl(key: string, format: 'json' | 'yml' | 'rdf' = 'json'): string {
    let cleanKey = key;
    if (!key.startsWith('/')) {
      // If it starts with OL then a number and ends with W, it's likely a work OLID
      if (/^OL\d+W$/.test(key)) cleanKey = `/works/${key}`;
      // If it ends with A, it's likely an author OLID
      else if (/^OL\d+A$/.test(key)) cleanKey = `/authors/${key}`;
      // Fallback to works if ambiguous
      else cleanKey = `/works/${key}`;
    }
    return `${API_BASE}${cleanKey}.${format}`;
  },

  getAuthorDetails: async (authorKey: string): Promise<Author> => {
    const key = authorKey.startsWith('/') ? authorKey : `/authors/${authorKey}`;
    const response = await fetch(`${API_BASE}${key}.json`);
    if (!response.ok) throw new Error('Failed to fetch author details');
    const data = await response.json();

    // Normalize bio
    const bio = typeof data.bio === 'string' 
      ? data.bio 
      : data.bio?.value || '';

    return {
      ...data,
      bio,
    };
  },

  async getTrending(): Promise<Book[]> {
    // There isn't a direct "trending" API that's simple, so we'll fetch popular subjects or a default query
    const params = new URLSearchParams({
      q: 'first_publish_year:[2023 TO 2024]',
      sort: 'rating',
      limit: '10',
      fields: 'key,title,author_name,author_key,cover_i,cover_edition_key,isbn,first_publish_year,subject,edition_count',
    });
    const response = await fetch(`${API_BASE}/search.json?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch trending books');
    const data = await response.json();
    return data.docs;
  },

  async getBooksBySubject(subject: string, limit = 10): Promise<Book[]> {
    const params = new URLSearchParams({
      subject: subject.toLowerCase(),
      limit: limit.toString(),
      fields: 'key,title,author_name,author_key,cover_i,cover_edition_key,isbn,first_publish_year,subject,edition_count',
      sort: 'rating',
    });
    const response = await fetch(`${API_BASE}/search.json?${params.toString()}`);
    if (!response.ok) throw new Error(`Failed to fetch books for subject: ${subject}`);
    const data = await response.json();
    return data.docs;
  },

  getCoverUrl(book: Partial<Book>, size: 'S' | 'M' | 'L' = 'M'): string {
    const placeholder = 'https://images.placeholders.dev/?width=200&height=300&text=No+Cover&bgColor=%23e5e7eb&textColor=%239ca3af';
    
    // Priority 1: Internal Cover ID
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
    }
    
    // Priority 2: OLID (Open Library ID)
    if (book.cover_edition_key) {
      return `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-${size}.jpg`;
    }
    
    // Priority 3: ISBN (usually an array, use the first one)
    if (book.isbn && book.isbn.length > 0) {
      return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-${size}.jpg`;
    }
    
    return placeholder;
  },

  getAuthorPhotoUrl(idOrOlid?: string | number, size: 'S' | 'M' | 'L' = 'M'): string {
    if (!idOrOlid) return 'https://images.placeholders.dev/?width=200&height=200&text=No+Photo&bgColor=%23e5e7eb&textColor=%239ca3af';
    
    // If it's a string starting with OL, it's an OLID
    if (typeof idOrOlid === 'string' && idOrOlid.startsWith('OL')) {
      return `https://covers.openlibrary.org/a/olid/${idOrOlid}-${size}.jpg`;
    }
    
    return `https://covers.openlibrary.org/a/id/${idOrOlid}-${size}.jpg`;
  }
};
