import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { NGROK_URL } from '@env';

export default function EventImageShow() {
  const route = useRoute();
  const { pictureId, eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [showedPicture, setShowedPicture] = useState(null);
  const [pictures, setPictures] = useState([]);

  const fetchEventData = useCallback(() => {
    axios.get(`${NGROK_URL}/api/v1/events/${eventId}`)
      .then(response => {
        setEvent(response.data);
        setPictures(response.data.event_pictures);
        
        // Buscar la imagen con el pictureId especificado
        const foundPicture = response.data.event_pictures.find(picture => picture.id === pictureId);
        setShowedPicture(foundPicture);
      })
      .catch(error => {
        console.error('Error fetching event:', error);
      });
  }, [eventId, pictureId]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  if (!showedPicture || !event) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: showedPicture.picture.url }} style={styles.image} />
      <Text style={styles.description}>{showedPicture.description}</Text>
      <Text style={styles.user}>{showedPicture.user.first_name} {showedPicture.user.last_name}</Text>
      <Text style={styles.eventName}>Event: {event.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  image: { width: '100%', height: 300, resizeMode: 'cover', borderRadius: 8 },
  description: { fontSize: 16, color: 'gray', marginTop: 10 },
  user: { fontSize: 14, color: 'black', marginTop: 5 },
  eventName: { fontSize: 14, color: 'blue', marginTop: 10 },
});
