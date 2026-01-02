import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getJourneyColor(journeyId: number) {
  switch (journeyId) {
    case 1:
      return {
        primary: '#0891b2',
        light: '#cffafe',
        gradient: 'from-cyan-500 to-cyan-600',
        bg: 'bg-cyan-500',
        text: 'text-cyan-500',
        border: 'border-cyan-500',
      };
    case 2:
      return {
        primary: '#7c3aed',
        light: '#ede9fe',
        gradient: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-500',
        text: 'text-violet-500',
        border: 'border-violet-500',
      };
    case 3:
      return {
        primary: '#f59e0b',
        light: '#fef3c7',
        gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-500',
        text: 'text-amber-500',
        border: 'border-amber-500',
      };
    default:
      return {
        primary: '#0891b2',
        light: '#cffafe',
        gradient: 'from-cyan-500 to-cyan-600',
        bg: 'bg-cyan-500',
        text: 'text-cyan-500',
        border: 'border-cyan-500',
      };
  }
}

export function getMissionStatusStyles(status: string) {
  switch (status) {
    case 'locked':
      return {
        card: 'opacity-60 cursor-not-allowed',
        badge: 'bg-gray-100 text-gray-500',
        icon: 'text-gray-400',
      };
    case 'available':
      return {
        card: 'hover:scale-[1.02] hover:shadow-lg cursor-pointer ring-2 ring-cyan-400 ring-offset-2',
        badge: 'bg-cyan-100 text-cyan-700',
        icon: 'text-cyan-500',
      };
    case 'in_progress':
      return {
        card: 'hover:scale-[1.02] hover:shadow-lg cursor-pointer border-l-4 border-l-cyan-500',
        badge: 'bg-blue-100 text-blue-700',
        icon: 'text-blue-500',
      };
    case 'completed':
      return {
        card: 'hover:scale-[1.02] hover:shadow-lg cursor-pointer',
        badge: 'bg-green-100 text-green-700',
        icon: 'text-green-500',
      };
    default:
      return {
        card: '',
        badge: 'bg-gray-100 text-gray-500',
        icon: 'text-gray-400',
      };
  }
}
