"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/action";
import { prepareProfileInput } from "@/lib/profile/prepare-profile-input";

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