import { getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BlogCard from '../../components/BlogCard';
import CopyLinkButton from '../../components/CopyLinkButton';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Article non trouvé' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author_name],
      images: post.cover_image ? [post.cover_image] : undefined,
      locale: 'fr_FR',
    },
  };
}

function formatDateFR(dateString: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

function estimateReadTime(content: string): number {
  return Math.max(2, Math.ceil(content.split(/\s+/).length / 200));
}

function formatContent(content: string): string {
  return content
    // Replace non-breaking spaces with regular spaces to allow normal wrapping
    .replace(/[\u00A0\u202F]/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(
      /^# (.*$)/gim,
      '<h1 class="text-3xl md:text-4xl font-black text-white mt-14 mb-5 leading-tight scroll-mt-24" id="$1">$1</h1>'
    )
    .replace(
      /^## (.*$)/gim,
      '<h2 class="text-2xl md:text-3xl font-bold text-white mt-12 mb-4 leading-tight scroll-mt-24" id="$1">$1</h2>'
    )
    .replace(
      /^### (.*$)/gim,
      '<h3 class="text-xl md:text-2xl font-semibold text-white mt-10 mb-3 scroll-mt-24" id="$1">$1</h3>'
    )
    .replace(
      /^> (.*$)/gim,
      '<blockquote class="border-l-4 border-brand-green pl-6 py-3 my-8 italic text-gray-200 bg-brand-green/5 rounded-r-2xl text-lg">&ldquo;$1&rdquo;</blockquote>'
    )
    .replace(
      /```([\s\S]*?)```/gim,
      '<pre class="bg-[#0d1117] rounded-2xl p-6 overflow-x-auto my-8 text-sm text-green-300 border border-white/10 font-mono leading-relaxed"><code>$1</code></pre>'
    )
    .replace(
      /`([^`]+)`/gim,
      '<code class="bg-brand-charcoal/80 px-2 py-0.5 rounded-md text-brand-green text-sm font-mono border border-white/10">$1</code>'
    )
    .replace(
      /^\* (.*$)/gim,
      '<li class="flex items-start gap-3 my-2 text-gray-300"><span class="text-brand-green mt-1 text-xs flex-shrink-0">▶</span><span class="leading-relaxed">$1</span></li>'
    )
    .replace(
      /^\d+\. (.*$)/gim,
      '<li class="flex items-start gap-3 my-2 text-gray-300 counter-item"><span class="text-brand-green font-bold flex-shrink-0 min-w-[1.5rem]">→</span><span class="leading-relaxed">$1</span></li>'
    )
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-200">$1</em>')
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/gim,
      '<figure class="my-10"><img src="$2" alt="$1" class="w-full rounded-2xl border border-white/10 shadow-lg object-cover" loading="lazy" /><figcaption class="text-center text-gray-500 text-sm mt-3 italic">$1</figcaption></figure>'
    )
    .replace(
      /(^|[^!])\[([^\]]+)\]\(([^)]+)\)/gim,
      '$1<a href="$3" class="text-brand-green font-medium underline underline-offset-4 hover:text-brand-accent transition-colors" target="_blank" rel="noopener">$2 ↗</a>'
    )
    .replace(
      /\n\n/gim,
      '</p><p class="my-5 text-gray-300 leading-[1.9] text-lg">'
    )
    .replace(/\n/gim, '<br />');
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug, post.tags, 3);
  const readTime = estimateReadTime(post.content);
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://bitcoinbenin.org/blog/${post.slug}`)}&via=BitcoinBenin`;

  return (
    <main className="min-h-screen bg-brand-dark">

      {/* ─── HERO ──────────────────────────────────────── */}
      <section className="relative">
        {/* Cover image */}
        {post.cover_image ? (
          <div className="relative h-[55vh] md:h-[70vh] w-full">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Multi-layer gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/30 to-transparent" />
          </div>
        ) : (
          <div className="h-48 md:h-56" />
        )}

        {/* Back button — floats above image */}
        <div className="absolute top-36 md:top-40 left-0 right-0 z-10">
          <div className="max-w-5xl mx-auto px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-black/50 backdrop-blur-md rounded-full text-sm text-gray-300 hover:text-white hover:bg-black/70 transition-all border border-white/15 font-medium"
            >
              ← Retour au blog
            </Link>
          </div>
        </div>

        {/* Article title block — overlaps the image bottom */}
        <div className={`${post.cover_image ? 'relative -mt-52 md:-mt-60' : 'relative'} max-w-5xl mx-auto px-6`}>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag, i) => (
              <Link
                key={i}
                href={`/blog?tag=${tag}`}
                className="text-xs px-3.5 py-1.5 rounded-full bg-brand-green/20 text-brand-green border border-brand-green/40 hover:bg-brand-green/30 transition-all font-semibold backdrop-blur-sm"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] drop-shadow-2xl max-w-4xl">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 py-5 border-y border-white/10">
            {/* Author */}
            <div className="flex items-center gap-3">
              {post.author_name === 'Bitcoin Bénin' || post.author_name === 'Bitcoin Benin' ? (
                <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg shadow-brand-green/10 overflow-hidden">
                  <Image src="/icon.svg" alt={post.author_name} width={44} height={44} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-green to-brand-accent flex items-center justify-center text-white font-black text-base shadow-lg shadow-brand-green/30 overflow-hidden">
                  {post.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-white font-bold text-sm">{post.author_name}</p>
                <p className="text-gray-400 text-xs">Auteur</p>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 hidden md:block" />

            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {formatDateFR(post.published_at)}
            </div>

            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {readTime} min de lecture
            </div>

            {/* Share button */}
            <div className="ml-auto">
              <a
                href={twitterShare}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 text-[#1DA1F2] rounded-full text-sm font-semibold hover:bg-[#1DA1F2]/20 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zM17.083 20.032h1.833L6.99 4.24H5.025l12.058 15.792z" /></svg>
                Partager
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTENT AREA ──────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex gap-12">

          {/* Main article column */}
          <article className="flex-1 min-w-0">
            {/* Lead / Excerpt */}
            <div className="mb-10 p-6 bg-gradient-to-r from-brand-green/10 to-transparent border-l-[3px] border-brand-green rounded-r-2xl">
              <p className="text-xl text-gray-200 leading-relaxed font-medium italic">
                {post.excerpt}
              </p>
            </div>

            {/* Article body */}
            <div
              className="text-gray-300 text-lg leading-[1.9] break-words"
              dangerouslySetInnerHTML={{ __html: `<p class="my-5 text-gray-300 leading-[1.9] text-lg">${formatContent(post.content)}</p>` }}
            />

            {/* ─── FOOTER ─── */}
            <div className="mt-16 pt-10 border-t border-white/10 space-y-8">

              {/* Tags */}
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Tags associés
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <Link
                      key={i}
                      href={`/blog?tag=${tag}`}
                      className="px-4 py-2 rounded-xl bg-brand-charcoal/60 text-gray-300 hover:text-brand-green hover:border-brand-green/50 border border-white/10 transition-all text-sm hover:bg-brand-green/10"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>



              {/* Share CTA */}
              <div className="p-6 bg-gradient-to-r from-brand-green/10 via-brand-green/5 to-transparent border border-brand-green/20 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                  <p className="text-white font-bold mb-1">Cet article vous a été utile ?</p>
                  <p className="text-gray-400 text-sm">Partagez-le avec vos proches pour promouvoir Bitcoin au Bénin 🇧🇯</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <CopyLinkButton url={`https://bitcoinbenin.org/blog/${post.slug}`} />
                  <a
                    href={twitterShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#1DA1F2] text-white rounded-xl text-sm font-bold hover:bg-[#1a8cd8] transition-all shadow-lg shadow-[#1DA1F2]/20"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zM17.083 20.032h1.833L6.99 4.24H5.025l12.058 15.792z" /></svg>
                    Partager sur X
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Sticky sidebar — desktop only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-6">


              {/* Tags sidebar */}
              {post.tags.length > 0 && (
                <div className="p-5 bg-brand-charcoal/40 border border-white/10 rounded-2xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <Link
                        key={i}
                        href={`/blog?tag=${tag}`}
                        className="text-xs px-3 py-1.5 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 hover:bg-brand-green/20 transition-colors font-medium"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share sidebar */}
              <div className="p-5 bg-brand-charcoal/40 border border-white/10 rounded-2xl">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Partager</p>
                <div className="space-y-3">
                  <CopyLinkButton url={`https://bitcoinbenin.org/blog/${post.slug}`} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-all" />
                  <a
                    href={twitterShare}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1DA1F2]/15 border border-[#1DA1F2]/30 text-[#1DA1F2] rounded-xl text-sm font-semibold hover:bg-[#1DA1F2]/25 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zM17.083 20.032h1.833L6.99 4.24H5.025l12.058 15.792z" /></svg>
                    Partager sur X
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── RELATED ARTICLES ──────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-white/5 bg-gradient-to-b from-brand-charcoal/20 to-brand-dark py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-white/10" />
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Articles <span className="text-brand-green">similaires</span>
              </h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
