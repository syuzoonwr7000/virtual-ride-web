"use client";

import { useActionState } from "react";
import { saveRideDraft } from "@/lib/rides/ride-actions";

export function RideForm() {
  const [state, formAction] = useActionState<
    { error: string | null },
    FormData
  >(saveRideDraft, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title">タイトル</label>
        <input id="title" name="title" />
      </div>

      {state.error && (
        <p className="text-red-500 text-sm">{state.error}</p>
      )}

      <button type="submit">下書き保存</button>
    </form>
  );
}