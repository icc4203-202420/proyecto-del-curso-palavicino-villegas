import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useWebSocket } from '../context/WebSocketContext';

const Feed = () => {
    const { messages } = useWebSocket();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Feed</Text>
            <ScrollView style={styles.messageContainer}>
                {messages.map((msg, index) => {
                    if (msg.type === 'text') {
                        return (
                            <View key={index} style={styles.messageWrapper}>
                                <Text style={styles.message}>{msg.content}</Text>
                            </View>
                        );
                    } else if (msg.type === 'image') {
                        return (
                            <View key={index} style={styles.messageWrapper}>
                                <Text style={styles.message}>{msg.content.user} subió una foto al evento {msg.content.event}</Text>
                                <Image
                                    source={{ uri: msg.content.picture_url }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                                <Text style={styles.message}>{msg.content.description}</Text>
                            </View>
                        );
                    }
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    messageContainer: {
        flex: 1,
    },
    messageWrapper: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    message: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
});

export default Feed;