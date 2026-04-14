type DecideAvatarUrlForSaveArgs = {
  currentAvatarUrl: string | null;
  uploadedAvatarUrl: string | null;
  removeAvatar?: boolean;
};

export function decideAvatarUrlForSave({
  currentAvatarUrl,
  uploadedAvatarUrl,
  removeAvatar = false,
}: DecideAvatarUrlForSaveArgs): string | null {
  if (removeAvatar) {
    return null;
  }

  if (uploadedAvatarUrl) {
    return uploadedAvatarUrl;
  }

  return currentAvatarUrl;
}