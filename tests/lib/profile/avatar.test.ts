import { describe, expect, it } from "vitest";
import { getAvatarFallbackText } from "@/lib/profile/avatar";

describe("getAvatarFallbackText", () => {
  it("displayName がある場合は先頭1文字を返す", () => {
    expect(getAvatarFallbackText("松岡和哉", "matsuoka")).toBe("松");
  });

  it("displayName が空なら username の先頭1文字を返す", () => {
    expect(getAvatarFallbackText("", "matsuoka")).toBe("m");
  });

  it("displayName が null なら username の先頭1文字を返す", () => {
    expect(getAvatarFallbackText(null, "matsuoka")).toBe("m");
  });

  it("displayName と username が空なら ? を返す", () => {
    expect(getAvatarFallbackText("", "")).toBe("?");
  });
});