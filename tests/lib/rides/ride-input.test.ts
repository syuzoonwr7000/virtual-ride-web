import { describe, expect, it } from "vitest";
import { prepareRideInput } from "@/lib/rides/ride-input";

describe("prepareRideInput", () => {
  it("文字列項目を trim して保存用に整形できる", () => {
    const result = prepareRideInput({
      title: "  朝練テンポ走  ",
      description: "  河川敷をテンポで巡航  ",
      video_url: "  https://example.com/video  ",
      thumbnail_url: "  https://example.com/thumb  ",
      activity_date: "2026-04-21",
      distance_km: "52.3",
      elevation_m: "410",
    });

    expect(result).toEqual({
      title: "朝練テンポ走",
      description: "河川敷をテンポで巡航",
      video_url: "https://example.com/video",
      thumbnail_url: "https://example.com/thumb",
      activity_date: "2026-04-21",
      distance_km: 52.3,
      elevation_m: 410,
      status: "draft",
    });
  });

  it("空文字の任意項目を null に変換できる", () => {
    const result = prepareRideInput({
      title: "テストライド",
      description: "   ",
      video_url: "   ",
      thumbnail_url: "",
      activity_date: "",
      distance_km: "",
      elevation_m: "",
    });

    expect(result).toEqual({
      title: "テストライド",
      description: null,
      video_url: null,
      thumbnail_url: null,
      activity_date: null,
      distance_km: null,
      elevation_m: null,
      status: "draft",
    });
  });

  it("数値項目を number に変換できる", () => {
    const result = prepareRideInput({
      title: "数値変換テスト",
      description: "",
      video_url: "",
      thumbnail_url: "",
      activity_date: "",
      distance_km: "25.5",
      elevation_m: "350",
    });

    expect(result.distance_km).toBe(25.5);
    expect(result.elevation_m).toBe(350);
  });

  it("title は trim 後の値を保持する", () => {
    const result = prepareRideInput({
      title: "  夕方リカバリー  ",
      description: "",
      video_url: "",
      thumbnail_url: "",
      activity_date: "",
      distance_km: "",
      elevation_m: "",
    });

    expect(result.title).toBe("夕方リカバリー");
    expect(result.status).toBe("draft");
  });
});