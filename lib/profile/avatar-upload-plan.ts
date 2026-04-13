type DecideAvatarUrlForSaveArgs = {
  currentAvatarUrl: string | null;
  uploadedAvatarUrl: string | null;
};

export function decideAvatarUrlForSave({
  currentAvatarUrl,
  uploadedAvatarUrl,
}: DecideAvatarUrlForSaveArgs): string | null {
  if (uploadedAvatarUrl) {
    return uploadedAvatarUrl;
  }

  return currentAvatarUrl;
}