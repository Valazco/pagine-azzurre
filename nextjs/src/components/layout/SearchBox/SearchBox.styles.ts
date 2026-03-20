'use client';

import styled from 'styled-components';
import { theme } from '@/lib/styles';

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.625rem ${theme.spacing.md};
  padding-right: 2.5rem;
  background-color: ${theme.colors.backgroundSecondary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm};
  text-align: center;
  transition: all ${theme.transitions.normal};

  &::placeholder {
    color: #9ca3af;
    text-align: center;
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    background-color: white;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

export const SearchButton = styled.button`
  position: absolute;
  right: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color ${theme.transitions.normal};

  &:hover {
    color: ${theme.colors.primary};
  }
`;
