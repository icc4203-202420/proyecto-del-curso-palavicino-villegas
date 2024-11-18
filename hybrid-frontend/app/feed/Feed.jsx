import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Collapsible from 'react-native-collapsible';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NGROK_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import BeerReviewCard from '../beers/BeerReviewCard';
import EventImageCard from '../events/EventImageCard';
import { formatDistanceToNow } from 'date-fns';

const Feed = () => {
    const [friends, setFriends] = useState([]);
    const [pictureReviewsFeed, setPictureReviewsFeed] = useState([]);
    const [filteredFeed, setFilteredFeed] = useState([]);
    const [filterType, setFilterType] = useState(null);
    const [filterValue, setFilterValue] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(true); 
    const navigation = useNavigation();

    // Friends
    useEffect(() => {
        const fetchFriends = async () => {
            const userId = await SecureStore.getItemAsync('CURRENT_USER_ID');
            if (userId) {
                try {
                    const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}`);
                    setFriends(response.data.friends);
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
                const allPictures = picturesResponse.data.filter(picture =>
                    friends.some(friend => friend.id === picture.user_id)
                );

                const reviewsResponse = await axios.get(`${NGROK_URL}/api/v1/reviews`);
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

            <TouchableOpacity
                style={styles.collapseButton}
                onPress={() => setIsCollapsed(!isCollapsed)}
            >
                <Text style={styles.collapseButtonText}>
                    {isCollapsed ? 'Add Filter' : 'Hide Filter'}
                </Text>
            </TouchableOpacity>


            <Collapsible collapsed={isCollapsed}>
                <View style={styles.filterContainer}>
                    <SegmentedControl
                        values={['Friend', 'Bar', 'Country', 'Beer']}
                        selectedIndex={filterType ? ['friend', 'bar', 'country', 'beer'].indexOf(filterType) : -1}
                        onChange={(event) => {
                            const index = event.nativeEvent.selectedSegmentIndex;
                            const filters = ['friend', 'bar', 'country', 'beer'];
                            setFilterType(index >= 0 ? filters[index] : null);
                        }}
                        style={styles.segmentedControl}
                    />

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
            </Collapsible>

            <ScrollView>
                {filteredFeed.map((item, index) => {
                    const uniqueKey = `${item.id || index}-${item.type}`;

                    if (item.type === 'review') {
                        return (
                            <View key={uniqueKey} style={styles.feedItem}>
                                <View style={styles.chatBubble}>
                                    <Text style={styles.caption}>
                                        @{item.user?.handle || item.user?.first_name || 'unknown'} reviewed the beer "{item.beer?.name || 'unknown'}" {formatDistanceToNow(new Date(item.created_at))} ago.
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('BeersShow', { id: item.beer_id })}>
                                    <BeerReviewCard review={item} />
                                </TouchableOpacity>
                            </View>
                        );
                    } else if (item.type === 'picture') {
                        return (
                            <View key={uniqueKey} style={styles.feedItem}>
                                <View style={styles.chatBubble}>
                                    <Text style={styles.caption}>
                                        @{item.user?.handle || item.user?.first_name || 'unknown'} posted an image at the event "{item.event?.name || 'unknown'}" from the bar {item.event.bar?.name || 'unknown'} {formatDistanceToNow(new Date(item.created_at))} ago.
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('EventsShow', { id: item.event_id })}>
                                    <EventImageCard
                                        pictureUrl={item.url}
                                        pictureDescription={item.description}
                                        userFirstName={item.user.first_name}
                                        userLastName={item.user.last_name}
                                    />
                                </TouchableOpacity>
                            </View>
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
    collapseButton: {
        marginBottom: 10,
        backgroundColor: 'offwhite',
        padding: 10,
        borderRadius: 5,
    },
    collapseButtonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    filterContainer: {
        marginBottom: 20,
    },
    segmentedControl: {
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    feedItem: {
        marginBottom: 20,
    },
    caption: {
        fontSize: 14,
        color: 'black',
        marginBottom: 5,
    },
    chatBubble: {
        backgroundColor: 'white', 
        borderRadius: 10, 
        padding: 10, 
        marginBottom: 10, 
        alignSelf: 'flex-start', 
        maxWidth: '80%', 
        position: 'relative', 
    }
});

export default Feed;
