import { describe, expect, it } from "vitest";
import { buildPublicProfilePath } from "@/lib/profile/public-profile-link";

describe("buildPublicProfilePath", () => {
  it("username がある場合は公開プロフィールURLを返す", () => {
    expect(buildPublicProfilePath("abc_123")).toBe("/users/abc_123");
  });

  it("前後空白を除去する", () => {
    expect(buildPublicProfilePath("  abc_123  ")).toBe("/users/abc_123");
  });

  it("username が空文字なら null を返す", () => {
    expect(buildPublicProfilePath("")).toBeNull();
  });

  it("username が空白のみなら null を返す", () => {
    expect(buildPublicProfilePath("   ")).toBeNull();
  });

  it("username が null なら null を返す", () => {
    expect(buildPublicProfilePath(null)).toBeNull();
  });
});