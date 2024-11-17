import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useActionCable from '../hooks/useActionCable';
import useChannel from '../hooks/useChannel';

const Feed = () => {
  const [message, setMessage] = useState(null);
  const { actionCable } = useActionCable('ws://10.0.0.33:3001/cable'); // Cambia la URL si es necesario
  const { subscribe, unsubscribe } = useChannel(actionCable);

  useEffect(() => {
    subscribe({ channel: 'FeedChannel', user_id: 16 }, {
      received: (data) => {
        console.log('Mensaje recibido en FeedChannel:', data);
        setMessage(data.message);
      },
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <Text style={styles.noUpdates}>No hay actualizaciones en tu feed.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  noUpdates: {
    fontSize: 16,
    color: 'gray',
  },
});

export default Feed;
