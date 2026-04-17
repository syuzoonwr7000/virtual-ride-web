import { createClient } from "@/lib/supabase/server";

type RideDetailProfileRow =
  | {
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
    }
  | {
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
    }[]
  | null;

export type RideDetailRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  activity_file_name: string | null;
  activity_file_type: "fit" | "gpx" | null;
  activity_date: string | null;
  distance_km: number | null;
  elevation_m: number | null;
  moving_time_sec: number | null;
  avg_speed_kmh: number | null;
  avg_power_w: number | null;
  np_w: number | null;
  tss: number | null;
  status: "draft" | "published";
  published_at: string | null;
  profiles: RideDetailProfileRow;
};

type RideDetailDbRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  activity_file_name: string | null;
  activity_file_type: "fit" | "gpx" | null;
  activity_date: string | null;
  distance_km: number | null;
  elevation_m: number | null;
  moving_time_sec: number | null;
  avg_speed_kmh: number | null;
  avg_power_w: number | null;
  np_w: number | null;
  tss: number | null;
  status: "draft" | "published";
  published_at: string | null;
};

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export type RideDetail = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  activityFileName: string | null;
  activityFileType: "fit" | "gpx" | null;
  activityDate: string | null;
  distanceKm: number | null;
  elevationM: number | null;
  movingTimeSec: number | null;
  avgSpeedKmh: number | null;
  avgPowerW: number | null;
  npW: number | null;
  tss: number | null;
  status: "draft" | "published";
  publishedAt: string | null;
  author: {
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

function normalizeProfile(
  profile: RideDetailProfileRow
): {
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
} {
  if (!profile) {
    return {
      username: null,
      displayName: null,
      avatarUrl: null,
    };
  }

  const profileRow = Array.isArray(profile) ? profile[0] ?? null : profile;

  if (!profileRow) {
    return {
      username: null,
      displayName: null,
      avatarUrl: null,
    };
  }

  return {
    username: profileRow.username ?? null,
    displayName: profileRow.display_name ?? null,
    avatarUrl: profileRow.avatar_url ?? null,
  };
}

export function mapRideRowToRideDetail(row: RideDetailRow): RideDetail {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    videoUrl: row.video_url,
    thumbnailUrl: row.thumbnail_url,
    activityFileName: row.activity_file_name,
    activityFileType: row.activity_file_type,
    activityDate: row.activity_date,
    distanceKm: row.distance_km,
    elevationM: row.elevation_m,
    movingTimeSec: row.moving_time_sec,
    avgSpeedKmh: row.avg_speed_kmh,
    avgPowerW: row.avg_power_w,
    npW: row.np_w,
    tss: row.tss,
    status: row.status,
    publishedAt: row.published_at,
    author: normalizeProfile(row.profiles),
  };
}

export async function fetchRideDetailById(
  rideId: string
): Promise<RideDetail | null> {
  const supabase = await createClient();

  const { data: ride, error: rideError } = await supabase
    .from("rides")
    .select(`
      id,
      user_id,
      title,
      description,
      video_url,
      thumbnail_url,
      activity_file_name,
      activity_file_type,
      activity_date,
      distance_km,
      elevation_m,
      moving_time_sec,
      avg_speed_kmh,
      avg_power_w,
      np_w,
      tss,
      status,
      published_at
    `)
    .eq("id", rideId)
    .maybeSingle();

  if (rideError || !ride) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("id", (ride as RideDetailDbRow).user_id)
    .maybeSingle();

  return mapRideRowToRideDetail({
    ...(ride as RideDetailDbRow),
    profiles: profileError ? null : ((profile as ProfileRow | null) ?? null),
  });
}