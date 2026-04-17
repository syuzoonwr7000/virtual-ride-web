import { describe, expect, it } from "vitest";
import { mapRideRowToRideListItem } from "@/lib/rides/ride-list";

describe("mapRideRowToRideListItem", () => {
  it("一覧表示用のデータに変換できる", () => {
    const row = {
      id: "ride-1",
      title: "朝練ライド",
      thumbnail_url: "https://example.com/thumb.jpg",
      activity_date: "2026-04-17",
      distance_km: 52.34,
      elevation_m: 612,
      published_at: "2026-04-17T08:30:00.000Z",
      profiles: {
        username: "matsuoka",
        display_name: "松岡和哉",
        avatar_url: "https://example.com/avatar.jpg",
      },
    };

    expect(mapRideRowToRideListItem(row)).toEqual({
      id: "ride-1",
      title: "朝練ライド",
      thumbnailUrl: "https://example.com/thumb.jpg",
      activityDate: "2026-04-17",
      distanceKm: 52.34,
      elevationM: 612,
      publishedAt: "2026-04-17T08:30:00.000Z",
      author: {
        username: "matsuoka",
        displayName: "松岡和哉",
        avatarUrl: "https://example.com/avatar.jpg",
      },
    });
  });

  it("nullable な項目をそのまま扱える", () => {
    const row = {
      id: "ride-2",
      title: "夜ライド",
      thumbnail_url: null,
      activity_date: null,
      distance_km: null,
      elevation_m: null,
      published_at: null,
      profiles: {
        username: "night_ride",
        display_name: null,
        avatar_url: null,
      },
    };

    expect(mapRideRowToRideListItem(row)).toEqual({
      id: "ride-2",
      title: "夜ライド",
      thumbnailUrl: null,
      activityDate: null,
      distanceKm: null,
      elevationM: null,
      publishedAt: null,
      author: {
        username: "night_ride",
        displayName: null,
        avatarUrl: null,
      },
    });
  });

  it("profiles が配列で返ってきても先頭要素を使って変換できる", () => {
    const row = {
      id: "ride-3",
      title: "ヒルクライム",
      thumbnail_url: "https://example.com/hill.jpg",
      activity_date: "2026-04-18",
      distance_km: 18.5,
      elevation_m: 820,
      published_at: "2026-04-18T09:00:00.000Z",
      profiles: [
        {
          username: "hill_user",
          display_name: "ヒルクライマー",
          avatar_url: "https://example.com/hill-avatar.jpg",
        },
      ],
    };

    expect(mapRideRowToRideListItem(row)).toEqual({
      id: "ride-3",
      title: "ヒルクライム",
      thumbnailUrl: "https://example.com/hill.jpg",
      activityDate: "2026-04-18",
      distanceKm: 18.5,
      elevationM: 820,
      publishedAt: "2026-04-18T09:00:00.000Z",
      author: {
        username: "hill_user",
        displayName: "ヒルクライマー",
        avatarUrl: "https://example.com/hill-avatar.jpg",
      },
    });
  });

  it("profiles が null の場合でも author を null 埋めで返せる", () => {
    const row = {
      id: "ride-4",
      title: "テストライド",
      thumbnail_url: null,
      activity_date: "2026-04-19",
      distance_km: 10,
      elevation_m: 100,
      published_at: "2026-04-19T10:00:00.000Z",
      profiles: null,
    };

    expect(mapRideRowToRideListItem(row)).toEqual({
      id: "ride-4",
      title: "テストライド",
      thumbnailUrl: null,
      activityDate: "2026-04-19",
      distanceKm: 10,
      elevationM: 100,
      publishedAt: "2026-04-19T10:00:00.000Z",
      author: {
        username: null,
        displayName: null,
        avatarUrl: null,
      },
    });
  });
});