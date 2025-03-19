import React from 'react';
import leagueLogo from '../assets/leagueLogo.png';

const Navbar = ({ handleResetDraft }) => {
  return (
    <nav className='navbar'>
      <img
        src={leagueLogo}
        alt='League of Legends Logo'
        className='h-24 p-6 will-change-auto hover:drop-shadow-xl'
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
};

export default Navbar;
