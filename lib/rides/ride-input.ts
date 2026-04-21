type PrepareRideInputParams = {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  activity_date: string;
  distance_km: string;
  elevation_m: string;
};

type PreparedRideInput = {
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  activity_date: string | null;
  distance_km: number | null;
  elevation_m: number | null;
  status: "draft";
};

function normalizeString(value: string): string {
  return value.trim();
}

function normalizeNullableString(value: string): string | null {
  const normalized = value.trim();
  return normalized === "" ? null : normalized;
}

function normalizeNullableNumber(value: string): number | null {
  const normalized = value.trim();
  if (normalized === "") {
    return null;
  }

  return Number(normalized);
}

export function prepareRideInput(
  params: PrepareRideInputParams,
): PreparedRideInput {
  return {
    title: normalizeString(params.title),
    description: normalizeNullableString(params.description),
    video_url: normalizeNullableString(params.video_url),
    thumbnail_url: normalizeNullableString(params.thumbnail_url),
    activity_date: normalizeNullableString(params.activity_date),
    distance_km: normalizeNullableNumber(params.distance_km),
    elevation_m: normalizeNullableNumber(params.elevation_m),
    status: "draft",
  };
}