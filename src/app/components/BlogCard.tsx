'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaArrowRight } from 'react-icons/fa';
import type { BlogPostPreview } from '@/app/types/blog';

interface BlogCardProps {
  post: BlogPostPreview;
  featured?: boolean;
}

function formatDateFR(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

function estimateReadTime(excerpt: string): number {
  return Math.max(2, Math.ceil(excerpt.split(' ').length / 40));
}

// Featured card (large, for first article)
function FeaturedCard({ post }: { post: BlogPostPreview }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block col-span-1 md:col-span-2">
      <article className="relative h-[480px] rounded-3xl overflow-hidden border border-white/10 hover:border-brand-green/40 transition-all duration-500 hover:shadow-[0_0_60px_rgba(34,197,94,0.12)]">
        {/* Background */}
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/30 via-brand-charcoal to-brand-dark" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* Featured badge */}
        <div className="absolute top-6 left-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg shadow-brand-green/30">
            ⭐ À la une
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20">
                #{tag}
              </span>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-brand-green transition-colors duration-300">
            {post.title}
          </h2>

          <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-2 max-w-2xl">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {post.author_name === 'Bitcoin Bénin' || post.author_name === 'Bitcoin Benin' ? (
                <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm overflow-hidden bg-brand-dark border border-white/5">
                  <Image src="/icon.svg" alt={post.author_name} width={36} height={36} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green text-sm font-bold border border-brand-green/30 overflow-hidden">
                  {post.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-white text-sm font-semibold">{post.author_name}</p>
                <div className="flex items-center gap-3 text-gray-400 text-xs">
                  <span className="flex items-center gap-1"><FaCalendarAlt /> {formatDateFR(post.published_at)}</span>
                  <span className="flex items-center gap-1"><FaClock /> {estimateReadTime(post.excerpt)} min</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-brand-green font-semibold text-sm group-hover:gap-3 transition-all duration-300">
              Lire <FaArrowRight />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Standard card
export default function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) return <FeaturedCard post={post} />;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="h-full flex flex-col bg-brand-charcoal/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-brand-green/40 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(34,197,94,0.1)] hover:-translate-y-1">
        {/* Cover image */}
        <div className="relative h-52 w-full overflow-hidden bg-brand-dark flex-shrink-0">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-charcoal flex items-center justify-center">
              <span className="text-5xl font-black text-brand-green/20">₿</span>
            </div>
          )}
          {/* Tags overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-brand-green border border-brand-green/30 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-green transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>

          <p className="text-gray-400 text-sm mb-5 line-clamp-3 leading-relaxed flex-1">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2.5">
              {post.author_image ? (
                <Image src={post.author_image} alt={post.author_name} width={28} height={28} className="rounded-full object-cover" />
              ) : post.author_name === 'Bitcoin Bénin' || post.author_name === 'Bitcoin Benin' ? (
                <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm overflow-hidden bg-brand-dark border border-white/5">
                  <Image src="/icon.svg" alt={post.author_name} width={28} height={28} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green text-xs font-bold border border-brand-green/20 overflow-hidden">
                  {post.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-300">{post.author_name}</p>
                <p className="text-xs text-gray-500">{formatDateFR(post.published_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-brand-green text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Lire <FaArrowRight className="text-[10px]" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
