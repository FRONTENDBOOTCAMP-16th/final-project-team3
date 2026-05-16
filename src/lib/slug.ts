export function toSlug(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export function buildPostUrl(title: string, id: string): string {
  return `/community/${toSlug(title)}-${id}`;
}

export function extractPostId(slug: string): string | null {
  const match = slug.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/,
  );
  return match?.[1] ?? null;
}

export function buildCompetitionUrl(name: string, id: string): string {
  return `/competitions/${toSlug(name)}-${id}`;
}

export function extractCompetitionId(slug: string): string | null {
  const match = slug.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/,
  );
  return match?.[1] ?? null;
}
