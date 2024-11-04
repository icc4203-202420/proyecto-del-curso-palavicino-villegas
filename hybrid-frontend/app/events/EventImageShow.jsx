import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { NGROK_URL } from '@env';

export default function EventImageShow() {
  const route = useRoute();
  const { pictureId, eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [showedPicture, setShowedPicture] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [taggedFriends, setTaggedFriends] = useState([]);

  const fetchEventData = useCallback(() => {
    axios.get(`${NGROK_URL}/api/v1/events/${eventId}`)
      .then(response => {
        setEvent(response.data);
        // console.log(response.data);
        setPictures(response.data.event_pictures);
        
        const foundPicture = response.data.event_pictures.find(picture => picture.id === pictureId);
        setShowedPicture(foundPicture);
      })
      .catch(error => {
        console.error('Error fetching event:', error);
      });
  }, [eventId, pictureId]);

  const fetchTaggedFriends = useCallback(() => {
    axios.get(`${NGROK_URL}/api/v1/event_pictures/${pictureId}`)
      .then(response => {
        setTaggedFriends(response.data.tagged_friends); // Actualiza el estado con los amigos etiquetados
      })
      .catch(error => {
        console.error('Error fetching tagged_friends:', error);
      });
  }, [pictureId]);

  useEffect(() => {
    fetchEventData();
    fetchTaggedFriends();
  }, [fetchEventData, fetchTaggedFriends]);

  if (!showedPicture || !event) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b5998" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {showedPicture.user.first_name[0].toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.userName}>{showedPicture.user.first_name} {showedPicture.user.last_name}</Text>
        </View>
      </View>
      <Image source={{ uri: showedPicture.picture.url }} style={styles.image} />
      <View style={styles.footer}>
        <Text style={styles.description}>{showedPicture.description}</Text>
      </View>
      {taggedFriends.length > 0 && (
        <View style={styles.taggedFriendsContainer}>
          {taggedFriends.map(friend => (
            <View key={friend.id} style={styles.taggedFriend}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarTextSmall}>
                  {friend.first_name[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.friendName}>{friend.first_name}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#fff', 
    paddingBottom: 20 
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b5998',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  image: { 
    width: '100%', 
    height: 400, 
    resizeMode: 'cover',
    borderRadius: 8,
    marginVertical: 10,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 8,
  },
  taggedFriendsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  taggedFriend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3b5998',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarTextSmall: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendName: {
    fontSize: 14,
    color: '#333',
  },
});
