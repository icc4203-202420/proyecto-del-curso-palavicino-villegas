import React, { createContext, useState, useEffect, useContext } from 'react';

const WebSocketContext = createContext();

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const websocket = new WebSocket('ws://192.168.1.83:3001/cable'); // Cambia la IP según tu entorno

        websocket.onopen = () => {
            console.log('Connected to FeedChannel');
            const msg = {
                command: 'subscribe',
                identifier: JSON.stringify({ channel: 'FeedChannel' }),
            };
            websocket.send(JSON.stringify(msg));
        };

        websocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log('Mensaje recibido desde WebSocket:', data);

            if (data.type === 'welcome' || data.type === 'ping' || data.type === 'confirm_subscription') {
                return;
            }

            if (data.message) {
                handleMessage(data.message);
            }
        };

        websocket.onerror = (e) => {
            console.error('WebSocket Error:', e.message);
        };

        websocket.onclose = (e) => {
            console.log('WebSocket Connection Closed:', e.code, e.reason);
        };

        setWs(websocket);

        return () => {
            websocket.close();
        };
    }, []);

    const handleMessage = (message) => {
        if (message.review) {
            const { review } = message;
            const formattedMessage = `🍺 ${review.user.first_name} ${review.user.last_name} (@${review.user.handle}) comentó sobre "${review.beer.name}" (${review.beer.style}, ${review.beer.alcohol}%):
            "${review.text}" - Calificación: ${review.rating}/5`;
            setMessages((prevMessages) => [...prevMessages, { type: 'text', content: formattedMessage }]);
        } else if (message.type === 'new_event_picture' && message.data) {
            const { data } = message;
            const formattedMessage = {
                type: 'image',
                content: {
                    description: data.description,
                    picture_url: data.picture_url,
                    event: data.event.name,
                    user: data.user.handle,
                },
            };
            setMessages((prevMessages) => [...prevMessages, formattedMessage]);
        } else {
            console.warn('Mensaje desconocido recibido:', message);
        }
    };

    const sendMessage = (message) => {
        if (ws) {
            const msg = {
                command: 'message',
                identifier: JSON.stringify({ channel: 'FeedChannel' }),
                data: JSON.stringify({ action: 'speak', message }),
            };
            ws.send(JSON.stringify(msg));
        } else {
            console.error('WebSocket not connected');
        }
    };

    return (
        <WebSocketContext.Provider value={{ messages, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};