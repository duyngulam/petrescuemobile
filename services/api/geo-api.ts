import { API_BASE_URL } from '@/constants/api';
import type { ApiEnvelope, GeoLocationPayload, NearbyUser } from '@/types/geo';

type HttpMethod = 'GET' | 'PUT';

async function apiRequest<T>(path: string, method: HttpMethod, token: string, body?: unknown) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let detail = '';
    try {
      const errorJson = (await response.json()) as Partial<ApiEnvelope<unknown>> & {
        errorCode?: string;
      };
      detail = errorJson.message ?? errorJson.errorCode ?? '';
    } catch {
      detail = '';
    }
    throw new Error(`API ${method} ${path} failed: ${response.status}${detail ? ` - ${detail}` : ''}`);
  }

  return (await response.json()) as ApiEnvelope<T>;
}

export async function getNearbyUsers(
  token: string,
  radiusKm = 2,
  limit = 50
): Promise<NearbyUser[]> {
  const result = await apiRequest<NearbyUser[]>(
    `/geo/nearby?radiusKm=${radiusKm}&limit=${limit}`,
    'GET',
    token
  );
  return result.data;
}

export async function updateMyLocation(token: string, payload: GeoLocationPayload): Promise<void> {
  await apiRequest<unknown>('/geo/me/location', 'PUT', token, payload);
}

