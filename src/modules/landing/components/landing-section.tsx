import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

import { LandingContainer } from './landing-container';

interface Props {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

export function LandingSection({
  id,
  className,
  containerClassName,
  children,
}: Props) {
  return (
    <section id={id} className={cn('py-10 px-6 relative', className)}>
      <LandingContainer className={containerClassName}>
        {children}
      </LandingContainer>
    </section>
  );
}
