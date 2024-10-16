import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import BarsHomeCard from './bars/BarsHomeCard';
import BeersHomeCard from './beers/BeersHomeCard';
import SocialHomeCard from './social/SocialHomeCard';
import pintpalLogo from '../assets/pintpal-logo.png';

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PintPal</Text>
        <Image source={pintpalLogo} style={styles.logo} />
      </View>

      {/* Cards Section */}
      <View style={styles.cardsContainer}>
        <BarsHomeCard />
        <BeersHomeCard />
        <SocialHomeCard />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginRight: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  cardsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default Home;