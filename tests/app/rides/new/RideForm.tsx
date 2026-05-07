"use client";

import { useActionState } from "react";
import { saveRideDraft } from "@/lib/rides/ride-actions";
import { SubmitButton } from "./SubmitButton";

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

      <SubmitButton />
    </form>
  );
}