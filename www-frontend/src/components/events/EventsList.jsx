import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const EventsList = ({ event }) => {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
            <Avatar alt={event.name} src={event.flyer} sx={{ width: 40, height: 40, marginRight: 3 }} />   
        </ListItemAvatar>
        <ListItemText
          primary={event.name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.primary', display: 'inline' }}
              >
                {event.date}
              </Typography>
              {" — "}{event.description}
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
};

export default EventsList;
