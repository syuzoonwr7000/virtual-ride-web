const ALLOWED_AVATAR_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;

export function validateAvatarFile(
  file: File | null
): { valid: true } | { valid: false; message: string } {
  if (!file) {
    return { valid: true };
  }

  if (!ALLOWED_AVATAR_MIME_TYPES.includes(file.type as (typeof ALLOWED_AVATAR_MIME_TYPES)[number])) {
    return {
      valid: false,
      message: "アバター画像は jpg・jpeg・png・webp のみアップロードできます",
    };
  }

  if (file.size > MAX_AVATAR_FILE_SIZE) {
    return {
      valid: false,
      message: "アバター画像は5MB以下にしてください",
    };
  }

  return { valid: true };
}

export function buildAvatarStoragePath(
  userId: string,
  fileName: string,
  timestamp: number
): string {
  const extension = fileName.includes(".")
    ? fileName.split(".").pop()?.toLowerCase() || "jpg"
    : "jpg";

  return `${userId}/${timestamp}.${extension}`;
}