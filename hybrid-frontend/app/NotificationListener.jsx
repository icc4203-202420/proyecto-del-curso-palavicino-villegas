import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

export default function NotificationListener() {
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { screen, event_id, picture_id } = response.notification.request.content.data;

      if (screen === 'EventsShow' && event_id) {
        navigation.navigate(screen, { id: event_id }); 
      } else if (screen === 'EventImageShow' && event_id && picture_id) {
        navigation.navigate(screen, { eventId: event_id, pictureId: picture_id }); 
      } else if (screen) {
        navigation.navigate(screen); 
      }
    });

    return () => subscription.remove();
  }, [navigation]);

  return <></>;
}