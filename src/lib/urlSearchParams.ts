import type { ReadonlyURLSearchParams } from 'next/navigation';

export function parsePositiveIntParam(
  value: string | null,
  fallback: number = 1,
) {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
}

export function parseEnumParam<TValue extends string>(
  value: string | null,
  validValues: readonly TValue[],
  fallback: TValue,
) {
  if (!value) {
    return fallback;
  }

  return validValues.includes(value as TValue) ? (value as TValue) : fallback;
}

export function updateSearchParams(
  currentSearchParams: ReadonlyURLSearchParams,
  updates: Record<string, string | null | undefined>,
) {
  const nextSearchParams = new URLSearchParams(currentSearchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (!value) {
      nextSearchParams.delete(key);
      return;
    }

    nextSearchParams.set(key, value);
  });

  return nextSearchParams;
}
