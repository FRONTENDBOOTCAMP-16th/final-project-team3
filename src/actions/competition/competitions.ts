'use server';
import { revalidateTag } from 'next/cache';

export async function revalidateCompetitions() {
  revalidateTag('competitions', 'max');
}

export async function revalidateCompetition(id: string) {
  revalidateTag(`competition-${id}`, 'max');
}
