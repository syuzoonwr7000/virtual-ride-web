export default function UsersNotFoundPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-8">
      <h1 className="text-2xl font-bold">プロフィールが見つかりません</h1>
      <p className="text-sm text-gray-400">
        指定されたユーザー名の公開プロフィールは存在しません。
      </p>
    </main>
  );
}