import { describe, expect, it } from "vitest";
import {
  mapRideRowToRideDetail,
  type RideDetailRow,
} from "@/lib/rides/ride-detail";

describe("mapRideRowToRideDetail", () => {
  it("詳細表示用のデータに変換できる", () => {
    const row: RideDetailRow = {
      id: "ride-1",
      user_id: "user-1",
      title: "朝練ライド",
      description: "テンポ走を中心に走った",
      video_url: "https://example.com/video.mp4",
      thumbnail_url: "https://example.com/thumb.jpg",
      activity_file_name: "ride.fit",
      activity_file_type: "fit",
      activity_date: "2026-04-17",
      distance_km: 52.34,
      elevation_m: 612,
      moving_time_sec: 5432,
      avg_speed_kmh: 34.7,
      avg_power_w: 210,
      np_w: 235,
      tss: 88,
      status: "published",
      published_at: "2026-04-17T08:30:00.000Z",
      profiles: {
        username: "matsuoka",
        display_name: "松岡和哉",
        avatar_url: "https://example.com/avatar.jpg",
      },
    };

    expect(mapRideRowToRideDetail(row)).toEqual({
      id: "ride-1",
      userId: "user-1",
      title: "朝練ライド",
      description: "テンポ走を中心に走った",
      videoUrl: "https://example.com/video.mp4",
      thumbnailUrl: "https://example.com/thumb.jpg",
      activityFileName: "ride.fit",
      activityFileType: "fit",
      activityDate: "2026-04-17",
      distanceKm: 52.34,
      elevationM: 612,
      movingTimeSec: 5432,
      avgSpeedKmh: 34.7,
      avgPowerW: 210,
      npW: 235,
      tss: 88,
      status: "published",
      publishedAt: "2026-04-17T08:30:00.000Z",
      author: {
        username: "matsuoka",
        displayName: "松岡和哉",
        avatarUrl: "https://example.com/avatar.jpg",
      },
    });
  });

  it("nullable な項目をそのまま扱える", () => {
    const row: RideDetailRow = {
      id: "ride-2",
      user_id: "user-2",
      title: "夜ライド",
      description: null,
      video_url: null,
      thumbnail_url: null,
      activity_file_name: null,
      activity_file_type: null,
      activity_date: null,
      distance_km: null,
      elevation_m: null,
      moving_time_sec: null,
      avg_speed_kmh: null,
      avg_power_w: null,
      np_w: null,
      tss: null,
      status: "draft",
      published_at: null,
      profiles: {
        username: "night_ride",
        display_name: null,
        avatar_url: null,
      },
    };

    expect(mapRideRowToRideDetail(row)).toEqual({
      id: "ride-2",
      userId: "user-2",
      title: "夜ライド",
      description: null,
      videoUrl: null,
      thumbnailUrl: null,
      activityFileName: null,
      activityFileType: null,
      activityDate: null,
      distanceKm: null,
      elevationM: null,
      movingTimeSec: null,
      avgSpeedKmh: null,
      avgPowerW: null,
      npW: null,
      tss: null,
      status: "draft",
      publishedAt: null,
      author: {
        username: "night_ride",
        displayName: null,
        avatarUrl: null,
      },
    });
  });

  it("profiles が配列で返ってきても先頭要素を使って変換できる", () => {
    const row: RideDetailRow = {
      id: "ride-3",
      user_id: "user-3",
      title: "ヒルクライム",
      description: "短時間高強度",
      video_url: null,
      thumbnail_url: "https://example.com/hill.jpg",
      activity_file_name: "hill.gpx",
      activity_file_type: "gpx",
      activity_date: "2026-04-18",
      distance_km: 18.5,
      elevation_m: 820,
      moving_time_sec: 3600,
      avg_speed_kmh: 18.5,
      avg_power_w: null,
      np_w: null,
      tss: null,
      status: "published",
      published_at: "2026-04-18T09:00:00.000Z",
      profiles: [
        {
          username: "hill_user",
          display_name: "ヒルクライマー",
          avatar_url: "https://example.com/hill-avatar.jpg",
        },
      ],
    };

    expect(mapRideRowToRideDetail(row)).toEqual({
      id: "ride-3",
      userId: "user-3",
      title: "ヒルクライム",
      description: "短時間高強度",
      videoUrl: null,
      thumbnailUrl: "https://example.com/hill.jpg",
      activityFileName: "hill.gpx",
      activityFileType: "gpx",
      activityDate: "2026-04-18",
      distanceKm: 18.5,
      elevationM: 820,
      movingTimeSec: 3600,
      avgSpeedKmh: 18.5,
      avgPowerW: null,
      npW: null,
      tss: null,
      status: "published",
      publishedAt: "2026-04-18T09:00:00.000Z",
      author: {
        username: "hill_user",
        displayName: "ヒルクライマー",
        avatarUrl: "https://example.com/hill-avatar.jpg",
      },
    });
  });

  it("profiles が null の場合でも author を null 埋めで返せる", () => {
    const row: RideDetailRow = {
      id: "ride-4",
      user_id: "user-4",
      title: "テストライド",
      description: null,
      video_url: null,
      thumbnail_url: null,
      activity_file_name: null,
      activity_file_type: null,
      activity_date: "2026-04-19",
      distance_km: 10,
      elevation_m: 100,
      moving_time_sec: 1800,
      avg_speed_kmh: 20,
      avg_power_w: null,
      np_w: null,
      tss: null,
      status: "draft",
      published_at: null,
      profiles: null,
    };

    expect(mapRideRowToRideDetail(row)).toEqual({
      id: "ride-4",
      userId: "user-4",
      title: "テストライド",
      description: null,
      videoUrl: null,
      thumbnailUrl: null,
      activityFileName: null,
      activityFileType: null,
      activityDate: "2026-04-19",
      distanceKm: 10,
      elevationM: 100,
      movingTimeSec: 1800,
      avgSpeedKmh: 20,
      avgPowerW: null,
      npW: null,
      tss: null,
      status: "draft",
      publishedAt: null,
      author: {
        username: null,
        displayName: null,
        avatarUrl: null,
      },
    });
  });
});