import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowLeft, Search, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { BlogPost } from '../types.ts';

interface BlogProps {
  posts: BlogPost[];
  onBackToHome: () => void;
  currentSlug?: string;
}

// Simple and highly effective Markdown/HTML renderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight pt-6 pb-2 border-b border-gray-100">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 pt-4 pb-1">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }
        if (trimmed.startsWith('- ')) {
          return (
            <ul key={idx} className="list-disc list-inside pl-4 space-y-2">
              <li className="text-gray-700 font-medium">
                {trimmed.replace('- ', '')}
              </li>
            </ul>
          );
        }
        if (trimmed.startsWith('1. ') || trimmed.match(/^\d+\.\s/)) {
          const text = trimmed.replace(/^\d+\.\s/, '');
          return (
            <ol key={idx} className="list-decimal list-inside pl-4 space-y-2">
              <li className="text-gray-700 font-medium">{text}</li>
            </ol>
          );
        }
        if (trimmed === '') {
          return <div key={idx} className="h-2"></div>;
        }

        // Custom anchor links parsing: e.g. [text](url) -> standard link
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        let lastIndex = 0;
        const parts: React.ReactNode[] = [];

        // Parse bold markdown: **text** -> strong
        const parseBold = (str: string) => {
          const boldRegex = /\*\*([^*]+)\*\*/g;
          let bMatch;
          let bLastIndex = 0;
          const bParts: React.ReactNode[] = [];
          while ((bMatch = boldRegex.exec(str)) !== null) {
            if (bMatch.index > bLastIndex) {
              bParts.push(str.substring(bLastIndex, bMatch.index));
            }
            bParts.push(<strong key={bMatch.index} className="font-extrabold text-gray-950">{bMatch[1]}</strong>);
            bLastIndex = boldRegex.lastIndex;
          }
          if (bLastIndex < str.length) {
            bParts.push(str.substring(bLastIndex));
          }
          return bParts.length > 0 ? bParts : str;
        };

        while ((match = linkRegex.exec(trimmed)) !== null) {
          if (match.index > lastIndex) {
            parts.push(parseBold(trimmed.substring(lastIndex, match.index)));
          }
          parts.push(
            <a 
              key={match.index} 
              href={match[2]} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary font-bold hover:underline"
            >
              {match[1]}
            </a>
          );
          lastIndex = linkRegex.lastIndex;
        }

        if (lastIndex < trimmed.length) {
          parts.push(parseBold(trimmed.substring(lastIndex)));
        }

        return (
          <p key={idx} className="leading-relaxed">
            {parts.length > 0 ? parts : parseBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
};


// Calculates edit distance between two strings (Levenshtein distance)
const getLevenshteinDistance = (a: string, b: string): number => {
  const tmp: number[][] = [];
  const alen = a.length;
  const blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;
  for (let i = 0; i <= alen; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= blen; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= alen; i++) {
    for (let j = 1; j <= blen; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[alen][blen];
};

// Checks if search query is a spelling-tolerant match for target values
const matchesFuzzySearch = (targets: string[], query: string): boolean => {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return true;

  const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 0);
  if (queryWords.length === 0) return true;

  const normalizedTargets = targets.map(t => (t || '').toLowerCase().trim());
  
  // Extract individual words from all targets to run edit-distance checklist
  const targetWords = normalizedTargets
    .flatMap(t => t.split(/[^a-z0-9_\u0900-\u097F]+/).filter(w => w.length > 1));

  return queryWords.every(qWord => {
    // 1. Direct matching or substring inclusion checks
    if (normalizedTargets.some(target => target.includes(qWord))) {
      return true;
    }

    // 2. Fuzzy match checks for spelling mistakes based on words
    if (qWord.length >= 3) {
      const maxDistanceAllowed = qWord.length <= 4 ? 1 : 2;
      for (const tWord of targetWords) {
        if (Math.abs(tWord.length - qWord.length) <= maxDistanceAllowed) {
          const dist = getLevenshteinDistance(qWord, tWord);
          if (dist <= maxDistanceAllowed) {
            return true;
          }
        }
      }
    }

    return false;
  });
};

const Blog: React.FC<BlogProps> = ({ posts, onBackToHome, currentSlug }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Find active article if slug is provided
  const activePost = currentSlug ? posts.find(p => p.slug === currentSlug) : null;

  // Dynamic header synchronization for human & robot engagement
  useEffect(() => {
    if (activePost) {
      document.title = activePost.meta_title || `${activePost.title} | Riddhaan Portfolio`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', activePost.meta_description || activePost.excerpt);
      }
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', activePost.meta_description || activePost.excerpt);
      }
      const twitterDesc = document.querySelector('meta[property="twitter:description"]');
      if (twitterDesc) {
        twitterDesc.setAttribute('content', activePost.meta_description || activePost.excerpt);
      }
    } else {
      document.title = "Riddhaan Portfolio | Premium Full Stack Developer & SEO Solutions";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', "Looking for a seasoned Full Stack Developer? Experience the Riddhaan Portfolio—crafting ultra-fast, modern, and SEO-optimized web engines designed to rank high, load instantly, and turn casual visitors into loyal clients.");
      }
    }
  }, [activePost]);

  // Categories extraction
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  // Filtering matching searches & categories
  const filteredPosts = posts.filter(post => {
    const targets = [
      post.title,
      post.excerpt,
      post.content,
      post.category,
      ...(post.tags || [])
    ];
    const matchesSearch = matchesFuzzySearch(targets, searchTerm);
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory && post.status === 'published';
  });

  const handlePostClick = (slug: string) => {
    window.location.hash = `#blog-${slug}`;
  };

  if (activePost) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        {/* Schema dynamic meta block for absolute ranking and crawling efficiency */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": activePost.title,
            "description": activePost.meta_description || activePost.excerpt,
            "image": activePost.cover_image,
            "datePublished": activePost.published_at,
            "author": {
              "@type": "Person",
              "name": "Riddhaan"
            }
          })}
        </script>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => window.location.hash = '#blog'}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary mb-8 transition group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog List
          </button>

          <article className="bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-sm p-6 sm:p-10 md:p-16">
            <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              <span className="bg-blue-50 text-primary px-3 py-1 rounded-full text-[10px]">{activePost.category}</span>
              <span className="flex items-center gap-1"><Calendar size={13} /> {activePost.published_at}</span>
              <span className="flex items-center gap-1"><Clock size={13} /> {activePost.read_time}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-8">
              {activePost.title}
            </h1>

            {activePost.cover_image && (
              <div className="rounded-2xl overflow-hidden mb-10 aspect-[16/9] bg-gray-100 border border-gray-100">
                <img 
                  src={activePost.cover_image} 
                  alt={activePost.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}

            <MarkdownRenderer content={activePost.content} />

            {activePost.tags && activePost.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {activePost.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-bold bg-gray-50 border border-gray-150 text-gray-600 px-3 py-1.5 rounded-lg select-none">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Hire section inside blog articles to convert organic search traffic */}
          <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-lg">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Hire Me</span>
              <h3 className="text-2xl sm:text-3xl font-black mt-4 mb-2 tracking-tight">Need an SEO Expert or Developer?</h3>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-6">
                Let's construct a flawless, high-performing website for your brand. Direct WhatsApp or Call assistance is available 24/7.
              </p>
              <button 
                onClick={onBackToHome}
                className="bg-white text-blue-600 font-black text-xs sm:text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-lg inline-flex items-center gap-2 group cursor-pointer"
              >
                Get Started &rarr;
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Header */}
        <div className="mb-14 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-blue-50 px-3 py-1.5 rounded-full">
              SEO Optimization Hub
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mt-4 mb-3">
              Riddhaan’s Insights
            </h1>
            <p className="text-sm sm:text-lg text-gray-500 max-w-xl font-medium">
              A collection of bespoke web performance guidelines, Google rankings articles, and local startup growth reviews.
            </p>
          </div>
          <button 
            onClick={onBackToHome}
            className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs px-6 py-3.5 rounded-xl shadow-sm transition inline-flex items-center gap-2 select-none self-center md:self-auto cursor-pointer"
          >
            &larr; Back to Portfolio
          </button>
        </div>

        {/* Dynamic Filters & Search Panel */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          {/* Search box */}
          <div className="w-full md:max-w-md flex flex-col gap-1.5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
              />
            </div>
            {searchTerm.trim().length > 0 && (
              <span className="text-[10px] text-blue-650 font-extrabold ml-1 flex items-center gap-1 uppercase tracking-widest animate-pulse">
                <span className="text-amber-500">⚡</span> Smart Spelling Tolerance Active
              </span>
            )}
          </div>

          {/* Categories select tags */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer select-none border whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white border-primary shadow-md shadow-blue-500/10' 
                    : 'bg-gray-50 text-gray-550 hover:bg-white border-gray-150'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Post List Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {filteredPosts.map((post, idx) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-150 hover:shadow-2xl transition-all group flex flex-col cursor-pointer"
                onClick={() => handlePostClick(post.slug)}
              >
                {post.cover_image && (
                  <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative border-b border-gray-100">
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-primary px-3 py-1.5 rounded-lg shadow-sm border border-white/50">
                        {post.category}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-bold mb-3 uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {post.published_at}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.read_time}</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight tracking-tight mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-med mb-6">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="text-primary font-black text-xs tracking-wider uppercase flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                    Read Article <ArrowRight size={14} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-150 p-16 text-center">
            <BookOpen className="mx-auto text-gray-300 w-16 h-16 mb-4 animate-pulse" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Articles Found</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              No published articles match your current search query or filter tags. Try a different combination.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Blog;
