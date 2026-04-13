export type NearbyUser = {
  userId: string;
  name: string;
  avatarUrl?: string | null;
  lat: number;
  lng: number;
  active: boolean;
  lastSeenAt?: string;
};

export type ApiEnvelope<T> = {
  success: boolean;
  status: number;
  message: string;
  data: T;
  timestamp: string;
  correlationId: string;
};

export type GeoLocationPayload = {
  lat: number;
  lng: number;
};

