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

      <div className="space-y-2">
        <label htmlFor="description">説明</label>
        <textarea id="description" name="description" rows={4} />
      </div>

      <div className="space-y-2">
        <label htmlFor="video_url">動画URL</label>
        <input id="video_url" name="video_url" type="url" />
      </div>

      <div className="space-y-2">
        <label htmlFor="thumbnail_url">サムネイルURL</label>
        <input id="thumbnail_url" name="thumbnail_url" type="url" />
      </div>

      <div className="space-y-2">
        <label htmlFor="activity_date">走行日</label>
        <input id="activity_date" name="activity_date" type="date" />
      </div>

      <div className="space-y-2">
        <label htmlFor="distance_km">距離(km)</label>
        <input
          id="distance_km"
          name="distance_km"
          type="number"
          step="0.1"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="elevation_m">獲得標高(m)</label>
        <input
          id="elevation_m"
          name="elevation_m"
          type="number"
          step="1"
        />
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