import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { createGeoSocket } from '@/services/socket/geo-socket';
import { getNearbyUsers, updateMyLocation } from '@/services/api/geo-api';
import type { NearbyUser } from '@/types/geo';

const UPDATE_INTERVAL_MS = 10000;

export function useGeoTracker(token: string | null) {
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const watcherRef = useRef<Location.LocationSubscription | null>(null);
  const lastPushAtRef = useRef(0);

  const canRun = useMemo(() => Boolean(token), [token]);

  const refreshNearby = useCallback(async () => {
    if (!token) return;
    const users = await getNearbyUsers(token, 2, 50);
    setNearbyUsers(users);
  }, [token]);

  const pushCurrentLocation = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const payload = { lat: current.coords.latitude, lng: current.coords.longitude };
      setMyLocation(payload);
      await updateMyLocation(token, payload);
      await refreshNearby();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update location';
      setError(message);
    }
  }, [refreshNearby, token]);

  useEffect(() => {
    if (!canRun || !token) {
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') {
          throw new Error('Location permission is required.');
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const initial = { lat: current.coords.latitude, lng: current.coords.longitude };

        if (active) {
          setMyLocation(initial);
        }
        await updateMyLocation(token, initial);
        await refreshNearby();

        watcherRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 10,
            timeInterval: UPDATE_INTERVAL_MS,
          },
          async (position) => {
            const next = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            if (active) {
              setMyLocation(next);
            }

            const now = Date.now();
            if (now - lastPushAtRef.current >= UPDATE_INTERVAL_MS) {
              lastPushAtRef.current = now;
              try {
                await updateMyLocation(token, next);
              } catch (e) {
                const message = e instanceof Error ? e.message : 'Failed to update location';
                if (active) {
                  setError(message);
                }
              }
            }
          }
        );
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Cannot start geo tracking';
        if (active) {
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    const socket = createGeoSocket(token, (users) => {
      setNearbyUsers((prev) => {
        const map = new Map(prev.map((u) => [u.userId, u]));
        for (const user of users) {
          map.set(user.userId, user);
        }
        return Array.from(map.values());
      });
    });

    return () => {
      active = false;
      watcherRef.current?.remove();
      watcherRef.current = null;
      socket.deactivate();
    };
  }, [canRun, refreshNearby, token]);

  return {
    myLocation,
    nearbyUsers,
    error,
    loading,
    refreshNearby,
    pushCurrentLocation,
  };
}

