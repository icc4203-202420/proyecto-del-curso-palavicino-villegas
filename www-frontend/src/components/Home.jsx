import * as React from 'react';
import ActionAreaCardBars from './bars/ActionAreaCardBars';
import ActionAreaCardBeers from './beers/ActionAreaCardBeers';
import Navbar from './Navbar';
import pintpalLogo from '../assets/pintpal-logo.png';

function Home() {
  return (
    <>
    {/* PintPal superior con el logo */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom:'20px' }}>
        <h2 style={{ margin: 0, color: 'black', fontSize: '2rem', fontWeight: 500 }}>PintPal</h2>
        <img src={pintpalLogo} alt="PintPal Logo" style={{ width: '50px', height: '50px' }} />
    </div>
      
    {/* Tarjeta que lleva al index de bars (/bars) */}
    <div id='barsHomeCard' style={{ marginTop: '20px', minWidth: '300px', maxWidth: '300px'}}>
        <ActionAreaCardBars />
    </div>

    {/* Tarjeta que lleva al index de beers (/beers) */}
    <div id='beersHomeCard' style={{ marginTop: '20px', minWidth: '300px', maxWidth: '300px'}}>
        <ActionAreaCardBeers />
    </div>

        
    {/* --------- Para probar scroll --------- */}
    <div id='beersHomeCard' style={{ marginTop: '20px', minWidth: '300px', maxWidth: '300px'}}>
        <ActionAreaCardBeers />
    </div>

    {/* --------- Para probar scroll --------- */}
    <div id='beersHomeCard' style={{ marginTop: '20px', minWidth: '300px', maxWidth: '300px'}}>
        <ActionAreaCardBeers />
    </div>

    {/* Bottom Navigation */}
    <div id='navbar' style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        padding: '10px',
        zIndex: 1000,
        maxWidth: '400px',
        margin: '0 auto', 
        boxSizing: 'border-box',
        height:'70px'
    }}>
        <Navbar />
    </div>

    </>
  );
}

export default Home;
