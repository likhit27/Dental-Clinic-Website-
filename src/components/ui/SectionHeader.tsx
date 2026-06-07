import clsx from 'clsx';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeader({ title, subtitle, centered = true, light = false }: SectionHeaderProps) {
  return (
    <div className={clsx('section-header', centered && 'text-center')}>
      <h2 className={clsx('section-title', light && 'text-white')}>{title}</h2>
      {subtitle ? <p className={clsx('section-subtitle', light && 'text-light')}>{subtitle}</p> : null}
    </div>
  );
}
