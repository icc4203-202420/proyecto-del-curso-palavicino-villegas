import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/Home';
import Login from './app/Login';
import Signup from './app/Signup'; 
import Logout from './app/Logout'; 
import BeersIndex from './app/beers/BeersIndex';
import BeersShow from './app/beers/BeersShow';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Logout" component={Logout} />
        <Stack.Screen name="Beers" component={BeersIndex} />
        <Stack.Screen name="BeersShow" component={BeersShow} options={{ title: 'Beer Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}