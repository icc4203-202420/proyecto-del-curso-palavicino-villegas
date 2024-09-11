import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { IconButton, CircularProgress, Typography, Divider, Box, Card, CardMedia, CardContent } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EventImage from './assets/event-image.png'; // Cambia esto por la ruta correcta de tu imagen
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function EventsShow() {
    const { id } = useParams();
    const [event, setEvent] = useState(undefined);
    
    const handleBackClick = () => {
        window.history.back();
    };

    useEffect(() => {
        axios.get(`http://localhost:3001/api/v1/events/${id}`)
            .then(response => {
                setEvent(response.data);
            });
    }, [id]);
    
    if (!event) {
        return <CircularProgress />;
    }
    

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <IconButton onClick={handleBackClick}>
                    <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem', marginRight:'10px' }} />
                </IconButton>

                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                    {event.name}
                </Typography>
            </div>
        
        <div style={{padding:'50px', marginTop:'-10px'} }>
            <Card sx={{ maxWidth: 345, borderRadius: '16px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
                {/* Flyer del evento */}
                <CardMedia
                    component="img"
                    height="350"
                    image={EventImage}
                    alt="Event image"
                    sx={{ borderRadius: '16px 16px 0 0' }}
                    />
                
                {/* Detalles del evento */}
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
        </div>
        </>
    );
}
