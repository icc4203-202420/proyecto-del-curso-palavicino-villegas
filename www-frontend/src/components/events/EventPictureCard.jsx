import React from 'react';
import { Card, CardMedia, Avatar, Box, Typography } from '@mui/material';

const EventPictureCard = ({ url, firstName, lastName }) => {
    const initial = firstName.charAt(0).toUpperCase();
    const fullName = `${firstName} ${lastName}`;

    return (
        <Card sx={{ marginTop: '20px', marginBottom: '10px', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                <Avatar
                    sx={{
                        width: 35,
                        height: 35,
                        background: 'linear-gradient(to right, #FFDB01, #FF8603)',
                        color: 'white',
                    }}
                >
                    {initial}
                </Avatar>

                <Typography variant="body1" sx={{ marginLeft: '20px', fontWeight: 'bold' }}>
                    {fullName}
                </Typography>
            </Box>

            <CardMedia
                component="img"
                height="160"
                image={url}
                alt="Event Picture"
            />
        </Card>
    );
};

export default EventPictureCard;
