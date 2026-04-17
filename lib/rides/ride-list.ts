import { createClient } from "@/lib/supabase/server";

type RideListProfile =
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

type RideListRow = {
  id: string;
  user_id: string;
  title: string;
  thumbnail_url: string | null;
  activity_date: string | null;
  distance_km: number | null;
  elevation_m: number | null;
  published_at: string | null;
};

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type RideListRowWithProfile = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  activity_date: string | null;
  distance_km: number | null;
  elevation_m: number | null;
  published_at: string | null;
  profiles: RideListProfile;
};

export type RideListItem = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  activityDate: string | null;
  distanceKm: number | null;
  elevationM: number | null;
  publishedAt: string | null;
  author: {
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

function normalizeProfile(
  profile: RideListProfile
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

export function mapRideRowToRideListItem(
  row: RideListRowWithProfile
): RideListItem {
  return {
    id: row.id,
    title: row.title,
    thumbnailUrl: row.thumbnail_url,
    activityDate: row.activity_date,
    distanceKm: row.distance_km,
    elevationM: row.elevation_m,
    publishedAt: row.published_at,
    author: normalizeProfile(row.profiles),
  };
}

export async function fetchPublishedRideList(
  limit = 20
): Promise<RideListItem[]> {
  const supabase = await createClient();

  const { data: rides, error: ridesError } = await supabase
    .from("rides")
    .select(`
      id,
      user_id,
      title,
      thumbnail_url,
      activity_date,
      distance_km,
      elevation_m,
      published_at,
      created_at
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (ridesError || !rides || rides.length === 0) {
    return [];
  }

  const userIds = Array.from(new Set((rides as RideListRow[]).map((ride) => ride.user_id)));

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", userIds);

  if (profilesError || !profiles) {
    return (rides as RideListRow[]).map((ride) =>
      mapRideRowToRideListItem({
        id: ride.id,
        title: ride.title,
        thumbnail_url: ride.thumbnail_url,
        activity_date: ride.activity_date,
        distance_km: ride.distance_km,
        elevation_m: ride.elevation_m,
        published_at: ride.published_at,
        profiles: null,
      })
    );
  }

  const profileMap = new Map(
    (profiles as ProfileRow[]).map((profile) => [profile.id, profile])
  );

  return (rides as RideListRow[]).map((ride) =>
    mapRideRowToRideListItem({
      id: ride.id,
      title: ride.title,
      thumbnail_url: ride.thumbnail_url,
      activity_date: ride.activity_date,
      distance_km: ride.distance_km,
      elevation_m: ride.elevation_m,
      published_at: ride.published_at,
      profiles: profileMap.get(ride.user_id) ?? null,
    })
  );
}