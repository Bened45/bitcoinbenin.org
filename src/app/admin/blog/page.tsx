'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { createBlogPost, updateBlogPost, deleteBlogPost } from '../blog-actions';
import Button from '@/app/components/ui/Button';
import {
  FaBook, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash,
  FaTimes, FaSave, FaTag, FaBold, FaItalic, FaHeading,
  FaListUl, FaQuoteRight, FaCode, FaLink, FaExternalLinkAlt,
  FaCheckCircle, FaClock, FaArchive, FaSpinner
} from 'react-icons/fa';
import type { BlogPost } from '@/app/types/blog';

function formatDateFR(dateString: string) {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateString));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function formatPreview(content: string): string {
  return content
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-6 mb-3">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-5 mb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-brand-green pl-4 italic text-gray-300 my-4">$1</blockquote>')
    .replace(/^\* (.*$)/gim, '<li class="text-gray-300 ml-4 list-disc">$1</li>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-200">$1</em>')
    .replace(/`([^`]+)`/gim, '<code class="bg-brand-charcoal px-1.5 py-0.5 rounded text-brand-green text-sm">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-brand-green underline">$1</a>')
    .replace(/\n\n/gim, '</p><p class="my-3 text-gray-300">')
    .replace(/\n/gim, '<br/>');
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author_name: '',
  cover_image: '',
  tags: '',
  status: 'draft' as 'draft' | 'published' | 'archived',
};

  // Upload a local cover image to Supabase storage and set its public URL
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Generate a unique filename to avoid collisions
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;
    const { data, error } = await supabase.storage.from('blog_covers').upload(fileName, file);
    if (error) {
      console.error('Cover image upload error:', error);
      return;
    }
    // Retrieve public URL of the uploaded file
    const { publicURL } = supabase.storage.from('blog_covers').getPublicUrl(data.path);
    setFormData(prev => ({ ...prev, cover_image: publicURL }));
  };



export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (!supabase) { setLoading(false); router.replace('/login'); return; }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); router.replace('/login'); return; }
      fetchPosts();
    };
    init();
  }, [router]);

  const fetchPosts = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author_name: post.author_name,
      cover_image: post.cover_image || '',
      tags: post.tags?.join(', ') || '',
      status: post.status,
    });
    setShowEditor(true);
    setShowPreview(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    setEditingPost(null);
    setFormData(EMPTY_FORM);
    setShowEditor(true);
    setShowPreview(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setShowEditor(false);
    setShowPreview(false);
    setEditingPost(null);
    setFormData(EMPTY_FORM);
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingPost ? prev.slug : slugify(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug || slugify(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        author_name: formData.author_name,
        cover_image: formData.cover_image || undefined,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        status: formData.status,
      };
      if (editingPost) {
        await updateBlogPost(editingPost.id, payload);
      } else {
        await createBlogPost(payload);
      }
      await fetchPosts();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement cet article ?')) return;
    await deleteBlogPost(id);
    setPosts(posts.filter(p => p.id !== id));
  };

  const insertMarkdown = useCallback((before: string, after = '') => {
    const textarea = document.getElementById('md-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end, value } = textarea;
    const selected = value.substring(start, end);
    const newText = value.substring(0, start) + before + selected + after + value.substring(end);
    setFormData(prev => ({ ...prev, content: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }, []);

  const filtered = posts.filter(p => filterStatus === 'all' || p.status === filterStatus);

  const statusCount = {
    all: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    archived: posts.filter(p => p.status === 'archived').length,
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-white">Chargement...</div></div>;
  }

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-2">
              Gestion du{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent">
                Blog
              </span>
            </h1>
            <p className="text-gray-400">Rédigez et publiez vos articles sur Bitcoin.</p>
          </div>
          {!showEditor && (
            <Button variant="primary" onClick={handleNew} className="flex items-center gap-2 shrink-0">
              <FaPlus /> Nouvel article
            </Button>
          )}
        </div>

        {/* Editor */}
        {showEditor && (
          <div className="bg-brand-charcoal/50 border border-white/10 rounded-2xl overflow-hidden mb-10">
            {/* Editor header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-brand-dark/40">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FaEdit className="text-brand-green" />
                {editingPost ? 'Modifier l\'article' : 'Nouvel article'}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    showPreview
                      ? 'bg-brand-green/20 text-brand-green border border-brand-green/30'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {showPreview ? <FaEyeSlash /> : <FaEye />}
                  {showPreview ? 'Éditeur' : 'Aperçu'}
                </button>
                <button onClick={resetForm} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <FaTimes />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <input
                  type="text"
                  placeholder="Titre de l'article..."
                  value={formData.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  required
                  className="w-full bg-transparent text-3xl font-black text-white placeholder-gray-600 focus:outline-none border-b border-white/10 pb-3 focus:border-brand-green transition-colors"
                />
              </div>

              {/* Slug + Author row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Slug URL</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="mon-article-bitcoin"
                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Auteur</label>
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={e => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Nom de l'auteur"
                    required
                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Résumé / Extrait</label>
                <textarea
                  value={formData.excerpt}
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Bref résumé qui apparaîtra dans les cartes articles..."
                  rows={2}
                  required
                  className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors resize-none"
                />
              </div>

                {/* Cover image upload */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">URL Image de couverture (optionnel)</label>
                      <input
                        type="url"
                        value={formData.cover_image}
                        onChange={e => setFormData({ ...formData, cover_image: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Uploader une image locale</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-green/20 file:text-brand-green hover:file:bg-brand-green/30"
                      />
                    </div>
                  </div>
                  {formData.cover_image && (
                    <div className="mt-4 p-2 bg-brand-dark/50 border border-white/10 rounded-xl inline-block">
                      <p className="text-xs font-semibold text-gray-400 mb-2">Aperçu :</p>
                      <img src={formData.cover_image} alt="Cover preview" className="h-32 w-auto object-cover rounded-lg border border-white/10" />
                    </div>
                  )}
                </div>

              {/* Markdown editor or Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {showPreview ? 'Aperçu' : 'Contenu (Markdown)'}
                  </label>
                  {/* Toolbar — only in editor mode */}
                  {!showPreview && (
                    <div className="flex items-center gap-1">
                      {[
                        { icon: FaBold, action: () => insertMarkdown('**', '**'), title: 'Gras' },
                        { icon: FaItalic, action: () => insertMarkdown('*', '*'), title: 'Italique' },
                        { icon: FaHeading, action: () => insertMarkdown('\n## '), title: 'Titre' },
                        { icon: FaListUl, action: () => insertMarkdown('\n* '), title: 'Liste' },
                        { icon: FaQuoteRight, action: () => insertMarkdown('\n> '), title: 'Citation' },
                        { icon: FaCode, action: () => insertMarkdown('`', '`'), title: 'Code' },
                        { icon: FaLink, action: () => insertMarkdown('[', '](url)'), title: 'Lien' },
                      ].map(({ icon: Icon, action, title }) => (
                        <button
                          key={title}
                          type="button"
                          onClick={action}
                          title={title}
                          className="p-2 text-gray-400 hover:text-brand-green hover:bg-brand-green/10 rounded transition-all text-xs"
                        >
                          <Icon />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {showPreview ? (
                  <div
                    className="min-h-64 p-6 bg-brand-dark/60 border border-white/10 rounded-xl text-gray-300 leading-relaxed overflow-auto"
                    dangerouslySetInnerHTML={{ __html: formatPreview(formData.content) || '<p class="text-gray-600 italic">Aucun contenu à afficher...</p>' }}
                  />
                ) : (
                  <textarea
                    id="md-editor"
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    placeholder={'# Titre de l\'article\n\nCommencez à écrire votre article ici...\n\n## Section\n\nVotre contenu...'}
                    rows={20}
                    required
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-brand-green transition-colors resize-y font-mono leading-relaxed"
                  />
                )}
              </div>

              {/* Tags + Status row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <FaTag className="text-xs" /> Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="bitcoin, éducation, débutant"
                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Statut</label>
                  <div className="flex gap-2">
                    {(['draft', 'published', 'archived'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: s })}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                          formData.status === s
                            ? s === 'published' ? 'bg-brand-green text-white border-brand-green'
                              : s === 'draft' ? 'bg-gray-600 text-white border-gray-600'
                              : 'bg-orange-600 text-white border-orange-600'
                            : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {s === 'published' ? '✅ Publié' : s === 'draft' ? '📝 Brouillon' : '📦 Archivé'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <Button type="submit" variant="primary" disabled={saving} className="flex items-center gap-2">
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {saving ? 'Enregistrement...' : editingPost ? 'Mettre à jour' : 'Créer l\'article'}
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Annuler
                </Button>
                {editingPost && (
                  <a
                    href={`/blog/${editingPost.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-2 text-sm text-gray-400 hover:text-brand-green transition-colors"
                  >
                    <FaExternalLinkAlt className="text-xs" /> Voir l&apos;article
                  </a>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Articles list */}
        <div className="bg-brand-charcoal/50 border border-white/5 rounded-2xl overflow-hidden">
          {/* List header with filters */}
          <div className="px-6 py-5 border-b border-white/10 flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <FaBook className="text-brand-green" /> Articles
            </h2>
            {/* Status tabs */}
            <div className="flex gap-2 ml-auto">
              {(['all', 'published', 'draft', 'archived'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    filterStatus === s
                      ? 'bg-brand-green/20 text-brand-green border-brand-green/40'
                      : 'text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {s === 'all' ? `Tous (${statusCount.all})`
                    : s === 'published' ? `✅ Publiés (${statusCount.published})`
                    : s === 'draft' ? `📝 Brouillons (${statusCount.draft})`
                    : `📦 Archivés (${statusCount.archived})`}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-white/5 overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="p-16 text-center">
                <FaBook className="text-5xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Aucun article dans cette catégorie.</p>
              </div>
            ) : (
              filtered.map(post => (
                <div key={post.id} className="p-5 hover:bg-white/3 transition-colors group">
                  <div className="flex items-start gap-4">
                    {/* Status icon */}
                    <div className="mt-1 flex-shrink-0">
                      {post.status === 'published'
                        ? <FaCheckCircle className="text-brand-green" />
                        : post.status === 'draft'
                        ? <FaClock className="text-gray-400" />
                        : <FaArchive className="text-orange-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-white truncate group-hover:text-brand-green transition-colors">
                          {post.title}
                        </h3>
                        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold ${
                          post.status === 'published' ? 'bg-brand-green/15 text-brand-green'
                          : post.status === 'draft' ? 'bg-gray-600/20 text-gray-400'
                          : 'bg-orange-600/15 text-orange-400'
                        }`}>
                          {post.status === 'published' ? 'Publié' : post.status === 'draft' ? 'Brouillon' : 'Archivé'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-1 mb-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Par <span className="text-gray-400">{post.author_name}</span></span>
                        <span>{formatDateFR(post.published_at || post.created_at)}</span>
                        {post.tags?.length > 0 && (
                          <span className="flex gap-1">
                            {post.tags.slice(0, 3).map((t, i) => (
                              <span key={i} className="text-brand-green/60">#{t}</span>
                            ))}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {post.status === 'published' && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-brand-green transition-colors"
                          title="Voir"
                        >
                          <FaExternalLinkAlt size={13} />
                        </a>
                      )}
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Modifier"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
