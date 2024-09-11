import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IconButton, CircularProgress, Box, Card, CardContent, Avatar, Typography, AvatarGroup } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function EventsUsers() {
    const { id } = useParams();
    const [users, setUsers] = useState(undefined);
    const [event, setEvent] = useState(undefined);

    const handleBackClick = () => {
        window.history.back();
    };

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

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <IconButton onClick={handleBackClick}>
                    <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem' }} />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                    {event?.name || 'Event'}
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <AvatarGroup
                    max={5}
                    sx={{
                        '& .MuiAvatarGroup-avatar': {
                            width: 40,
                            height: 40,
                            fontSize: '1rem'
                        },
                        '& .MuiAvatarGroup-count': {
                            width: 40,
                            height: 40,
                            fontSize: '1rem'
                        }
                    }}
                >
                    {users.map(user => (
                        <Avatar key={user.id} alt={user.name}>
                            {user.first_name[0]}
                        </Avatar>
                    ))}
                </AvatarGroup>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {`${users.length} users registered for this event.`}
                </Typography>
            </Box>

            <Box>
                {users.map(user => (
                    <Card key={user.handle} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2 }}>
                        <Avatar alt={`${user.first_name} ${user.last_name}`} sx={{ width: 40, height: 40, mr: 2 }}>
                            {user.first_name[0]}
                        </Avatar>
                        <CardContent sx={{ padding: '0 16px' }}>
                            <Typography variant="h6">{`${user.first_name} ${user.last_name}`}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                @{user.handle}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </>
    );
}
