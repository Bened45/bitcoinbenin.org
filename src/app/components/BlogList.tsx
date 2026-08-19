'use client';

import { useState } from 'react';
import BlogCard from './BlogCard';
import type { BlogPostPreview } from '@/app/types/blog';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface BlogListProps {
  posts: BlogPostPreview[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  // Filter posts
  const filtered = posts.filter((post) => {
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !activeTag || post.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  if (posts.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-7xl mb-6">₿</div>
        <h3 className="text-2xl font-bold text-white mb-3">Aucun article pour le moment</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Revenez bientôt pour découvrir nos nouveaux contenus sur Bitcoin au Bénin !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-brand-charcoal/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-green transition-colors text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                !activeTag
                  ? 'bg-brand-green text-white border-brand-green shadow-lg shadow-brand-green/20'
                  : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              Tous
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  activeTag === tag
                    ? 'bg-brand-green text-white border-brand-green shadow-lg shadow-brand-green/20'
                    : 'bg-transparent text-gray-400 border-white/10 hover:border-brand-green/40 hover:text-brand-green'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      {(search || activeTag) && (
        <p className="text-sm text-gray-500 -mt-6">
          {filtered.length} article{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          {activeTag && <> dans <span className="text-brand-green">#{activeTag}</span></>}
          {search && <> pour &ldquo;<span className="text-white">{search}</span>&rdquo;</>}
        </p>
      )}

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">Aucun résultat</h3>
          <p className="text-gray-400">
            Essayez avec d&apos;autres mots-clés ou supprimez le filtre actif.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              featured={index === 0 && !search && !activeTag}
            />
          ))}
        </div>
      )}
    </div>
  );
}
