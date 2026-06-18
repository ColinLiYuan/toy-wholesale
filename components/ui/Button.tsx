import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-hover shadow-sm hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-brand',
  secondary:
    'border-2 border-gray-300 text-text-primary hover:border-brand hover:text-brand focus-visible:ring-brand',
  outline:
    'border border-brand/20 text-brand hover:bg-brand-light focus-visible:ring-brand',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-surface focus-visible:ring-brand',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-4 text-lg',
};

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type ButtonAsButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLinkProps = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({ variant = 'primary', size = 'md', className, href, ...props }, ref) => {
  const classes = cn(
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 whitespace-nowrap',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (href) {
    return (
      <a
        ref={ref as any}
        href={href}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  return (
    <button
      ref={ref as any}
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});

Button.displayName = 'Button';
