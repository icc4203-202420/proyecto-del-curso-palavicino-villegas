import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('http://192.168.1.89:3001/api/v1/countries')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const handleSubmit = () => {
    axios.post('http://192.168.1.89:3001/api/v1/signup', {
      user: {
        first_name: firstName,
        last_name: lastName,
        email,
        handle,
        password,
        country: selectedCountry,
        line1,
        line2,
        city,
      },
    })
      .then(response => {
        const JWT_TOKEN = response.headers['authorization'];
        const CURRENT_USER_ID = response.data.data.id;

        if (JWT_TOKEN) {
          AsyncStorage.setItem('JWT_TOKEN', JWT_TOKEN);
        }

        if (CURRENT_USER_ID) {
          AsyncStorage.setItem('CURRENT_USER_ID', CURRENT_USER_ID.toString());
        }

        Alert.alert('Signup Successful!');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Error during signup:', error);
        Alert.alert('Error during signup', 'Please check your information.');
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Handle"
        value={handle}
        onChangeText={setHandle}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.optionalTitle}>Optional Address Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Line 1"
        value={line1}
        onChangeText={setLine1}
      />
      <TextInput
        style={styles.input}
        placeholder="Line 2"
        value={line2}
        onChangeText={setLine2}
      />
      <TextInput
        style={styles.city_input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      <Picker
        selectedValue={selectedCountry}
        onValueChange={(itemValue) => setSelectedCountry(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Country" value="" />
        {countries.map(country => (
          <Picker.Item key={country.id} label={country.name} value={country.id} />
        ))}
      </Picker>

      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSubmit} color="#FF8603" />
      </View>

      <Text style={styles.signInText}>
        Already have an account?{' '}
        <Text style={styles.signInLink} onPress={() => navigation.navigate('Login')}>
          Sign In
        </Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
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
  city_input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 0,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 0, 
    fontSize: 12, 
  },  
  optionalTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: 'gray',
  },
  buttonContainer: {
    marginTop: 250, 
    marginBottom: 10, 
  },
  signInText: {
    textAlign: 'center',
    marginTop: 15,
    color: 'gray',
  },
  signInLink: {
    color: 'blue',
  },
});

export default Signup;