import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Avatar, Typography, IconButton, Button, Box, CircularProgress } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import GroupIcon from '@mui/icons-material/Group';
import ClearIcon from '@mui/icons-material/Clear'; 
import CheckIcon from '@mui/icons-material/Check'; 
import axios from 'axios';

function SocialShow() {
  const { id } = useParams();  
  const [user, setUser] = useState(null);  
  const [friendCount, setFriendCount] = useState("");  
  const [mutualCount, setMutualCount] = useState("");  
  const [currentUserId, setCurrentUserId] = useState(null);  
  const [isFriend, setIsFriend] = useState(false);  
  const [loading, setLoading] = useState(false);  

  useEffect(() => {
    const storedUserId = localStorage.getItem('CURRENT_USER_ID');
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    } 
  }, []);

  // set Current User
  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/users/${id}`)
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.error('Error al obtener el usuario:', error);
      });
  }, [id]);

  // Verificar si ya hay friendship
  useEffect(() => {
    if (currentUserId) {
      axios.get(`http://localhost:3001/api/v1/users/${currentUserId}/friendships/${id}`)
        .then(response => {
          setIsFriend(response.data.is_friend);  
        })
    }
  }, [id, currentUserId]);

  // Agregar friendship
  const handleAddFriend = async () => {
    if (!currentUserId) {
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(
        `http://localhost:3001/api/v1/users/${currentUserId}/friendships`,
        {
          friendship: { friend_id: id },
        },
      );
  
      console.log('Amigo agregado:', response.data);
      setIsFriend(true); 
    } catch (error) {
      console.error('Error al agregar amigo:', error.response);
    } finally {
      setLoading(false);
    }
  };  

  if (!user) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => window.history.back()} sx={{ color: 'black' }}>
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

          {!isFriend ? (
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
              onClick={handleAddFriend}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : '+ ADD FRIEND'}
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#FF8603',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  mr: 1,
                }}
                startIcon={<CheckIcon />} 
              >
                Friends
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#FF8603',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
                startIcon={<ClearIcon />}
              >
                Remove
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SocialShow;