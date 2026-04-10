import { describe, expect, it } from "vitest";
import { normalizeUsername, validateUsername } from "@/lib/validation/profile";

describe("normalizeUsername", () => {
  it("前後の空白を除去して小文字化する", () => {
    expect(normalizeUsername("  AbC_123  ")).toBe("abc_123");
  });
});

describe("validateUsername", () => {
  it("abc は通る", () => {
    expect(validateUsername("abc")).toEqual({ valid: true });
  });

  it("abc_123 は通る", () => {
    expect(validateUsername("abc_123")).toEqual({ valid: true });
  });

  it("英大文字を含んでも正規化後に通る", () => {
    expect(validateUsername("AbC_123")).toEqual({ valid: true });
  });

  it("2文字は落ちる", () => {
    expect(validateUsername("ab")).toEqual({
      valid: false,
      message: "ユーザー名は3〜20文字で入力してください",
    });
  });

  it("21文字は落ちる", () => {
    expect(validateUsername("abcdefghijklmnopqrstu")).toEqual({
      valid: false,
      message: "ユーザー名は3〜20文字で入力してください",
    });
  });

  it("ハイフンを含むと落ちる", () => {
    expect(validateUsername("abc-def")).toEqual({
      valid: false,
      message: "ユーザー名は半角英小文字・数字・アンダースコアのみ使用できます",
    });
  });

  it("日本語を含むと落ちる", () => {
    expect(validateUsername("あいう")).toEqual({
      valid: false,
      message: "ユーザー名は半角英小文字・数字・アンダースコアのみ使用できます",
    });
  });

  it("先頭がアンダースコアだと落ちる", () => {
    expect(validateUsername("_abc")).toEqual({
      valid: false,
      message: "ユーザー名の先頭と末尾は英数字にしてください",
    });
  });

  it("末尾がアンダースコアだと落ちる", () => {
    expect(validateUsername("abc_")).toEqual({
      valid: false,
      message: "ユーザー名の先頭と末尾は英数字にしてください",
    });
  });

  it("アンダースコア連続は落ちる", () => {
    expect(validateUsername("ab__cd")).toEqual({
      valid: false,
      message: "アンダースコアは連続で使用できません",
    });
  });
});