import { normalizeUsername, validateUsername } from "@/lib/validation/profile";

export type ProfileInput = {
  username: string;
  display_name: string;
  height_cm: string;
  weight_kg: string;
  ftp_w: string;
  bio: string;
};

export type PrepareProfileInputResult =
  | {
      success: true;
      data: {
        username: string | null;
        display_name: string | null;
        height_cm: number | null;
        weight_kg: number | null;
        ftp_w: number | null;
        bio: string | null;
      };
    }
  | {
      success: false;
      message: string;
    };

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function toNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;

  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? Number.NaN : parsed;
}

export function prepareProfileInput(input: ProfileInput): PrepareProfileInputResult {
  const rawUsername = input.username.trim();

  if (rawUsername !== "") {
    const validation = validateUsername(rawUsername);

    if (!validation.valid) {
      return {
        success: false,
        message: validation.message ?? "ユーザー名が不正です",
      };
    }
  }

  const heightCm = toNullableNumber(input.height_cm);
  const weightKg = toNullableNumber(input.weight_kg);
  const ftpW = toNullableNumber(input.ftp_w);

  if (heightCm !== null && Number.isNaN(heightCm)) {
    return {
      success: false,
      message: "身長は数値で入力してください",
    };
  }

  if (weightKg !== null && Number.isNaN(weightKg)) {
    return {
      success: false,
      message: "体重は数値で入力してください",
    };
  }

  if (ftpW !== null && Number.isNaN(ftpW)) {
    return {
      success: false,
      message: "FTPは数値で入力してください",
    };
  }

  return {
    success: true,
    data: {
      username: rawUsername === "" ? null : normalizeUsername(rawUsername),
      display_name: emptyToNull(input.display_name),
      height_cm: heightCm,
      weight_kg: weightKg,
      ftp_w: ftpW,
      bio: emptyToNull(input.bio),
    },
  };
}