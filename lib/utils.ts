import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 className 的工具函数，自动处理 Tailwind 类名冲突
 * 用法: cn('px-4 py-2', isActive && 'bg-brand', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
