import { BeltLevel } from '@/types/user';

export const BELTS: BeltLevel[] = ['White', 'Blue', 'Purple', 'Brown', 'Black'];

export const BELT_COLORS: Record<BeltLevel, string> = {
  White: '#ffffff',
  Blue: '#2e6fdb',
  Purple: '#7c4ddb',
  Brown: '#8b5a2b',
  Black: '#1a1a1a',
};

const BELT_NORMALIZE_MAP: Record<string, BeltLevel> = {
  white: 'White',
  blue: 'Blue',
  purple: 'Purple',
  brown: 'Brown',
  black: 'Black',
};

export function normalizeBeltLevel(
  beltLevel?: string | null,
): BeltLevel | null {
  if (!beltLevel) return null;

  return BELT_NORMALIZE_MAP[beltLevel.trim().toLowerCase()] ?? null;
}
