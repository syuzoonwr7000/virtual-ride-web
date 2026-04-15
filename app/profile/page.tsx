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

function getMessageVariant(message: string | null) {
  if (!message) {
    return null;
  }

  if (
    message.includes("失敗") ||
    message.includes("できません") ||
    message.includes("エラー")
  ) {
    return "error";
  }

  if (message.includes("保存しました")) {
    return "success";
  }

  return "info";
}

function formatOptionalValue(value: string | number | null, suffix = "") {
  if (value === null || value === "") return "未設定";
  return `${value}${suffix}`;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;
  const message = params.message ? decodeURIComponent(params.message) : null;
  const messageVariant = getMessageVariant(message);

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
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm text-gray-400">Profile Settings</p>
          <h1 className="text-2xl font-bold">プロフィール編集</h1>
          <p className="text-sm text-gray-400">
            公開プロフィールに表示する内容や、ライダー情報を編集できます。
          </p>
        </header>

        {message ? (
          <div
            className={[
              "rounded-lg border p-4 text-sm",
              messageVariant === "success"
                ? "border-green-500/40 bg-green-500/10 text-green-100"
                : messageVariant === "error"
                  ? "border-red-500/40 bg-red-500/10 text-red-100"
                  : "border-white/20 bg-white/5 text-white",
            ].join(" ")}
          >
            {message}
          </div>
        ) : null}

        {profileError ? (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
            プロフィールの取得に失敗しました: {profileError.message}
          </div>
        ) : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-[auto,1fr]">
          <div className="rounded-lg border p-5">
            <h2 className="mb-3 text-lg font-semibold">現在のアバター</h2>

            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="現在のアバター"
                data-testid="profile-avatar-image"
                className="h-24 w-24 rounded-full border object-cover"
              />
            ) : (
              <div
                data-testid="profile-avatar-fallback"
                className="flex h-24 w-24 items-center justify-center rounded-full border text-3xl font-bold"
              >
                {avatarFallback}
              </div>
            )}

            <p className="mt-3 max-w-xs text-xs leading-5 text-gray-400">
              公開プロフィールにもこのアバターが表示されます。画像がない場合は、
              表示名またはユーザー名の先頭文字が表示されます。
            </p>
          </div>

          <div className="space-y-4">
            <section className="rounded-lg border p-5">
              <h2 className="mb-2 text-lg font-semibold">公開プロフィール</h2>
              <p className="mb-3 text-sm text-gray-400">
                公開プロフィールでは、表示名・ユーザー名・アバター・基本情報・自己紹介が表示されます。
              </p>

              {publicProfilePath ? (
                <Link
                  href={publicProfilePath}
                  data-testid="public-profile-link"
                  className="inline-flex rounded border px-3 py-2 text-sm underline underline-offset-4 hover:opacity-80"
                >
                  公開プロフィールを見る
                </Link>
              ) : (
                <p className="text-sm text-gray-400">
                  ユーザー名を設定すると公開プロフィールのURLが作成されます。
                </p>
              )}
            </section>

            <section className="rounded-lg border p-5">
              <h2 className="mb-2 text-lg font-semibold">現在のプロフィール内容</h2>
              <p className="mb-4 text-sm text-gray-400">
                今保存されているプロフィール内容です。
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded border p-4">
                  <p className="text-sm text-gray-400">メールアドレス</p>
                  <p className="mt-1 break-all text-sm font-medium">
                    {user.email ?? "未設定"}
                  </p>
                </div>

                <div className="rounded border p-4">
                  <p className="text-sm text-gray-400">表示名</p>
                  <p className="mt-1 text-sm font-medium">
                    {profile?.display_name ?? "未設定"}
                  </p>
                </div>

                <div className="rounded border p-4">
                  <p className="text-sm text-gray-400">ユーザー名</p>
                  <p className="mt-1 text-sm font-medium">
                    {profile?.username ? `@${profile.username}` : "未設定"}
                  </p>
                </div>

                <div className="rounded border p-4">
                  <p className="text-sm text-gray-400">身長</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatOptionalValue(profile?.height_cm ?? null, "cm")}
                  </p>
                </div>

                <div className="rounded border p-4">
                  <p className="text-sm text-gray-400">体重</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatOptionalValue(profile?.weight_kg ?? null, "kg")}
                  </p>
                </div>

                <div className="rounded border p-4">
                  <p className="text-sm text-gray-400">FTP</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatOptionalValue(profile?.ftp_w ?? null, "W")}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded border p-4">
                <p className="text-sm text-gray-400">自己紹介</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                  {profile?.bio?.trim() ? profile.bio : "未設定"}
                </p>
              </div>
            </section>
          </div>
        </section>

        <section className="rounded-lg border p-5">
          <h2 className="mb-1 text-lg font-semibold">編集フォーム</h2>
          <p className="mb-5 text-sm text-gray-400">
            内容を変更したら保存してください。公開プロフィールにも反映されます。
          </p>

          <form action={saveProfile} className="space-y-6">
            <section className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">アカウント情報</h3>
                <p className="text-sm text-gray-400">
                  ログイン情報と公開プロフィールの基本設定です。
                </p>
              </div>

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
                <p className="text-xs text-gray-400">
                  ログインに使用しているメールアドレスです。ここでは変更できません。
                </p>
              </div>

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
                <p className="text-xs text-gray-400">
                  公開プロフィールで最初に目に入る名前です。未設定の場合はユーザー名が表示されます。
                </p>
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
                <p className="text-xs text-gray-400">
                  公開プロフィールのURLに使われます。3〜20文字、英小文字・数字・_ が使えます。
                </p>
                <p className="text-xs text-gray-400">
                  先頭と末尾は英数字のみ、_ の連続は使えません。
                </p>
              </div>
            </section>

            <section className="space-y-4 border-t pt-6">
              <div>
                <h3 className="text-base font-semibold">アバター設定</h3>
                <p className="text-sm text-gray-400">
                  プロフィール画像の登録や削除を行えます。
                </p>
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
                <p className="text-xs text-gray-400">
                  jpg / jpeg / png / webp に対応しています。ファイルサイズは5MB以下にしてください。
                </p>
                <p className="text-xs text-gray-400">
                  新しい画像を保存すると、公開プロフィールのアバターも更新されます。
                </p>
              </div>

              {profile?.avatar_url ? (
                <div className="space-y-1 rounded border border-yellow-500/30 bg-yellow-500/5 p-3">
                  <label
                    htmlFor="remove_avatar"
                    className="flex cursor-pointer items-center gap-2 text-sm font-medium"
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
                  <p className="text-xs leading-5 text-yellow-100/80">
                    チェックして保存すると、現在のアバター画像はプロフィールと公開プロフィールの両方から削除されます。
                  </p>
                  <p className="text-xs leading-5 text-yellow-100/80">
                    削除後は、表示名またはユーザー名の先頭文字が代わりに表示されます。
                  </p>
                </div>
              ) : null}
            </section>

            <section className="space-y-4 border-t pt-6">
              <div>
                <h3 className="text-base font-semibold">ライダー情報</h3>
                <p className="text-sm text-gray-400">
                  基本情報として公開プロフィールに表示されます。
                </p>
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
                  <p className="text-xs text-gray-400">
                    公開プロフィールの基本情報に表示されます。
                  </p>
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
                  <p className="text-xs text-gray-400">小数1桁まで入力できます。</p>
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
                  <p className="text-xs text-gray-400">
                    サイクリング向けのプロフィール情報として表示されます。
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4 border-t pt-6">
              <div>
                <h3 className="text-base font-semibold">自己紹介</h3>
                <p className="text-sm text-gray-400">
                  活動内容や目標などを自由に記載できます。
                </p>
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
                <p className="text-xs text-gray-400">
                  活動内容や目標、ひとことなどを自由に書けます。公開プロフィールにそのまま表示されます。
                </p>
              </div>
            </section>

            <div className="border-t pt-6">
              <button
                type="submit"
                className="rounded bg-white px-4 py-2 text-black hover:opacity-90"
              >
                保存する
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}