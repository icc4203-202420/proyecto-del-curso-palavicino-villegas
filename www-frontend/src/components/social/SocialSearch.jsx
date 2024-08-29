import React, { useState } from 'react';
import { TextField, Grid, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SocialSearch() {
  const [searchByHandle, setSearchByHandle] = useState('');
  const [displayText, setDisplayText] = useState('');

  const handleInputChange = (event) => {
    setSearchByHandle(event.target.value); 
  };

  const handleSearch = () => {
    setDisplayText(searchByHandle); 
  };

  return (
    <>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <TextField id="outlined-basic" label="Search by @handle" variant="outlined" onChange={handleInputChange}/>
        </Grid>
        <Grid item>
          <IconButton color="primary" onClick={handleSearch} style={{ height: '56px', width: '56px' }}>
            <SearchIcon />
          </IconButton>
        </Grid>
      </Grid>

      {displayText && (
        <p style={{ marginTop: 10, color: 'black', fontSize: '1rem', fontWeight: 500 }}>
          Couldn't find @{displayText}
        </p>
      )}
    </>
  );
}
