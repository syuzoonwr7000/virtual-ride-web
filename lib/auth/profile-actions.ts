"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/action";

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const username = String(formData.get("username") ?? "").trim() || null;
  const displayName = String(formData.get("display_name") ?? "").trim() || null;
  const heightCmRaw = String(formData.get("height_cm") ?? "").trim();
  const weightKgRaw = String(formData.get("weight_kg") ?? "").trim();
  const ftpWRaw = String(formData.get("ftp_w") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim() || null;

  const heightCm = heightCmRaw ? Number(heightCmRaw) : null;
  const weightKg = weightKgRaw ? Number(weightKgRaw) : null;
  const ftpW = ftpWRaw ? Number(ftpWRaw) : null;

  if (heightCm !== null && Number.isNaN(heightCm)) {
    redirect("/profile?message=" + encodeURIComponent("身長は数値で入力してください"));
  }

  if (weightKg !== null && Number.isNaN(weightKg)) {
    redirect("/profile?message=" + encodeURIComponent("体重は数値で入力してください"));
  }

  if (ftpW !== null && Number.isNaN(ftpW)) {
    redirect("/profile?message=" + encodeURIComponent("FTPは数値で入力してください"));
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    username,
    display_name: displayName,
    height_cm: heightCm,
    weight_kg: weightKg,
    ftp_w: ftpW,
    bio,
  });

  if (error) {
    redirect("/profile?message=" + encodeURIComponent(`保存に失敗しました: ${error.message}`));
  }

  redirect("/profile?message=" + encodeURIComponent("プロフィールを保存しました"));
}