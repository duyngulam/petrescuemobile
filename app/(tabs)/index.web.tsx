import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { useAuth } from '@/contexts/auth-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreenWeb() {
  const { token, user, loading: authLoading, error: authError, login, logout } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!token) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Đăng nhập</ThemedText>
        <TextInput
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
          style={styles.input}
          placeholder="Email hoặc username"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          style={styles.button}
          onPress={() => void login(emailOrUsername.trim(), password)}
          disabled={authLoading}>
          <ThemedText style={styles.buttonText}>
            {authLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </ThemedText>
        </Pressable>
        {authError ? <ThemedText style={styles.error}>{authError}</ThemedText> : null}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Geo map không hỗ trợ web</ThemedText>
      <ThemedText>Hi {user?.fullName || user?.username || 'bạn'}, hãy mở app trên Android/iOS.</ThemedText>
      <Pressable style={styles.logoutButton} onPress={logout}>
        <ThemedText style={styles.buttonText}>Đăng xuất</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#64748B',
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
});

