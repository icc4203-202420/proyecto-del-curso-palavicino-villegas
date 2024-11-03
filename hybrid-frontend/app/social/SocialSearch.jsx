import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import SocialSearchCard from './SocialSearchCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NGROK_URL } from '@env';

const SocialSearch = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedUserId = await AsyncStorage.getItem('CURRENT_USER_ID');
      if (storedUserId) {
        setCurrentUserId(storedUserId);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      setLoading(true);
      axios.get(`${NGROK_URL}/api/v1/users`)
        .then(response => {
          const filteredUsers = response.data.users.filter(user => user.id !== parseInt(currentUserId));
          setUsers(filteredUsers);
        })
        .catch(error => {
          console.error('Error al obtener los usuarios:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentUserId]);

  const filteredUsers = searchText.trim() === '' ? [] : users.filter(user =>
    user.handle.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search ..."
        value={searchText}
        onChangeText={setSearchText}
      />
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('SocialShow', { id: item.id })}>
              <SocialSearchCard user={item} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noResultsText}>No users found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  noResultsText: {
    textAlign: 'center',
    color: 'gray',
  },
});

export default SocialSearch;
