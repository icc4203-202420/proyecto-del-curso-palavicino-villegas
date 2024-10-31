import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Home
import Home from './app/Home';

// Auth
import Login from './app/Login';
import Signup from './app/Signup'; 
import Logout from './app/Logout'; 

// Beers
import BeersIndex from './app/beers/BeersIndex';
import BeersShow from './app/beers/BeersShow';

// Bars
import BarsIndex from './app/bars/BarsIndex';
import BarsShow from './app/bars/BarsShow';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={Home} />
        
        {/* Authentication views */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Logout" component={Logout} />
        
        {/* Beers views */}
        <Stack.Screen name="Beers" component={BeersIndex} />
        <Stack.Screen name="BeersShow" component={BeersShow} options={{ title: 'Beer Details' }} />
      
        {/* Bars views */}
        <Stack.Screen name="Bars" component={BarsIndex} />
        <Stack.Screen name="BarsShow" component={BarsShow} options={{ title: 'Bar Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}