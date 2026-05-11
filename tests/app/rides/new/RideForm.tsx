"use client";

import { useActionState } from "react";
import {
  saveRideDraft,
  type RideFormState,
} from "@/lib/rides/ride-actions";
import { SubmitButton } from "./SubmitButton";

export function RideForm() {
  const initialState: RideFormState = {
    error: null,
    fieldErrors: {},
  };

  const [state, formAction] = useActionState(
    saveRideDraft,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title">タイトル</label>

        <input
          id="title"
          name="title"
          aria-describedby={
            state.fieldErrors?.title ? "title-error" : undefined
          }
        />

        {state.fieldErrors?.title?.map((error) => (
          <p
            key={error}
            id="title-error"
            className="text-red-500 text-sm"
          >
            {error}
          </p>
        ))}
      </div>

      {state.error && (
        <p className="text-red-500 text-sm">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}