import { useMemo, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { useAuth } from '@/contexts/auth-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useGeoTracker } from '@/hooks/use-geo-tracker';

export default function HomeScreen() {
  const { token, user, loading: authLoading, error: authError, login, logout } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const { myLocation, nearbyUsers, error, loading, refreshNearby, pushCurrentLocation } = useGeoTracker(token);

  const region = useMemo(
    () => ({
      latitude: myLocation?.lat ?? 10.86,
      longitude: myLocation?.lng ?? 108.8,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    }),
    [myLocation]
  );

  if (!token) {
    return (
      <ThemedView style={styles.authContainer}>
        <ThemedText type="title">Dang nhap</ThemedText>
        <TextInput
          value={emailOrUsername}
          onChangeText={(text) => {
            emailRef.current = text;
            setEmailOrUsername(text);
          }}
          onEndEditing={(e) => {
            const text = e.nativeEvent.text ?? '';
            emailRef.current = text;
            setEmailOrUsername(text);
          }}
          style={styles.input}
          placeholder="Email hoac username"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          value={password}
          onChangeText={(text) => {
            passwordRef.current = text;
            setPassword(text);
          }}
          onEndEditing={(e) => {
            const text = e.nativeEvent.text ?? '';
            passwordRef.current = text;
            setPassword(text);
          }}
          style={styles.input}
          placeholder="Mat khau"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password"
        />
        <Pressable
          style={styles.button}
          onPress={() => void login(emailRef.current.trim(), passwordRef.current)}
          disabled={authLoading}>
          <ThemedText style={styles.buttonText}>
            {authLoading ? 'Dang dang nhap...' : 'Dang nhap'}
          </ThemedText>
        </Pressable>
        {authError ? <ThemedText style={styles.error}>{authError}</ThemedText> : null}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">
          Xin chao {user?.fullName || user?.username || 'ban'}
        </ThemedText>
        <Pressable style={styles.button} onPress={() => void refreshNearby()}>
          <ThemedText style={styles.buttonText}>{loading ? 'Dang tai...' : 'Refresh nearby'}</ThemedText>
        </Pressable>
        <Pressable style={styles.manualPushButton} onPress={() => void pushCurrentLocation()}>
          <ThemedText style={styles.buttonText}>Gui vi tri hien tai</ThemedText>
        </Pressable>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <ThemedText style={styles.buttonText}>Dang xuat</ThemedText>
        </Pressable>
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      </View>

      <MapView style={styles.map} initialRegion={region} region={region} showsUserLocation={false}>
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />

        {myLocation ? (
          <Marker
            coordinate={{ latitude: myLocation.lat, longitude: myLocation.lng }}
            title="Vi tri cua toi"
            pinColor="#0B84FF"
          />
        ) : null}

        {nearbyUsers.map((user) => (
          <Marker
            key={user.userId}
            coordinate={{ latitude: user.lat, longitude: user.lng }}
            title={user.name || 'Nearby user'}
            description={user.lastSeenAt ? `Seen: ${user.lastSeenAt}` : undefined}
            pinColor={user.active ? '#22C55E' : '#A8A29E'}>
            {user.avatarUrl ? (
              <View
                collapsable={false}
                style={[styles.avatarMarkerWrap, user.active ? styles.avatarActive : styles.avatarInactive]}>
                <Image source={{ uri: user.avatarUrl }} style={styles.avatarMarkerImage} resizeMode="cover" />
              </View>
            ) : null}
          </Marker>
        ))}
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 52,
    paddingBottom: 8,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontSize: 13,
  },
  logoutButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#64748B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  manualPushButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#FFFFFF',
  },
  error: {
    color: '#DC2626',
  },
  map: {
    flex: 1,
  },
  avatarMarkerWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarActive: {
    borderColor: '#22C55E',
  },
  avatarInactive: {
    borderColor: '#A8A29E',
  },
  avatarMarkerImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
});

