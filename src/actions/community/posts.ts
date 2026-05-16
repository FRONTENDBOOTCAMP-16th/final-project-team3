'use server';
import { revalidateTag } from 'next/cache';

export async function revalidatePost(id: string) {
  revalidateTag(`post-${id}`, 'max');
}
