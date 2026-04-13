import { describe, expect, it } from "vitest";
import { decideAvatarUrlForSave } from "@/lib/profile/avatar-upload-plan";

describe("decideAvatarUrlForSave", () => {
  it("新しい avatarUrl がある場合はそれを採用する", () => {
    expect(
      decideAvatarUrlForSave({
        currentAvatarUrl: "https://example.com/old.png",
        uploadedAvatarUrl: "https://example.com/new.png",
      })
    ).toBe("https://example.com/new.png");
  });

  it("新しい avatarUrl がない場合は既存値を維持する", () => {
    expect(
      decideAvatarUrlForSave({
        currentAvatarUrl: "https://example.com/old.png",
        uploadedAvatarUrl: null,
      })
    ).toBe("https://example.com/old.png");
  });

  it("どちらもない場合は null を返す", () => {
    expect(
      decideAvatarUrlForSave({
        currentAvatarUrl: null,
        uploadedAvatarUrl: null,
      })
    ).toBeNull();
  });
});