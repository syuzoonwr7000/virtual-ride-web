import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  let profile = null;
  let profileError = null;

  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    profile = data;
    profileError = error;
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">ホーム</h1>

        <section className="rounded border p-4">
          <h2 className="mb-2 text-lg font-semibold">認証確認</h2>
          <pre className="overflow-x-auto text-sm">
            {JSON.stringify(
              {
                hasSession: !!user,
                userId: user?.id ?? null,
                email: user?.email ?? null,
                userError,
              },
              null,
              2
            )}
          </pre>
        </section>

        <section className="rounded border p-4">
          <h2 className="mb-2 text-lg font-semibold">プロフィール確認</h2>
          <pre className="overflow-x-auto text-sm">
            {JSON.stringify(
              {
                profile,
                profileError,
              },
              null,
              2
            )}
          </pre>
        </section>
      </div>
    </main>
  );
}