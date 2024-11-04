import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { NGROK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import barsHomeImage from '../../assets/bars_home.png';
import EventImageCard from './EventImageCard';

const EventsShow = () => {
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [eventPictures, setEventPictures] = useState([]);
  const [checkingIn, setCheckingIn] = useState(false);
  const route = useRoute();
  const { id } = route.params;

  const fetchEventData = () => {
    axios.get(`${NGROK_URL}/api/v1/events/${id}`)
      .then(response => {
        setEvent(response.data);
        setUsers(response.data.users);
        setEventPictures(response.data.event_pictures);
      })
      .catch(error => {
        console.error('Error fetching event:', error);
      });
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const userId = await AsyncStorage.getItem('CURRENT_USER_ID');
      await axios.post(`${NGROK_URL}/api/v1/attendances`, {
        user_id: parseInt(userId, 10),
        event_id: id,
      });
      Alert.alert('Checked-in', 'You have successfully checked in for this event.');
    } catch (error) {
      console.error('Error checking in:', error);
      Alert.alert('Error', 'You are already registered for this event.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleAddPhoto = async () => {
    const userId = await AsyncStorage.getItem('CURRENT_USER_ID');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split('/').pop();
      const fileExtension = fileName.split('.').pop();

      const mimeTypes = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        heic: "image/heic",
      };
      const mimeType = mimeTypes[fileExtension] || "image/png";

      const formData = new FormData();
      formData.append("event_picture[event_id]", id);
      formData.append("event_picture[user_id]", parseInt(userId, 10));
      formData.append("event_picture[description]", "Event photo description");
      formData.append("event_picture[tagged_friends]", []);
      formData.append("event_picture[picture]", {
        uri,
        type: mimeType,
        name: fileName,
      });

      axios.post(`${NGROK_URL}/api/v1/events/${id}/event_pictures`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(() => {
        Alert.alert('Photo Uploaded', 'The photo has been successfully uploaded.');
        fetchEventData(); 
      })
      .catch(error => {
        console.error('Error uploading photo:', error);
        Alert.alert('Error', 'Failed to upload photo.');
      });
    }
  };

  if (!event) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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

      <View style={styles.photosHeader}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <TouchableOpacity onPress={handleAddPhoto}>
          <Text style={styles.addPhotoText}>+</Text>
        </TouchableOpacity>
      </View>

      <View>
        <FlatList
          data={eventPictures}
          renderItem={({ item }) => (
            <EventImageCard pictureUrl={item.picture.url} pictureDescription={item.description} userFirstName={item.user.first_name} userLastName={item.user.last_name} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 16 },
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
  photosHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 },
  addPhotoText: { fontSize: 24, color: 'blue', marginLeft: 8 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default EventsShow;