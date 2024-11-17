import React from 'react';
import { Card } from 'react-native-elements';
import { Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FeedHomeCard = ({ userId }) => {
  console.log("userId en FeedHomeCard:", userId);
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Feed', { userId })}>
      <Card containerStyle={styles.card}>
        <Text style={styles.title}>Feed</Text>
      </Card>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  card: {
    width: 320,
    borderRadius: 10,
    marginBottom: 15,
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default FeedHomeCard;