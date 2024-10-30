import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import pintpalLogo from '../assets/pintpal-logo.png'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { NGROK_URL } from '@env';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = () => {
    axios.post(`${NGROK_URL}/api/v1/login`, { user: { email, password } })  // Cambiar IP Local: 192.168.1.30
      .then(response => {
        const JWT_TOKEN = response.headers['authorization'];
        const CURRENT_USER_ID = response.data.status.data.user.id;

        if (JWT_TOKEN) {
          AsyncStorage.setItem('JWT_TOKEN', JWT_TOKEN);
        }

        if (CURRENT_USER_ID) {
          AsyncStorage.setItem('CURRENT_USER_ID', CURRENT_USER_ID.toString());
        }

        Alert.alert('Login Successful!');
        navigation.navigate('Home'); 
      })
      .catch(error => {
        console.error('Error logging in:', error);
        Alert.alert('Error de inicio de sesión', 'Verifica tus credenciales.');
      });
  };

  return (
    <View style={styles.container}>
      <Image source={pintpalLogo} style={styles.logo} />
      <Text style={styles.title}>PintPal</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={showPassword ? "Hide Password" : "Show Password"}
        onPress={() => setShowPassword(!showPassword)}
        color="gray"
      />

      <Button
        title="Sign In"
        onPress={handleSubmit}
        color="#FF8603"
      />

      <Text style={styles.signupLink}>
        Don't have an account?{' '}
        <Text style={styles.linkText} onPress={() => navigation.navigate('Signup')}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  signupLink: {
    textAlign: 'center',
    marginTop: 10,
    color: 'gray',
  },
  linkText: {
    color: '#FF8603',
    fontWeight: 'bold',
  },
});

export default Login;