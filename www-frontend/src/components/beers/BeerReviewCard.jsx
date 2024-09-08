import React from 'react';
import { Card, CardContent, Typography, Box, Rating, Avatar } from '@mui/material';

export default function BeerReviewCard({ review }) {
  return (
    <Card sx={{ marginBottom: '16px', boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>

          <Avatar sx={{ width: 35, height: 35, marginRight: '15px' }}>
            {review.user.handle.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h6" component="p">
            {'@'}{review.user.handle}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <Rating value={parseFloat(review.rating)} readOnly precision={0.5} />
          <Typography variant="body2" sx={{ marginLeft: '8px' }}>
            {parseFloat(review.rating).toFixed(2)}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {'"'}{review.text}{'"'}
        </Typography>
      </CardContent>
    </Card>
  );
}
