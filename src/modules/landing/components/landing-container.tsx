import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

export function LandingContainer({ className, children }: Props) {
  return (
    <div className={cn('relative mx-auto w-full max-w-7xl', className)}>
      {children}
    </div>
  );
}
