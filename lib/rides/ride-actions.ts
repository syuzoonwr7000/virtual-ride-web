"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/action";
import { prepareRideInput } from "@/lib/rides/ride-input";

export async function saveRideDraft(
  prevState: { error: string | null },
  formData: FormData
) {
  const rawTitle = String(formData.get("title") ?? "");

  if (rawTitle.trim() === "") {
    return { error: "タイトルは必須です" };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
    return { error: null };
  }

  const rawTitle = String(formData.get("title") ?? "");

  if (rawTitle.trim() === "") {
    throw new Error("タイトルは必須です");
  }
  
  const prepared = prepareRideInput({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    video_url: String(formData.get("video_url") ?? ""),
    thumbnail_url: String(formData.get("thumbnail_url") ?? ""),
    activity_date: String(formData.get("activity_date") ?? ""),
    distance_km: String(formData.get("distance_km") ?? ""),
    elevation_m: String(formData.get("elevation_m") ?? ""),
  });

  if (prepared.title === "") {
    throw new Error("タイトルは必須です");
  }

  const { error } = await supabase.from("rides").insert([
    {
      user_id: user.id,
      title: prepared.title,
      description: prepared.description,
      video_url: prepared.video_url,
      thumbnail_url: prepared.thumbnail_url,
      activity_date: prepared.activity_date,
      distance_km: prepared.distance_km,
      elevation_m: prepared.elevation_m,
      status: prepared.status,
    },
  ]);

  if (error) {
    throw new Error("ライド下書きの保存に失敗しました");
  }

  redirect("/rides");
  return { error: null };
}