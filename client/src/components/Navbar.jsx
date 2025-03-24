import React from 'react';
import leagueLogo from '../assets/leagueLogo.png';

const Navbar = ({ handleResetDraft, handleStartDraft, started }) => {
  return (
    <nav className='flex justify-between items-center flex-row p-4 w-full h-16'>
      <img
        src={leagueLogo}
        alt='League of Legends Logo'
        className='h-24 p-6 will-change-auto hover:drop-shadow-xl'
      />
      {!started && (
        <button
          onClick={handleStartDraft}
          className='flex justify-center flex-row'
        >
          Start Draft
        </button>
      )}
      <button onClick={handleResetDraft}>Reset Draft</button>
    </nav>
  );
};

export default Navbar;
