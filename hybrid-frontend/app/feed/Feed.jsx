import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NGROK_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import BeerReviewCard from '../beers/BeerReviewCard';
import EventImageCard from '../events/EventImageCard';

{/*
TO DO:
  - Navigate with picture/review card to the 'show view'
  - Sort by 'created_at' date
  - Add filters
  - Wrap the data in a single vertical scroll
*/}

const Feed = () => {
    const [friends, setFriends] = useState([]);
    const [friendsPictures, setFriendsPictures] = useState([]);
    const [friendsReviews, setFriendsReviews] = useState([]);
    const navigation = useNavigation();

    // Friends
    useEffect(() => {
        const fetchFriends = async () => {
            const userId = await SecureStore.getItemAsync('CURRENT_USER_ID');
            if (userId) {
                try {
                    const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}`);
                    setFriends(response.data.friends);
                    // console.log(response.data.friends);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                console.error('User ID not found');
            }
        };
        fetchFriends();
    }, []);

    // Pictures
    useEffect(() => {
        const fetchEventPictures = async () => {
            try {
                const response = await axios.get(`${NGROK_URL}/api/v1/event_pictures`);
                const allPictures = response.data.event_pictures;
                
                const filteredPictures = allPictures.filter(picture => 
                    friends.some(friend => friend.id === picture.user_id)
                );

                setFriendsPictures(filteredPictures);
                // console.log(filteredPictures);
            } catch (error) {
                console.error('Error fetching pictures data:', error);
            }
        };
        fetchEventPictures();
    }, [friends]);

    // Reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${NGROK_URL}/api/v1/reviews`);
                const allReviews = response.data.reviews;

                const filteredReviews = allReviews.filter(review => 
                    friends.some(friend => friend.id === review.user_id)
                );

                setFriendsReviews(filteredReviews);
                // console.log(filteredReviews);
            } catch (error) {
                console.error('Error fetching reviews data:', error);
            }
        };
        fetchReviews();
    }, [friends]);

    console.log(friendsPictures)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Feed</Text>

            <FlatList
                data={friendsReviews}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <BeerReviewCard review={item} />
                )}
            />

            <FlatList
                data={friendsPictures}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    // console.log(item.user.first_name);

                    return (
                        <EventImageCard
                            pictureUrl={item.url}
                            pictureDescription={item.description}
                            userFirstName={item.user.first_name}
                            userLastName={item.user.last_name}
                        />
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default Feed;
