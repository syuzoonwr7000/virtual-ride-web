import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveProfile } from "@/lib/auth/profile-actions";
import { buildPublicProfilePath } from "@/lib/profile/public-profile-link";
import { getAvatarFallbackText } from "@/lib/profile/avatar";

type ProfilePageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;
  const message = params.message ? decodeURIComponent(params.message) : null;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const publicProfilePath = buildPublicProfilePath(profile?.username ?? null);
  const avatarFallback = getAvatarFallbackText(
    profile?.display_name ?? null,
    profile?.username ?? null
  );

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">プロフィール編集</h1>

        {message ? (
          <div className="rounded border border-white/20 bg-white/5 p-4 text-sm">
            {message}
          </div>
        ) : null}

        {profileError ? (
          <div className="rounded border border-red-500/40 bg-red-500/10 p-4 text-sm">
            プロフィールの取得に失敗しました: {profileError.message}
          </div>
        ) : null}

        <section className="rounded border p-4">
          <h2 className="mb-3 text-lg font-semibold">現在のアバター</h2>

          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="現在のアバター"
              data-testid="profile-avatar-image"
              className="h-20 w-20 rounded-full border object-cover"
            />
          ) : (
            <div
              data-testid="profile-avatar-fallback"
              className="flex h-20 w-20 items-center justify-center rounded-full border text-2xl font-bold"
            >
              {avatarFallback}
            </div>
          )}
        </section>

        {publicProfilePath ? (
          <section className="rounded border p-4">
            <Link
              href={publicProfilePath}
              data-testid="public-profile-link"
              className="text-sm underline underline-offset-4 hover:opacity-80"
            >
              公開プロフィールを見る
            </Link>
          </section>
        ) : null}

        <section className="rounded border p-4">
          <form action={saveProfile} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium">
                メールアドレス
              </label>
              <input
                id="email"
                value={user.email ?? ""}
                disabled
                className="w-full rounded border bg-transparent px-3 py-2 opacity-70"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="avatar" className="block text-sm font-medium">
                アバター画像
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                data-testid="avatar-file-input"
                className="w-full rounded border bg-transparent px-3 py-2"
              />
              <p className="text-xs text-gray-400">jpg / jpeg / png / webp、5MB以下</p>
            </div>

            {profile?.avatar_url ? (
              <div className="space-y-1">
                <label
                  htmlFor="remove_avatar"
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    id="remove_avatar"
                    name="remove_avatar"
                    type="checkbox"
                    data-testid="remove-avatar-checkbox"
                    className="h-4 w-4"
                  />
                  <span>現在のアバターを削除する</span>
                </label>
                <p className="text-xs text-gray-400">
                  チェックして保存すると現在のアバター画像を削除します
                </p>
              </div>
            ) : null}

            <div className="space-y-1">
              <label htmlFor="display_name" className="block text-sm font-medium">
                表示名
              </label>
              <input
                id="display_name"
                name="display_name"
                defaultValue={profile?.display_name ?? ""}
                className="w-full rounded border bg-transparent px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium">
                ユーザー名
              </label>
              <input
                id="username"
                name="username"
                defaultValue={profile?.username ?? ""}
                className="w-full rounded border bg-transparent px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <label htmlFor="height_cm" className="block text-sm font-medium">
                  身長(cm)
                </label>
                <input
                  id="height_cm"
                  name="height_cm"
                  type="number"
                  defaultValue={profile?.height_cm ?? ""}
                  className="w-full rounded border bg-transparent px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="weight_kg" className="block text-sm font-medium">
                  体重(kg)
                </label>
                <input
                  id="weight_kg"
                  name="weight_kg"
                  type="number"
                  step="0.1"
                  defaultValue={profile?.weight_kg ?? ""}
                  className="w-full rounded border bg-transparent px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="ftp_w" className="block text-sm font-medium">
                  FTP(W)
                </label>
                <input
                  id="ftp_w"
                  name="ftp_w"
                  type="number"
                  defaultValue={profile?.ftp_w ?? ""}
                  className="w-full rounded border bg-transparent px-3 py-2"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="bio" className="block text-sm font-medium">
                自己紹介
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={5}
                defaultValue={profile?.bio ?? ""}
                className="w-full rounded border bg-transparent px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="rounded bg-white px-4 py-2 text-black hover:opacity-90"
            >
              保存する
            </button>
          </form>
        </section>

        <section className="rounded border p-4">
          <h2 className="mb-2 text-lg font-semibold">現在のプロフィール値</h2>
          <pre className="overflow-x-auto text-sm">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}