'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { BankProvider } from '@/context/BankContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <BankProvider>
        {children}
      </BankProvider>
    </AuthProvider>
  );
}
