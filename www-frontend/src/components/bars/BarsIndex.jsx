import axios from 'axios';
import React, { useEffect, useState } from 'react';
import pintpalLogo from './assets/pintpal-logo.png';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchBar from '../SearchBar';

function BarsIndex() {
  const [bars, setBars] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/bars')
      .then(response => {
        setBars(response.data);
        console.log(response.data);
      })
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Para que la barrita encuentre coincidencias por nombre, direccion o ciudad de los bares   
  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (bar.address.line1 && bar.address.line1.toLowerCase().includes(searchText.toLowerCase())) ||
    (bar.address.city && bar.address.city.toLowerCase().includes(searchText.toLowerCase()))
  );
  
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

      <div style={{ marginBottom: '20px' }}>
        <SearchBar value={searchText} onChange={handleSearchChange} />
      </div>

      <div>
        {filteredBars.map(bar => (
          <div key={bar.id}>
            <div style={{ marginBottom: '15px'}}>
              <h2 style={{ margin: 0, color: 'black', fontSize: '20px', fontWeight: 500 }} > {bar.name}</h2>
              <h4 style={{ margin: 0, color: '#858585', fontSize: '15px', fontWeight: 450 }} > {bar.address.line1}, {bar.address.city} </h4>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default BarsIndex;
