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

type Success<T> = [null, T];
type Failure<E> = [E, null];
type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error as E, null];
  }
}

export function defaultTo<T, Default>(
  value: T | undefined,
  defaultValue: Default,
): T | Default {
  return value ?? defaultValue;
}
