import Constants from 'expo-constants';

type ExtraConfig = {
  apiBaseUrl?: string;
  wsBaseUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

export const API_BASE_URL =
  extra.apiBaseUrl ?? 'https://pet-rescue-api-0uhx.onrender.com/api/v1';

export const WS_BASE_URL = extra.wsBaseUrl ?? 'wss://pet-rescue-api-0uhx.onrender.com/ws';

