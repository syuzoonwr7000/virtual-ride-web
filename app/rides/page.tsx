import Link from "next/link";
import { fetchPublishedRideList } from "@/lib/rides/ride-list";

function formatOptionalValue(value: number | string | null, suffix = "") {
  if (value === null || value === "") {
    return "未設定";
  }

  return `${value}${suffix}`;
}

export default async function RidesPage() {
  const rides = await fetchPublishedRideList();

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm text-gray-400">Ride Posts</p>
          <h1 className="text-2xl font-bold">ライド一覧</h1>
          <p className="text-sm text-gray-400">
            公開されているライド投稿を新着順で表示しています。
          </p>
        </header>

        {rides.length === 0 ? (
          <section className="rounded-lg border p-8 text-center">
            <h2 className="text-lg font-semibold">まだライド投稿がありません</h2>
            <p className="mt-2 text-sm text-gray-400">
              公開されたライド投稿がここに表示されます。
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rides.map((ride) => (
              <article
                key={ride.id}
                className="overflow-hidden rounded-lg border bg-transparent"
              >
                <div className="aspect-video border-b">
                  {ride.thumbnailUrl ? (
                    <img
                      src={ride.thumbnailUrl}
                      alt={`${ride.title} のサムネイル`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      サムネイル未設定
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <h2 className="line-clamp-2 text-lg font-semibold">
                      {ride.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {ride.author.displayName ?? ride.author.username ?? "ユーザー名未設定"}
                    </p>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded border p-3">
                      <dt className="text-gray-400">走行日</dt>
                      <dd className="mt-1 font-medium">
                        {ride.activityDate ?? "未設定"}
                      </dd>
                    </div>

                    <div className="rounded border p-3">
                      <dt className="text-gray-400">公開日</dt>
                      <dd className="mt-1 font-medium">
                        {ride.publishedAt
                          ? new Date(ride.publishedAt).toLocaleDateString("ja-JP")
                          : "未設定"}
                      </dd>
                    </div>

                    <div className="rounded border p-3">
                      <dt className="text-gray-400">距離</dt>
                      <dd className="mt-1 font-medium">
                        {formatOptionalValue(ride.distanceKm, "km")}
                      </dd>
                    </div>

                    <div className="rounded border p-3">
                      <dt className="text-gray-400">獲得標高</dt>
                      <dd className="mt-1 font-medium">
                        {formatOptionalValue(ride.elevationM, "m")}
                      </dd>
                    </div>
                  </dl>

                  <div>
                    <Link
                      href={`/rides/${ride.id}`}
                      className="inline-flex rounded border px-3 py-2 text-sm underline underline-offset-4 hover:opacity-80"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}