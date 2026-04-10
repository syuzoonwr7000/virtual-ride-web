"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/action";
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

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const prepared = prepareProfileInput({
    username: String(formData.get("username") ?? ""),
    display_name: String(formData.get("display_name") ?? ""),
    height_cm: String(formData.get("height_cm") ?? ""),
    weight_kg: String(formData.get("weight_kg") ?? ""),
    ftp_w: String(formData.get("ftp_w") ?? ""),
    bio: String(formData.get("bio") ?? ""),
  });

  if (!prepared.success) {
    redirect("/profile?message=" + encodeURIComponent(prepared.message));
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    username: prepared.data.username,
    display_name: prepared.data.display_name,
    height_cm: prepared.data.height_cm,
    weight_kg: prepared.data.weight_kg,
    ftp_w: prepared.data.ftp_w,
    bio: prepared.data.bio,
  });

  if (error) {
    redirect("/profile?message=" + encodeURIComponent(`保存に失敗しました: ${error.message}`));
  }

  redirect("/profile?message=" + encodeURIComponent("プロフィールを保存しました"));
}