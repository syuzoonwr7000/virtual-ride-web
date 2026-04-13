export function getAvatarFallbackText(
  displayName: string | null,
  username: string | null
): string {
  const display = displayName?.trim() ?? "";
  const user = username?.trim() ?? "";

  if (display !== "") return display[0];
  if (user !== "") return user[0];

  return "?";
}