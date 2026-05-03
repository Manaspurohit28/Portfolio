// src/lib/utils.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merges Tailwind classes safely — prevents conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}