import { describe, expect, it } from "vitest";
import { prepareProfileInput } from "@/lib/auth/profile-actions";

describe("prepareProfileInput", () => {
  it("不正な username の場合は失敗を返す", () => {
    const result = prepareProfileInput({
      username: "ab__cd",
      display_name: "表示名",
      height_cm: "168",
      weight_kg: "62.5",
      ftp_w: "255",
      bio: "自己紹介",
    });

    expect(result).toEqual({
      success: false,
      message: "アンダースコアは連続で使用できません",
    });
  });

  it("正常な username は小文字化して返す", () => {
    const result = prepareProfileInput({
      username: "  AbC_123  ",
      display_name: "表示名",
      height_cm: "168",
      weight_kg: "62.5",
      ftp_w: "255",
      bio: "自己紹介",
    });

    expect(result).toEqual({
      success: true,
      data: {
        username: "abc_123",
        display_name: "表示名",
        height_cm: 168,
        weight_kg: 62.5,
        ftp_w: 255,
        bio: "自己紹介",
      },
    });
  });

  it("username が空文字なら null で返す", () => {
    const result = prepareProfileInput({
      username: "   ",
      display_name: "表示名",
      height_cm: "",
      weight_kg: "",
      ftp_w: "",
      bio: "",
    });

    expect(result).toEqual({
      success: true,
      data: {
        username: null,
        display_name: "表示名",
        height_cm: null,
        weight_kg: null,
        ftp_w: null,
        bio: null,
      },
    });
  });

  it("身長が数値でない場合は失敗を返す", () => {
    const result = prepareProfileInput({
      username: "abc_123",
      display_name: "表示名",
      height_cm: "abc",
      weight_kg: "62.5",
      ftp_w: "255",
      bio: "自己紹介",
    });

    expect(result).toEqual({
      success: false,
      message: "身長は数値で入力してください",
    });
  });

  it("体重が数値でない場合は失敗を返す", () => {
    const result = prepareProfileInput({
      username: "abc_123",
      display_name: "表示名",
      height_cm: "168",
      weight_kg: "abc",
      ftp_w: "255",
      bio: "自己紹介",
    });

    expect(result).toEqual({
      success: false,
      message: "体重は数値で入力してください",
    });
  });

  it("FTPが数値でない場合は失敗を返す", () => {
    const result = prepareProfileInput({
      username: "abc_123",
      display_name: "表示名",
      height_cm: "168",
      weight_kg: "62.5",
      ftp_w: "abc",
      bio: "自己紹介",
    });

    expect(result).toEqual({
      success: false,
      message: "FTPは数値で入力してください",
    });
  });
});