import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Avatar, Typography, IconButton, Button, Box } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import GroupIcon from '@mui/icons-material/Group';

function SocialShow() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [friendCount, setFriendCount] = "";
  const [mutualCount, setMutualCount] = "";

  const handleBackClick = () => {
    window.history.back();
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/users/${id}`)
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.error('Error al obtener el usuario:', error);
      });
  }, [id]);

  if (!user) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleBackClick} sx={{ color: 'black' }}>
          <ArrowBackIosIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black'}}>
            @{user.handle}
        </Typography>
        
      </Box>

      <Card sx={{ maxWidth: '400px', margin: '0 auto', p: 3, boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>

          <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
            {user.first_name ? user.first_name[0] : user.handle[0]}
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {user.first_name ? `${user.first_name} ${user.last_name}` : user.handle}
          </Typography>

          <Typography variant="body1" sx={{ color: 'textSecondary', mt: 1 }}>
            {`${friendCount} Friends • ${mutualCount} mutual`}
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FF8603',
              color: 'white',
              mt: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              width: '100%',
            }}
            startIcon={<GroupIcon />}
          >
            + ADD FRIEND
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SocialShow;