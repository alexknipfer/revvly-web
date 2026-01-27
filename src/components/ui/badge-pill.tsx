import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

export function BadgePill({ className, children }: Props) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 border',
        className,
      )}
    >
      {children}
    </div>
  );
}
