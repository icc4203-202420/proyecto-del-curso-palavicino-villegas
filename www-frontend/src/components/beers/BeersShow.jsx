import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Dialog, Button } from '@mui/material';
import beersHomeImage from './assets/home.png'; 
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchBar from '../SearchBar';
import BeerReviewForm from "./BeerReviewForm";

export default function BeersShow() {

    const { id } = useParams();
    const [beer, setBeer] = useState(null);
    const [beerReviews, setBeerReviews] = useState([]);
    const [openReviewForm, setOpenReviewForm] = useState(false);
    const [reviewSubmitMessage, setReviewSubmitMessage] = useState("");

    const handleBackClick = () => {
        window.history.back();
    };

    const handleReviewSubmit = (values) => {
        const review = {
            text: values.text,
            rating: values.rating,
            beer_id: beer.id,
        };

        const userId = 1; // Poner user actual

        axios.post(`http://localhost:3001/api/v1/reviews`, { review, user_id: userId })
            .then((response) => {
                setReviewSubmitMessage("Review submitted successfully");
                fetchReviews(); 
            });
    };

    const fetchReviews = () => {
        axios.get(`http://localhost:3001/api/v1/beers/${id}/reviews`)
            .then(response => {
                setBeerReviews(response.data.reviews);
            });
    };

    useEffect(() => {
        axios.get(`http://localhost:3001/api/v1/beers/${id}`)
        .then(response => {
            setBeer(response.data.beer);
            fetchReviews();
        });
    }, [id]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setReviewSubmitMessage("");
        }, 3000);
        return () => clearTimeout(timeout);
    }, [reviewSubmitMessage]);

    if (!beer) return <div>Loading...</div>;

    return (
    <>        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
            <IconButton onClick={handleBackClick}>
            <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem' }} />
            </IconButton>
            <SearchBar value={beer.name} />
        </div>



        <Card sx={{ maxWidth: 600, margin: 'auto', marginTop: '20px', boxShadow: 5}}>
            <CardMedia
            component="img"
            height="140"
            image={beersHomeImage}
            />

        <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
            {beer.name} ({beer.style})
            </Typography>

            <Typography variant="body2" color="text.secondary">
            <strong>Alcohol:</strong> {beer.alcohol}%<br />
            <strong>Bitterness (IBU):</strong> {beer.ibu}<br />

            <br />
            <strong>Produced by:</strong>
            {' '} {beer.brewery_name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Rating value={beer.avg_rating} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ marginLeft: '8px' }}>
                {beer.avg_rating} ({beer.reviews_count || 'N/A'} Reviews)
            </Typography>
            </Box>

            <Button onClick={() => setOpenReviewForm(true)} color="primary" sx={{ marginTop: '20px' }}>
                Write a Review
            </Button>

            <Typography variant="body1" sx={{marginTop:2}}>
                {beer.bar_names && beer.bar_names.length > 0 ? (
                    <ul>
                    {beer.bar_names.map((barName, index) => (
                        <li key={index}>{barName}</li>
                    ))}
                    </ul>
                ) : (
                    <span style={{color:'gray', fontSize:'16px'}}>No bars found.</span>

                )}
            </Typography>
        </CardContent>
        </Card>

        <Dialog open={openReviewForm} onClose={() => setOpenReviewForm(false)}>
            <BeerReviewForm
                beer={beer}
                open={openReviewForm}
                onClose={() => setOpenReviewForm(false)}
                onSubmit={handleReviewSubmit}
            />
        </Dialog>

        {reviewSubmitMessage && (
            <Typography variant="body2" color="primary" align="center" sx={{ marginTop: '20px' }}>
                {reviewSubmitMessage}
            </Typography>
        )}
        </>
    );
}

