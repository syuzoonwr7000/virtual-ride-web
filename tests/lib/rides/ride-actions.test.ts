import { beforeEach, describe, expect, it, vi } from "vitest";

const redirectMock = vi.fn();

const getUserMock = vi.fn();
const insertMock = vi.fn();
const fromMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (path: string) => redirectMock(path),
}));

vi.mock("@/lib/supabase/action", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: getUserMock,
    },
    from: fromMock,
  })),
}));

vi.mock("@/lib/rides/ride-input", () => ({
  prepareRideInput: vi.fn((input) => ({
    ...input,
    title: "整形後タイトル",
    description: null,
    video_url: null,
    thumbnail_url: null,
    activity_date: null,
    distance_km: null,
    elevation_m: null,
    status: "draft",
  })),
}));

import { saveRideDraft } from "@/lib/rides/ride-actions";

describe("saveRideDraft", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    insertMock.mockResolvedValue({
      error: null,
      data: [{ id: "ride-1" }],
    });

    fromMock.mockReturnValue({
      insert: insertMock,
    });
  });

  it("未認証なら /login へリダイレクトする", async () => {
    getUserMock.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const formData = new FormData();
    formData.set("title", "テスト");

    await saveRideDraft(formData);

    expect(redirectMock).toHaveBeenCalledWith("/login");
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("認証済みなら rides テーブルへ draft 保存する", async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: { id: "user-1" },
      },
      error: null,
    });

    const formData = new FormData();
    formData.set("title", "  元タイトル  ");
    formData.set("description", "");
    formData.set("video_url", "");
    formData.set("thumbnail_url", "");
    formData.set("activity_date", "");
    formData.set("distance_km", "");
    formData.set("elevation_m", "");

    await saveRideDraft(formData);

    expect(fromMock).toHaveBeenCalledWith("rides");
    expect(insertMock).toHaveBeenCalledWith([
      {
        user_id: "user-1",
        title: "整形後タイトル",
        description: null,
        video_url: null,
        thumbnail_url: null,
        activity_date: null,
        distance_km: null,
        elevation_m: null,
        status: "draft",
      },
    ]);
  });
  
  it("保存成功後に /rides へリダイレクトする", async () => {
    getUserMock.mockResolvedValue({
        data: {
        user: { id: "user-1" },
        },
        error: null,
    });

    insertMock.mockResolvedValue({
        error: null,
        data: [{ id: "ride-1" }],
    });

    const formData = new FormData();
    formData.set("title", "保存成功テスト");
    formData.set("description", "");
    formData.set("video_url", "");
    formData.set("thumbnail_url", "");
    formData.set("activity_date", "");
    formData.set("distance_km", "");
    formData.set("elevation_m", "");

    await saveRideDraft(formData);

    expect(redirectMock).toHaveBeenCalledWith("/rides");
  });

  it("保存失敗時はエラーを投げる", async () => {
    getUserMock.mockResolvedValue({
        data: {
        user: { id: "user-1" },
        },
        error: null,
    });

    insertMock.mockResolvedValue({
        error: { message: "insert failed" },
        data: null,
    });

    const formData = new FormData();
    formData.set("title", "保存失敗テスト");
    formData.set("description", "");
    formData.set("video_url", "");
    formData.set("thumbnail_url", "");
    formData.set("activity_date", "");
    formData.set("distance_km", "");
    formData.set("elevation_m", "");

    await expect(saveRideDraft(formData)).rejects.toThrow(
        "ライド下書きの保存に失敗しました",
    );

    expect(redirectMock).not.toHaveBeenCalledWith("/rides");
  });

  it("title が空なら保存せずにエラーを投げる", async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: { id: "user-1" },
      },
      error: null,
    });

    const formData = new FormData();
    formData.set("title", "   ");
    formData.set("description", "");
    formData.set("video_url", "");
    formData.set("thumbnail_url", "");
    formData.set("activity_date", "");
    formData.set("distance_km", "");
    formData.set("elevation_m", "");

    await expect(saveRideDraft(formData)).rejects.toThrow(
      "タイトルは必須です",
    );

    expect(fromMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalledWith("/rides");
  });
});