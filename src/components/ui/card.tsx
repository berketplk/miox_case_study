import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <article className={cn('rounded-xl border border-slate-200 bg-white p-4 shadow-sm', className)} {...props} />;
}
