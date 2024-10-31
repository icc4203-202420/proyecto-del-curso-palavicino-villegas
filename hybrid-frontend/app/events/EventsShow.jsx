import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { NGROK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import barsHomeImage from '../../assets/bars_home.png';

const EventsShow = () => {
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [eventPictures, setEventPictures] = useState([]);
  const [checkingIn, setCheckingIn] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const userId = AsyncStorage.getItem('CURRENT_USER_ID');

  useEffect(() => {
    axios.get(`${NGROK_URL}/api/v1/events/${id}`)
      .then(response => {
        setEvent(response.data);
        setUsers(response.data.users);
        setEventPictures(response.data.event_pictures);
      })
      .catch(error => {
        console.error('Error fetching event:', error);
      });
  }, [id]);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const userId = await AsyncStorage.getItem('CURRENT_USER_ID');
      await axios.post(`${NGROK_URL}/api/v1/attendances`, {
        user_id: parseInt(userId, 10),
        event_id: id,
      });
      Alert.alert('Checked-in', 'You have succesfully checked-in for this event.');
    } catch (error) {
      console.error('Error checking in:', error);
      Alert.alert('Error', 'You are already registered for this event.');
    } finally {
      setCheckingIn(false);
    }
  };
  

  if (!event) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Image source={barsHomeImage} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.hostedBy}>Hosted by {event.bar.name}</Text>
        <Text style={styles.date}>
          {new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Botón de Check-In y lista de usuarios */}
      <View style={styles.checkInContainer}>
        <FlatList
          horizontal
          data={users}
          renderItem={({ item }) => (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.first_name[0]}</Text>
            </View>
          )}
          keyExtractor={(user) => user.id.toString()}
        />
        <TouchableOpacity 
          style={styles.checkInButton} 
          onPress={handleCheckIn} 
          disabled={checkingIn}
        >
          {checkingIn ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.checkInText}>Check-In</Text>}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>About Event</Text>
      <Text style={styles.eventDescription}>{event.description}</Text>

      <Text style={styles.sectionTitle}>Location</Text>
      <Text style={styles.location}>
        {event.bar.address.line1}{"\n"}
        {event.bar.address.line2}, {event.bar.address.city}
      </Text>

      <Text style={styles.sectionTitle}>Photos</Text>
      <FlatList
        data={eventPictures}
        renderItem={({ item }) => (
          <Image source={{ uri: item.picture.url }} style={styles.eventImage} />
        )}
        keyExtractor={(item) => item.picture.id.toString()}
        horizontal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backText: { fontSize: 18, color: 'black' },
  title: { fontSize: 20, fontWeight: 'bold' },
  image: { width: '100%', height: 200, borderRadius: 16, marginTop: 16 },
  detailsContainer: { marginVertical: 16 },
  hostedBy: { fontSize: 16, color: 'gray' },
  date: { fontSize: 14, color: 'gray', marginTop: 8 },
  checkInContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 },
  avatar: { backgroundColor: 'lightgray', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontWeight: 'bold' },
  checkInButton: { backgroundColor: '#333', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5 },
  checkInText: { color: 'white', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  eventDescription: { color: 'gray', marginTop: 5 },
  location: { color: 'gray', marginTop: 5 },
  eventImage: { width: 100, height: 100, borderRadius: 8, marginRight: 8 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default EventsShow;
