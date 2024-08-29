import axios from 'axios';
import React, { useEffect, useState } from 'react';

function BarsIndex() {
  const [bars, setBars] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/bars')
      .then(response => {
        setBars(response.data.bars);
        console.log(response.data)
      })
    }, []);

  return (
    <>
      <div>
        {bars.map(bar => (
          <div key={bar.id}>
            <h3  style={{ margin: 0, color: 'black', fontSize: '2rem', fontWeight: 500 }} >{bar.name}</h3>
          </div>
        ))}
      </div>
    </>
  );
}

export default BarsIndex;
