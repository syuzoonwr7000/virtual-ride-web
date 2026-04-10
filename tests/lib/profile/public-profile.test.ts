import { describe, expect, it } from "vitest";
import { mapProfileToPublicProfileView } from "@/lib/profile/public-profile";

describe("mapProfileToPublicProfileView", () => {
  it("公開プロフィール表示用の値へ変換できる", () => {
    const result = mapProfileToPublicProfileView({
      username: "abc_123",
      display_name: "松岡和哉",
      bio: "よろしくお願いします",
      height_cm: 168,
      weight_kg: 62.5,
      ftp_w: 255,
      avatar_url: null,
    });

    expect(result).toEqual({
      username: "abc_123",
      displayName: "松岡和哉",
      bio: "よろしくお願いします",
      heightCm: 168,
      weightKg: 62.5,
      ftpW: 255,
      avatarUrl: null,
    });
  });

  it("display_name が null の場合は username を表示名として使う", () => {
    const result = mapProfileToPublicProfileView({
      username: "abc_123",
      display_name: null,
      bio: null,
      height_cm: null,
      weight_kg: null,
      ftp_w: null,
      avatar_url: null,
    });

    expect(result).toEqual({
      username: "abc_123",
      displayName: "abc_123",
      bio: null,
      heightCm: null,
      weightKg: null,
      ftpW: null,
      avatarUrl: null,
    });
  });
});