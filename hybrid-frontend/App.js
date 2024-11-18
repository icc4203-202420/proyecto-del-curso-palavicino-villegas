import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WebSocketProvider } from './app/context/WebSocketContext';
import NotificationListener from './app/NotificationListener';

// CheckTokenStorage
import CheckTokenStorage from './app/CheckTokenStorage';

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

// Events
import EventsShow from './app/events/EventsShow';
import EventImageForm from './app/events/EventImageForm';
import EventImageShow from './app/events/EventImageShow';

// Social
import SocialIndex from './app/social/SocialIndex';
import SocialShow from './app/social/SocialShow';

// Feed
import Feed from './app/feed/Feed';

const Stack = createStackNavigator();

export default function App() {
    return (
        <WebSocketProvider>
            <NavigationContainer>
                <NotificationListener />
                <Stack.Navigator initialRouteName="CheckTokenStorage">
                    <Stack.Screen name="CheckTokenStorage" component={CheckTokenStorage} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Signup" component={Signup} />
                    <Stack.Screen name="Logout" component={Logout} />
                    <Stack.Screen name="Beers" component={BeersIndex} />
                    <Stack.Screen name="BeersShow" component={BeersShow} options={{ title: 'Beer Details' }} />
                    <Stack.Screen name="Bars" component={BarsIndex} />
                    <Stack.Screen name="BarsShow" component={BarsShow} options={{ title: 'Bar Details' }} />
                    <Stack.Screen name="EventsShow" component={EventsShow} options={{ title: 'Event Details' }} />
                    <Stack.Screen name="EventImageForm" component={EventImageForm} options={{ title: 'Upload Photo' }} />
                    <Stack.Screen name="EventImageShow" component={EventImageShow} options={{ title: 'Image Details' }} />
                    <Stack.Screen name="Social" component={SocialIndex} options={{ title: 'Social' }} />
                    <Stack.Screen name="SocialShow" component={SocialShow} options={{ title: 'User Details' }} />
                    <Stack.Screen name="Feed" component={Feed} />
                </Stack.Navigator>
            </NavigationContainer>
        </WebSocketProvider>
    );
}