import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/Home';
import Login from './app/Login';
import BarsHomeCard from './app/bars/BarsHomeCard';
import BeersHomeCard from './app/beers/BeersHomeCard';
import SocialHomeCard from './app/social/SocialHomeCard';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Bars" component={BarsHomeCard} />
        <Stack.Screen name="Beers" component={BeersHomeCard} />
        <Stack.Screen name="Social" component={SocialHomeCard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}