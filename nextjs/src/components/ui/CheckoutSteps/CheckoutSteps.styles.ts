'use client';

import styled, { css } from 'styled-components';

export const StepsNav = styled.nav`
  padding: 1.5rem 0;
`;

export const StepsList = styled.ol`
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const StepItem = styled.li`
  display: flex;
  align-items: center;
`;

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StepCircle = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid;
  transition: all 0.2s ease;

  ${({ $isActive }) =>
    $isActive
      ? css`
          background-color: #2563eb;
          border-color: #2563eb;
          color: white;
        `
      : css`
          background-color: white;
          border-color: #d1d5db;
          color: #9ca3af;
        `}
`;

export const StepNumber = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
`;

export const StepLabel = styled.span<{ $isActive?: boolean }>`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  color: ${({ $isActive }) => ($isActive ? '#2563eb' : '#9ca3af')};
`;

export const Connector = styled.div<{ $isCompleted?: boolean }>`
  width: 3rem;
  height: 2px;
  margin: 0 0.5rem;
  margin-top: -1.5rem;
  background-color: ${({ $isCompleted }) => ($isCompleted ? '#2563eb' : '#d1d5db')};

  @media (min-width: 640px) {
    width: 5rem;
  }

  @media (min-width: 768px) {
    width: 8rem;
  }
`;
