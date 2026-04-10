import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Virtual Ride Web</h1>
      <p className="mt-2">Supabase 接続確認ページ</p>

      <pre className="mt-4 rounded bg-gray-100 p-4 text-sm">
        {JSON.stringify(
          {
            hasSession: !!data.session,
            error: error?.message ?? null,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}