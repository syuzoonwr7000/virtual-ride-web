import { describe, expect, it } from "vitest";
import { buildAvatarStoragePath, validateAvatarFile } from "@/lib/profile/avatar-upload";

function createFile(options: {
  name: string;
  type: string;
  size: number;
}) {
  return new File([new Uint8Array(options.size)], options.name, {
    type: options.type,
  });
}

describe("validateAvatarFile", () => {
  it("ファイル未選択は成功扱いにする", () => {
    expect(validateAvatarFile(null)).toEqual({ valid: true });
  });

  it("jpg は許可する", () => {
    const file = createFile({
      name: "avatar.jpg",
      type: "image/jpeg",
      size: 1024,
    });

    expect(validateAvatarFile(file)).toEqual({ valid: true });
  });

  it("png は許可する", () => {
    const file = createFile({
      name: "avatar.png",
      type: "image/png",
      size: 1024,
    });

    expect(validateAvatarFile(file)).toEqual({ valid: true });
  });

  it("webp は許可する", () => {
    const file = createFile({
      name: "avatar.webp",
      type: "image/webp",
      size: 1024,
    });

    expect(validateAvatarFile(file)).toEqual({ valid: true });
  });

  it("許可されていない拡張子は失敗にする", () => {
    const file = createFile({
      name: "avatar.gif",
      type: "image/gif",
      size: 1024,
    });

    expect(validateAvatarFile(file)).toEqual({
      valid: false,
      message: "アバター画像は jpg・jpeg・png・webp のみアップロードできます",
    });
  });

  it("5MBを超えるファイルは失敗にする", () => {
    const file = createFile({
      name: "avatar.jpg",
      type: "image/jpeg",
      size: 5 * 1024 * 1024 + 1,
    });

    expect(validateAvatarFile(file)).toEqual({
      valid: false,
      message: "アバター画像は5MB以下にしてください",
    });
  });
});

describe("buildAvatarStoragePath", () => {
  it("userId と拡張子から storage path を生成できる", () => {
    const result = buildAvatarStoragePath(
      "user-123",
      "avatar.png",
      1710000000000
    );

    expect(result).toBe("avatars/user-123-1710000000000.png");
  });

  it("拡張子が大文字でも小文字化して生成する", () => {
    const result = buildAvatarStoragePath(
      "user-123",
      "avatar.JPG",
      1710000000000
    );

    expect(result).toBe("avatars/user-123-1710000000000.jpg");
  });

  it("拡張子が取れない場合は jpg を使う", () => {
    const result = buildAvatarStoragePath(
      "user-123",
      "avatar",
      1710000000000
    );

    expect(result).toBe("avatars/user-123-1710000000000.jpg");
  });
});