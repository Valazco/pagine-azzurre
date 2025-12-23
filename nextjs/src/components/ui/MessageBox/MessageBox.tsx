'use client';

import { ReactNode, HTMLAttributes } from 'react';
import {
  StyledMessageBox,
  MessageBoxWrapper,
  MessageVariant,
} from './MessageBox.styles';

export interface MessageBoxProps extends HTMLAttributes<HTMLDivElement> {
  variant?: MessageVariant;
  children: ReactNode;
  centered?: boolean;
  fullWidth?: boolean;
}

export function MessageBox({
  variant = 'info',
  children,
  centered = true,
  fullWidth = false,
  ...props
}: MessageBoxProps) {
  // Use role="alert" for danger/warning to announce to screen readers immediately
  const isAlertRole = variant === 'danger' || variant === 'warning';

  return (
    <MessageBoxWrapper $centered={centered}>
      <StyledMessageBox
        $variant={variant}
        $centered={centered}
        $fullWidth={fullWidth}
        role={isAlertRole ? 'alert' : 'status'}
        aria-live={isAlertRole ? 'assertive' : 'polite'}
        {...props}
      >
        {children}
      </StyledMessageBox>
    </MessageBoxWrapper>
  );
}

export default MessageBox;
