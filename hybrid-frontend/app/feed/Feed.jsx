import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NGROK_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import BeerReviewCard from '../beers/BeerReviewCard';
import EventImageCard from '../events/EventImageCard';

{/*
TO DO:
  - Navigate with picture/review card to the 'show view'
  - Add filters
*/}

const Feed = () => {
    const [friends, setFriends] = useState([]);
    const [pictureReviewsFeed, setpictureReviewsFeed] = useState([]);
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

    // Pictures and Reviews
    useEffect(() => {
        const fetchPictureReviewsFeed = async () => {
            try {
                // Pictures
                const picturesResponse = await axios.get(`${NGROK_URL}/api/v1/event_pictures`);
                const allPictures = picturesResponse.data.event_pictures.filter(picture =>
                    friends.some(friend => friend.id === picture.user_id)
                );

                // Reviews
                const reviewsResponse = await axios.get(`${NGROK_URL}/api/v1/reviews`);
                const allReviews = reviewsResponse.data.reviews.filter(review =>
                    friends.some(friend => friend.id === review.user_id)
                );

                // usefull for each card component (BeerReviewCard or EventImageCard)
                const friendsPictures = allPictures.map(picture => ({
                    ...picture,
                    type: 'picture',
                }));

                const friendsReviews = allReviews.map(review => ({
                    ...review,
                    type: 'review',
                }));

                // sort by created_at (pictures and reviews)
                const combinedSort = [...friendsPictures, ...friendsReviews].sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );

                setpictureReviewsFeed(combinedSort);
            } catch (error) {
                console.error('Error fetching feed data:', error);
            }
        };

        fetchPictureReviewsFeed();

    }, [friends]);

    return (
        <View style={styles.container}>
            <ScrollView>
                {pictureReviewsFeed.map((item) => {
                    if (item.type === 'review') {
                        return (
                            <TouchableOpacity key={item.id} onPress={() => navigation.navigate('BeersShow', { id: item.beer_id })}>
                                <BeerReviewCard review={item} />
                            </TouchableOpacity>
                        );                        

                    } else if (item.type === 'picture') {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate('EventsShow', { id: item.event_id })}>
                                <EventImageCard
                                    key={item.id}
                                    pictureUrl={item.url}
                                    pictureDescription={item.description}
                                    userFirstName={item.user.first_name}
                                    userLastName={item.user.last_name}
                                />
                            </TouchableOpacity>
                        );
                    }
                    return null;
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default Feed;
