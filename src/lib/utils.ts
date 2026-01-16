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

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

/**
 * Type guard that filters an array to only include items where a specific property is defined.
 * This properly narrows the type so the property is no longer optional in the filtered result.
 *
 * @example
 * const entries = [{ mpg: 10 }, { mpg: undefined }];
 * const withMpg = entries.filter(hasDefined('mpg')); // mpg is now number, not number | undefined
 */
export function hasDefined<K extends string | number | symbol>(
  key: K,
): <T extends { [P in K]?: unknown }>(
  item: T,
) => item is T & { [P in K]: NonNullable<T[P]> } {
  return <T extends { [P in K]?: unknown }>(
    item: T,
  ): item is T & { [P in K]: NonNullable<T[P]> } => {
    return isDefined(item[key]);
  };
}
