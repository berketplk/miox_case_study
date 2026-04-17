import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'danger';
};

export function Button({ className, variant = 'default', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'default' && 'border-slate-900 bg-slate-900 text-white',
        variant === 'outline' && 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
        variant === 'danger' && 'border-rose-300 bg-white text-rose-700 hover:bg-rose-50',
        className,
      )}
      {...props}
    />
  );
}
