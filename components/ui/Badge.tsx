import { cn } from '@/lib/utils';

type BadgeVariant = 'brand' | 'green' | 'gray';

const variantStyles: Record<BadgeVariant, string> = {
  brand: 'bg-brand-light text-brand',
  green: 'bg-green-50 text-green-700',
  gray: 'bg-gray-100 text-text-secondary',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'brand', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded text-xs font-semibold',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
