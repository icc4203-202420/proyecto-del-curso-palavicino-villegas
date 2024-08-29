import React, { useState } from 'react';
import { TextField, Grid, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchBar from '../SearchBar';

export default function SocialSearch() {
  const [searchByHandle, setSearchByHandle] = useState('');
//   const [displayText, setDisplayText] = useState('');

  const handleSearchChange = (event) => {
    setSearchByHandle(event.target.value); 
  };

//   const handleSearch = () => {
//     setDisplayText(searchByHandle); 
//   };

  return (
    <>
        <div style={{ marginBottom: '20px' }}>
            <SearchBar value={searchByHandle} onChange={handleSearchChange} />
        </div>
      
        {searchByHandle && (
        <p style={{ marginTop: 10, color: 'black', fontSize: '1rem', fontWeight: 500 }}>
          Couldn't find @{searchByHandle}
        </p>
      )}
    </>
  );
}
