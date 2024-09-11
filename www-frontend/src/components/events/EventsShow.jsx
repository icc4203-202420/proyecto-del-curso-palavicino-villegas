import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { IconButton, CircularProgress, Typography, Box, Card, CardMedia, CardContent, AvatarGroup, Avatar, Button, Snackbar, Alert } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventImage from './assets/event-image.png';

export default function EventsShow() {
    const { id } = useParams();
    const [event, setEvent] = useState(undefined);
    const [users, setUsers] = useState(undefined);
    const [checkingIn, setCheckingIn] = useState(false); 
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarType, setSnackbarType] = useState('success'); // Para alternar entre éxito y error
    const userId = localStorage.getItem('CURRENT_USER_ID');

    const handleBackClick = () => {
        window.history.back();
    };

    const handleCheckIn = () => {
        setCheckingIn(true);
        axios.post('http://localhost:3001/api/v1/attendances', {
            user_id: userId,
            event_id: id
        })
        .then(response => {
            setEvent(prevEvent => ({
                ...prevEvent,
                users: [...prevEvent.users, response.data.user]
            }));
            setSnackbarType('success'); // Éxito
            setOpenSnackbar(true);
        })
        .catch(error => {
            console.error('Error al hacer check-in:', error);
            setSnackbarType('error'); // Error
            setOpenSnackbar(true);
        })
        .finally(() => {
            setCheckingIn(false);
        });
    };

    useEffect(() => {
        axios.get(`http://localhost:3001/api/v1/events/${id}`)
            .then(response => {
                setEvent(response.data);
                setUsers(response.data.users);
            });
    }, [id]);

    if (!event) {
        return <CircularProgress />;
    }

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <IconButton onClick={handleBackClick}>
                    <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem', marginRight: '10px' }} />
                </IconButton>

                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                    {event.name}
                </Typography>
            </div>
        
            <div style={{ padding: '50px', marginTop: '-10px' }}>
                <Card sx={{ maxWidth: 345, borderRadius: '16px', boxShadow: '2px 2px 20px rgba(0, 0, 0, 0.4)' }}>
                    <CardMedia
                        component="img"
                        height="350"
                        image={EventImage}
                        alt="Event image"
                        sx={{ borderRadius: '16px 16px 0 0' }}
                    />
                
                    <CardContent>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon sx={{ color: 'gray', marginRight: '8px' }} />
                            Hosted by <strong style={{ marginLeft: '5px' }}>{event.bar.name}</strong>
                        </Typography>

                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                            <AccessTimeIcon sx={{ color: 'gray', marginRight: '8px' }} />
                            {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </Typography>
                    </CardContent>
                </Card>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <Link to={`/events/${id}/users`} style={{ textDecoration: 'none' }}>
                        <AvatarGroup
                            max={5}
                            sx={{
                                '& .MuiAvatarGroup-avatar': {
                                    width: 30,
                                    height: 30
                                },
                                '& .MuiAvatarGroup-count': {
                                    width: 30, 
                                    height: 30,
                                    fontSize: '0.60 rem'
                                }
                            }}
                        >
                            {users.map(user => (
                                <Avatar key={user.id} alt={user.name}>
                                    {user.first_name[0]}
                                </Avatar>
                            ))}
                        </AvatarGroup>
                    </Link>
                    
                    <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ padding: '5px 15px', color: '#333', borderColor: '#6c757d', fontWeight: 'bold' }}
                        onClick={handleCheckIn}
                        disabled={checkingIn}
                    >
                        {checkingIn ? <CircularProgress size={24} /> : 'Check-In'}
                    </Button>
                </Box>
                
                <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: '20px' }}>
                    {users.slice(0, 2).map((user, index) => 
                        `${user.first_name} ${user.last_name}${index !== 1 ? ', ' : ' and '}`
                    )}
                    {users.length - 2} others
                </Typography>   
                
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', marginTop: '20px' }}>
                    About Event
                </Typography>
            
                <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: '5px' }}>
                    {event.description}
                </Typography>
            </div>

            {/* Snackbar para éxito y error */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setOpenSnackbar(false)} 
                    severity={snackbarType} 
                    sx={{ 
                        width: '100%', 
                        backgroundColor: snackbarType === 'success' ? '#212121' : '#212121',
                        color: '#FFFFFF'
                    }}
                >
                    {snackbarType === 'success' 
                        ? 'Checked-in! You have successfully registered for this event.' 
                        : 'You are already registered for this event.'}
                </Alert>
            </Snackbar>
        </>
    );
}
