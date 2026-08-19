'use client';
import { useState, useEffect } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

export default function CopyLinkButton({ url, className }: { url: string, className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={className || "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5"}
    >
      {copied ? <FaCheck className="text-brand-green" /> : <FaCopy />}
      {copied ? 'Lien copié !' : 'Copier le lien'}
    </button>
  );
}
