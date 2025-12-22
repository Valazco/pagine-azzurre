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
  return (
    <MessageBoxWrapper $centered={centered}>
      <StyledMessageBox
        $variant={variant}
        $centered={centered}
        $fullWidth={fullWidth}
        {...props}
      >
        {children}
      </StyledMessageBox>
    </MessageBoxWrapper>
  );
}

export default MessageBox;
