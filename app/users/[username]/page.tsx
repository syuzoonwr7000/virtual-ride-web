import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapProfileToPublicProfileView } from "@/lib/profile/public-profile";

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

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

      <section className="space-y-2 rounded border p-4">
        <div>
          <span className="font-semibold">ユーザー名: </span>
          <span>{profile.username}</span>
        </div>

        <div>
          <span className="font-semibold">表示名: </span>
          <span>{profile.displayName}</span>
        </div>

        <div>
          <span className="font-semibold">自己紹介: </span>
          <span>{profile.bio ?? "未設定"}</span>
        </div>

        <div>
          <span className="font-semibold">身長: </span>
          <span>{profile.heightCm ?? "未設定"}</span>
        </div>

        <div>
          <span className="font-semibold">体重: </span>
          <span>{profile.weightKg ?? "未設定"}</span>
        </div>

        <div>
          <span className="font-semibold">FTP: </span>
          <span>{profile.ftpW ?? "未設定"}</span>
        </div>
      </section>
    </main>
  );
}