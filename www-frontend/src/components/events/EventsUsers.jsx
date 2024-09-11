import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CircularProgress, Box, Card, CardContent, Avatar, Typography } from '@mui/material';

export default function EventsUsers() {
    const { id } = useParams();
    const [users, setUsers] = useState(undefined);
    const [event, setEvent] = useState(undefined);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/v1/events/${id}`)
            .then(response => {
                setEvent(response.data);
                setUsers(response.data.users);
            });
    }, [id]);

    if (!users) {
        return <CircularProgress />;
    }

    console.log(users)

    return (
        <Box>
            <h1 style={{color:'black'}}>{event.name}</h1>
            {users.map(user => (
                <Card key={user.handle} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2 }}>
                    <Avatar alt={`${user.first_name} ${user.last_name}`} sx={{ mr: 2 }}>
                        {user.first_name[0]}
                    </Avatar>
                    <CardContent>
                        <Typography variant="h6">{`${user.first_name} ${user.last_name}`}</Typography>
                        <Typography variant="body2" color="textSecondary">{user.handle}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
