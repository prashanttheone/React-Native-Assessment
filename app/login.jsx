import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Snackbar } from 'react-native-paper';

export default function LoginScreen() {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('pistol');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (token) router.replace('/index');
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setSnackbar({ visible: true, message: 'All fields are required' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        router.replace('/home');
      } else {
        setSnackbar({ visible: true, message: data.error || 'Login failed' });
      }
    } catch (error) {
      setSnackbar({ visible: true, message: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/*  Image */}
      <Image
        source={{ uri: 'https://es-tracker.skyquake.in/images/login-img-1.jpg' }}
        style={styles.topImage}
      />
          {/* Heading */}
      <Text style={styles.title}>Login</Text>

      {/* Email */}
      <TextInput
        placeholder="Email ID"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password with  Icon */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginVertical: 10 }} />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.dividerText}>OR</Text>

      {/* Google Login UI*/}
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={{ uri: 'https://img.icons8.com/?size=256&id=V5cGWnc9R4xj&format=png' }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Login with Google</Text>
      </TouchableOpacity>

      {/* Register Text */}
      <Text style={styles.registerText}>
        New to here? <Text style={styles.linkText}>Register</Text>
      </Text>

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  topImage: {
    width: 250,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 12,
  },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  passwordInput: { flex: 1, fontSize: 16 },
  loginButton: {
    width: '100%',
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dividerText: { marginVertical: 10, color: '#555' },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleText: { fontSize: 16 },
  registerText: { marginTop: 20, fontSize: 14 },
  linkText: { color: '#007BFF', fontWeight: '600' },
});
