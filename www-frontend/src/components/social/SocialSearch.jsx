import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SearchBar from '../SearchBar';
import UsersList from './SocialSearchCard'; 
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function UsersIndex() {
  const [users, setUsers] = useState([]); 
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/users')
      .then(response => {
        setUsers(response.data.users || response.data); 
      })
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredUsers = searchText.trim() === '' ? [] : users.filter(user =>
    user.handle.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <SearchBar value={searchText} onChange={handleSearchChange} />
      </div>

      <div>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <Link key={user.id} to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
              <UsersList user={user} />
            </Link>
          ))
        ) : (
          searchText.trim() !== '' && (
            <Typography variant="body1" style={{ marginTop: 10, color: 'gray' }}>
              No se encontraron usuarios.
            </Typography>
          )
        )}
      </div>
    </>
  );
}

export default UsersIndex;