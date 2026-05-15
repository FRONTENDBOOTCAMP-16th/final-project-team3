import type { ReadonlyURLSearchParams } from 'next/navigation';

interface NormalizedPositiveIntParam {
  value: number;
  shouldNormalize: boolean;
  normalizedValue: string | null;
}

export function parsePositiveIntParam(
  value: string | null,
  fallback: number = 1,
): NormalizedPositiveIntParam {
  if (!value) {
    return {
      value: fallback,
      shouldNormalize: false,
      normalizedValue: fallback <= 1 ? null : String(fallback),
    };
  }

  if (!/^\d+$/.test(value)) {
    return {
      value: fallback,
      shouldNormalize: true,
      normalizedValue: fallback <= 1 ? null : String(fallback),
    };
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return {
      value: fallback,
      shouldNormalize: true,
      normalizedValue: fallback <= 1 ? null : String(fallback),
    };
  }

  const normalizedValue = parsedValue <= 1 ? null : String(parsedValue);

  return {
    value: parsedValue,
    shouldNormalize: value !== normalizedValue,
    normalizedValue,
  };
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
