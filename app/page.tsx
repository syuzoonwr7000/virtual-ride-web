import { logout } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Virtual Ride Web</h1>
      <p className="mt-2">Supabase 接続確認ページ</p>

      <pre className="mt-4 rounded bg-gray-100 p-4 text-sm text-black">
        {JSON.stringify(
          {
            hasSession: !!data.session,
            error: error?.message ?? null,
          },
          null,
          2
        )}
      </pre>

      <form action={logout} className="mt-4">
        <button
          type="submit"
          className="rounded bg-white px-4 py-2 text-black"
        >
          ログアウト
        </button>
      </form>
    </main>
  );
}