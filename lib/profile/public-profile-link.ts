export function buildPublicProfilePath(username: string | null): string | null {
  if (username === null) return null;

  const normalized = username.trim();
  if (normalized === "") return null;

  return `/users/${normalized}`;
}