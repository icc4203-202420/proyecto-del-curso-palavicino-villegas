import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

export default function NotificationListener() {
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { screen } = response.notification.request.content.data;
      if (screen) {
        navigation.navigate(screen); 
      }
    });

    return () => subscription.remove();
  }, [navigation]);

  return <></>;
}
