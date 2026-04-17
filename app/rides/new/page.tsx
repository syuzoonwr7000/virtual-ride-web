export default function NewRidePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">ライドを投稿</h1>
          <p className="text-sm text-gray-600">
            まずは下書きとして保存できる最小構成です
          </p>
          <p className="text-sm text-gray-600">
            公開設定は後続の実装で追加します
          </p>
        </header>

        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              タイトル
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              説明
            </label>
            <textarea
              id="description"
              name="description"
              className="min-h-32 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="video_url" className="block text-sm font-medium">
              動画URL
            </label>
            <input
              id="video_url"
              name="video_url"
              type="url"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="thumbnail_url" className="block text-sm font-medium">
              サムネイルURL
            </label>
            <input
              id="thumbnail_url"
              name="thumbnail_url"
              type="url"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="activity_date" className="block text-sm font-medium">
              走行日
            </label>
            <input
              id="activity_date"
              name="activity_date"
              type="date"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="distance_km" className="block text-sm font-medium">
              距離(km)
            </label>
            <input
              id="distance_km"
              name="distance_km"
              type="number"
              step="0.1"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="elevation_m" className="block text-sm font-medium">
              獲得標高(m)
            </label>
            <input
              id="elevation_m"
              name="elevation_m"
              type="number"
              step="1"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-white"
            >
              下書き保存
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}