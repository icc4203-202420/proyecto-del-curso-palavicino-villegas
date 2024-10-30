import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import BeerReviewCard from './BeerReviewCard';
import BeerReviewForm from './BeerReviewForm';
import beersHomeImage from '../../assets/beers_home.png';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper'; 
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NGROK_URL } from '@env';

function userReviewsFirst(reviews, currentUserId) {
  const userReviews = reviews.filter(review => review.user_id === parseInt(currentUserId));
  const otherReviews = reviews.filter(review => review.user_id !== parseInt(currentUserId));
  return [...userReviews, ...otherReviews];
}

const initialState = {
  reviews: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REVIEWS_SUCCESS':
      const orderedReviews = userReviewsFirst(action.payload.reviews, action.payload.currentUserId); 
      return { ...state, reviews: orderedReviews, loading: false };
    case 'FETCH_REVIEWS_ERROR':
      return { ...state, error: action.error, loading: false };
    case 'ADD_REVIEW_SUCCESS':
      return { ...state, reviews: [action.payload, ...state.reviews], loading: false };
    default:
      return state;
  }
}

const BeersShow = ({ route }) => {
  const { id } = route.params;
  const [beer, setBeer] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [openReviewForm, setopenReviewForm] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get(`${NGROK_URL}/api/v1/beers/${id}`)  // Cambiar IP Local: 192.168.1.30
      .then(response => setBeer(response.data.beer))
      .catch(error => console.error(error));

    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    const userId = await AsyncStorage.getItem('CURRENT_USER_ID');
    axios.get(`${NGROK_URL}/api/v1/beers/${id}/reviews`)  // Cambiar IP Local: 192.168.1.30
      .then(response => {
        dispatch({ 
          type: 'FETCH_REVIEWS_SUCCESS', 
          payload: { reviews: response.data.reviews || [], currentUserId: userId } 
        });
      })
      .catch(error => dispatch({ type: 'FETCH_REVIEWS_ERROR', error: error.message }));
  };

  const handleReviewSubmit = async (values) => {
    const review = {
      text: values.text,
      rating: values.rating,
      beer_id: beer.id,
    };

    const userId = await AsyncStorage.getItem('CURRENT_USER_ID');
    if (userId) {
      await axios.post(`${NGROK_URL}/api/v1/beers/${beer.id}/reviews`, { // Cambiar IP Local: 192.168.1.30
        review, 
        user_id: userId 
      });
      fetchReviews(); 
    }
  };

  if (!beer) return <ActivityIndicator size="large" style={styles.loader} />;

  const renderReview = ({ item }) => (
    <BeerReviewCard review={item} />
  );

  return (
    
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{beer.name}</Text>
        </View>

        <Image source={beersHomeImage} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{beer.name} ({beer.style})</Text>
          <Text style={styles.detailText}><Text style={styles.boldText}>Alcohol: </Text>{beer.alcohol}</Text>
          <Text style={styles.detailText}><Text style={styles.boldText}>Bitterness (IBU): </Text>{beer.ibu}</Text>
          <Text style={styles.detailText}><Text style={styles.boldText}>Produced by: </Text>{beer.brewery_name}</Text>

          <View style={styles.ratingContainer}>
          <Rating
            type='custom'
            imageSize={25} 
            readonly
            startingValue={beer.avg_rating}
            fractions={1} 
            ratingColor="#FFD700" 
            tintColor="#f5f5f5" 
          />
            <Text style={styles.ratingText}>
              {parseFloat(beer.avg_rating).toFixed(2)}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>You can find it at:</Text>
          {beer.bar_names && beer.bar_names.length > 0 ? (
            beer.bar_names.map((barName, index) => (
              <Text key={index} style={styles.barName}>{barName}</Text>
            ))
          ) : (
            <Text style={styles.detailText}>No bars found.</Text>
          )}
        </View>

        <Divider style={{ marginVertical: 0 }} />

        <Button 
          title="Write a Review" 
          onPress={() => setopenReviewForm(true)} 
          color="#1E90FF" 
        />

        <BeerReviewForm
          beer={beer}
          visible={openReviewForm}
          onClose={() => setopenReviewForm(false)}
          onSubmit={handleReviewSubmit}
        />
           
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewsTitle}>Reviews</Text>
          {state.loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={state.reviews}
              keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
              renderItem={renderReview}
              ListEmptyComponent={<Text style={styles.noReviews}>No reviews found.</Text>}
              initialNumToRender={5}  
            />
          )}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
    color: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  barName: {
    fontSize: 16,
    color: 'gray',
  },
  noReviews: {
    textAlign: 'center',
    marginTop: 10,
    color: 'gray',
    fontSize: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
});

export default BeersShow;