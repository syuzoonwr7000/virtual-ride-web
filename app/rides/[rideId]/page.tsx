import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchRideDetailById } from "@/lib/rides/ride-detail";

type RideDetailPageProps = {
  params: Promise<{
    rideId: string;
  }>;
};

function formatOptionalValue(value: number | string | null, suffix = "") {
  if (value === null || value === "") {
    return "未設定";
  }

  return `${value}${suffix}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "未設定";
  }

  return new Date(value).toLocaleDateString("ja-JP");
}

function formatMovingTime(value: number | null) {
  if (value === null) {
    return "未設定";
  }

  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  if (hours > 0) {
    return `${hours}時間${minutes}分${seconds}秒`;
  }

  if (minutes > 0) {
    return `${minutes}分${seconds}秒`;
  }

  return `${seconds}秒`;
}

export default async function RideDetailPage({
  params,
}: RideDetailPageProps) {
  const { rideId } = await params;
  const ride = await fetchRideDetailById(rideId);

  if (!ride) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm text-gray-400">Ride Detail</p>
          <h1 className="text-2xl font-bold">{ride.title}</h1>
          <p className="text-sm text-gray-400">
            投稿者: {ride.author.displayName ?? ride.author.username ?? "ユーザー名未設定"}
          </p>
        </header>

        <div>
          <Link
            href="/rides"
            className="inline-flex rounded border px-3 py-2 text-sm underline underline-offset-4 hover:opacity-80"
          >
            ライド一覧へ戻る
          </Link>
        </div>

        <section className="rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold">メイン表示</h2>

          {ride.videoUrl ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">動画URL</p>
              <a
                href={ride.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="break-all text-sm underline underline-offset-4 hover:opacity-80"
              >
                {ride.videoUrl}
              </a>
            </div>
          ) : ride.thumbnailUrl ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">サムネイル</p>
              <img
                src={ride.thumbnailUrl}
                alt={`${ride.title} のサムネイル`}
                className="aspect-video w-full rounded border object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded border text-sm text-gray-400">
              動画もサムネイルも未設定です
            </div>
          )}
        </section>

        <section className="rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold">ライド情報</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">走行日</p>
              <p className="mt-1 text-base font-medium">
                {ride.activityDate ?? "未設定"}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">距離</p>
              <p className="mt-1 text-base font-medium">
                {formatOptionalValue(ride.distanceKm, "km")}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">獲得標高</p>
              <p className="mt-1 text-base font-medium">
                {formatOptionalValue(ride.elevationM, "m")}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">移動時間</p>
              <p className="mt-1 text-base font-medium">
                {formatMovingTime(ride.movingTimeSec)}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">平均速度</p>
              <p className="mt-1 text-base font-medium">
                {formatOptionalValue(ride.avgSpeedKmh, "km/h")}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">平均パワー</p>
              <p className="mt-1 text-base font-medium">
                {formatOptionalValue(ride.avgPowerW, "W")}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">NP</p>
              <p className="mt-1 text-base font-medium">
                {formatOptionalValue(ride.npW, "W")}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">TSS</p>
              <p className="mt-1 text-base font-medium">
                {formatOptionalValue(ride.tss)}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">公開日</p>
              <p className="mt-1 text-base font-medium">
                {formatDate(ride.publishedAt)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold">アクティビティファイル</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">ファイル名</p>
              <p className="mt-1 text-base font-medium">
                {ride.activityFileName ?? "未設定"}
              </p>
            </div>

            <div className="rounded border p-4">
              <p className="text-sm text-gray-400">ファイル形式</p>
              <p className="mt-1 text-base font-medium">
                {ride.activityFileType ?? "未設定"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold">説明</h2>
          <p className="whitespace-pre-wrap text-sm leading-7">
            {ride.description?.trim() ? ride.description : "未設定"}
          </p>
        </section>
      </div>
    </main>
  );
}