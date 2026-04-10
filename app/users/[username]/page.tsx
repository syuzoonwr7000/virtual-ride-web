import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapProfileToPublicProfileView } from "@/lib/profile/public-profile";

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

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">公開プロフィール</h1>

      <section className="space-y-4 rounded border p-4">
        <div>
          <p className="text-sm text-gray-400">ユーザー名</p>
          <p className="text-base font-medium">{profile.username}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">表示名</p>
          <p className="text-base font-medium">{profile.displayName}</p>
        </div>
      </section>

      <section className="space-y-4 rounded border p-4">
        <h2 className="text-lg font-semibold">基本情報</h2>

        <div>
          <p className="text-sm text-gray-400">身長</p>
          <p>{formatOptionalValue(profile.heightCm, "cm")}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">体重</p>
          <p>{formatOptionalValue(profile.weightKg, "kg")}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">FTP</p>
          <p>{formatOptionalValue(profile.ftpW, "W")}</p>
        </div>
      </section>

      <section className="space-y-4 rounded border p-4">
        <h2 className="text-lg font-semibold">自己紹介</h2>
        <p>{profile.bio ?? "未設定"}</p>
      </section>
    </main>
  );
}