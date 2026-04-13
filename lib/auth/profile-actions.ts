"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/action";
import { prepareProfileInput } from "@/lib/profile/prepare-profile-input";
import {
  buildAvatarStoragePath,
  getOldAvatarStoragePathForDelete,
  validateAvatarFile,
} from "@/lib/profile/avatar-upload";
import { decideAvatarUrlForSave } from "@/lib/profile/avatar-upload-plan";

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: currentProfile, error: currentProfileError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (currentProfileError) {
    redirect(
      "/profile?message=" +
        encodeURIComponent(
          `プロフィールの取得に失敗しました: ${currentProfileError.message}`
        )
    );
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

  const avatarFileValue = formData.get("avatar");
  const avatarFile =
    avatarFileValue instanceof File && avatarFileValue.size > 0
      ? avatarFileValue
      : null;

  const avatarValidation = validateAvatarFile(avatarFile);

  if (!avatarValidation.valid) {
    redirect("/profile?message=" + encodeURIComponent(avatarValidation.message));
  }

  const currentAvatarUrl = currentProfile?.avatar_url ?? null;
  let uploadedAvatarUrl: string | null = null;

  if (avatarFile) {
    const storagePath = buildAvatarStoragePath(
      user.id,
      avatarFile.name,
      Date.now()
    );

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(storagePath, avatarFile, {
        upsert: true,
        contentType: avatarFile.type,
      });

    if (uploadError) {
      redirect(
        "/profile?message=" +
          encodeURIComponent(
            `画像のアップロードに失敗しました: ${uploadError.message}`
          )
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(storagePath);

    uploadedAvatarUrl = publicUrlData.publicUrl;
  }

  const avatarUrl = decideAvatarUrlForSave({
    currentAvatarUrl,
    uploadedAvatarUrl,
  });

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    username: prepared.data.username,
    display_name: prepared.data.display_name,
    height_cm: prepared.data.height_cm,
    weight_kg: prepared.data.weight_kg,
    ftp_w: prepared.data.ftp_w,
    bio: prepared.data.bio,
    avatar_url: avatarUrl,
  });

  if (error) {
    redirect("/profile?message=" + encodeURIComponent(`保存に失敗しました: ${error.message}`));
  }

  const oldAvatarStoragePath = getOldAvatarStoragePathForDelete({
    currentAvatarUrl,
    nextAvatarUrl: avatarUrl,
  });

  if (oldAvatarStoragePath) {
    await supabase.storage.from("avatars").remove([oldAvatarStoragePath]);
  }

  redirect("/profile?message=" + encodeURIComponent("プロフィールを保存しました"));
}