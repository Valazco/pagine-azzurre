'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LoadingBox } from '@/components/ui/LoadingBox';
import { MessageBox } from '@/components/ui/MessageBox';
import {
  Overlay,
  SidebarContainer,
  SidebarHeader,
  SidebarTitle,
  CloseButton,
  SidebarNav,
  CategoryList,
  CategoryItem,
  CategoryLink,
} from './Sidebar.styles';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
      <Overlay $isOpen={isOpen} onClick={onClose} aria-hidden="true" />

      {/* Sidebar */}
      <SidebarContainer
        $isOpen={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu categorie"
      >
        {/* Header */}
        <SidebarHeader>
          <SidebarTitle>Categorie</SidebarTitle>
          <CloseButton onClick={onClose} aria-label="Chiudi menu">
            <X size={20} />
          </CloseButton>
        </SidebarHeader>

        {/* Categories List */}
        <SidebarNav>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <CategoryList>
              {categories.map((category) => (
                <CategoryItem key={category}>
                  <CategoryLink
                    href={`/search/category/${encodeURIComponent(category)}`}
                    onClick={onClose}
                  >
                    {formatCategory(category)}
                  </CategoryLink>
                </CategoryItem>
              ))}
            </CategoryList>
          )}
        </SidebarNav>
      </SidebarContainer>
    </>
  );
}

export default Sidebar;
