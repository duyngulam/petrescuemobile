import { Client, IMessage } from '@stomp/stompjs';
import { WS_BASE_URL } from '@/constants/api';
import type { ApiEnvelope, NearbyUser } from '@/types/geo';

type GeoUpdateListener = (users: NearbyUser[]) => void;

function parseGeoMessage(body: string): NearbyUser[] {
  const parsed = JSON.parse(body) as
    | ApiEnvelope<NearbyUser[]>
    | ApiEnvelope<NearbyUser>
    | NearbyUser[]
    | NearbyUser;

  if (Array.isArray(parsed)) {
    return parsed;
  }
  if ('data' in parsed) {
    const payload = parsed.data;
    return Array.isArray(payload) ? payload : [payload];
  }
  return [parsed];
}

export function createGeoSocket(token: string, onUpdate: GeoUpdateListener) {
  const client = new Client({
    brokerURL: WS_BASE_URL,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      client.subscribe('/user/queue/geo/updates', (message: IMessage) => {
        onUpdate(parseGeoMessage(message.body));
      });
    },
  });

  client.activate();
  return client;
}

