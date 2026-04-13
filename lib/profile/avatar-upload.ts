const ALLOWED_AVATAR_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;
const AVATAR_BUCKET_NAME = "avatars";

export function validateAvatarFile(
  file: File | null
): { valid: true } | { valid: false; message: string } {
  if (!file) {
    return { valid: true };
  }

  if (
    !ALLOWED_AVATAR_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_AVATAR_MIME_TYPES)[number]
    )
  ) {
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

  return `${AVATAR_BUCKET_NAME}/${userId}-${timestamp}.${extension}`;
}

export function extractAvatarStoragePathFromUrl(
  avatarUrl: string | null | undefined
): string | null {
  if (!avatarUrl) {
    return null;
  }

  try {
    const url = new URL(avatarUrl);
    const marker = `/storage/v1/object/public/${AVATAR_BUCKET_NAME}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    const encodedPath = url.pathname.slice(markerIndex + marker.length);
    if (!encodedPath) {
      return null;
    }

    const decodedPath = decodeURIComponent(encodedPath);

    return decodedPath || null;
  } catch {
    return null;
  }
}

export function getOldAvatarStoragePathForDelete(options: {
  currentAvatarUrl: string | null;
  nextAvatarUrl: string | null;
}): string | null {
  const { currentAvatarUrl, nextAvatarUrl } = options;

  if (!currentAvatarUrl) {
    return null;
  }

  if (currentAvatarUrl === nextAvatarUrl) {
    return null;
  }

  return extractAvatarStoragePathFromUrl(currentAvatarUrl);
}