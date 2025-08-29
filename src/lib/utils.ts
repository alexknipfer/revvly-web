import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSupportedVehicleYears() {
  const startYear = 1990;
  const endYear = new Date().getFullYear();

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => `${startYear + i}`,
  ).reverse();
}
