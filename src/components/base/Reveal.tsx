import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  mask?: boolean;
  delay?: number;
}

/**
 * Static wrapper. Content is always visible (previous clip/opacity reveal
 * could leave images hidden when the observer never fired).
 * Kept as a component so motion can be reintroduced in a later phase.
 */
export default function Reveal({ children, className = '' }: RevealProps) {
  return <div className={className}>{children}</div>;
}