'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import LoadingBox from '@/components/ui/LoadingBox';
import MessageBox from '@/components/ui/MessageBox';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products/categories');
        if (!res.ok) throw new Error('Errore nel caricamento delle categorie');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Menu categorie"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Categorie</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Chiudi menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Categories List */}
        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/search/category/${encodeURIComponent(category)}`}
                    onClick={onClose}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    {formatCategory(category)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </aside>
    </>
  );
}
