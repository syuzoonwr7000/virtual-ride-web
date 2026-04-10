import { signup } from "@/lib/auth/actions";

type SearchParams = Promise<{
  message?: string;
}>;

export default async function SignupPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const message = searchParams.message
    ? decodeURIComponent(searchParams.message)
    : undefined;

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">新規登録</h1>

      <form action={signup} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded border px-3 py-2 text-black"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded border px-3 py-2 text-black"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-white px-4 py-2 text-black"
        >
          新規登録
        </button>
      </form>

      {message ? (
        <p className="mt-4 rounded border border-white/20 p-3 text-sm">
          {message}
        </p>
      ) : null}
    </main>
  );
}