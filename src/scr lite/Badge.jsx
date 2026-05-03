// src/components/ui/Badge.jsx
import { cn } from '@/lib/utils';

// variant: 'default' | 'gold' | 'outline'
function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'tech-badge',
    gold: [
      'font-mono text-xs px-2.5 py-1 rounded-md',
      'bg-[rgba(255, 255, 255, 0.08)] text-gold',
      'border border-[rgba(255, 255, 255, 0.2)]',
    ].join(' '),
    outline: [
      'font-mono text-xs px-2.5 py-1 rounded-md',
      'bg-transparent text-text-secondary',
      'border border-[rgba(255,255,255,0.08)]',
    ].join(' '),
  };

  return (
    <span className={cn(variants[variant], className)}>
      {children}
    </span>
  );
}

export default Badge;