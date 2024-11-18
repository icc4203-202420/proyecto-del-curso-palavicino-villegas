import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NGROK_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import BeerReviewCard from '../beers/BeerReviewCard';
import EventImageCard from '../events/EventImageCard';

const Feed = () => {
    const [friends, setFriends] = useState([]);
    const [pictureReviewsFeed, setPictureReviewsFeed] = useState([]);
    const [filteredFeed, setFilteredFeed] = useState([]);
    const [filterType, setFilterType] = useState(null);
    const [filterValue, setFilterValue] = useState('');
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
                const picturesResponse = await axios.get(`${NGROK_URL}/api/v1/event_pictures`);
                // console.log(picturesResponse.data);
                const allPictures = picturesResponse.data.filter(picture =>
                    friends.some(friend => friend.id === picture.user_id)
                );

                const reviewsResponse = await axios.get(`${NGROK_URL}/api/v1/reviews`);
                // console.log(reviewsResponse.data.reviews);

                const allReviews = reviewsResponse.data.reviews.filter(review =>
                    friends.some(friend => friend.id === review.user_id)
                );

                const friendsPictures = allPictures.map(picture => ({
                    ...picture,
                    type: 'picture',
                }));

                const friendsReviews = allReviews.map(review => ({
                    ...review,
                    type: 'review',
                }));

                const combinedSort = [...friendsPictures, ...friendsReviews].sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );

                setPictureReviewsFeed(combinedSort);
                setFilteredFeed(combinedSort);
            } catch (error) {
                console.error('Error fetching feed data:', error);
            }
        };

        fetchPictureReviewsFeed();
    }, [friends]);

    // Filter feed
    useEffect(() => {
        if (!filterType || !filterValue) {
            setFilteredFeed(pictureReviewsFeed);
            return;
        }
    
        const filtered = pictureReviewsFeed.filter(item => {
            const searchValue = filterValue.toLowerCase();
            console.log(item);
            if (filterType === 'friend') {
                const user = item.user;
                return (
                    user?.handle?.toLowerCase().includes(searchValue) ||
                    user?.first_name?.toLowerCase().includes(searchValue) ||
                    user?.last_name?.toLowerCase().includes(searchValue)
                );
            } else if (filterType === 'bar') {
                return item.type === 'picture' && item.event.bar.name?.toLowerCase().includes(searchValue);
            } else if (filterType === 'country') {
                return item.type === 'picture' && item.event.bar.address.country.name?.toLowerCase().includes(searchValue);
            } else if (filterType === 'beer') {
                return item.type === 'review' && item.beer?.name?.toLowerCase().includes(searchValue);
            }
    
            return true;
        });
    
        setFilteredFeed(filtered);
    }, [filterType, filterValue, pictureReviewsFeed]);
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Feed</Text>

            <View style={styles.filterContainer}>
                <Picker
                    selectedValue={filterType}
                    onValueChange={(value) => setFilterType(value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select Filter" value={null} />
                    <Picker.Item label="Friend" value="friend" />
                    <Picker.Item label="Bar" value="bar" />
                    <Picker.Item label="Country" value="country" />
                    <Picker.Item label="Beer" value="beer" />
                </Picker>

                {filterType && (
                    <TextInput
                        style={styles.input}
                        placeholder={`Enter ${filterType}`}
                        value={filterValue}
                        onChangeText={setFilterValue}
                    />
                )}

                <Button
                    title="Clear Filter"
                    onPress={() => {
                        setFilterType(null);
                        setFilterValue('');
                    }}
                />
            </View>

            <ScrollView>
                {filteredFeed.map((item) => {
                    if (item.type === 'review') {
                        return (
                            <TouchableOpacity key={item.id} onPress={() => navigation.navigate('BeersShow', { id: item.beer_id })}>
                                <BeerReviewCard review={item} />
                            </TouchableOpacity>
                        );
                    } else if (item.type === 'picture') {
                        return (
                            <TouchableOpacity key={item.id} onPress={() => navigation.navigate('EventsShow', { id: item.event_id })}>
                                <EventImageCard
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
    filterContainer: {
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
});

export default Feed;
