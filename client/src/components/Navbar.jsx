import React from 'react';
import leagueLogo from '../assets/leagueLogo.png';

function Navbar({ handleResetDraft }) {
  return (
    <nav className='navbar'>
      <img
        src={leagueLogo}
        alt='League of Legends Logo'
        className='logo'
      />
      <h1>League of Legends Draft</h1>
      <div className='reset-container'>
        <button
          className='reset-button'
          onClick={handleResetDraft}
        >
          Reset Draft
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
