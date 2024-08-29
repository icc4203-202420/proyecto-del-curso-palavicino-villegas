import React from 'react'
import SocialSearch from './SocialSearch'
import pintpalLogo from "../../assets/pintpal-logo.png";
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function SocialIndex() {

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    
    <>
    {/* PintPal superior con el logo */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
        {/* Flecha para ir hacia atras */}
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon sx={{ color: 'black', fontSize: '2rem', marginLeft: '-5rem' }} />
        </IconButton>
        <h2 style={{ margin: 0, color: 'black', fontSize: '2rem', fontWeight: 500 }}>PintPal</h2>
        <img src={pintpalLogo} alt="PintPal Logo" style={{ width: '50px', height: '50px' }} />
    </div>
    <SocialSearch/>
    </> 
  )
}
