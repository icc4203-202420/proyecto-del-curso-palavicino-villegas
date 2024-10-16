import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import barsHomeImage from './assets/home.png'; 

export default function ActionAreaCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/bars/discover');
  };

  return (
    <Card sx={{ maxWidth: 345, boxShadow: 5}} onClick={handleClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={barsHomeImage}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Bars
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}