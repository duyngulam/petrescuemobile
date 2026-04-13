import { API_BASE_URL } from '@/constants/api';
import type { ApiEnvelope } from '@/types/geo';
import type { AuthTokenResponse, LoginRequest } from '@/types/auth';

export async function loginApi(payload: LoginRequest): Promise<AuthTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  const json = (await response.json()) as ApiEnvelope<AuthTokenResponse>;
  return json.data;
}

