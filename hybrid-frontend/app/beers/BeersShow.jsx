import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import BeerReviewCard from './BeerReviewCard';
import BeerReviewForm from './BeerReviewForm';
import beersHomeImage from '../../assets/beers_home.png';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper'; 

const initialState = {
  reviews: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REVIEWS_SUCCESS':
      return { ...state, reviews: action.payload, loading: false };
    case 'FETCH_REVIEWS_ERROR':
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
}

const BeersShow = ({ route }) => {
  const { id } = route.params;
  const [beer, setBeer] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [formVisible, setFormVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get(`http://192.168.1.89:3001/api/v1/beers/${id}`)
      .then(response => setBeer(response.data.beer))
      .catch(error => console.error(error));

    axios.get(`http://192.168.1.89:3001/api/v1/beers/${id}/reviews`)
      .then(response => dispatch({ type: 'FETCH_REVIEWS_SUCCESS', payload: response.data.reviews }))
      .catch(error => dispatch({ type: 'FETCH_REVIEWS_ERROR', error: error.message }));
  }, [id]);

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

        <Text style={styles.sectionTitle}>You can find it at:</Text>
        {beer.bar_names && beer.bar_names.length > 0 ? (
          beer.bar_names.map((barName, index) => (
            <Text key={index} style={styles.barName}>{barName}</Text>
          ))
        ) : (
          <Text style={styles.detailText}>No bars found.</Text>
        )}
      </View>

      <Divider style={{ marginVertical: 10 }} />

      {/* Botón para escribir reseña */}
      <Button 
        title="Write a Review" 
        onPress={() => setFormVisible(true)} 
        color="#1E90FF" 
      />

      {/* Formulario de reseña */}
      <BeerReviewForm
        beer={beer}
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSubmit={(review) => dispatch({ type: 'FETCH_REVIEWS_SUCCESS', payload: [...state.reviews, review] })}
      />

      {/* Lista de reseñas */}
      <FlatList
        data={state.reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReview}
        ListEmptyComponent={<Text style={styles.noReviews}>No reviews found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    height: 200,
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
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BeersShow;