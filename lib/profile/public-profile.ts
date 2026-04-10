export type PublicProfileRow = {
  username: string;
  display_name: string | null;
  bio: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  ftp_w: number | null;
  avatar_url: string | null;
};

export type PublicProfileView = {
  username: string;
  displayName: string;
  bio: string | null;
  heightCm: number | null;
  weightKg: number | null;
  ftpW: number | null;
  avatarUrl: string | null;
};

export function mapProfileToPublicProfileView(profile: PublicProfileRow): PublicProfileView {
  return {
    username: profile.username,
    displayName: profile.display_name ?? profile.username,
    bio: profile.bio,
    heightCm: profile.height_cm,
    weightKg: profile.weight_kg,
    ftpW: profile.ftp_w,
    avatarUrl: profile.avatar_url,
  };
}