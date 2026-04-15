import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapProfileToPublicProfileView } from "@/lib/profile/public-profile";
import { getAvatarFallbackText } from "@/lib/profile/avatar";

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

function formatOptionalValue(value: string | number | null, suffix = "") {
  if (value === null || value === "") return "未設定";
  return `${value}${suffix}`;
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("username, display_name, bio, height_cm, weight_kg, ftp_w, avatar_url")
    .eq("username", username)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const profile = mapProfileToPublicProfileView(data);
  const avatarFallback = getAvatarFallbackText(profile.displayName, profile.username);

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm text-gray-400">Public Profile</p>
          <h1 className="text-2xl font-bold">公開プロフィール</h1>
        </header>

        <section className="rounded-lg border p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={`${profile.displayName}のアバター`}
                data-testid="public-avatar-image"
                className="h-24 w-24 rounded-full border object-cover"
              />
            ) : (
              <div
                data-testid="public-avatar-fallback"
                className="flex h-24 w-24 items-center justify-center rounded-full border text-3xl font-bold"
              >
                {avatarFallback}
              </div>
            )}

            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm text-gray-400">表示名</p>
                <p className="text-xl font-semibold">{profile.displayName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">ユーザー名</p>
                <p className="text-base font-medium">@{profile.username}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">基本情報</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">身長</p>
              <p className="mt-1 text-lg font-medium">
                {formatOptionalValue(profile.heightCm, "cm")}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">体重</p>
              <p className="mt-1 text-lg font-medium">
                {formatOptionalValue(profile.weightKg, "kg")}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">FTP</p>
              <p className="mt-1 text-lg font-medium">
                {formatOptionalValue(profile.ftpW, "W")}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">自己紹介</h2>
          <p className="whitespace-pre-wrap leading-7 text-sm sm:text-base">
            {profile.bio?.trim() ? profile.bio : "未設定"}
          </p>
        </section>
      </div>
    </main>
  );
}