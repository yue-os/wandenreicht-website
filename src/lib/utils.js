import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Join class names (typed loosely for JS files)
 * @param {...any} inputs
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 


export const isIframe = typeof window !== 'undefined' && window.self !== window.top;
